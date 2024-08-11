import { createSlice } from "@reduxjs/toolkit"
import blogService from "../services/blogs"

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    login(state, action) {
      return action.payload
    },
    logout(state, action) {
      return null
    },
  },
})

export const setUser = (user) => {
  return (dispatch) => {
    if (user) {
      window.localStorage.setItem("loggedBlogUser", JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(login(user))
    } else {
      window.localStorage.removeItem("loggedBlogUser")
      blogService.setToken(null)
      dispatch(logout())
    }
  }
}

export const { login, logout } = userSlice.actions
export default userSlice.reducer
