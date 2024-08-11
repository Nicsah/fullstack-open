import axios from "axios"
const baseUrl = "/api/blogs"

let token = null

const setToken = (Newtoken) => {
  token = `Bearer ${Newtoken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (BlogObject) => {
  const response = await axios.put(`${baseUrl}/${BlogObject.id}`, BlogObject)
  return response.data
}

const remove = async (BlogObject) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}/${BlogObject.id}`, config)
}

const comment = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment })
  return response.data
}

export default { getAll, setToken, create, update, remove, comment }
