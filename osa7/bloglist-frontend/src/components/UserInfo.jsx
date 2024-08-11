const UserInfo = ({ user }) => {
  if (!user) return <div>no user</div>

  return (
    <div>
      <h1>{user.name}</h1>
      <h2>{user.blogs ? "added blogs" : "no blogs"}</h2>
      <ul>
        {user.blogs.length > 0 ? (
          user.blogs.map((blog) => <li key={blog.id}>{blog.title}</li>)
        ) : (
          <div>no blogs</div>
        )}
      </ul>
    </div>
  )
}

export default UserInfo
