export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const RECEIVE_POSTS_FAILURE = 'RECEIVE_POSTS_FAILURE'
export const SELECT_SUBREDDIT = 'SELECT_SUBREDDIT'
export const INVALIDATE_SUBREDDIT = 'INVALIDATE_SUBREDDIT'

export const selectSubreddit = subreddit => ({
  type: SELECT_SUBREDDIT,
  subreddit
})

export const invalidateSubreddit = subreddit => ({
  type: INVALIDATE_SUBREDDIT,
  subreddit
})

export const requestPosts = subreddit => ({
  type: REQUEST_POSTS,
  subreddit
})

export const receivePosts = (subreddit, json) => ({
  type: RECEIVE_POSTS,
  subreddit,
  posts: json,
  receivedAt: Date.now()
})

export const receivePostsFailure = (subreddit, error) => ({
  type: RECEIVE_POSTS_FAILURE,
  subreddit,
  error: error.message
})

const fetchPosts = subreddit => dispatch => {
  dispatch(requestPosts(subreddit))
  return fetch(`https://hacker-news.firebaseio.com/v0/${subreddit}.json`)
    .then(response => {
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
    .then(ids => Promise.all(
      ids.slice(0, 20).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Hacker News item request failed with ${response.status}`)
            }

            return response.json()
          })
      )
    ))
    .then(posts => dispatch(receivePosts(subreddit, posts.filter(post => post && post.title))))
    .catch(error => {
      dispatch(receivePostsFailure(subreddit, error))
    })
}

const shouldFetchPosts = (state, subreddit) => {
  const posts = state.postsBySubreddit[subreddit]
  if (!posts) {
    return true
  }
  if (posts.isFetching) {
    return false
  }
  return posts.didInvalidate
}

export const fetchPostsIfNeeded = subreddit => (dispatch, getState) => {
  if (shouldFetchPosts(getState(), subreddit)) {
    return dispatch(fetchPosts(subreddit))
  }
}
