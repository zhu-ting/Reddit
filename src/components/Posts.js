import React from "react"

const Posts = ({posts}) => (
  <ul>
    {posts.map((post, i) =>
      <li key={post.id || i}>
        {post.url
          ? <a href={post.url} target="_blank" rel="noopener noreferrer">{post.title}</a>
          : post.title}
      </li>)}
  </ul>
)

export default Posts
