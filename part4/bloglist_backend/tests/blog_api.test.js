const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const Blog = require('../models/blog')
const User = require("../models/users")
const users = require('../models/users.js')
const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogList.map(item => new Blog(item))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)

  await users.deleteMany({})
  const userObjects = helper.initialUserList.map(item => new User(item))
  const promiseArray2 = userObjects.map(user => user.save())
  await Promise.all(promiseArray2)
})

describe('returned blogs as json', () => {
  test('blogs are returned as json and have the correct amount', async () => {
    const arraySum = helper.initialBlogList.length
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      
      const getRequest = await api.get('/api/blogs')
      expect(getRequest.body.length).toBe(arraySum)

  }, 150000)
})

describe('the unique identifier property', () => {
 
  test('is \'id\'', async () => {
    const getRequest = await api.get('/api/blogs')
    const BlogsWithId = getRequest.body.filter(item => item.id !== undefined)
    expect(BlogsWithId.length).toBe(helper.initialBlogList.length)
  })

  test('is not \'_id\'', async () => {
    const getRequest = await api.get('/api/blogs')
    const BlogsWithUnderslId = getRequest.body.filter(item => item._id !== undefined)
    expect(BlogsWithUnderslId.length).toBe(0)
  })
})

describe('the post request is succesful', () => {
  test('a valid blog can be added', async () => {
    
    const title = 'adding blogs is fun'

    const newBlog = {
      title: title,
      author: 'my self',
      url: 'www.www.ww',
      likes: 1337
    }
    await api
      .post('/api/blogs')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pc1RhIiwiaWQiOiI2MWZlM2FkNTI3MzZjNDFmZDg5NDUxMTciLCJpYXQiOjE2NDQyMTg1ODh9.YET2x8CAsHs1IAXrOyItkAdCRnYaiw4n55AwFo0IgrY")
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogList.length + 1)
    
    const contentArray = blogsAtEnd.map(blog => blog.title)
    expect(contentArray).toContain(title)
   
  })

  test('value is set to 0, if its missing', async () => {

    const newBlogWithoutLikes = {
      title: 'adding blogs is fun',
      author: 'my self',
      url: 'www.www.ww'
    }

    const postResponse = await api
      .post('/api/blogs')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pc1RhIiwiaWQiOiI2MWZlM2FkNTI3MzZjNDFmZDg5NDUxMTciLCJpYXQiOjE2NDQyMTg1ODh9.YET2x8CAsHs1IAXrOyItkAdCRnYaiw4n55AwFo0IgrY")
      .send(newBlogWithoutLikes)
      
    expect(postResponse.body.likes).toBe(0)
  })

  test('status code is 400, if url AND title is missing', async () => {
    const newFailBlog = {
      author: 'my self',
      likes: 1337,
    }
    await api
      .post('/api/blogs/')
      .set("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1pc1RhIiwiaWQiOiI2MWZlM2FkNTI3MzZjNDFmZDg5NDUxMTciLCJpYXQiOjE2NDQyMTg1ODh9.YET2x8CAsHs1IAXrOyItkAdCRnYaiw4n55AwFo0IgrY")
      .send(newFailBlog)
      .expect(400)
  })
})

describe("failed authentication", () => {
  test("status 401 if a token is not provided", async () => {
    await api
      .post('/api/blogs/')
      .expect(401)
  })
})

afterAll( () => {
  mongoose.connection.close()
})
  