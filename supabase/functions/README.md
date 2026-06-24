# chosun Supabase Edge Functions

## chosun-chat — 전공 챗봇 OpenAI 프록시

OpenAI 키를 프론트엔드에 노출하지 않고, 로그인 사용자가 사이트 제공 키로 챗봇을 쓰게 하는 프록시.

### 1회 배포 (공유 프로젝트: hcmgdztsgjvzcyxyayaj)

```bash
# 1) 프로젝트 링크 (이미 했으면 생략)
supabase link --project-ref hcmgdztsgjvzcyxyayaj

# 2) OpenAI 키를 시크릿으로 등록 (브라우저에 절대 노출 안 됨)
supabase secrets set OPENAI_API_KEY=sk-...McIA --project-ref hcmgdztsgjvzcyxyayaj

# 3) 함수 배포
supabase functions deploy chosun-chat --project-ref hcmgdztsgjvzcyxyayaj
```

- 기본 `verify_jwt = true` → Supabase 로그인 세션이 있는 호출만 통과(전공 챗봇에서 '사이트 제공' 선택 시 자동으로 세션 JWT 전송).
- 프론트엔드는 `supabase.functions.invoke('chosun-chat', { body: { system, messages } })` 로 호출.
- 키 교체: `supabase secrets set OPENAI_API_KEY=...` 다시 실행.
- ⚠️ 시크릿은 프로젝트 전역이라 같은 프로젝트의 다른 함수와 `OPENAI_API_KEY`를 공유합니다.
