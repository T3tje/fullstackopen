import React, { useState, useEffect } from "react"
import Blog from "./components/Blog"
import blogService from "./services/blogs"
import loginService from "./services/login"
import Toggleable from "./components/Togglable"
import BlogForm from "./components/BlogForm"

const App = () => {
   const [blogs, setBlogs] = useState([])
   const [username, setUsername] = useState("")
   const [password, setPassword] = useState("")
   const [user, setUser] = useState(null)
   const [succMsg, setSuccMsg] = useState(null)
   const [errMsg, setErrMsg] = useState(null)


   useEffect(() => {
      blogService.getAll().then(blogs => {
         const sortedBlogs = blogs.sort((b,a) => a.likes - b.likes)
         setBlogs(sortedBlogs)
      })
   }, [])

   useEffect(() => {
      const loginUserJSON = window.localStorage.getItem("loggedBlogUser")

      if (loginUserJSON) {
         const user = JSON.parse(loginUserJSON)
         setUser(user)
         blogService.setToken(user.token)
      }
   }, [])

   const handleLogin = async (event) => {
      event.preventDefault()

      try {
         const user = await loginService.login({
            "username": username,
            "password": password
         })

         setUser(user)
         window.localStorage.setItem("loggedBlogUser", JSON.stringify(user))
         blogService.setToken(user.token)
         setPassword("")
         setUsername("")
         setSuccMsg("succesfully logged in")
         setTimeout(() => setSuccMsg(null), 5000)
      } catch (excepion){
         setErrMsg("login failed")
         setTimeout(() => setErrMsg(null), 5000)
      }


   }

   const handleLogout = (event) => {
      event.preventDefault()
      setUser(null)
      window.localStorage.removeItem("loggedBlogUser")
      setSuccMsg("succesfully logged out")
      setTimeout(() => setSuccMsg(null), 5000)
   }

   const updateLike = (blogId, newObject) => {
      blogService.update(blogId, newObject)
      const blogWithoutNew = blogs.filter(blog => blog.id !== blogId)
      const newBlogList = blogWithoutNew.concat(newObject).sort((b,a) => a.likes - b.likes)

      setBlogs(newBlogList)
   }

   const addBlog = async (blogObject) => {
      try {
         const response = await blogService.create(blogObject)
         const newBlogs = blogs.concat({ ...response, user })
         setBlogs(newBlogs)
         setSuccMsg("blog successfully added")
         setTimeout(() => setSuccMsg(null), 5000)
      } catch {
         setErrMsg("blog creation failed")
         setTimeout(() => setErrMsg(null), 5000)
      }
   }

   const handleDelete = async (blogId) => {
      blogService.remove(blogId)
      const newBloglist = blogs.filter(blog => blog.id !== blogId)
      setBlogs(newBloglist)
   }

   const showLogin = () => (
      <div>
         <h2>Log in to application</h2>
         <form onSubmit={handleLogin} id="loginForm">
            <div>
          username
               <input
                  type="text"
                  value={username}
                  name="Username"
                  id="username"
                  onChange={({ target }) => setUsername(target.value)}
               />
          password
               <input
                  type="password"
                  value={password}
                  name="Password"
                  id="password"
                  onChange={({ target }) => setPassword(target.value)}
               />
               <button type="submit" id="loginButton">login</button>
            </div>

         </form>
      </div>
   )

   const showBlogList = () => (
      <div>
         <p>{user.name} is logged in</p>
         <button type="button" onClick={handleLogout}>logout</button>
         <Toggleable buttonLabel="new blog">
            <BlogForm
               createBlog={addBlog}
            />
         </Toggleable>

         {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} updateLike={updateLike} user={user} handleDelete={handleDelete}/>
         )}
      </div>
   )

   return(
      <div>
         <h2>blogs</h2>
         <p className="success" style={{ color:"green" }}>{succMsg}</p>
         <p className="error" style={{ color: "red" }}>{errMsg}</p>
         {user === null
            ? showLogin()
            : showBlogList()
         }
      </div>
   )

}

export default App