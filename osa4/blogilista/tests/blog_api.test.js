const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

describe('blogs as json', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })
})

describe('All blogs found', () => {
  test('there are six blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
  test('the first blog is about React patterns', async () => {
    const response = await api.get('/api/blogs')

    const title = response.body.map((e) => e.title)
    assert(title.includes('React patterns'))
  })
})

describe('Blogs have id', () => {
  test('All blogs have id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    blogs.forEach((blog) => {
      const keys = Object.keys(blog)
      assert(keys.includes('id'))
    })
  })
})

describe('Valid blogs are added', () => {
  test('a valid blog can be added', async () => {
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
      .expect('Content-TYpe', /application\/json/)

    const response = await api.get('/api/blogs')
    const blogTitles = response.body.map((r) => r.title)

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert(blogTitles.includes('A New Hope'))
  })

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
      .expect('Content-TYpe', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })

  test('a blog without title is not added', async () => {
    const newBlog = {
      _id: '5a422bc61b54a676234d18fd',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2020/04/05/ANewHope.html',
      likes: 3,
      __v: 0,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
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

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
