import { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input
            data-testid='title'
            type='text'
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
            placeholder='write a title'
          />
        </div>
        <div>
          author
          <input
            data-testid='author'
            type='text'
            value={newAuthor}
            onChange={(event) => setNewAuthor(event.target.value)}
            placeholder='write an author'
          />
        </div>
        <div>
          url
          <input
            data-testid='url'
            type='text'
            value={newUrl}
            onChange={(event) => setNewUrl(event.target.value)}
            placeholder='write a url'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default CreateBlogForm
