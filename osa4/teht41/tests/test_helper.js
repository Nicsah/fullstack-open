const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "paras blogi ikinä",
        author: "nico",
        url: "https://jugicraft.fi",
        likes: 300
    },
    {
        title: "huono blogi",
        author: "pelaaja1",
        url: "https://example.com",
    },
    {
        title: "paras blogi",
        author: "nico",
        url: "https://testisivu.fi",
    }
]

const initialUsers = [
    {
        username: "nico",
        name: "Nico",
        password: "salasana",
        blogs: []
    },
    {
        username: "pelaaja1",
        name: "Pelaaja1",
        password: "salasana",
        blogs: []
    }
]

const authTokens=[]

const nonExistingId = async () => {
    const blog = new Blog({title:'willremovethissoon',url:'willremovethissoon'})
    await blog.save()
    await blog.deleteOne()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}


module.exports = {
    initialBlogs, initialUsers, authTokens, nonExistingId, blogsInDb, usersInDb
}