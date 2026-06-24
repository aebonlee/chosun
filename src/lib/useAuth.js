import { useEffect, useState, useCallback } from 'react'
import { supabase } from './supabase'

// 가입 사이트 식별용 고정 도메인 (github.io 등 다른 경로로 접속해도 chosun으로 기록)
export const SITE_DOMAIN = 'chosun.dreamitbiz.com'

// Supabase 세션 + user_profiles 프로필 추적 훅
// - 로그인 시 user_profiles 행을 보장(없으면 생성)하고 signup_domain/visited_sites에 사이트 기록
// - 트리거 없이 클라이언트에서만 처리(과거 트리거 사고 회피)
export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) { setProfile(null); return }
    const meta = authUser.user_metadata || {}
    const provider = authUser.app_metadata?.provider || 'email'
    const metaName = meta.name || meta.full_name || meta.user_name || ''

    let p = null
    try {
      const { data } = await supabase.from('user_profiles').select('*').eq('id', authUser.id).maybeSingle()
      p = data
    } catch (e) { console.warn('프로필 조회 실패:', e?.message) }

    if (!p) {
      // 신규 가입: 사이트 정보와 함께 프로필 생성
      try {
        const { data } = await supabase.from('user_profiles').insert({
          id: authUser.id,
          email: authUser.email || '',
          name: metaName,
          display_name: metaName,
          phone: meta.phone || '',
          provider,
          signup_domain: SITE_DOMAIN,
          visited_sites: [SITE_DOMAIN],
          role: 'member',
        }).select().single()
        p = data
      } catch (e) {
        // 경합 등으로 이미 생성된 경우 재조회
        console.warn('프로필 생성 실패(재조회):', e?.message)
        const { data } = await supabase.from('user_profiles').select('*').eq('id', authUser.id).maybeSingle()
        p = data
      }
    } else {
      // 기존 프로필: 사이트 기록 보강
      const updates = {}
      if (!p.signup_domain) updates.signup_domain = SITE_DOMAIN
      const sites = Array.isArray(p.visited_sites) ? p.visited_sites : []
      if (!sites.includes(SITE_DOMAIN)) updates.visited_sites = [...sites, SITE_DOMAIN]
      if (Object.keys(updates).length > 0) {
        try {
          const { data } = await supabase.from('user_profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', authUser.id).select().single()
          if (data) p = data
        } catch (e) { console.warn('사이트 기록 보강 실패:', e?.message) }
      }
    }
    setProfile(p || null)
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) loadProfile(u)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u)
      else setProfile(null)
    })
    return () => sub.subscription.unsubscribe()
  }, [loadProfile])

  const refreshProfile = useCallback(() => (user ? loadProfile(user) : Promise.resolve()), [user, loadProfile])
  const signOut = () => supabase.auth.signOut({ scope: 'local' })

  // 이름이 비어 있으면 프로필 완성 모달 필요 (전화번호도 함께 받지만 이름이 필수 트리거)
  const needsProfile = !!user && !!profile && !((profile.name || '').trim())

  return { user, profile, loading, needsProfile, refreshProfile, signOut }
}

// 사용자 표시 이름 — 프로필 name 우선, 없으면 메타데이터 → 이메일
export function displayName(user, profile) {
  if (profile && (profile.name || profile.display_name)) return profile.name || profile.display_name
  if (!user) return ''
  const m = user.user_metadata || {}
  return m.name || m.full_name || m.user_name || (user.email ? user.email.split('@')[0] : '사용자')
}
