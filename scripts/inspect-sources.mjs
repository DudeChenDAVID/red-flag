// 仅访问公开史料，输出栏目链接，供人工核验数据源。
const urls = process.argv.slice(2).filter((value) => !value.startsWith('--'))
for (const url of urls) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(20000) })
    const buffer = await response.arrayBuffer()
    const initial = new TextDecoder().decode(buffer)
    const charset = initial.match(/charset=["']?([\w-]+)/i)?.[1] || 'utf-8'
    const html = new TextDecoder(charset).decode(buffer)
    console.log('\nURL:', url, response.status)
    if (process.argv.includes('--text')) console.log(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 24000))
    if (process.env.SOURCE_SAVE) {
      const { writeFileSync } = await import('node:fs')
      writeFileSync(process.env.SOURCE_SAVE, html)
    }
    console.log([...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map((m) => ({ href: new URL(m[1], url).href, title: m[2].replace(/<[^>]+>/g, '').trim() }))
      .filter((a) => /今天|大事记|10月17|历史|开国大典|遵义|三中全会|学习|新民主/.test(a.title)).slice(0, 90))
    console.log('IMAGES:', [...html.matchAll(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/gi)].slice(0, 8).map((m) => m[0]))
  } catch (error) { console.log(url, error.message) }
}
