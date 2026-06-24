// Supabase Edge Function: chosun-chat
// 전공 챗봇용 OpenAI 프록시. OpenAI 키는 Supabase 시크릿(OPENAI_API_KEY)에만 보관하고
// 브라우저에는 절대 노출하지 않는다. 기본 verify_jwt=true 이므로 로그인 사용자만 호출 가능.
//
// 배포(프로젝트 1회):
//   supabase functions deploy chosun-chat --project-ref hcmgdztsgjvzcyxyayaj
//   supabase secrets set OPENAI_API_KEY=sk-... --project-ref hcmgdztsgjvzcyxyayaj

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, 'content-type': 'application/json' },
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })
  if (req.method !== 'POST') return json({ error: 'POST만 허용됩니다.' }, 405)

  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) return json({ error: '서버에 OPENAI_API_KEY가 설정되지 않았습니다.' }, 200)

    const { system, messages, model } = await req.json()
    if (!Array.isArray(messages) || messages.length === 0) {
      return json({ error: 'messages 형식이 올바르지 않습니다.' }, 400)
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: typeof model === 'string' && model ? model : 'gpt-4o-mini',
        messages: system ? [{ role: 'system', content: system }, ...messages] : messages,
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) return json({ error: data?.error?.message || `OpenAI 오류 (${res.status})` }, 200)

    const text = (data?.choices?.[0]?.message?.content ?? '').trim()
    return json({ text })
  } catch (e) {
    return json({ error: (e as Error)?.message || '요청 처리에 실패했습니다.' }, 200)
  }
})
