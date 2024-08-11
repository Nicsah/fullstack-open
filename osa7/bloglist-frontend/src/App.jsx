import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { BrowserRouter as Router, Routes, Route, useMatch } from "react-router-dom"

import Blog from "./components/Blog"
import LoginForm from "./components/LoginForm"
import Logout from "./components/Logout"
import CreateBlog from "./components/CreateBlog"
import Notification from "./components/Notification"
import Togglable from "./components/Togglable"
import UserList from "./components/UserList"
import UserInfo from "./components/UserInfo"
import BlogInfo from "./components/BlogInfo"
import NavBar from "./components/NavBar"

import loginService from "./services/login"

import { setNotification } from "./reducers/notificationReducer"
import { commentBlogObject, InitializeBlogs, likeBlogObject } from "./reducers/blogReducer"
import { deleteBlogObject } from "./reducers/blogReducer"
import { setUser } from "./reducers/userReducer"
import { InitializeUsers } from "./reducers/usersReducer"

const App = () => {
  const dispatch = useDispatch()
  const createBlogRef = useRef()
  const blogs = useSelector((state) => state.blogs)
  const user = useSelector((state) => state.user)
  const users = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(InitializeBlogs())
    dispatch(InitializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogUser")
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
    }
  }, [dispatch])

  const matchUser = useMatch("/users/:id")
  const userMatch =
    matchUser && users ? users.find((user) => user.id === matchUser.params.id) : null

  const matchBlog = useMatch("/blogs/:id")
  const blogMatch =
    matchBlog && blogs ? blogs.find((blog) => blog.id === matchBlog.params.id) : null

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)
      dispatch(setUser(user))
      dispatch(setNotification(`Tervetuloa ${user.name}`, "onnistunut", 5))
    } catch {
      dispatch(setNotification("Virheellinen käyttäjänimi tai salasana", "virhe", 5))
    }
  }

  const handleLogout = () => {
    dispatch(setUser(null))
  }

  const deleteBlog = (blogObject) => {
    if (window.confirm(`Poista blog ${blogObject.title}`)) {
      try {
        dispatch(deleteBlogObject(blogObject))
        dispatch(setNotification(`Blogi ${blogObject.title} poistettu`, "onnistunut", 5))
      } catch {
        dispatch(setNotification("Blogin poistaminen epäonnistui", "virhe", 5))
      }
    }
  }

  const likeBlog = (blogObject) => {
    try {
      const newblogObject = { ...blogObject, likes: blogObject.likes + 1 }
      dispatch(likeBlogObject(newblogObject))
      dispatch(setNotification(`Tykätty ${blogObject.title}`, "onnistunut", 5))
    } catch {
      dispatch(setNotification("Virhe tykkäyksessä", "virhe", 5))
    }
  }

  const commentBlog = (blogObject, comment) => {
    if (!comment){
      dispatch(setNotification("Kommentti ei voi olla tyhjä", "virhe", 5))
      return
    }
    try {
      dispatch(commentBlogObject(blogObject.id, comment))
      dispatch(setNotification(`Kommentoitu ${blogObject.title}`, "onnistunut", 5))
    } catch {
      dispatch(setNotification("Virhe kommentoinnissa", "virhe", 5))
    }
  }

  return (
    <div className="container">
      {!user && (
        <div>
          <Notification />
          <LoginForm doLogin={handleLogin} />
        </div>
      )}

      {user && (
        <div>
          <NavBar handleLogout={handleLogout} user={user} />
          <h2>blog app</h2>
          <Notification />
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Togglable buttonLabel="create new blog" ref={createBlogRef}>
                    <CreateBlog />
                  </Togglable>

                  {blogs.map((blog) => (
                    <Blog
                      key={blog.id}
                      blog={blog}
                      likeBlog={likeBlog}
                      user={user.username}
                      deleteBlog={deleteBlog}
                    />
                  ))}
                </div>
              }
            />
            <Route path="/users" element={<UserList users={users} />} />
            <Route path="/users/:id" element={<UserInfo user={userMatch} />} />
            <Route
              path="/blogs/:id"
              element={<BlogInfo blog={blogMatch} likeBlog={likeBlog} commentBlog={commentBlog} />}
            />
          </Routes>
        </div>
      )}
    </div>
  )
}

export default App
