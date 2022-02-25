const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/users")


usersRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("blogs", /*{title: 1, author: 1}*/ {_id: 1})
    response.json(users)
})

usersRouter.post("/", async (request, response) => {
    const body = request.body

    if (!body.password || !body.username) {
        response.status(400).json({
            error: "Both username and password must be given"
        })
    }

    if (body.password.length > 2 && body.username.length > 2) { 
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        console.log(passwordHash)
        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } else {
        response.status(400).json({
            error: "username's and password's minimum length is 3"
        })
    }
})

module.exports = usersRouter