import { useState } from "react"
import { useDispatch } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"
import { createBlog } from "../reducers/blogReducer"
import { Button, Form } from "react-bootstrap"

const CreateBlog = () => {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [url, setUrl] = useState("")

  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    try {
      dispatch(
        createBlog({
          title: title,
          author: author,
          url: url,
        }),
      )
      dispatch(setNotification(`Uusi blogi ${title} lisätty`, "onnistunut", 5))
    } catch {
      dispatch(setNotification("Puutteelliset blogin tiedot", "virhe", 5))
    }
    setTitle("")
    setAuthor("")
    setUrl("")
  }

  return (
    <div className="formDiv">
      <h2>create new</h2>
      <Form onSubmit={addBlog} style={{ width: "40vw" }}>
        <Form.Group>
          <Form.Label>title:</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            id="title"
            data-testid="title"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>author:</Form.Label>
          <Form.Control
            type="text"
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
            id="author"
            data-testid="author"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>url:</Form.Label>
          <Form.Control
            type="text"
            value={url}
            onChange={({ target }) => setUrl(target.value)}
            id="url"
            data-testid="url"
          />
        </Form.Group>
        <Button type="submit">create</Button>
      </Form>
    </div>
  )
}

export default CreateBlog
