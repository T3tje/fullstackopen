const blogRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require("../models/users")
const middleware = require("../utils/middleware")

/*
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}
*/ 

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate("user", {username: 1, name: 1})
    response.json(blogs)
  })
  
blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if(!body.title && !body.url) {
    response.status(400).json(
      {error: "you are not allowed to leave title and url empty"}
    )
  } else {
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await User.findByIdAndUpdate(user._id, user, {new:true})
    response.status(200)
    response.json(savedBlog)
  }
})

blogRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  
  const blogId = request.params.id
  const blog = await Blog.findById(blogId)
  
  const user = request.user
  const blogUserIndex = user.blogs.indexOf(blogId)

  if (blog.user.toString() === user._id.toString()) {
    await Blog.findByIdAndRemove(blogId)
    
    //remove blogid from User
    if (blogUserIndex > -1) {
      
      user.blogs.splice(blogUserIndex, 1)
      await User.findByIdAndUpdate(user._id, user, {new:true})
    }
    response.status(204).end()

  } else {
    return response.status(401).json({
      error: "token invalid"
    })
  }
})

blogRouter.put('/:id', async (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new:true})
  response.json(updatedBlog)
})
  
  module.exports = blogRouter