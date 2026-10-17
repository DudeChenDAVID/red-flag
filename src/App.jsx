import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import PartyConstitution from './pages/PartyConstitution'
import HistoryMuseum from './pages/HistoryMuseum'
import TheoryLibrary from './pages/TheoryLibrary'

const Page = ({ title, eyebrow }) => <section className="page-shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-intro">内容模块正在建设中，后续将接入阅读、检索、答题与学习记录。</p></section>

export default function App() {
  return <Routes><Route element={<Layout />}><Route index element={<Home />} /><Route path="history" element={<HistoryMuseum />} /><Route path="rules" element={<PartyConstitution />} /><Route path="quiz" element={<TheoryLibrary />} /><Route path="report" element={<Page eyebrow="思想报告助手" title="把学习思考写成真切文字" />} /><Route path="profile" element={<Page eyebrow="个人中心" title="我的学习足迹" />} /><Route path="*" element={<Navigate to="/" replace />} /></Route></Routes>
}
