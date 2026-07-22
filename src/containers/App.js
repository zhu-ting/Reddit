import React, { Component } from 'react';
import { connect } from 'react-redux'
import { fetchPostsIfNeeded } from "../actions"
import Picker from '../components/Picker'
import Posts from '../components/Posts'

class App extends Component {
  componentDidMount() {
    const { dispatch, selectedSubreddit } = this.props
    dispatch(fetchPostsIfNeeded(selectedSubreddit))
  }

  render() {
    const { selectedSubreddit, posts, error } = this.props
    return (
      <div>
        <Picker value={selectedSubreddit} options={["topstories"]}/>
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
