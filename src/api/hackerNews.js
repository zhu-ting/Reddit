const HACKER_NEWS_API_URL = 'https://hacker-news.firebaseio.com/v0'

const fetchJson = url =>
  fetch(url).then(response => {
    const contentType = response.headers.get('content-type') || ''

    if (!response.ok) {
      throw new Error(`Hacker News request failed with ${response.status}`)
    }

    if (!contentType.includes('application/json')) {
      return response.text().then(text => {
        throw new Error(`Expected JSON from Hacker News, received: ${text.slice(0, 80)}`)
      })
    }

    return response.json()
  })

export const fetchPosts = feed =>
  fetchJson(`${HACKER_NEWS_API_URL}/${feed}.json`)
    .then(ids => Promise.all(
      ids.slice(0, 20).map(id => fetchJson(`${HACKER_NEWS_API_URL}/item/${id}.json`))
    ))
    .then(posts => posts.filter(post => post && post.title))
