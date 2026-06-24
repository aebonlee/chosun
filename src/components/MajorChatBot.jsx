// 전공학과별 AI 챗봇 — 사용자가 OpenAI 또는 Claude API Key를 직접 입력해 사용.
// 정적 사이트(GitHub Pages)이므로 브라우저에서 각 제공사 API를 직접 호출한다.
// 키는 브라우저 메모리에만 있고 서버로 전송/저장되지 않는다.
import { useState, useRef, useEffect } from 'react'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const PROVIDERS = {
  claude: { label: 'Claude (Anthropic)', model: 'claude-opus-4-8', hint: 'sk-ant-…' },
  openai: { label: 'OpenAI (ChatGPT)', model: 'gpt-4o-mini', hint: 'sk-…' },
}

async function callClaude({ apiKey, model, system, messages }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({ model, max_tokens: 1024, system, messages }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `Claude 오류 (${res.status})`)
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim()
}

async function callOpenAI({ apiKey, model, system, messages }) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: [{ role: 'system', content: system }, ...messages] }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error?.message || `OpenAI 오류 (${res.status})`)
  return data.choices?.[0]?.message?.content?.trim() || ''
}

const field = { width: '100%', boxSizing: 'border-box', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '9px 12px', fontSize: 14, fontFamily: 'inherit', background: '#fff', color: '#1B1916' }
const labelCss = { display: 'block', fontSize: 12.5, fontWeight: 700, color: '#7A7263', marginBottom: 6, letterSpacing: '0.01em' }

export default function MajorChatBot() {
  const [provider, setProvider] = useState('claude')
  const [apiKey, setApiKey] = useState('')
  const [department, setDepartment] = useState('컴퓨터공학')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  const systemPrompt = `당신은 조선대학교 「${department || '전공'}」 전공 학생과 교원을 돕는 친절하고 정확한 AI 학습 도우미입니다. 해당 전공 분야의 개념 설명, 과제·강의 준비 도움, 학습 방향 안내를 한국어로 명확하게 제공하세요. 확실하지 않은 내용은 모른다고 솔직히 답하고, 추측을 사실처럼 말하지 마세요.`

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    if (!apiKey.trim()) { setError('먼저 API Key를 입력하세요.'); return }
    setError('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const fn = provider === 'claude' ? callClaude : callOpenAI
      const reply = await fn({ apiKey: apiKey.trim(), model: PROVIDERS[provider].model, system: systemPrompt, messages: next })
      setMessages((m) => [...m, { role: 'assistant', content: reply || '(빈 응답)' }])
    } catch (e) {
      setError(e.message || '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>전공 챗봇</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>
        전공학과를 입력하고 사용할 AI(OpenAI 또는 Claude)와 API Key를 넣으면, 해당 전공 맞춤 챗봇으로 동작합니다.
      </p>

      {/* 설정 */}
      <div style={{ marginTop: 22, background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={labelCss}>AI 제공사</label>
          <select value={provider} onChange={(e) => setProvider(e.target.value)} style={field}>
            {Object.entries(PROVIDERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelCss}>전공 / 학과</label>
          <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="예: 컴퓨터공학, 간호학, 경영학" style={field} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelCss}>API Key <span style={{ fontWeight: 500, color: '#9A8F7D' }}>({PROVIDERS[provider].hint} · 브라우저에만 보관, 저장 안 함)</span></label>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={PROVIDERS[provider].hint} autoComplete="off" style={field} />
        </div>
      </div>

      {/* 대화 */}
      <div ref={listRef} style={{ marginTop: 16, height: 360, overflowY: 'auto', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.length === 0 && !loading && (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#9A8F7D' }}>
            <div style={{ fontFamily: NEWS, fontSize: 30, color: TERRA, marginBottom: 8 }}>💬</div>
            <div style={{ fontSize: 14 }}>「{department || '전공'}」 챗봇에게 무엇이든 물어보세요.</div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '82%' }}>
            <div style={{
              padding: '10px 14px', borderRadius: 13, fontSize: 14.5, lineHeight: 1.65, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              background: m.role === 'user' ? NAVY : '#F1ECE1', color: m.role === 'user' ? '#fff' : '#1B1916',
            }}>{m.content}</div>
          </div>
        ))}
        {loading && <div style={{ alignSelf: 'flex-start', fontSize: 13.5, color: '#9A8F7D', fontStyle: 'italic' }}>답변 작성 중…</div>}
      </div>

      {error && <div style={{ marginTop: 10, fontSize: 13.5, color: '#B23B2E', background: '#FBEDEA', border: '1px solid #F0CFC9', borderRadius: 9, padding: '9px 12px' }}>{error}</div>}

      {/* 입력 */}
      <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          rows={2}
          placeholder="메시지를 입력하고 Enter (줄바꿈은 Shift+Enter)"
          style={{ ...field, resize: 'none', flex: 1 }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{ flexShrink: 0, alignSelf: 'stretch', background: loading ? '#9AA7B5' : NAVY, color: '#fff', border: 'none', borderRadius: 11, cursor: loading ? 'default' : 'pointer', fontSize: 14.5, fontWeight: 700, padding: '0 22px' }}
        >보내기</button>
      </div>

      <p style={{ marginTop: 12, fontSize: 12, color: '#9A8F7D', lineHeight: 1.6 }}>
        ※ 입력한 API Key는 이 브라우저에서 해당 AI 서버로 직접 전송될 뿐, 본 사이트 서버에 저장·전송되지 않습니다. 공용 PC에서는 사용 후 키를 비워 주세요.
      </p>
    </div>
  )
}
