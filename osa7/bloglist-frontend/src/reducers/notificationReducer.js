import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    showNotification(state, action) {
      return action.payload
    },
  },
})

export const setNotification = (message, action, time) => {
  return (dispatch) => {
    dispatch(showNotification({ message, action }))
    setTimeout(() => {
      dispatch(showNotification(null))
    }, time * 1000)
  }
}

export const { showNotification } = notificationSlice.actions
export default notificationSlice.reducer
