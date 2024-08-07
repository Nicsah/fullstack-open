const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const {tokenExtractor,userExtractor} = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)

})
  
blogsRouter.post('/',tokenExtractor, userExtractor, async (request, response) => {
  const {title, author, url, likes} = request.body

  const user = await User.findById(request.user.id)
  
  if (!user){
    return response.status(400).json({error: 'Can\'t find user'})
  }
  

  const blog = new Blog({
    title,
    author,
    url,
    likes:likes || 0,
    user: user._id
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)

})

blogsRouter.delete('/:id',tokenExtractor, userExtractor, async (request, response) => {

  const blog = await Blog.findById(request.params.id)
  if (!blog) return response.status(400).send({error: 'invalid blog id'})

  if (blog.user.toString() === request.user.id){
    await Blog.findByIdAndDelete(request.params.id)
    const user = await User.findById(request.user.id)
    user.blogs = user.blogs.filter(blogId => blogId.toString() !== request.params.id)
    await user.save()
    response.status(204).end()
  }
  return response.status(403).end()
})

blogsRouter.put('/:id', async (request,response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)

})

module.exports = blogsRouter;