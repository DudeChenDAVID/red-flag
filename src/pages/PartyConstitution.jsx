import { ChevronDown, ChevronRight, Headphones, Search, ZoomIn, ZoomOut } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const constitutionEntries = [
  ['总纲', '中国共产党是中国工人阶级的先锋队，同时是中国人民和中华民族的先锋队，是中国特色社会主义事业的领导核心。', ['中国共产党', '先锋队', '领导核心']],
  ['第一章 党员', '党员必须履行党章规定的义务，执行党的决定，严守党的纪律，对党忠诚，积极工作，为共产主义奋斗终身。', ['党员', '党的纪律', '共产主义']],
  ['第二章 党的组织制度', '党是根据自己的纲领和章程，按照民主集中制组织起来的统一整体。党的根本组织原则是民主集中制。', ['组织制度', '民主集中制', '组织原则']],
  ['第三章 党的中央组织', '党的最高领导机关，是党的全国代表大会和它所产生的中央委员会。党的全国代表大会每五年举行一次。', ['中央组织', '全国代表大会', '中央委员会']],
  ['第四章 党的地方组织', '党的地方各级委员会全体会议，每年至少召开两次。党的地方各级代表大会每五年举行一次。', ['地方组织', '地方委员会']],
  ['第五章 党的基层组织', '党的基层组织是党在社会基层组织中的战斗堡垒，是党的全部工作和战斗力的基础。', ['基层组织', '战斗堡垒', '组织建设']],
  ['第六章 党的干部', '党的干部是党的事业的骨干，是人民的公仆，要做到忠诚干净担当。', ['党的干部', '人民公仆', '担当']],
  ['第七章 党的纪律', '党的纪律是各级组织和全体党员必须遵守的行为规则，是维护党的团结统一、完成党的任务的保证。', ['党的纪律', '团结统一', '纪律建设']],
  ['第八章 党的纪律检查机关', '党的各级纪律检查委员会是党内监督专责机关，履行监督、执纪、问责职责。', ['纪律检查机关', '党内监督', '监督执纪']],
  ['第九章 党组', '在中央和地方国家机关、人民团体、经济组织、文化组织和其他非党组织的领导机关中，可以成立党组。', ['党组', '领导机关', '组织领导']],
  ['第十章 党和共产主义青年团的关系', '中国共产主义青年团是中国共产党领导的先进青年的群团组织，是党的助手和后备军。', ['共青团', '先进青年', '后备军']],
  ['第十一章 党徽党旗', '中国共产党党徽为镰刀和锤头组成的图案。中国共产党党旗为旗面缀有金黄色党徽图案的红旗。', ['党徽', '党旗', '政治标志']],
].map(([title, body, keywords], index) => ({ id: 'constitution-' + index, title, body, keywords }))

const documents = {
  党章: { title: '中国共产党章程', meta: '中国共产党第二十次全国代表大会部分修改 · 2022年10月22日通过', entries: constitutionEntries },
  准则: { title: '关于新形势下党内政治生活的若干准则', meta: '2016年10月27日中国共产党第十八届中央委员会第六次全体会议通过', entries: ['坚定理想信念', '坚持党的基本路线', '坚决维护党中央权威', '严明党的政治纪律', '保持党同人民群众的血肉联系', '坚持民主集中制原则'].map((title, index) => ({ id: 'guideline-' + index, title, body: '严肃党内政治生活是党的优良传统和政治优势。全党必须坚持党的领导，严明政治纪律，保持党的先进性和纯洁性。', keywords: ['党内政治生活', '政治纪律'] })) },
  条例: { title: '中国共产党纪律处分条例', meta: '2023年12月修订，自2024年1月1日起施行', entries: ['总则：指导思想、原则和适用范围', '对违反政治纪律行为的处分', '对违反组织纪律行为的处分', '对违反廉洁纪律行为的处分', '对违反群众纪律行为的处分', '对违反工作纪律行为的处分', '对违反生活纪律行为的处分'].map((title, index) => ({ id: 'regulation-' + index, title, body: '坚持党要管党、全面从严治党，依规依纪严肃处理违纪行为，维护党章和其他党内法规的权威。', keywords: ['纪律处分', '全面从严治党'] })) },
  党务知识: { title: '党务知识学习手册', meta: '入党积极分子与党员基础学习资料', entries: ['申请入党', '入党积极分子培养教育', '发展对象政治审查', '预备党员接收与教育考察', '预备党员转正', '党的组织生活'].map((title, index) => ({ id: 'knowledge-' + index, title, body: '党务工作应当坚持标准、严格程序、保证质量，教育引导党员坚定理想信念，履行党员义务。', keywords: ['党务知识', '组织生活'] })) },
}

const childLabels = { 党章: ['总纲', ...constitutionEntries.slice(1).map((entry) => entry.title)], 准则: documents.准则.entries.map((entry) => entry.title), 条例: documents.条例.entries.map((entry) => entry.title), 党务知识: documents.党务知识.entries.map((entry) => entry.title) }
function HighlightText({ text, keyword }) {
  if (!keyword.trim()) return text
  const lower = text.toLowerCase(); const target = keyword.toLowerCase(); const output = []; let cursor = 0; let index = lower.indexOf(target)
  while (index >= 0) { if (index > cursor) output.push(text.slice(cursor, index)); output.push(<mark key={index}>{text.slice(index, index + keyword.length)}</mark>); cursor = index + keyword.length; index = lower.indexOf(target, cursor) }
  output.push(text.slice(cursor)); return output
}

