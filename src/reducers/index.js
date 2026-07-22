import { combineReducers } from 'redux'
import { SELECT_SUBREDDIT,
  REQUEST_POSTS, RECEIVE_POSTS, RECEIVE_POSTS_FAILURE
} from '../actions'

const selectedSubreddit = (state = 'topstories', action) => {
  switch (action.type) {
    case SELECT_SUBREDDIT:
      return action.subreddit
    default:
      return state
  }
}

const posts = (state = {isFetching: false,didInvalidate: false,items: []}, action) => {
  switch (action.type) {
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        error: null
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        error: null,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    case RECEIVE_POSTS_FAILURE:
      return {
        ...state,
        isFetching: false,
        didInvalidate: true,
        error: action.error
      }
    default:
      return state
  }
}

const postsBySubreddit = (state = { }, action) => {
  switch (action.type) {
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
    case RECEIVE_POSTS_FAILURE:
      return {
        ...state,
        [action.subreddit]: posts(state[action.subreddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsBySubreddit,
  selectedSubreddit
})

export default rootReducer
