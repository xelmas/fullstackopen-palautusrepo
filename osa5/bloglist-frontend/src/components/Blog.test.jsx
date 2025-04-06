import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test, vi } from 'vitest'
import CreateBlogForm from './CreateBlogForm'

test('renders title', () => {
  const blog = {
    title: 'This is the title',
  }

  render(<Blog blog={blog} />)

  const elementTitle = screen.getByText('This is the title')

  expect(elementTitle).toBeDefined()
})

test('url, likes and username are displayed after clicking the button', async () => {
  const blog = {
    title: 'This is the title',
    author: 'This is the author',
    url: 'This is the url',
    likes: 2,
    user: {
      username: 'testuser',
      name: 'Test user',
    },
  }
  const { container } = render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const togglableDiv = container.querySelector('.togglableContent')
  expect(togglableDiv).not.toBeNull()

  const UrlElement = within(togglableDiv).getByText('This is the url')
  const likesElement = within(togglableDiv).getByText('likes 2')
  const userElement = within(togglableDiv).getByText('Test user')

  expect(UrlElement).toBeVisible()
  expect(likesElement).toBeVisible()
  expect(userElement).toBeVisible()
})

test('clicking the like button calls event handler', async () => {
  const blog = {
    title: 'This is the title',
    author: 'This is the author',
    url: 'This is the url',
    likes: 2,
    user: {
      username: 'testuser',
      name: 'Test user',
    },
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updateBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('<CreateBlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<CreateBlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('write a title')
  const authorInput = screen.getByPlaceholderText('write an author')
  const urlInput = screen.getByPlaceholderText('write a url')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing title')
  await user.type(authorInput, 'testing author')
  await user.type(urlInput, 'testing url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'testing title',
    author: 'testing author',
    url: 'testing url',
  })
})
