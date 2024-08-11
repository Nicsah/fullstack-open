import { Button } from "react-bootstrap"
const Logout = ({ name, doLogout }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 10 }}>
    <div>{name} logged in</div>
    <Button onClick={() => doLogout()}>logout</Button>
  </div>
)
export default Logout
