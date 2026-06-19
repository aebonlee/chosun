import { useEffect, useState } from 'react'
import { supabase } from './supabase'

// Supabase 세션 추적 훅
export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const signOut = () => supabase.auth.signOut()

  return { user, loading, signOut }
}

// 사용자 표시 이름 추출 (구글/카카오 메타데이터 → 이메일 순)
export function displayName(user) {
  if (!user) return ''
  const m = user.user_metadata || {}
  return m.name || m.full_name || m.user_name || (user.email ? user.email.split('@')[0] : '사용자')
}
