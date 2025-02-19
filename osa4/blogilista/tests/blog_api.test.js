const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('when tere is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
  })
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
  test('all blogs are found', async () => {
    const blogsAtStart = await helper.blogsInDb()
    assert.strictEqual(blogsAtStart.length, helper.initialBlogs.length)
  })
  test('a spesific blog is within the returned blogs', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const title = blogsAtStart.map((e) => e.title)
    assert(title.includes('React patterns'))
  })
  test('all blogs have id', async () => {
    const blogsAtStart = await helper.blogsInDb()
    blogsAtStart.forEach((blog) => {
      const keys = Object.keys(blog)
      assert(keys.includes('id'))
    })
  })
  describe('viewing a spesific blog', async () => {
    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      assert.deepStrictEqual(resultBlog.body, blogToView)
    })
  })
  test('fails with statuscode 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingId()

    await api.get(`/api/blogs/${validNonExistingId}`).expect(404)
  })
  test('fails with statuscode 400 if id is invalid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'

    await api.get(`/api/blogs/${invalidId}`).expect(400)
  })
  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
      const newBlog = {
        _id: '5a422bc61b54a676234d18fd',
        title: 'A New Hope',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html',
        likes: 3,
        __v: 0,
      }
      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

      const blogTitles = blogsAtEnd.map((r) => r.title)
      assert(blogTitles.includes('A New Hope'))
    })

    describe('missing data is initialized', () => {
      test('a blog without likes is initialized to 0', async () => {
        const newBlog = {
          _id: '5a422bc61b54a676234d18fd',
          title: 'A New Hope',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html',
          __v: 0,
        }
        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, 0)
      })
    })
    describe('fails with status code 400 if data is invalid', () => {
      test('a blog without title is not added', async () => {
        const newBlog = {
          _id: '5a422bc61b54a676234d18fd',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html',
          likes: 3,
          __v: 0,
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
      test('a blog without url is not added', async () => {
        const newBlog = {
          _id: '5a422bc61b54a676234d18fd',
          title: 'A New Hope',
          author: 'Robert C. Martin',
          likes: 3,
          __v: 0,
        }
        await api.post('/api/blogs').send(newBlog).expect(400)
        const blogsAtEnd = await helper.blogsInDb()

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
      })
    })
  })
  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

      const ids = blogsAtEnd.map((r) => r.id)
      assert(!ids.includes(blogToDelete.id))
    })
  })
  describe('updating the blog succeeds with status code 200', () => {
    test('likes are modified', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1,
      }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd[0].likes, updatedBlog.likes)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
