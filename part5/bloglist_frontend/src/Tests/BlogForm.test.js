import React from "react"
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import BlogForm from "../components/BlogForm"

describe("BlogForm Test", () => {
   test("the form calls the event handler with the right details", () => {
      const createBlog = jest.fn()

      const { container } = render(<BlogForm createBlog={createBlog}/>)

      const inputTitle = container.querySelector("#titleInput")
      const inputAuthor = container.querySelector("#authorInput")
      const inputUrl = container.querySelector("#urlInput")

      const createButton = container.querySelector("#createButton")

      userEvent.type(inputTitle, "title test")
      userEvent.type(inputAuthor, "author test")
      userEvent.type(inputUrl, "url test")
      userEvent.click(createButton)

      expect(createBlog.mock.calls).toHaveLength(1)
      expect(createBlog.mock.calls[0][0].title).toBe("title test")
      expect(createBlog.mock.calls[0][0].author).toBe("author test")
      expect(createBlog.mock.calls[0][0].url).toBe("url test")
   })
})