export default function PartyConstitution() {
  const [documentKey, setDocumentKey] = useState('党章'); const [page, setPage] = useState(0); const [keyword, setKeyword] = useState(''); const [fontSize, setFontSize] = useState('medium'); const [openItems, setOpenItems] = useState(() => new Set(['党章'])); const [speaking, setSpeaking] = useState(false)
  const activeDocument = documents[documentKey]; const pageSize = 3; const totalPages = Math.ceil(activeDocument.entries.length / pageSize); const pageEntries = activeDocument.entries.slice(page * pageSize, page * pageSize + pageSize)
  const firstMatchPage = useMemo(() => {
    if (!keyword.trim()) return null
    const lower = keyword.toLowerCase()
    const index = activeDocument.entries.findIndex((entry) => (entry.title + entry.body).toLowerCase().includes(lower))
    return index >= 0 ? Math.floor(index / pageSize) : null
  }, [activeDocument, keyword])
  const filteredCount = useMemo(() => keyword.trim() ? activeDocument.entries.filter((entry) => (entry.title + entry.body).toLowerCase().includes(keyword.toLowerCase())).length : 0, [activeDocument, keyword])
  useEffect(() => { if (firstMatchPage !== null) setPage(firstMatchPage) }, [firstMatchPage])
  const toggle = (label) => setOpenItems((current) => { const next = new Set(current); next.has(label) ? next.delete(label) : next.add(label); return next })
  const switchDocument = (key) => { setDocumentKey(key); setPage(0); setKeyword(''); setOpenItems((current) => { const next = new Set(current); next.has(key) ? next.delete(key) : next.add(key); return next }) }
  const jumpToEntry = (key, title) => { const index = documents[key].entries.findIndex((entry) => entry.title === title); setDocumentKey(key); setKeyword(''); if (index >= 0) setPage(Math.floor(index / pageSize)) }
  return <div className="constitution-page service-bg">
    <aside className="constitution-sidebar glass-panel" aria-label="党章党规目录"><div className="constitution-sidebar-head"><p>文献目录</p><strong>党章党规</strong></div><nav>{Object.keys(documents).map((key) => <div className="tree-group" key={key}><button type="button" className={'tree-parent ' + (documentKey === key ? 'document-active' : '')} onClick={() => switchDocument(key)} aria-expanded={openItems.has(key)}><span>{openItems.has(key) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}{key}</span><small>{documents[key].entries.length}</small></button>{openItems.has(key) && <div className="tree-children">{childLabels[key].map((child) => { const childIndex = documents[key].entries.findIndex((entry) => entry.title === child); const isSelected = key === documentKey && childIndex >= page * pageSize && childIndex < page * pageSize + pageSize; return <button type="button" className={isSelected ? 'selected' : ''} key={child} onClick={() => jumpToEntry(key, child)}>{child}</button> })}</div>}</div>)}</nav></aside>
    <main className="constitution-reader"><header className="reader-header"><div><p className="section-eyebrow">原文研读 · 常学常新</p><h1>{activeDocument.title}</h1><p className="reader-meta">{activeDocument.meta}</p></div><div className="reader-tools"><label className="reader-search"><Search size={16} /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索正文关键词" aria-label="搜索正文关键词" /></label><div className="font-controls" aria-label="字体大小"><button type="button" onClick={() => setFontSize('small')} className={fontSize === 'small' ? 'active' : ''}><ZoomOut size={15} />小</button><button type="button" onClick={() => setFontSize('medium')} className={fontSize === 'medium' ? 'active' : ''}>中</button><button type="button" onClick={() => setFontSize('large')} className={fontSize === 'large' ? 'active' : ''}><ZoomIn size={15} />大</button></div><button type="button" className={'read-button ' + (speaking ? 'active' : '')} onClick={() => setSpeaking((value) => !value)}><Headphones size={16} />{speaking ? '朗读中' : '朗读'}</button></div></header>
    {keyword && <div className="search-result">{filteredCount > 0 ? <>当前文献找到 <strong>{filteredCount}</strong> 个相关条目，已定位到首个匹配页</> : <>当前文献没有匹配 “{keyword}” 的条目</>}</div>}<article className={'constitution-body font-' + fontSize}>{pageEntries.map((entry) => <section className="constitution-chapter" key={entry.id}><h2><span><HighlightText text={entry.title} keyword={keyword} /></span></h2><p><HighlightText text={entry.body} keyword={keyword} /></p><div className="keyword-row">{entry.keywords.map((tag) => <span key={tag}>{tag}</span>)}</div></section>)}</article>
    <footer className="reader-pagination"><button type="button" disabled={page <= 0} onClick={() => setPage((value) => value - 1)}><ChevronRight size={16} />上一页</button><span>第 {page + 1} / {totalPages} 页</span><button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((value) => value + 1)}>下一页<ChevronRight size={16} /></button></footer></main>
  </div>
}
