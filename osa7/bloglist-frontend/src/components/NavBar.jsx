import { Link } from "react-router-dom"
import { Navbar, Nav } from "react-bootstrap"
import Logout from "./Logout"

const NavBar = ({ user, handleLogout }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      <Nav className="mr-auto" style={{ color: "white", alignItems: "center" }}>
        <Nav.Link href="#" as="span">
          <Link to={"/"}>blogs</Link>
        </Nav.Link>
        <Nav.Link href="#" as="span">
          <Link to={"/users"}>users</Link>
        </Nav.Link>
        <Nav.Item>
          <Logout name={user.name} doLogout={handleLogout} />
        </Nav.Item>
      </Nav>
    </Navbar.Collapse>
  </Navbar>
)

export default NavBar
