import quoteData from '../data/quotes.json'

const localQuotes = () => quoteData.map((quote) => ({ ...quote, tags: [...quote.tags] }))

async function readQuotes() {
  try {
    const response = await fetch('/api/quotes')
    if (!response.ok) throw new Error('quotes endpoint unavailable')
    const remoteQuotes = await response.json()
    return Array.isArray(remoteQuotes) && remoteQuotes.length ? remoteQuotes : localQuotes()
  } catch {
    return localQuotes()
  }
}

export async function fetchDailyQuote({ rotate = false } = {}) {
  const quotes = await readQuotes()
  const day = Math.floor(Date.now() / 86400000)
  return quotes[rotate ? Math.floor(Math.random() * quotes.length) : day % quotes.length]
}

export async function fetchByAuthor(author) {
  const quotes = await readQuotes()
  return quotes.filter((quote) => quote.author === author)
}

export async function fetchByTag(tag) {
  const quotes = await readQuotes()
  return quotes.filter((quote) => quote.tags.includes(tag))
}
