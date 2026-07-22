import { useEffect, useState } from 'react'
import { fetchPosts } from '../api/hackerNews'

const emptyFeed = {
  isFetching: false,
  items: [],
  error: null,
  lastUpdated: null
}

const loadingFeed = {
  ...emptyFeed,
  isFetching: true
}

const getFeedState = (cache, feed) => cache[feed] || loadingFeed

const useHackerNewsPosts = feed => {
  const [cache, setCache] = useState({})

  useEffect(() => {
    if (cache[feed] && !cache[feed].error) {
      return undefined
    }

    let isCurrent = true

    setCache(previousCache => ({
      ...previousCache,
      [feed]: {
        ...(previousCache[feed] || emptyFeed),
        isFetching: true,
        error: null
      }
    }))

    fetchPosts(feed)
      .then(posts => {
        if (!isCurrent) {
          return
        }

        setCache(previousCache => ({
          ...previousCache,
          [feed]: {
            isFetching: false,
            items: posts,
            error: null,
            lastUpdated: Date.now()
          }
        }))
      })
      .catch(error => {
        if (!isCurrent) {
          return
        }

        setCache(previousCache => ({
          ...previousCache,
          [feed]: {
            ...(previousCache[feed] || emptyFeed),
            isFetching: false,
            error: error.message
          }
        }))
      })

    return () => {
      isCurrent = false
    }
  }, [feed])

  const feedState = getFeedState(cache, feed)

  return {
    posts: feedState.items,
    isFetching: feedState.isFetching,
    error: feedState.error,
    lastUpdated: feedState.lastUpdated
  }
}

export default useHackerNewsPosts
