import { useState } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import { Button } from "react-bootstrap"
const Blog = ({ blog, likeBlog, user, deleteBlog }) => {
  const [showAllInfo, setShowAllInfo] = useState(false)
  const [buttonLabel, setButtonLabel] = useState("view")

  const showWhenShow = { display: showAllInfo ? "" : "none" }

  const toggleInfo = () => {
    setShowAllInfo(!showAllInfo)
    if (showAllInfo) {
      setButtonLabel("view")
    } else {
      setButtonLabel("hide")
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle} data-testid="blog">
      <div>
        <div>
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
          <Button onClick={toggleInfo}>{buttonLabel}</Button>
        </div>
        <div style={showWhenShow} className="togglableContent">
          <a href={blog.url}>{blog.url}</a>
          <div>
            likes {blog.likes}
            <Button onClick={() => likeBlog(blog)}>like</Button>
          </div>
          <div>{blog.user.name}</div>
          {user === blog.user.username && (
            <Button onClick={() => deleteBlog(blog)}>remove</Button>
          )}
        </div>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  likeBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.string.isRequired,
}

export default Blog
