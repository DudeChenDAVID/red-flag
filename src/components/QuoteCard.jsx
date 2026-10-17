import { Check, Copy, Heart, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function QuoteCard({ quote, onFavorite, onCopy }) {
  const [favorite, setFavorite] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showContext, setShowContext] = useState(false)
  if (!quote) return null

  const handleFavorite = () => {
    const next = !favorite
    setFavorite(next)
    onFavorite?.(quote, next)
  }

  const handleCopy = async () => {
    const text = ['“' + quote.quote + '”', '——' + quote.author + '，《' + quote.source.replace(/^《|》$/g, '') + '》'].join('')
    try {
      await navigator.clipboard?.writeText(text)
      setCopied(true)
      onCopy?.(quote)
      window.setTimeout(() => setCopied(false), 1600)
    } catch { setCopied(false) }
  }

  return (
    <motion.article layout transition={{ layout: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }} className="quote-card glass-panel gold-shimmer service-bg" tabIndex="0" onFocus={() => setShowContext(true)} onBlur={() => setShowContext(false)}>
      <span className="quote-mark quote-mark-top" aria-hidden="true">“</span>
      <blockquote>{quote.quote}</blockquote>
      <span className="quote-mark quote-mark-bottom" aria-hidden="true">”</span>
      <footer className="quote-meta"><span className="quote-author">{quote.author}</span><span className="quote-source">{quote.source} · {quote.date}</span></footer>
      <div className="quote-actions">
        <button type="button" aria-label={favorite ? '取消收藏' : '收藏语录'} aria-pressed={favorite} onClick={handleFavorite}><Heart size={16} fill={favorite ? 'currentColor' : 'none'} />{favorite ? '已收藏' : '收藏'}</button>
        <button type="button" aria-label="复制语录" onClick={handleCopy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '已复制' : '复制'}</button>
        <button type="button" className="context-trigger" aria-label="查看语录背景" aria-expanded={showContext} onClick={() => setShowContext((value) => !value)}><Info size={16} />背景</button>
      </div>
      <div className={'quote-context ' + (showContext ? 'is-visible' : '')} role="status"><strong>出处背景</strong><span>{quote.author} · {quote.source} · {quote.date}</span><small>{quote.tags.join(' · ')}</small></div>
    </motion.article>
  )
}
