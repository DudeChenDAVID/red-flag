import { ArrowRight, BookOpen, ChevronRight, ExternalLink, Search, X } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { historyMilestones, historyPeriods, historySources, historyStories } from '../data/history'
import '../styles/history.css'

function HistoryDetail({ item, onClose }) {
  const dialogRef = useRef(null)
  const closeRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
      if (event.key !== 'Tab') return
      const controls = dialogRef.current?.querySelectorAll('button, a[href]')
      if (!controls?.length) return
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [onClose])

  // 避免公共页面切换动效影响弹窗的固定定位。
  return createPortal(
    <div className="history-modal-backdrop" onClick={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section ref={dialogRef} className="history-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <button ref={closeRef} type="button" className="history-modal-close" onClick={onClose} aria-label="关闭详情"><X size={20} /></button>
        <p className="history-kicker">{item.date} <span aria-hidden="true">/</span> {item.tag}</p>
        <h2 id={titleId}>{item.title}</h2>
        <div className="history-detail-body">{item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        <div className="history-significance"><span>历史启示</span><p>{item.significance}</p></div>
        <footer className="history-detail-source">
          <span>资料依据 · {item.source.publisher}</span>
          <a href={item.source.url} target="_blank" rel="noopener noreferrer">{item.source.title}<ExternalLink size={14} aria-hidden="true" /><span className="history-sr-only">（在新窗口打开）</span></a>
        </footer>
      </section>
    </div>, document.body,
  )
}

export default function HistoryMuseum() {
  const [activePeriod, setActivePeriod] = useState('revolution')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const searchId = useId()
  const period = historyPeriods.find((entry) => entry.id === activePeriod)
  const searchText = query.trim().toLocaleLowerCase()
  const visible = historyMilestones.filter((item) => (
    (activePeriod === 'all' || item.period === activePeriod)
    && [item.year, item.title, item.summary, ...item.keywords].join(' ').toLocaleLowerCase().includes(searchText)
  ))

  function changePeriod(id) {
    setActivePeriod(id)
    setQuery('')
  }

  return <div className="history-page">
    <header className="history-hero">
      <div className="history-hero-copy">
        <p className="history-kicker">百年征程 · 信仰如炬</p>
        <h1>党史馆</h1>
        <p className="history-hero-intro">循着历史的足迹，读懂重要转折背后的探索与选择。</p>
        <p className="history-hero-meta">四个历史时期 <span aria-hidden="true">·</span> {historyMilestones.length} 个精选节点 <span aria-hidden="true">·</span> 原文可溯</p>
      </div>
      <div className="history-seal" aria-hidden="true"><span>鉴往</span><span>知来</span></div>
    </header>

    <nav className="history-periods" aria-label="按历史时期浏览">
      {historyPeriods.map((entry, index) => <button type="button" key={entry.id} className={`history-period${entry.id === activePeriod ? ' is-active' : ''}`} aria-pressed={entry.id === activePeriod} aria-controls="history-results" onClick={() => changePeriod(entry.id)}>
        <span className="history-period-top"><span>{entry.range}</span><span aria-hidden="true">0{index + 1}</span></span>
        <strong>{entry.title}</strong>
        <span className="history-period-bottom"><span>{entry.theme}</span><ArrowRight size={16} aria-hidden="true" /></span>
      </button>)}
    </nav>

    <div className="history-layout">
      <section className="history-exhibition" aria-labelledby="history-results-heading">
        <header className="history-exhibition-head">
          <div><p className="history-kicker">历史回眸</p><h2 id="history-results-heading">{period ? period.title : '百年征程 · 重要节点'}</h2></div>
          <button type="button" className={`history-all-button${activePeriod === 'all' ? ' is-active' : ''}`} aria-pressed={activePeriod === 'all'} onClick={() => changePeriod('all')}>全部节点<ArrowRight size={14} aria-hidden="true" /></button>
        </header>
        <p className="history-period-description">{period ? period.description : '按时间顺序回看1921—2022年的精选史事，了解四个历史时期的发展脉络。'}</p>
        <div className="history-toolbar">
          <div className="history-search"><Search size={17} aria-hidden="true" /><label htmlFor={searchId} className="history-sr-only">搜索当前展厅的年份、事件或关键词</label><input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索本展厅的年份、事件或关键词" />{query && <button type="button" onClick={() => setQuery('')} aria-label="清空搜索"><X size={15} /></button>}</div>
          <p className="history-count" role="status" aria-live="polite">{searchText ? '找到 ' : '精选 '}<strong>{visible.length}</strong> 个节点</p>
        </div>
        <div id="history-results" className="history-grid">
          {visible.map((item) => <article key={item.id} className="history-event">
            <button type="button" className="history-event-button" onClick={() => setSelected(item)} aria-haspopup="dialog" aria-label={`查看${item.year}年${item.title}详情`}>
              <span className="history-event-meta"><span className="history-event-year">{item.year}</span><span className="history-event-tag">{item.tag}</span></span>
              <h3>{item.title}</h3>
              <span className="history-event-summary">{item.summary}</span>
              <span className="history-event-footer"><span>{item.date}</span><span>阅读史事<ArrowRight size={14} aria-hidden="true" /></span></span>
            </button>
          </article>)}
        </div>
        {!visible.length && <div className="history-empty"><Search size={28} aria-hidden="true" /><h3>未找到相关史事</h3><p>试试“长征”“改革开放”，或切换历史时期继续查找。</p><button type="button" onClick={() => changePeriod('all')}>查看全部 {historyMilestones.length} 个节点<ArrowRight size={15} aria-hidden="true" /></button></div>}
        <p className="history-scope-note">展陈说明：本馆精选1921—2022年部分重要史事，不作为完整编年史；1949、1978、2012年按具体事件归入相应时期。</p>
      </section>

      <aside className="history-sidebar" aria-label="红色记忆与延伸阅读">
        <section className="history-story-panel" aria-labelledby="history-stories-heading">
          <div className="history-sidebar-heading"><div><p className="history-kicker">见人 · 见事 · 见精神</p><h2 id="history-stories-heading">红色故事</h2></div><BookOpen size={21} aria-hidden="true" /></div>
          <div className="history-story-list">{historyStories.map((story, index) => <button type="button" key={story.id} onClick={() => setSelected(story)} aria-haspopup="dialog">
            <span className="history-story-index" aria-hidden="true">0{index + 1}</span><span className="history-story-copy"><span className="history-story-tag">{story.tag}</span><strong>{story.title}</strong><span>{story.summary}</span></span><ChevronRight size={16} aria-hidden="true" />
          </button>)}</div>
        </section>
        <section className="history-reading-panel" aria-labelledby="history-reading-heading">
          <p className="history-kicker">回到原文</p><h2 id="history-reading-heading">史料索引</h2>
          <p>节点与故事为学习摘要，完整表述请参阅权威原文。</p>
          {[historySources.chronology, historySources.resolution, historySources.congress].map((source) => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span><small>{source.publisher}</small><strong>{source.title}</strong></span><ExternalLink size={15} aria-hidden="true" /><span className="history-sr-only">（在新窗口打开）</span></a>)}
        </section>
      </aside>
    </div>
    {selected && <HistoryDetail item={selected} onClose={() => setSelected(null)} />}
  </div>
}
