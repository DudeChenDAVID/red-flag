import { BookOpen, ExternalLink, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import '../styles/theory.css'
const categories = ['全部', '马克思主义经典', '毛泽东思想', '中国特色社会主义理论体系', '习近平新时代中国特色社会主义思想', '党史党章', '《资本论》专题']
const books = [
  { title: '《共产党宣言》', author: '马克思、恩格斯', category: '马克思主义经典', intro: '科学社会主义的纲领性文献，理解共产党人的初心使命。', source: '马克思主义经典文献公开学习资料' },
  { title: '《资本论》', author: '马克思', category: '《资本论》专题', intro: '研究资本主义生产方式及其发展规律的经典著作。', source: '马克思主义经典文献公开学习资料' },
  { title: '《实践论》《矛盾论》', author: '毛泽东', category: '毛泽东思想', intro: '学习实事求是、认识和改造世界的思想方法。', source: '毛泽东著作公开文献' },
  { title: '《邓小平文选》', author: '邓小平', category: '中国特色社会主义理论体系', intro: '理解解放思想、实事求是与改革开放的理论实践。', source: '中央党史和文献研究院公开资料' },
  { title: '《习近平谈治国理政》', author: '习近平', category: '习近平新时代中国特色社会主义思想', intro: '系统学习新时代党和国家事业发展的理论与实践。', source: '中国政府网、中央党史和文献研究院公开资料' },
  { title: '中国共产党一百年大事记', author: '中央党史和文献研究院', category: '党史党章', intro: '按时间梳理 1921 年 7 月至 2021 年 6 月党的重大历史事件。', source: 'https://ebook.dswxyjy.org.cn/detail/322' },
]
export default function TheoryLibrary() {
  const [category, setCategory] = useState('全部'); const [query, setQuery] = useState(''); const [selected, setSelected] = useState(null)
  const visible = useMemo(() => books.filter((book) => (category === '全部' || book.category === category) && (book.title + book.author + book.intro).includes(query.trim())), [category, query])
  return <section className="theory-page"><header className="theory-hero"><p className="section-eyebrow">理论学习 · 经典导读</p><h1>党的思想</h1><p>从马克思主义经典到新时代党的创新理论，循序学习、联系实际、知行合一。</p></header><div className="theory-toolbar"><div className="theory-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索书名、作者或关键词" /></div><div className="theory-tabs">{categories.map((item) => <button className={category === item ? 'active' : ''} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div><div className="theory-grid">{visible.map((book) => <article className="theory-card glass-panel" key={book.title} onClick={() => setSelected(book)}><BookOpen size={25} /><p>{book.category}</p><h2>{book.title}</h2><strong>{book.author}</strong><span>{book.intro}</span><button>查看导读 <ExternalLink size={14} /></button></article>)}</div>{selected && <div className="theory-dialog" onClick={() => setSelected(null)}><article className="theory-dialog-card glass-panel" onClick={(event) => event.stopPropagation()}><button className="dialog-close" onClick={() => setSelected(null)}>×</button><p className="section-eyebrow">学习导读</p><h2>{selected.title}</h2><p>{selected.intro}</p><small>资料来源：{selected.source}</small><p className="theory-note">本页面为学习原型，全文阅读请前往出版社、政府网站或其他已授权的公开渠道。</p></article></div>}</section>
}
