import { createSlice } from "@reduxjs/toolkit"
import blogsService from "../services/blogs"

const blogSlice = createSlice({
  name: "blog",
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload.id)
    },
    addLike(state, action) {
      const id = action.payload.id
      const blogToLike = state.find((blog) => blog.id === id)
      const likedBlog = { ...blogToLike, likes: blogToLike.likes + 1 }
      return state
        .map((blog) => (blog.id === id ? likedBlog : blog))
        .sort((a, b) => b.likes - a.likes)
    },
    addComment(state, action) {
      const commentedBlog = action.payload
      const commentedBlogId = commentedBlog.id
      return state.map((blog) => (blog.id === commentedBlogId ? commentedBlog : blog))
    },
  },
})

export const createBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(blog)
    dispatch(appendBlog(newBlog))
  }
}

export const InitializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs.sort((a, b) => b.likes - a.likes)))
  }
}

export const deleteBlogObject = (blog) => {
  return async (dispatch) => {
    await blogsService.remove(blog)
    dispatch(removeBlog(blog))
  }
}

export const likeBlogObject = (blog) => {
  return async (dispatch) => {
    const likedBlog = await blogsService.update(blog)
    dispatch(addLike(likedBlog))
  }
}

export const commentBlogObject = (blogId, comment) => {
  return async (dispatch) => {
    const commentedBlog = await blogsService.comment(blogId, comment)
    dispatch(addComment(commentedBlog))
  }
}

export const { appendBlog, setBlogs, removeBlog, addLike, addComment } = blogSlice.actions
export default blogSlice.reducer
