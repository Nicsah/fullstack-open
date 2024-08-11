import { useState } from "react"
import { Form, Button } from "react-bootstrap"

const LoginForm = ({ doLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (event) => {
    event.preventDefault()
    doLogin({ username, password })
    setPassword("")
    setUsername("")
  }

  return (
    <Form data-testid="loginForm" onSubmit={handleLogin} style={{ maxWidth: "30vw" }}>
      <Form.Group>
        <Form.Label>username:</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>password:</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button type="submit">login</Button>
    </Form>
  )
}
export default LoginForm
