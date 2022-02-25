const Blog = require ('../models/blog')
const User = require('../models/users')
const mongoose = require("mongoose")
const logger = require("./logger")
require('express-async-errors')

const initialBlogs = [
  {
    "_id": "61fe3b742736c41fd8945121",
    "title": "First class tests",
    "author": "Robert C. Martn",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    "likes": 10,
    "user": {
      "_id": "61fe3ad52736c41fd8945117",
      "username": "misTa",
      "name": "Tetje",
      "passwordHash": "$2b$10$XpRQkIhC4pks1Yg8EbI89eTcUlRxizyUCFMSroTbt3QR4N58VJ55C",
      "blogs": [
        "61fe3b742736c41fd8945121",
        "61fe3bb42736c41fd8945125"
      ],
      "__v": 0
    },
    "__v": 0
  },
  {
    "_id": "61fe3bb42736c41fd8945125",
    "title": "Go To Statement Considered Harmful",
    "author": "Edsger W. Dijkstra",
    "url": "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    "likes": 5,
    "user": {
      "_id": "61fe3ad52736c41fd8945117",
      "username": "misTa",
      "name": "Tetje",
      "passwordHash": "$2b$10$XpRQkIhC4pks1Yg8EbI89eTcUlRxizyUCFMSroTbt3QR4N58VJ55C",
      "blogs": [
        "61fe3b742736c41fd8945121",
        "61fe3bb42736c41fd8945125"
      ],
      "__v": 0
    },
    "__v": 0
  },
  {
    "_id": "61fe3bfb2736c41fd894512a",
    "title": "TDD harms architecture",
    "author": "Robert C. Martin",
    "url": "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    "likes": 0,
    "user": {
      "_id": "61fe3af02736c41fd894511b",
      "username": "mrm1ster",
      "name": "Tilman",
      "passwordHash": "$2b$10$lwFd2/3VgqBTpyN69DlYwO5h2c2aBghAF94L/IWw57.JCFSlJHL62",
      "blogs": [
        "61fe3bfb2736c41fd894512a"
      ],
      "__v": 0
    },
    "__v": 0
  }
]

initialUsers = [
  {
    "_id": "61fe3ad52736c41fd8945117",
    "username": "misTa",
    "name": "Tetje",
    "passwordHash": "$2b$10$XpRQkIhC4pks1Yg8EbI89eTcUlRxizyUCFMSroTbt3QR4N58VJ55C",
    "blogs": ["61fe3b742736c41fd8945121","61fe3bb42736c41fd8945125"],
    "__v": 0
  },
  {
      "_id": "61fe3af02736c41fd894511b",
      "username": "mrm1ster",
      "name": "Tilman",
      "passwordHash": "$2b$10$lwFd2/3VgqBTpyN69DlYwO5h2c2aBghAF94L/IWw57.JCFSlJHL62",
      "blogs": ["61fe3bfb2736c41fd894512a"],
      "__v": 0
  }
  ]

const resetBlogsAndUsers = async () => {
  logger.info('connecting to MongoDB')
  await mongoose.connect("mongodb+srv://fullstackopen:K4k4k4n4k%21@cluster0.mwzy7.mongodb.net/bloglist?retryWrites=true&w=majority")
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)

  await User.deleteMany({})
  await User.insertMany(initialUsers)

  await mongoose.connection.close()
}

resetBlogsAndUsers()


