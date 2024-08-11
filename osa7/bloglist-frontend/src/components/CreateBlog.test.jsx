import { render, screen } from "@testing-library/react"
import { beforeEach, describe, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import CreateBlog from "./CreateBlog"

test("<CreateBlog /> returns right values from form", async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const container = render(<CreateBlog createBlog={createBlog} />).container

  const titleInput = container.querySelector("#title")
  const authorInput = container.querySelector("#author")
  const urlInput = container.querySelector("#url")
  const button = screen.getByText("create")
  await user.type(titleInput, "Testi title")
  await user.type(authorInput, "Testi author")
  await user.type(urlInput, "Testi url")
  await user.click(button)

  expect(createBlog.mock.calls[0][0].title).toBe("Testi title")
  expect(createBlog.mock.calls[0][0].author).toBe("Testi author")
  expect(createBlog.mock.calls[0][0].url).toBe("Testi url")
})
