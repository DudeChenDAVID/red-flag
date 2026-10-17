import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, CalendarDays, ChevronRight, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import '../styles/history.css'

const milestones = [
  { year: '1921', title: '开天辟地', event: '中国共产党成立', summary: '中国共产党第一次全国代表大会召开，中国革命有了坚强的领导核心。', detail: '1921年7月，中国共产党第一次全国代表大会在上海召开，后转移至浙江嘉兴南湖举行。大会宣告中国共产党正式成立。', tone: 'red', image: null, imageAlt: '中国共产党成立相关史料待接入', imageSource: '权威党史资料待接入' },
  { year: '1935', title: '伟大转折', event: '遵义会议召开', summary: '在生死攸关的历史关头，会议挽救了党、挽救了红军、挽救了中国革命。', detail: '遵义会议确立了毛泽东同志在党中央和红军的领导地位，成为党的历史上一个生死攸关的转折点。', tone: 'gold', image: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/ZunyiMeeting.jpg', imageAlt: '遵义会议会址资料图', imageSource: 'Wikimedia Commons · ZunyiMeeting.jpg' },
  { year: '1949', title: '改天换地', event: '中华人民共和国成立', summary: '第一面五星红旗在天安门广场升起，中华民族从此站起来了。', detail: '1949年10月1日，中华人民共和国中央人民政府成立，开启了中国历史新纪元。', tone: 'red', image: null, imageAlt: '中华人民共和国成立历史影像待接入', imageSource: '权威党史资料待接入' },
  { year: '1978', title: '伟大转折', event: '党的十一届三中全会召开', summary: '开启改革开放和社会主义现代化建设新时期。', detail: '全会重新确立了解放思想、实事求是的思想路线，实现了党和国家工作中心的历史性转移。', tone: 'gold', image: null, imageAlt: '十一届三中全会历史影像待接入', imageSource: '权威党史资料待接入' },
  { year: '1997', title: '复兴新篇', event: '香港回归祖国', summary: '一国两制伟大构想成功实践，香港回到祖国怀抱。', detail: '1997年7月1日，中国政府对香港恢复行使主权。', tone: 'red' },
  { year: '2001', title: '开放发展', event: '中国加入世界贸易组织', summary: '中国改革开放进入新的阶段，更深融入世界经济。', detail: '2001年12月11日，中国正式成为世界贸易组织成员。', tone: 'gold' },
  { year: '2012', title: '新的篇章', event: '党的十八大召开', summary: '中国特色社会主义进入新的发展阶段。', detail: '党的十八大对全面建成小康社会和推进社会主义现代化建设作出战略部署。', tone: 'red' },
  { year: '2022', title: '继往开来', event: '党的二十大召开', summary: '擘画以中国式现代化全面推进中华民族伟大复兴的宏伟蓝图。', detail: '党的二十大明确新时代新征程中国共产党的使命任务，凝聚奋进新征程的磅礴力量。', tone: 'gold' },
]
const stories = [
  ['半条被子', '一床棉被见证军民鱼水深情，温暖穿越烽火岁月。'],
  ['焦裕禄的“泡桐精神”', '把群众的小事当作自己的大事，在兰考留下不朽的精神丰碑。'],
  ['红岩英魂', '在黑暗中坚持信仰，在斗争中守护理想，用生命诠释忠诚。'],
  ['杨靖宇：冰雪中的坚守', '以树皮、草根充饥，坚持抗联斗争，彰显民族气节。'],
  ['谷文昌：不治服风沙不下山', '带领东山人民植树造林、治理风沙，改变海岛面貌。'],
  ['王进喜：铁人精神', '在大庆石油会战中奋勇拼搏，以实际行动诠释艰苦奋斗。'],
  ['雷锋：平凡中的不平凡', '把有限的生命投入无限的为人民服务之中。'],
  ['钱学森：赤子归来', '冲破重重阻力回到祖国，为新中国科技事业作出重大贡献。'],
  ['南泥湾：自己动手丰衣足食', '三五九旅开展大生产运动，为抗战胜利奠定物质基础。'],
  ['“两弹一星”功勋', '老一辈科学家隐姓埋名、协同攻关，铸就国之重器。'],
]
const martyrs = [
  ['杨靖宇', '东北抗日联军主要领导人，民族英雄。'],
  ['赵一曼', '中国共产党抗日女英雄，留下不屈的家国情怀。'],
  ['董存瑞', '舍身炸碉堡的战斗英雄。'],
  ['黄继光', '用胸膛堵住敌人枪眼的特级英雄。'],
  ['邱少云', '严守纪律、烈火焚身而不动的战斗英雄。'],
]
const poems = [
  ['《七律·长征》', '红军长征途中创作的壮丽史诗，展现革命乐观主义精神。', '毛泽东'],
  ['《沁园春·雪》', '借雪抒怀，表达对历史与时代的深沉思考。', '毛泽东'],
  ['《忆秦娥·娄山关》', '记录红军征战中的豪迈气概与胜利信念。', '毛泽东'],
  ['《囚歌》', '以坚定诗句表达革命者在狱中的信仰与气节。', '叶挺'],
]

export default function HistoryMuseum() {
  const [activeYear, setActiveYear] = useState('全部')
  const [selected, setSelected] = useState(null)
  const currentYear = new Date().getFullYear()
  const years = useMemo(() => ['全部', ...Array.from({ length: Math.max(1, currentYear - 1921 + 1) }, (_, index) => String(1921 + index))], [currentYear])
  const visible = useMemo(() => {
    if (activeYear === '全部') return milestones
    const major = milestones.find((item) => item.year === activeYear)
    return [major || { year: activeYear, title: '年度节点', event: `${activeYear} 年党史节点`, summary: '该年份保留可点击入口，相关编年史与权威资料将在资料库接入后显示。', detail: `这里展示中国共产党自成立以来的逐年时间坐标。${activeYear} 年的详细史事请以中央党史和文献研究院、党史出版社等权威公开资料为准。`, tone: Number(activeYear) % 2 ? 'red' : 'gold', image: null, imageAlt: '年度史料待接入', imageSource: '权威党史资料待接入' }]
  }, [activeYear])
  return <div className="history-page">
    <header className="history-hero"><div><p className="section-eyebrow">百年征程 · 信仰如炬</p><h1>党史馆</h1><p>沿着时间的坐标，重温中国共产党团结带领人民走过的光辉历程。</p></div><div className="history-seal" aria-hidden="true">党史<br /><small>MEMORY</small></div></header>
    <section className="history-timeline" aria-label="党史时间轴"><div className="timeline-track" />{years.map((year) => { const major = milestones.some((item) => item.year === year); return <button key={year} type="button" className={`${activeYear === year ? 'timeline-node active' : 'timeline-node'} ${major ? 'major' : ''}`} onClick={() => setActiveYear(year)}><span>{year}</span><i /></button> })}</section>
    <div className="history-layout"><main><div className="history-section-heading"><div><p className="section-eyebrow">历史回眸</p><h2>{activeYear === '全部' ? '重大节点 · 逐年可查' : activeYear + ' 年 · 历史节点'}</h2></div><span className="history-count">{activeYear === '全部' ? `${milestones.length} 个重大节点 / ${years.length - 1} 年可查` : '点击卡片查看详情'}</span></div><div className="history-grid">{visible.map((item, index) => <motion.article key={item.year} className={'history-scroll-card ' + item.tone} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * .06 }} whileHover={{ y: -5 }} onClick={() => setSelected(item)} tabIndex="0" role="button" onKeyDown={(event) => event.key === 'Enter' && setSelected(item)}><div className="scroll-edge" />{item.image ? <figure className="history-image"><img src={item.image} alt={item.imageAlt} /><figcaption><strong>{item.year}</strong><span>{item.imageSource}</span></figcaption></figure> : <div className="history-thumb"><CalendarDays size={23} /><strong>{item.year}</strong><span>{item.imageSource}</span></div>}<div className="history-card-body"><p>{item.title}</p><h3>{item.event}</h3><span>{item.summary}</span><button type="button" onClick={(event) => { event.stopPropagation(); setSelected(item) }}>展开详情 <ArrowRight size={14} /></button></div></motion.article>)}</div></main>
      <aside className="history-sidebar">
        <section className="story-panel glass-panel"><div className="history-section-heading"><div><p className="section-eyebrow">口述与记忆</p><h2>红色故事</h2></div><BookOpen size={21} /></div><div className="story-list">{stories.map(([title, text]) => <button type="button" key={title} onClick={() => setSelected({ year: '故事', title: '红色记忆', event: title, detail: text })}><strong>{title}</strong><span>{text}</span><ChevronRight size={15} /></button>)}</div></section>
        <section className="martyr-panel glass-panel"><div className="history-section-heading"><div><p className="section-eyebrow">永远的丰碑</p><h2>英烈名录</h2></div></div><div className="martyr-list">{martyrs.map(([name, intro]) => <button type="button" key={name} onClick={() => setSelected({ year: '英烈', title: '英烈名录', event: name, detail: intro })}><strong>{name}</strong><span>{intro}</span><ChevronRight size={15} /></button>)}</div></section>
        <section className="poem-panel glass-panel"><div className="history-section-heading"><div><p className="section-eyebrow">诗以咏志</p><h2>革命诗歌</h2></div></div>{poems.map(([title, intro, author]) => <button type="button" className="poem-item" key={title} onClick={() => setSelected({ year: '诗歌', title: author, event: title, detail: intro })}><strong>{title}</strong><span>{author} · {intro}</span></button>)}</section>
      </aside>
    </div>
    <AnimatePresence>{selected && <motion.div className="history-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)}><motion.div className="history-modal glass-panel" initial={{ opacity: 0, y: 24, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={(event) => event.stopPropagation()}><button type="button" className="modal-close" onClick={() => setSelected(null)} aria-label="关闭详情"><X size={18} /></button><p className="section-eyebrow">{selected.year} · {selected.title}</p><h2>{selected.event}</h2><div className="scroll-divider"><i className="scroll-divider-mark" /></div><p>{selected.detail}</p><small>资料说明：本页为学习原型展示，后续可接入校史馆、党史文献和权威公开资料。</small></motion.div></motion.div>}</AnimatePresence>
  </div>
}
