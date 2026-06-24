// 전공학과별 AI 챗봇 — 사용자가 OpenAI 또는 Claude API Key를 직접 입력해 사용.
// 정적 사이트(GitHub Pages)이므로 브라우저에서 각 제공사 API를 직접 호출한다.
// 키는 브라우저 메모리에만 있고 서버로 전송/저장되지 않는다.
// 로그인한 사용자는 나눈 대화가 Supabase(chosun_chat_logs)에 저장되어
// 아래 '대화 히스토리' 게시판으로 유지된다.
import { useState, useRef, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const PROVIDERS = {
  site: { label: '사이트 제공 (OpenAI · 로그인 필요)', model: 'gpt-4o-mini', mode: 'proxy' },
  claude: { label: 'Claude (Anthropic) · 내 키', model: 'claude-opus-4-8', hint: 'sk-ant-…', mode: 'key' },
  openai: { label: 'OpenAI (ChatGPT) · 내 키', model: 'gpt-4o-mini', hint: 'sk-…', mode: 'key' },
}
const providerLabel = (p) => (p === 'openai' ? 'OpenAI' : p === 'claude' ? 'Claude' : '사이트')

// 사이트 제공 키(Edge Function 프록시) — 키는 Supabase 시크릿에만, 로그인 세션으로 호출
async function callSiteProxy({ system, messages }) {
  const { data, error } = await supabase.functions.invoke('chosun-chat', { body: { system, messages } })
  if (error) throw new Error(error.message || '사이트 프록시 호출 실패 (로그인/배포 상태 확인)')
  if (data?.error) throw new Error(data.error)
  return (data?.text || '').trim()
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

function fmtTime(ts) {
  try {
    const d = new Date(ts)
    return d.toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch { return '' }
}

export default function MajorChatBot({ user, onRequestLogin }) {
  const [provider, setProvider] = useState('site')
  const [apiKey, setApiKey] = useState('')
  const [department, setDepartment] = useState('컴퓨터공학')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [history, setHistory] = useState([])
  const [openId, setOpenId] = useState(null)
  const listRef = useRef(null)

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, loading])

  const loadHistory = useCallback(async () => {
    if (!user) { setHistory([]); return }
    const { data, error: e } = await supabase
      .from('chosun_chat_logs')
      .select('id, department, provider, question, answer, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)
    if (e) { console.warn('히스토리 로드 실패:', e.message); return }
    setHistory(data || [])
  }, [user])

  useEffect(() => { loadHistory() }, [loadHistory])

  const systemPrompt = `당신은 조선대학교 「${department || '전공'}」 전공 학생과 교원을 돕는 친절하고 정확한 AI 학습 도우미입니다. 해당 전공 분야의 개념 설명, 과제·강의 준비 도움, 학습 방향 안내를 한국어로 명확하게 제공하세요. 확실하지 않은 내용은 모른다고 솔직히 답하고, 추측을 사실처럼 말하지 마세요.`

  const mode = PROVIDERS[provider].mode

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    if (mode === 'proxy') {
      if (!user) { setError('사이트 제공 키는 로그인 후 사용할 수 있습니다.'); return }
    } else if (!apiKey.trim()) {
      setError('먼저 API Key를 입력하세요.'); return
    }
    setError('')
    const next = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setInput('')
    setLoading(true)
    try {
      const reply = mode === 'proxy'
        ? await callSiteProxy({ system: systemPrompt, messages: next })
        : await (provider === 'claude' ? callClaude : callOpenAI)({ apiKey: apiKey.trim(), model: PROVIDERS[provider].model, system: systemPrompt, messages: next })
      setMessages((m) => [...m, { role: 'assistant', content: reply || '(빈 응답)' }])
      // 로그인 사용자면 대화 저장 → 히스토리 게시판 갱신
      if (user) {
        const { error: e } = await supabase.from('chosun_chat_logs').insert({
          user_id: user.id, department, provider, question: text, answer: reply || '',
        })
        if (e) console.warn('히스토리 저장 실패:', e.message)
        else loadHistory()
      }
    } catch (e) {
      setError(e.message || '요청에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const removeEntry = async (id) => {
    const { error: e } = await supabase.from('chosun_chat_logs').delete().eq('id', id)
    if (e) { console.warn('삭제 실패:', e.message); return }
    setHistory((h) => h.filter((x) => x.id !== id))
  }

  return (
    <div>
      <h2 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 25, color: NAVY, letterSpacing: '-0.01em' }}>전공 챗봇</h2>
      <p style={{ fontSize: 15.5, color: '#5A5246', marginTop: 10, lineHeight: 1.7 }}>
        전공학과를 입력하면 해당 전공 맞춤 챗봇으로 동작합니다. 기본은 <b>사이트 제공(OpenAI)</b>이라 로그인만 하면 키 없이 바로 사용할 수 있고, 원하면 본인 OpenAI/Claude 키로도 쓸 수 있습니다.
        {user ? ' 로그인되어 있어 대화가 아래 히스토리에 저장됩니다.' : ' 로그인하면 대화가 히스토리로 저장됩니다.'}
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
        {mode === 'key' ? (
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelCss}>API Key <span style={{ fontWeight: 500, color: '#9A8F7D' }}>({PROVIDERS[provider].hint} · 브라우저에만 보관, 저장 안 함)</span></label>
            <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={PROVIDERS[provider].hint} autoComplete="off" style={field} />
          </div>
        ) : (
          <div style={{ gridColumn: '1 / -1', fontSize: 13, color: '#5A5246', background: '#F1ECE1', borderRadius: 9, padding: '10px 12px', lineHeight: 1.6 }}>
            🔒 사이트가 제공하는 OpenAI 키로 동작합니다. <b>로그인만</b> 하면 별도 키 입력 없이 사용할 수 있어요. (키는 서버에만 보관되어 노출되지 않습니다)
          </div>
        )}
      </div>

      {/* 대화 */}
      <div ref={listRef} style={{ marginTop: 16, height: 340, overflowY: 'auto', background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
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

      {/* 대화 히스토리 게시판 */}
      <div style={{ marginTop: 36 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: `2px solid ${NAVY}` }}>
          <h3 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 20, color: NAVY }}>대화 히스토리</h3>
          {user && <span style={{ marginLeft: 'auto', fontFamily: NEWS, fontSize: 14, color: '#9A8F7D' }}>{history.length}건</span>}
        </div>

        {!user ? (
          <div style={{ background: '#fff', border: `1px dashed ${BORDER}`, borderRadius: 14, padding: '28px 24px', textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#7A7263', marginBottom: 14 }}>로그인하면 나눈 대화가 이곳에 게시판처럼 저장·유지됩니다.</p>
            <button onClick={onRequestLogin} style={{ background: NAVY, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13.5, fontWeight: 700, padding: '10px 22px', borderRadius: 999 }}>로그인</button>
          </div>
        ) : history.length === 0 ? (
          <p style={{ fontSize: 14, color: '#9A8F7D', padding: '8px 2px' }}>아직 저장된 대화가 없습니다. 챗봇과 대화하면 이곳에 쌓입니다.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* 헤더 행 */}
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 130px', gap: 12, padding: '0 14px', fontSize: 12, fontWeight: 700, color: '#9A8F7D' }}>
              <span>전공 · AI</span><span>질문</span><span style={{ textAlign: 'right' }}>일시</span>
            </div>
            {history.map((h) => {
              const open = openId === h.id
              return (
                <div key={h.id} style={{ background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12, overflow: 'hidden' }}>
                  <button
                    onClick={() => setOpenId(open ? null : h.id)}
                    style={{ width: '100%', display: 'grid', gridTemplateColumns: '120px 1fr 130px', gap: 12, alignItems: 'center', padding: '12px 14px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}
                  >
                    <span style={{ fontSize: 12, color: NAVY, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.department || '전공'} · {providerLabel(h.provider)}</span>
                    <span style={{ fontSize: 14, color: '#1B1916', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{h.question}</span>
                    <span style={{ fontFamily: NEWS, fontSize: 12.5, color: '#9A8F7D', textAlign: 'right' }}>{fmtTime(h.created_at)}</span>
                  </button>
                  {open && (
                    <div style={{ borderTop: `1px solid ${BORDER}`, padding: '14px 16px', background: '#FBF8F2' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 4 }}>Q. 질문</div>
                      <div style={{ fontSize: 14, color: '#1B1916', whiteSpace: 'pre-wrap', lineHeight: 1.6, marginBottom: 14 }}>{h.question}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: TERRA, marginBottom: 4 }}>A. 답변</div>
                      <div style={{ fontSize: 14, color: '#1B1916', whiteSpace: 'pre-wrap', lineHeight: 1.65 }}>{h.answer}</div>
                      <div style={{ marginTop: 14, textAlign: 'right' }}>
                        <button onClick={() => removeEntry(h.id)} style={{ background: 'none', border: `1px solid ${BORDER}`, color: '#B23B2E', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, padding: '6px 12px', borderRadius: 8 }}>삭제</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
