// 회원가입/로그인 후 이름·전화번호를 받는 프로필 완성 모달.
// user_profiles 업데이트 + auth 메타데이터(updateUser) 동시 반영으로 표시 이름까지 갱신.
import { useState } from 'react'
import { supabase } from '../lib/supabase'

const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

const field = {
  width: '100%', boxSizing: 'border-box', border: `1.5px solid ${BORDER}`, borderRadius: 10,
  padding: '11px 13px', fontSize: 15, fontFamily: 'inherit', background: '#fff', color: '#1B1916', outline: 'none',
}
const labelCss = { display: 'block', fontSize: 13, fontWeight: 700, color: '#3C3730', marginBottom: 6 }

export default function ProfileCompleteModal({ user, onComplete, onSkip }) {
  const meta = user.user_metadata || {}
  const [name, setName] = useState(meta.name || meta.full_name || '')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const save = async ({ requireName }) => {
    const trimmed = name.trim()
    if (requireName && !trimmed) { setError('이름을 입력해 주세요.'); return false }
    const digits = phone.replace(/\D/g, '')
    if (digits && !/^01[0-9]\d{7,8}$/.test(digits)) {
      setError('올바른 휴대전화 번호를 입력해 주세요. (예: 010-1234-5678)'); return false
    }
    setSaving(true)
    setError('')
    try {
      const updates = { updated_at: new Date().toISOString() }
      if (trimmed) { updates.name = trimmed; updates.display_name = trimmed }
      if (digits) updates.phone = formatPhone(digits)
      if (trimmed || digits) {
        await supabase.from('user_profiles').update(updates).eq('id', user.id)
        // 표시 이름/전화 메타데이터도 동기화
        await supabase.auth.updateUser({ data: { name: trimmed || undefined, phone: digits ? formatPhone(digits) : undefined } })
      }
      return true
    } catch (e) {
      console.error('프로필 저장 실패:', e?.message)
      setError('저장에 실패했습니다. 다시 시도해 주세요.')
      return false
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (await save({ requireName: true })) await onComplete()
  }

  const handleSkip = async () => {
    await save({ requireName: false }) // 입력분만 저장 시도
    onSkip()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(27,25,22,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} style={{ background: '#F6F2EA', borderRadius: 22, border: `1px solid ${BORDER}`, width: '100%', maxWidth: 420, padding: '40px 36px 32px', position: 'relative', boxShadow: '0 30px 80px rgba(27,25,22,0.3)' }}>
        <button type="button" onClick={handleSkip} aria-label="나중에 입력" disabled={saving}
          style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, borderRadius: '50%', border: `1px solid ${BORDER}`, background: '#fff', cursor: 'pointer', fontSize: 17, color: '#7A7163', lineHeight: 1 }}>×</button>

        <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, fontSize: 23, letterSpacing: '-0.01em', color: NAVY }}>프로필 정보 입력</h3>
        <p style={{ fontSize: 14, color: '#6F665A', marginTop: 8, marginBottom: 24, lineHeight: 1.6 }}>
          원활한 교육 운영을 위해 이름과 연락처를 입력해 주세요.
        </p>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <span style={labelCss}>이름 <span style={{ color: TERRA }}>*</span></span>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="실명을 입력해 주세요" autoFocus style={field}
            onFocus={(e) => (e.target.style.borderColor = NAVY)} onBlur={(e) => (e.target.style.borderColor = BORDER)} />
        </label>

        <label style={{ display: 'block', marginBottom: 22 }}>
          <span style={labelCss}>휴대전화 <span style={{ color: '#9A8F7D', fontWeight: 500 }}>(선택)</span></span>
          <input type="tel" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="010-0000-0000" style={field}
            onFocus={(e) => (e.target.style.borderColor = NAVY)} onBlur={(e) => (e.target.style.borderColor = BORDER)} />
        </label>

        {error && <p style={{ fontSize: 13.5, color: '#B23B2E', marginBottom: 14 }}>{error}</p>}

        <button type="submit" disabled={saving}
          style={{ width: '100%', padding: 13, fontSize: 15, fontWeight: 700, color: '#fff', background: saving ? '#9AA7B5' : NAVY, border: 'none', borderRadius: 11, cursor: saving ? 'default' : 'pointer', marginBottom: 10 }}>
          {saving ? '저장 중…' : '저장하고 시작하기'}
        </button>
        <button type="button" onClick={handleSkip} disabled={saving}
          style={{ width: '100%', padding: 11, fontSize: 14, fontWeight: 600, color: '#6F665A', background: 'none', border: `1px solid ${BORDER}`, borderRadius: 11, cursor: saving ? 'default' : 'pointer' }}>
          나중에 입력하기
        </button>
      </form>
    </div>
  )
}
