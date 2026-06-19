import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import CodeBlock from './CodeBlock'
import basics from '../prompt/data/basics'
import systemPrompts from '../prompt/data/system-prompts'
import xmlTags from '../prompt/data/xml-tags'
import extendedThinking from '../prompt/data/extended-thinking'
import chainOfThought from '../prompt/data/chain-of-thought'
import toolUse from '../prompt/data/tool-use'
import bestPractices from '../prompt/data/best-practices'

const SERIF = "'Noto Serif KR', serif"
const NEWS = "'Newsreader', serif"
const NAVY = '#1E3A5F'
const TERRA = '#C2603D'
const BORDER = '#E2D9C9'

const SECTIONS = [basics, systemPrompts, xmlTags, extendedThinking, chainOfThought, toolUse, bestPractices]

const mdComponents = {
  code({ inline, className, children, node, ...props }) {
    const match = /language-(\w+)/.exec(className || '')
    const text = String(children).replace(/\n$/, '')
    if (!inline && match) return <CodeBlock code={text} language={match[1]} />
    if (!inline && !match && text.includes('\n')) return <CodeBlock code={text} language="" />
    return <code className="inline-code" {...props}>{children}</code>
  },
  pre({ children }) {
    return <>{children}</>
  },
  table({ children }) {
    return <div className="table-responsive"><table>{children}</table></div>
  },
  blockquote({ children }) {
    return <div className="md-tip">{children}</div>
  },
}

export default function PromptGuide() {
  const [active, setActive] = useState(0)
  const sec = SECTIONS[active]

  return (
    <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 40px' }}>
      <div className="lecture-grid" style={{ display: 'grid', gridTemplateColumns: '264px 1fr', gap: 48, alignItems: 'start', padding: '56px 0 100px' }}>
        <aside className="lecture-aside" style={{ position: 'sticky', top: 90 }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA, marginBottom: 16 }}>Prompt Guide</div>
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              onClick={() => { setActive(i); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              style={{
                width: '100%', textAlign: 'left', display: 'block',
                background: i === active ? '#fff' : 'transparent',
                border: i === active ? `1px solid ${BORDER}` : '1px solid transparent',
                borderLeft: i === active ? `3px solid ${NAVY}` : '3px solid transparent',
                borderRadius: 9, padding: '10px 13px', cursor: 'pointer', marginBottom: 4,
                fontFamily: 'inherit', fontSize: 14, lineHeight: 1.4,
                color: i === active ? '#1B1916' : '#5A5246', fontWeight: i === active ? 600 : 500,
              }}
            >{s.title}</button>
          ))}
        </aside>

        <article style={{ minWidth: 0, animation: 'floatIn .35s ease both' }}>
          <div style={{ fontFamily: NEWS, fontStyle: 'italic', fontSize: 15, color: TERRA, marginBottom: 10 }}>Prompt Engineering</div>
          <h1 style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, lineHeight: 1.2, letterSpacing: '-0.025em' }}>{sec.title}</h1>
          {sec.sections.map((s, i) => (
            <section key={i} style={{ marginTop: 38 }}>
              <h2 style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 24, letterSpacing: '-0.02em', marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${BORDER}` }}>{s.title}</h2>
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>{s.content}</ReactMarkdown>
              </div>
            </section>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, gap: 12 }}>
            <button disabled={active === 0} onClick={() => { setActive(active - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={navBtn(active === 0)}>← 이전</button>
            <button disabled={active === SECTIONS.length - 1} onClick={() => { setActive(active + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }} style={navBtn(active === SECTIONS.length - 1)}>다음 →</button>
          </div>
        </article>
      </div>
    </div>
  )
}

function navBtn(disabled) {
  return {
    background: disabled ? '#EDE7DC' : NAVY, color: disabled ? '#A99' : '#fff',
    border: 'none', borderRadius: 11, padding: '12px 24px', fontSize: 15, fontWeight: 600,
    cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.5 : 1, fontFamily: 'inherit',
  }
}
