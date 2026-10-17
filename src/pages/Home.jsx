import { ArrowRight, BookOpen, CalendarDays, CheckCircle2, ChevronRight, FilePenLine, Flame, ListChecks, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import QuoteCard from '../components/QuoteCard'
import { fetchDailyQuote } from '../services/quotes'

const entrances = [{ to: '/history', label: '学党史', detail: '回望百年征程', icon: BookOpen }, { to: '/rules', label: '读党章', detail: '原文研读常新', icon: CheckCircle2 }, { to: '/quiz', label: '党的思想', detail: '理论学习图书馆', icon: ListChecks }, { to: '/report', label: '写报告', detail: '记录思想成长', icon: FilePenLine }]
const ranking = [{ name: '马克思主义学院 · 2024级', score: 9820 }, { name: '信息科学与技术学院 · 2023级', score: 9460 }, { name: '经济管理学院 · 2024级', score: 9214 }, { name: '外国语学院 · 2023级', score: 8978 }, { name: '法学院 · 2024级', score: 8750 }]
const todayEvents = {
  '01-15': [{ date: '1935.01.15', title: '遵义会议召开', text: '会议在危急关头挽救了党、挽救了红军、挽救了中国革命。' }],
  '07-01': [{ date: '1921.07.01', title: '中国共产党成立纪念日', text: '铭记党的诞生，沿着先辈足迹坚定理想信念。' }],
  '07-23': [{ date: '1921.07.23', title: '中国共产党第一次全国代表大会召开', text: '中国共产党正式成立，中国革命从此有了坚强的领导核心。' }],
  '10-01': [{ date: '1949.10.01', title: '中华人民共和国成立', text: '第一面五星红旗在天安门广场升起，中华民族从此站起来了。' }],
  '12-18': [{ date: '1978.12.18', title: '党的十一届三中全会召开', text: '开启了改革开放和社会主义现代化建设新时期。' }],
}
const historyFallback = [{ date: '1921—至今', title: '百年奋斗历程', text: '今天适合打开党史年表，选择一个年份了解党的光辉历程。' }, { date: '资料提示', title: '以权威资料为准', text: '本页事件依据公开党史文献整理，后续将持续补充。' }, { date: '学习入口', title: '进入党史馆', text: '时间轴已支持从 1921 年至今逐年点击查询。' }, { date: '每日一学', title: '积跬步以至千里', text: '坚持学习党的理论和历史，记录自己的思考。' }]

export default function Home() {
  const [quote, setQuote] = useState(null); const [quoteLoading, setQuoteLoading] = useState(true); const [quoteRefreshing, setQuoteRefreshing] = useState(false)
  const today = new Date(); const todayKey = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const historyToday = [...(todayEvents[todayKey] || []), ...historyFallback].slice(0, 4)
  const loadQuote = useCallback(async (rotate = false) => {
    if (rotate) setQuoteRefreshing(true); else setQuoteLoading(true)
    const nextQuote = await fetchDailyQuote({ rotate })
    setQuote(nextQuote)
    setQuoteLoading(false)
    setQuoteRefreshing(false)
  }, [])
  useEffect(() => { loadQuote() }, [loadQuote])
  return <div className="home-page">
    <section className="home-hero service-bg" aria-labelledby="home-title"><div className="cloud-pattern" aria-hidden="true" />
      <motion.div className="hero-copy" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: 'easeOut' }}><p className="hero-kicker">红旗学苑 · 每日一学</p><h1 id="home-title">学党史 · 强信念 · 跟党走</h1><p className="hero-subtitle">在党的光辉历程中汲取奋进力量</p></motion.div>
      <motion.div className="hero-quote-wrap" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: .15, ease: 'easeOut' }}>{quoteLoading ? <div className="quote-loading">正在加载今日金句…</div> : <div className={quoteRefreshing ? 'quote-refreshing' : ''}><motion.div key={quote?.id ?? 'none'} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35, ease: 'easeOut' }}><QuoteCard quote={quote} /></motion.div>{quoteRefreshing && <span className="quote-refresh-indicator" aria-live="polite">正在换一条</span>}</div>}</motion.div>
      <button type="button" className="change-quote" onClick={() => loadQuote(true)} disabled={quoteLoading || quoteRefreshing}><RefreshCw size={15} className={quoteLoading || quoteRefreshing ? 'spin' : ''} />换一条</button>
      <div className="hero-entrances" aria-label="学习入口">{entrances.map(({ to, label, detail, icon: Icon }, index) => <motion.div key={to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .55, delay: .25 + index * .1 }}><Link to={to} className="entrance-card glass-panel gold-shimmer"><Icon size={21} /><span><strong>{label}</strong><small>{detail}</small></span><ArrowRight size={16} className="entrance-arrow" /></Link></motion.div>)}</div>
    </section>
    <section className="home-progress-grid" aria-label="学习数据"><article className="progress-panel glass-panel"><div className="section-heading"><div><p className="section-eyebrow">我的学习</p><h2>学习进度</h2></div><Link to="/profile" className="text-link">查看详情 <ChevronRight size={15} /></Link></div><div className="progress-content"><div className="progress-ring" aria-label="本周学习进度 72%"><div><strong>72<span>%</span></strong><small>本周完成</small></div></div><div className="streak"><Flame size={21} /><strong>12</strong><span>连续学习天数</span><small>再坚持 3 天，达成新徽章</small></div></div><div className="progress-bar-label"><span>本周学习目标</span><span>18 / 25 分钟</span></div><div className="progress-bar"><span /></div></article>
      <article className="ranking-panel glass-panel"><div className="section-heading"><div><p className="section-eyebrow">并肩同行</p><h2>支部排行榜</h2></div><Link to="/profile" className="text-link">完整榜单 <ChevronRight size={15} /></Link></div><ol className="ranking-list">{ranking.map((item, index) => <li key={item.name}><span className="rank-number">{String(index + 1).padStart(2, '0')}</span><span className="rank-name">{item.name}</span><span className="rank-score">{item.score.toLocaleString()} <small>分</small></span></li>)}</ol></article></section>
    <section className="today-section"><div className="section-heading"><div><p className="section-eyebrow">铭记历史</p><h2>党史上的今天</h2></div><CalendarDays size={21} className="section-icon" /></div><div className="today-scroller">{historyToday.map((item) => <article className="today-card glass-panel" key={item.date}><time>{item.date}</time><h3>{item.title}</h3><p>{item.text}</p><Link to="/history">阅读详情 <ArrowRight size={14} /></Link></article>)}</div></section>
  </div>
}
