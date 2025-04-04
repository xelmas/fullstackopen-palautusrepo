import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, updateBlog, removeBlog, currentUser }) => {
  const [showInfo, setShowInfo] = useState(false)

  const likeBlog = (event) => {
    event.preventDefault()
    updateBlog({
      ...blog,
      likes: blog.likes + 1,
    })
  }
  const handleRemoveBlog = (event) => {
    event.preventDefault()
    removeBlog(blog)
  }
  const toggleShowInfo = () => {
    setShowInfo(!showInfo)
  }
  const label = showInfo ? 'hide' : 'view'
  const isAdder =
    currentUser && blog.user && currentUser.username === blog.user.username

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
            likes {blog.likes} <button onClick={likeBlog}>like</button>
          </div>
          <div>{blog.user.name}</div>
          {isAdder && <button onClick={handleRemoveBlog}>remove</button>}
        </div>
      )}
    </div>
  )
}

Blog.displayName = 'Blog'

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
}

export default Blog
