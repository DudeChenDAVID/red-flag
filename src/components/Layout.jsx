import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { BookOpen, ChevronRight, FilePenLine, House, Library, ListChecks } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
const navigation = [
  { to: '/', label: '首页', icon: House, end: true },
  { to: '/history', label: '党史馆', icon: Library },
  { to: '/rules', label: '党章党规', icon: BookOpen },
  { to: '/quiz', label: '党的思想', icon: ListChecks },
  { to: '/report', label: '思想报告助手', icon: FilePenLine },
]
export default function Layout() {
  // Layout 仅管理公共导航与页面容器，业务页面通过 Outlet 挂载。
  const location = useLocation()
  const reducedMotion = useReducedMotion()
  const current = navigation.find((item) => item.to === location.pathname) || { label: '个人中心' }
  // 装饰文字对辅助技术隐藏，不参与交互，也不用作品牌标识。
  return <div className="app-shell">
    <div className="ink-texture ink-texture-left" aria-hidden="true">为人民服务</div><div className="ink-texture ink-texture-center" aria-hidden="true">为人民服务</div><div className="ink-texture ink-texture-right" aria-hidden="true">为人民服务</div>
    <header className="topbar"><NavLink to="/" className="brand" aria-label="返回首页"><span className="brand-seal">★</span><span><strong>红旗学苑</strong><small>党史党章学习平台</small></span></NavLink>
      <nav className="desktop-nav" aria-label="主导航">{navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={16} strokeWidth={1.8} />{label}</NavLink>)}</nav>
      <NavLink to="/profile" className="profile-chip"><span className="avatar">学</span><span className="profile-name">我的学习</span><ChevronRight size={15} /></NavLink>
    </header>
    <main className="main-content"><div className="breadcrumb"><span>红旗学苑</span><ChevronRight size={14} />{current && <span>{current.label}</span>}</div><motion.div key={location.pathname} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' }}><Outlet /></motion.div></main>
    <footer className="footer"><span>传承红色基因 · 赓续精神血脉</span><span className="footer-rule" /><span>学习记录仅供个人使用</span></footer>
    <div className="mobile-nav">{navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label}</span></NavLink>)}</div>
  </div>
}

