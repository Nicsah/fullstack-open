import { useState } from "react"
import { Button } from "react-bootstrap"

const BlogInfo = ({ blog, likeBlog, commentBlog }) => {
  const [comment, setComment] = useState("")

  if (!blog) return <div>no blog</div>

  const handleComment = () => {
    commentBlog(blog, comment)
    setComment("")
  }

  return (
    <div>
      <h1>{blog.title}</h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}
        <Button onClick={() => likeBlog(blog)}>like</Button>
      </div>
      Added by {blog.user.name}
      <div>
        <h3>comments</h3>
        <div>
          <input type="text" value={comment} onChange={({ target }) => setComment(target.value)} />
          <Button onClick={() => handleComment()}>add comment</Button>
        </div>
        <ul>
          {blog.comments.length > 0 ? (
            blog.comments.map((comment, index) => <li key={index}> {comment} </li>)
          ) : (
            <li>no comments</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default BlogInfo
