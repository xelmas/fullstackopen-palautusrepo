import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notifyWith = (message, isError = false) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()

    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      notifyWith(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`
      )
    })
  }

  const updateBlog = (blogObject) => {
    blogService.update(blogObject.id, blogObject).then((returnedBlog) => {
      setBlogs(
        blogs.map((blog) =>
          blog.id === returnedBlog.id
            ? { ...returnedBlog, user: blog.user }
            : blog
        )
      )
    })
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      notifyWith(`${user.username} logged in`)
    } catch (exception) {
      notifyWith(`wrong username or password`, true)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input
          type='text'
          value={username}
          name='Username'
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type='password'
          value={password}
          name='Password'
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type='submit'>login</button>
    </form>
  )

  const logOut = () => {
    window.localStorage.removeItem('loggedBlogappUser', JSON.stringify(user))
    location.reload()
  }
  const blogForm = () => {
    return (
      <div>
        <h2>blogs</h2>
        <p>
          {user.username} logged in <button onClick={logOut}>log out</button>
        </p>

        <div>
          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <CreateBlogForm createBlog={addBlog} />
          </Togglable>
        </div>
        <div>
          {[...blogs]
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
            ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />

      {!user && loginForm()}
      {user && blogForm()}
    </div>
  )
}

export default App
