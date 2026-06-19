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
  width: '100%', maxWidth: 420, padding: '44px 40px 38px', position: 'relative',
  boxShadow: '0 30px 80px rgba(27,25,22,0.3)', textAlign: 'center',
}
const btnBase = {
  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  border: 'none', borderRadius: 12, padding: '14px 18px', fontSize: 15.5, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'inherit',
}

export default function LoginModal({ onClose }) {
  const [loading, setLoading] = useState('') // '' | 'google' | 'kakao'
  const [err, setErr] = useState('')

  const signIn = async (provider) => {
    setErr('')
    setLoading(provider)
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setErr('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      setLoading('')
      console.error(error)
    }
    // 성공 시 OAuth 제공자 페이지로 리다이렉트됨
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

        <div style={{ width: 48, height: 48, borderRadius: 12, background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: "'Newsreader', serif", fontStyle: 'italic', fontSize: 27, margin: '0 auto 20px' }}>C</div>
        <h3 style={{ fontFamily: "'Noto Serif KR', serif", fontWeight: 700, fontSize: 26, letterSpacing: '-0.02em' }}>로그인</h3>
        <p style={{ fontSize: 14.5, color: '#6F665A', marginTop: 10, marginBottom: 30, lineHeight: 1.6 }}>
          조선대학교 교원 교육 페이지에<br />구글 또는 카카오 계정으로 로그인하세요.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => signIn('google')}
            disabled={!!loading}
            style={{ ...btnBase, background: '#fff', color: '#1B1916', border: `1px solid ${BORDER}` }}
          >
            <GoogleIcon />
            {loading === 'google' ? '이동 중…' : 'Google로 로그인'}
          </button>
          <button
            onClick={() => signIn('kakao')}
            disabled={!!loading}
            style={{ ...btnBase, background: '#FEE500', color: '#191600' }}
          >
            <KakaoIcon />
            {loading === 'kakao' ? '이동 중…' : '카카오로 로그인'}
          </button>
        </div>

        {err && <div style={{ fontSize: 13.5, color: '#B23B2E', marginTop: 16 }}>{err}</div>}

        <p style={{ fontSize: 12.5, color: '#9A8F7D', marginTop: 26, lineHeight: 1.6 }}>
          로그인 시 교육 운영을 위한 기본 정보(이메일·이름)가 수집됩니다.
        </p>
      </div>
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#191600" d="M12 3C6.48 3 2 6.48 2 10.8c0 2.79 1.86 5.23 4.65 6.6-.2.71-.74 2.66-.85 3.07-.13.51.19.5.4.36.16-.1 2.6-1.77 3.66-2.49.69.1 1.4.16 2.14.16 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/>
    </svg>
  )
}
