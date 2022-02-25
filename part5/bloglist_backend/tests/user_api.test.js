const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper.js')
const app = require('../app')
const User = require("../models/users")

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await User.insertMany(helper.initialUserList)
})

describe("invalid users are not added", () => {
    test("username is missing - same length, expect status 400", async () => {

        const newUser = {
            name:"Telemann",
            password:"lalalalulululu"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUserList.length)
        
    }, 150000)

    test("password is missing - same length, expect status 400", async () => {

        const newUser = {
            name:"Telemann",
            username: "TestUserName"            
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUserList.length)
        
    }, 150000)

    test("username is to short - same length, not Contain name, expect status 400", async () => {

        const newUser = {
            username: "Te",
            name:"Telemann",
            password:"lalalalulululu"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUserList.length)
        
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain("Te")
    }, 150000)

    test("password is to short - same length, expect status 400", async () => {

        const newUser = {
            username: "Tetala",
            name:"Telemann",
            password:"la"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(400)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUserList.length)
        
    }, 150000)

    test("username is unique - same length, not Contain username, expect status 500", async () => {

        const testusername = helper.initialUserList[0].username

        const newUser = {
            username: testusername,
            name:"Telemann",
            password:"laliu"
        }

        await api
            .post("/api/users")
            .send(newUser)
            .expect(500)
        
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(helper.initialUserList.length)
        
        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).not.toContain(testusername)
    }, 150000)


})

afterAll( () => {
    mongoose.connection.close()
  })