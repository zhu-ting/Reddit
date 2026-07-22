import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchPostsIfNeeded, selectSubreddit } from "../actions"
import Picker from '../components/Picker'
import Posts from '../components/Posts'

const HACKER_NEWS_FEEDS = ["topstories", "beststories", "jobstories"]

class App extends Component {
  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  componentDidUpdate(prevProps) {
    const { dispatch, selectedSubreddit } = this.props
    if (selectedSubreddit !== prevProps.selectedSubreddit) {
      dispatch(fetchPostsIfNeeded(selectedSubreddit))
    }
  }

  handleChange = nextSubreddit => {
    this.props.dispatch(selectSubreddit(nextSubreddit))
  }

  render() {
    const { selectedSubreddit, posts, error } = this.props
    return (
      <div>
        <Picker
          value={selectedSubreddit}
          onChange={this.handleChange}
          options={HACKER_NEWS_FEEDS} />
        <p>
          Last update at {new Date().toLocaleTimeString()}
        </p>
        {error &&
          <p>
            Unable to load Hacker News：{error}
          </p>
        }
        <Posts posts={posts}/>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedSubreddit, postsBySubreddit } = state
  const { isFetching, lastUpdated, items: posts, error } = postsBySubreddit[selectedSubreddit] || {isFetching: true,items: []}

  return {
    selectedSubreddit,
    posts,
    isFetching,
    lastUpdated,
    error
  }
}
export default connect(mapStateToProps)(App)
