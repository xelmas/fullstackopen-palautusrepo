import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showInfo, setShowInfo] = useState(false)

  const toggleShowInfo = () => {
    setShowInfo(!showInfo)
  }
  const label = showInfo ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleShowInfo}>{label}</button>
      </div>
      {showInfo && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      )}
    </div>
  )
}

export default Blog
