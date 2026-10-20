import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, RotateCcw, Send, X } from 'lucide-react'
import bank from '../data/practice-bank.json'
import '../styles/practice.css'

const types = { all: '全部题型', single: '单选题', multiple: '多选题', boolean: '判断题' }
const HISTORY_KEY = 'red-flag-practice-history-v1'
const WRONG_KEY = 'red-flag-practice-wrong-v1'
const SESSION_KEY = 'red-flag-practice-session-v1'
export const isCorrect = (question, answer = []) => answer.length === question.answers.length && answer.every((id) => question.answers.includes(id))

function sample(pool, count, random) {
  const result = [...pool]
  // Fisher-Yates 保留题目与答案映射，仅打乱抽题顺序。
  if (random) for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result.slice(0, count)
}

export default function PracticePanel() {
  const [saved] = useState(() => {
    try {
      const value = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
      if (!value || !['setup', 'answer', 'result', 'review'].includes(value.stage)) return null
      const items = (value.questionIds || []).map((id) => bank.questions.find((q) => q.id === id)).filter(Boolean)
      if (value.stage !== 'setup' && !items.length) return null
      return { ...value, items }
    } catch { return null }
  })
  const [type, setType] = useState('all')
  const [count, setCount] = useState(10)
  const [random, setRandom] = useState(true)
  const [questions, setQuestions] = useState(saved?.items || [])
  const [answers, setAnswers] = useState(saved?.answers || {})
  const [index, setIndex] = useState(Math.max(0, Math.min(saved?.index || 0, (saved?.items.length || 1) - 1)))
  const [stage, setStage] = useState(saved?.stage || 'setup')
  const [confirm, setConfirm] = useState(null)
  const [history, setHistory] = useState(() => { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] } })
  const [wrongStats, setWrongStats] = useState(() => { try { return JSON.parse(localStorage.getItem(WRONG_KEY) || '{}') } catch { return {} } })
  const [reviewOrigin, setReviewOrigin] = useState(saved?.reviewOrigin || 'result')
  const [saveError, setSaveError] = useState('')
  useEffect(() => {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify({ questionIds: questions.map((q) => q.id), answers, index, stage, reviewOrigin }))
      setSaveError('')
    } catch { setSaveError('浏览器存储不可用，本次练习暂时无法保存。') }
  }, [questions, answers, index, stage, reviewOrigin])
  const pool = useMemo(() => bank.questions.filter((q) => type === 'all' || q.type === type), [type])
  const validCount = Number.isInteger(Number(count)) && Number(count) >= 1 && Number(count) <= pool.length
  const current = questions[index]
  const selected = current ? answers[current.id] || [] : []
  const answered = questions.filter((q) => answers[q.id]?.length).length
  const correct = questions.filter((q) => isCorrect(q, answers[q.id]))
  const wrong = questions.filter((q) => answers[q.id]?.length && !isCorrect(q, answers[q.id]))
  const review = stage === 'review'

  useEffect(() => {
    if (!confirm) return
    const escape = (event) => { if (event.key === 'Escape') setConfirm(null) }
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [confirm])

  function start(items) {
    setQuestions(items); setAnswers({}); setIndex(0); setStage('answer'); setConfirm(null)
  }
  function finish() {
    const result = questions.reduce((summary, question) => {
      const answer = answers[question.id] || []
      const right = isCorrect(question, answer)
      summary.total += 1
      if (answer.length) summary.answered += 1
      if (right) summary.correct += 1
      else if (answer.length) summary.wrong += 1
      return summary
    }, { total: 0, answered: 0, correct: 0, wrong: 0 })
    const attemptTypes = [...new Set(questions.map((question) => question.type))]
    const nextHistory = [{ id: Date.now(), at: new Date().toISOString(), ...result, count: questions.length,
      type: attemptTypes.length === 1 ? attemptTypes[0] : 'all', unanswered: questions.length - result.answered,
      questionIds: questions.map((question) => question.id), answers: Object.fromEntries(questions.map((question) => [question.id, answers[question.id] || []])) }, ...history]
    const nextWrong = { ...wrongStats }
    questions.forEach((question) => { if (answers[question.id]?.length && !isCorrect(question, answers[question.id])) nextWrong[question.id] = (nextWrong[question.id] || 0) + 1 })
    setHistory(nextHistory); setWrongStats(nextWrong)
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory)); localStorage.setItem(WRONG_KEY, JSON.stringify(nextWrong)) }
    catch { setSaveError('浏览器存储空间不足，记录未能保存，请勿关闭本页。') }
    setStage('result')
  }
  function choose(id) {
    if (review) return
    setAnswers((previous) => {
      const old = previous[current.id] || []
      return { ...previous, [current.id]: current.type === 'multiple'
        ? old.includes(id) ? old.filter((value) => value !== id) : [...old, id]
        : [id] }
    })
  }
  function reviewHistory(record) {
    const savedQuestions = (record.questionIds || []).map((id) => bank.questions.find((question) => question.id === id)).filter(Boolean)
    setQuestions(savedQuestions); setAnswers(record.answers || {}); setIndex(0); setReviewOrigin('history'); setStage('review')
  }

  return <section className="practice-section" aria-labelledby="practice-heading">
    <header className="practice-title"><div><p className="section-eyebrow">第45期积极分子测试题库</p><h2 id="practice-heading">专题练习</h2></div><span>共 {bank.questions.length} 题</span></header>
    <p className="practice-source" role="status">{saveError || '进度与记录自动保存在当前浏览器，切换页面或刷新后，点击“进入练习”即可恢复。'}</p>
    {stage === 'setup' ? <>
      <div className="practice-counts">{Object.entries(types).filter(([key]) => key !== 'all').map(([key, label]) => <span key={key}>{label} <strong>{bank.questions.filter((q) => q.type === key).length}</strong></span>)}</div>
      <form className="practice-setup" onSubmit={(event) => { event.preventDefault(); if (validCount) start(sample(pool, Number(count), random)) }}>
        <label>练习题型<select value={type} onChange={(event) => { setType(event.target.value); setCount(Math.min(Number(count) || 10, bank.questions.filter((q) => event.target.value === 'all' || q.type === event.target.value).length)) }}>{Object.entries(types).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>
        <label>每次题量<input aria-label="每次题量" type="number" min="1" max={pool.length} step="1" required value={count} onChange={(event) => setCount(event.target.value)} /><small>可选 1–{pool.length} 题</small></label>
        <label>出题顺序<select value={random ? 'random' : 'ordered'} onChange={(event) => setRandom(event.target.value === 'random')}><option value="random">随机抽题</option><option value="ordered">题库顺序</option></select></label>
        <button className="practice-primary" disabled={!validCount} type="submit">开始练习 <ArrowRight size={16} /></button>
      </form>
      <div className="practice-presets">{[10, 20, 50, pool.length].filter((value, i, list) => list.indexOf(value) === i && value <= pool.length).map((value) => <button key={value} onClick={() => setCount(value)}>{value === pool.length ? '全部' : `${value} 题`}</button>)}</div>
      <div className="practice-record-grid"><article><strong>练习记录</strong><b>{history.length}</b><small>次已完成</small></article><article><strong>错题本</strong><b>{Object.keys(wrongStats).length}</b><small>道错题 · 共错 {Object.values(wrongStats).reduce((a, b) => a + b, 0)} 次</small></article></div>
      {Object.keys(wrongStats).length > 0 && <details className="practice-wrong-book"><summary>打开错题本 · {Object.keys(wrongStats).length} 道题，累计错答 {Object.values(wrongStats).reduce((a, b) => a + b, 0)} 次</summary><div className="practice-wrong-list">{bank.questions.filter((q) => wrongStats[q.id]).sort((a, b) => wrongStats[b.id] - wrongStats[a.id]).map((question) => <article key={question.id}><div><span>{types[question.type]} · 原题库第 {question.number} 题</span><b>错答 {wrongStats[question.id]} 次</b></div><p>{question.prompt}</p><small>正确答案：{question.answers.join('、')}</small></article>)}</div><button className="practice-wrong-link" onClick={() => start(bank.questions.filter((q) => wrongStats[q.id]))}><RotateCcw size={15} />重练全部错题</button></details>}
      {history.length > 0 && <div className="practice-history"><strong>练习记录</strong>{history.map((item) => <article key={item.id}><span>{new Date(item.at).toLocaleString('zh-CN', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}　答对 {item.correct}/{item.total}　错答 {item.wrong} 题</span><button onClick={() => reviewHistory(item)}>查看记录</button></article>)}</div>}
      <p className="practice-source">题库来源：{bank.title}。答案按原题库判定，多选题须全部选对。</p>
    </> : stage === 'result' ? <div className="practice-result" role="status">
      <strong>{Math.round(correct.length / questions.length * 100)}<small> 分</small></strong><h3>本次练习完成</h3><p>答对 {correct.length} 题 · 答错 {answered - correct.length} 题 · 未答 {questions.length - answered} 题</p><small>本次结果已保存到练习记录，错题已自动加入错题本。</small>
      <div className="practice-commands"><button className="practice-primary" onClick={() => { setIndex(0); setReviewOrigin('result'); setStage('review') }}>查看答案</button>{wrong.length > 0 && <button className="practice-secondary" onClick={() => start(wrong)}><RotateCcw size={16} />错题重练（{wrong.length}）</button>}<button className="practice-secondary" onClick={() => setStage('setup')}>重新选题</button></div>
    </div> : <>
      <div className="practice-status"><span>{review ? reviewOrigin === 'history' ? '历史记录回顾' : '答案回顾' : '正在练习'} · 第 {index + 1} / {questions.length} 题</span><button onClick={() => review ? setStage(reviewOrigin === 'history' ? 'setup' : 'result') : setConfirm('exit')}>{review ? reviewOrigin === 'history' ? '返回练习记录' : '返回成绩' : '结束练习'}</button></div>
      <progress className="practice-progress" value={answered} max={questions.length} aria-label="已答题进度" />
      <div className="practice-layout"><div className="practice-question" key={current.id}>
        <div className="practice-question-meta"><span>{types[current.type]}</span><small>原题库第 {current.number} 题{current.type === 'multiple' ? ' · 可选多项' : ''}</small></div>
        <h3>{current.prompt}</h3><div className="practice-options" role="group" aria-label="答案选项">{current.options.map((option) => <label key={option.id} className={`practice-option ${selected.includes(option.id) ? 'selected' : ''} ${review && current.answers.includes(option.id) ? 'correct' : ''} ${review && selected.includes(option.id) && !current.answers.includes(option.id) ? 'wrong' : ''}`}>
          <input type={current.type === 'multiple' ? 'checkbox' : 'radio'} name={current.id} checked={selected.includes(option.id)} disabled={review} onChange={() => choose(option.id)} />
          {current.type !== 'boolean' && <b>{option.id}</b>}<span>{option.text}</span>{review && current.answers.includes(option.id) && <Check size={17} />}
        </label>)}</div>
        {review && <div className="practice-feedback"><strong>{isCorrect(current, selected) ? '回答正确' : selected.length ? '回答错误' : '未作答'}</strong><p>你的答案：{selected.join('、') || '未作答'}</p><p>正确答案：{current.answers.join('、')}</p><small>答案来源：原题库「{current.sheet}」第 {current.number} 题</small></div>}
        <footer className="practice-commands"><button className="practice-secondary" disabled={index === 0} onClick={() => setIndex(index - 1)}><ArrowLeft size={16} />上一题</button><button className="practice-secondary" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>下一题 <ArrowRight size={16} /></button>{!review && <button className="practice-primary" onClick={() => answered < questions.length ? setConfirm('submit') : finish()}><Send size={16} />交卷</button>}</footer>
      </div><aside className="practice-sheet"><h3>答题卡</h3><small>已答 {answered} / {questions.length}</small><div>{questions.map((q, i) => <button key={q.id} aria-label={`第${i + 1}题${answers[q.id]?.length ? '，已答' : '，未答'}`} aria-current={i === index ? 'step' : undefined} className={`${i === index ? 'current' : ''} ${review ? isCorrect(q, answers[q.id]) ? 'correct' : 'wrong' : answers[q.id]?.length ? 'done' : ''}`} onClick={() => setIndex(i)}>{i + 1}</button>)}</div></aside></div>
    </>}
    {confirm && <div className="practice-confirm-backdrop"><div className="practice-confirm" role="dialog" aria-modal="true" aria-labelledby="confirm-title"><button className="practice-close" aria-label="关闭" onClick={() => setConfirm(null)}><X size={18} /></button><h3 id="confirm-title">{confirm === 'exit' ? '结束本次练习？' : `还有 ${questions.length - answered} 题未作答，确认交卷？`}</h3><p>{confirm === 'exit' ? '结束后将清空本次作答。' : '未作答题目按错误计入成绩。'}</p><div className="practice-commands"><button autoFocus className="practice-secondary" onClick={() => setConfirm(null)}>继续答题</button><button className="practice-primary" onClick={() => { if (confirm === 'exit') { setStage('setup'); setConfirm(null) } else { setConfirm(null); finish() } }}>确认{confirm === 'exit' ? '结束' : '交卷'}</button></div></div></div>}
  </section>
}
