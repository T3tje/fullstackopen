import React from "react"
import "@testing-library/jest-dom/extend-expect"
import userEvent from "@testing-library/user-event"
import { render, screen } from "@testing-library/react"
import Blog from "../components/Blog"

const blog = {
   title: "jetzt wird getestet",
   author: "lalalalalalalakekekekekekeke",
   url: "thistextwillnotbethereatanytime.li",
   likes: 2,
   user: {
      name: "Hans"
   }
}

const user = {
   name: "Hans"
}

describe("Blog element", () => {

   test("renders title and author", () => {

      const mockHandler = jest.fn()
      render(<Blog blog={blog} user={user} updateLike={mockHandler} handleDelete={mockHandler}/>)
      const titleElement = screen.getAllByText("jetzt wird getestet")
      expect(titleElement[0]).toBeDefined()

      const authorElement = screen.getByText("lalalalalalalakekekekekekeke", { exact: false })
      expect(authorElement).toBeDefined()
   })

   test("url and likes are not visible by default", () => {
      const mockHandler = jest.fn()
      const { container } = render(<Blog blog={blog} user={user} updateLike={mockHandler} handleDelete={mockHandler}/>)

      const notVisiblePart = container.querySelector(".notVisible")
      expect(notVisiblePart).not.toHaveStyle("display: none")
      expect(notVisiblePart).not.toHaveTextContent("thistextwillnotbethereatanytime.li")
      expect(notVisiblePart).not.toHaveTextContent("lalalalalalalakekekekekekeke")

      const visiblePart = container.querySelector(".visible")
      expect(visiblePart).toHaveStyle("display: none")
      expect(visiblePart).toHaveTextContent("thistextwillnotbethereatanytime.li")
      expect(visiblePart).toHaveTextContent("lalalalalalalakekekekekekeke")
   })

   test("after clicking the view button url and likes are visible", () => {
      const mockHandler = jest.fn()
      const { container } = render(<Blog blog={blog} user={user} updateLike={mockHandler} handleDelete={mockHandler}/>)

      const visiblePart = container.querySelector(".visible")
      expect(visiblePart).toHaveStyle("display: none")

      const viewButton = container.querySelector("#viewbutton")
      userEvent.click(viewButton)
      expect(visiblePart).not.toHaveStyle("display: none")
   })

   test("the addlike function is called twice if the button is clicked twice", () => {
      const mockHandler = jest.fn()
      const updateLike = jest.fn()
      const { container } = render(<Blog blog={blog} user={user} updateLike={updateLike} handleDelete={mockHandler}/>)

      const button = container.querySelector("#likeButton")

      userEvent.click(button)
      userEvent.click(button)
      expect(updateLike.mock.calls).toHaveLength(2)

   })
})