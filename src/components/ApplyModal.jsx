import { useState } from 'react'
import { supabase } from '../lib/supabase'

const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const overlay = {
  position: 'fixed', inset: 0, zIndex: 100,
  background: 'rgba(27,25,22,0.55)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  animation: 'floatIn .25s ease both',
}
const sheet = {
  background: '#F6F2EA', borderRadius: 22, border: `1px solid ${BORDER}`,
  width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto',
  padding: '40px 40px 36px', position: 'relative',
  boxShadow: '0 30px 80px rgba(27,25,22,0.3)',
}
const labelS = { fontSize: 13, fontWeight: 600, color: '#5A5246', marginBottom: 7, display: 'block' }
const inputS = {
  width: '100%', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 11,
  padding: '12px 14px', fontSize: 15, fontFamily: 'inherit', color: '#1B1916', outline: 'none',
}
const fieldWrap = { marginBottom: 18 }

const POSITIONS = ['교수', '부교수', '조교수', '기타']

export default function ApplyModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', department: '', position: '', email: '', phone: '', research_topic: '', note: '',
  })
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errMsg, setErrMsg] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.department || !form.email) {
      setErrMsg('성함, 소속 학과, 이메일은 필수입니다.')
      setStatus('error')
      return
    }
    setStatus('sending')
    setErrMsg('')
    const { error } = await supabase.from('chosun_applications').insert([form])
    if (error) {
      setStatus('error')
      setErrMsg('신청 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      console.error(error)
      return
    }
    setStatus('done')
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={sheet} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          aria-label="닫기"
          style={{
            position: 'absolute', top: 18, right: 18, width: 34, height: 34, borderRadius: '50%',
            border: `1px solid ${BORDER}`, background: '#fff', cursor: 'pointer', fontSize: 18, color: '#7A7163',
            display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
          }}
        >×</button>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '24px 0 8px' }}>
            <div style={{ fontFamily: "'Newsreader', serif", fontSize: 40, color: TERRA }}>◆</div>
            <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, fontSize: 26, marginTop: 14 }}>신청이 접수되었습니다</h3>
            <p style={{ fontSize: 15, color: '#6F665A', marginTop: 12, lineHeight: 1.6 }}>
              담당자가 확인 후 안내드리겠습니다.<br />감사합니다.
            </p>
            <button onClick={onClose} style={{ marginTop: 28, background: NAVY, color: '#fff', border: 'none', borderRadius: 11, padding: '13px 30px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>닫기</button>
          </div>
        ) : (
          <>
            <div style={{ fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 15, color: TERRA, marginBottom: 10 }}>Registration</div>
            <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, fontSize: 28, letterSpacing: '-0.02em' }}>교육 신청</h3>
            <p style={{ fontSize: 14.5, color: '#6F665A', marginTop: 10, marginBottom: 26, lineHeight: 1.6 }}>
              조선대학교 전임 교원 대상 · 2026. 6. 24 – 25
            </p>

            <form onSubmit={submit}>
              <div style={fieldWrap}>
                <label style={labelS}>성함 *</label>
                <input style={inputS} value={form.name} onChange={set('name')} placeholder="홍길동" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={fieldWrap}>
                  <label style={labelS}>소속 학과 *</label>
                  <input style={inputS} value={form.department} onChange={set('department')} placeholder="OO학과" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelS}>직위</label>
                  <select style={inputS} value={form.position} onChange={set('position')}>
                    <option value="">선택</option>
                    {POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div style={fieldWrap}>
                  <label style={labelS}>이메일 *</label>
                  <input style={inputS} type="email" value={form.email} onChange={set('email')} placeholder="name@chosun.ac.kr" />
                </div>
                <div style={fieldWrap}>
                  <label style={labelS}>연락처</label>
                  <input style={inputS} value={form.phone} onChange={set('phone')} placeholder="010-0000-0000" />
                </div>
              </div>
              <div style={fieldWrap}>
                <label style={labelS}>관심 연구·교과목 주제</label>
                <input style={inputS} value={form.research_topic} onChange={set('research_topic')} placeholder="예: 데이터 분석 기반 연구, OO 교과목 AI 접목" />
              </div>
              <div style={fieldWrap}>
                <label style={labelS}>요청사항 (선택)</label>
                <textarea style={{ ...inputS, minHeight: 80, resize: 'vertical' }} value={form.note} onChange={set('note')} placeholder="사전 문의나 요청사항을 적어주세요." />
              </div>

              {status === 'error' && (
                <div style={{ fontSize: 13.5, color: '#B23B2E', marginBottom: 14 }}>{errMsg}</div>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%', background: status === 'sending' ? '#7A8699' : NAVY, color: '#fff', border: 'none',
                  borderRadius: 11, padding: '15px', fontSize: 16, fontWeight: 600,
                  cursor: status === 'sending' ? 'default' : 'pointer', marginTop: 6,
                }}
              >
                {status === 'sending' ? '신청 중…' : '신청서 제출'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
