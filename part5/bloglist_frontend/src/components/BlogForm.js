import React, { useState } from "react"

const BlogForm = ({ createBlog }) => {
   const [title, setTitle] = useState("")
   const [author, setAuthor] = useState("")
   const [url, setUrl] = useState("")

   const addBlog = (event) => {
      event.preventDefault()
      createBlog(
         { title, author, url }
      )
      setTitle("")
      setAuthor("")
      setUrl("")
   }

   return(
      <div>
         <h2>create new</h2>
         <form onSubmit={addBlog}>
                title:
            <input
               type="text"
               value={title}
               name="Title"
               id="titleInput"
               onChange={({ target }) => setTitle(target.value)}
            />
                author:
            <input
               type="text"
               value={author}
               name="Author"
               id="authorInput"
               onChange={({ target }) => setAuthor(target.value)}
            />
                url:
            <input
               type="text"
               value={url}
               name="Url"
               id="urlInput"
               onChange={({ target }) => setUrl(target.value)}
            />
            <button type="submit" id="createButton">create</button>

         </form>
      </div>
   )
}

export default BlogForm