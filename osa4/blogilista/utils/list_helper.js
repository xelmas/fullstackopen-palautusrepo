const blog = require('../models/blog')
const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const totalLikes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
  return totalLikes
}

const favoriteBlog = (blogs) => {
  const maxLikes = Math.max(...blogs.map((blog) => blog.likes))
  const favoriteBlog = blogs.find((blog) => blog.likes === maxLikes)

  result = {
    title: favoriteBlog.title,
    author: favoriteBlog.author,
    likes: favoriteBlog.likes,
  }
  return result
}

const mostBlogs = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author')

  const result = _.map(groupByAuthor, (blogs, author) => ({
    author: author,
    blogs: blogs.length,
  }))

  const mostBlogsObj = _.maxBy(result, 'blogs')
  return mostBlogsObj
}
const mostLikes = (blogs) => {
  const groupByAuthor = _.groupBy(blogs, 'author')

  const result = _.map(groupByAuthor, (blogs, author) => ({
    author: author,
    likes: _.sumBy(blogs, 'likes'),
  }))
  const mostLikesObj = _.maxBy(result, 'likes')
  return mostLikesObj
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
