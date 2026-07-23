import React, { useState } from 'react'
import Picker from '../components/Picker'
import Posts from '../components/Posts'
import useHackerNewsPosts from '../hooks/useHackerNewsPosts'

const HACKER_NEWS_FEEDS = ["topstories", "beststories", "jobstories"]

const App = () => {
  const [selectedSubreddit, setSelectedSubreddit] = useState('topstories')
  const { posts, isFetching, error, lastUpdated } = useHackerNewsPosts(selectedSubreddit)

  return (
    <div>
      <Picker
        value={selectedSubreddit}
        onChange={setSelectedSubreddit}
        options={HACKER_NEWS_FEEDS} />
      {lastUpdated &&
        <p>
          Last update at {new Date(lastUpdated).toLocaleTimeString()}
        </p>
      }
      {isFetching &&
        <p>
          Loading...
        </p>
      }
      {error &&
        <p>
          Unable to load Hacker News：{error}
        </p>
      }
      <Posts posts={posts}/>
    </div>
  )
}

export default App
