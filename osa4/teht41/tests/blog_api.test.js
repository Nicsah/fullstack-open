const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')
const Blog = require('../models/blog')

describe('blogin omat testit', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        helper.authTokens=[]

        for (const kayttaja of helper.initialUsers) {
            await api
            .post('/api/users')
            .send(kayttaja)
            .expect(201)
        }

        for (const kayttaja of helper.initialUsers){
            const response = await api
            .post('/api/login')
            .send(kayttaja)
            .expect(200)

            helper.authTokens.push(response.body.token)
        }
        

            let index = 1
        for (const blog of helper.initialBlogs){
            index--
            await api
            .post('/api/blogs')
            .set('Authorization',`bearer ${helper.authTokens[index]}`)
            .send(blog)
            index++
        }
    })


    test('blogs are returned as json', async () => {
        await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })


    test('there are right amount of blogs', async () => {
        const response = await api.get('/api/blogs')
  
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
    

    test('first blog is about how good it is', async () => {
        const response = await api.get('/api/blogs')

        const title = response.body[0].title
        assert.equal(title,'paras blogi ikinä')
    })


    test('valid blog can be added', async () => {
        const newBlog = {
            title: 'testi blogi',
            author: 'testaaja',
            url: 'https://example.com',
            likes: 0,
        }

        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.authTokens[0]}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    })


    test('blog without title or url is not added', async () => {
        const newBlog = {
            
        }

        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.authTokens[0]}`)
        .send(newBlog)
        .expect(400)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })


    test('returned id is modified to id', async () => {
        const response = await api.get('/api/blogs')

        assert('id' in response.body[0],'oikeaa id ei löydetä')
        assert(!('_id' in response.body[0]),'väärä _id löydetty')
    })

    test('default likes 0', async () => {
        const newBlog = {
            title: 'jeejeehyvä title',
            url: 'https://example.commmm',
        }

        await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${helper.authTokens[0]}` )
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const blog = response.body.find(blog => blog.title === newBlog.title)
        assert.strictEqual(blog.likes, 0)
    })

    test('deleting one blog', async () =>{

        const blogsAtStart = await helper.blogsInDb()
        const poistettava = blogsAtStart[0]
        await api
        .delete(`/api/blogs/${poistettava.id}`)
        .set('Authorization', `Bearer ${helper.authTokens[0]}`)
        .expect(204)
    })
    test('editing a blog', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const muokattava = blogsAtStart[0]

        const newBlog = {
            likes: 1000
        }
        const response = await api
        .put(`/api/blogs/${muokattava.id}`)
        .send(newBlog)
        
        const paivitetty = response.body
        assert.strictEqual(paivitetty.likes,newBlog.likes)

    })  

    test('cant create blog with no token', async () => {
        const newBlog = {
            title: 'jeejeehyvä title',
            url: 'https://example.commmm',
        }
        await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
})


describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'käyttäjä',
        name: 'En',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('getting all users', async () => {
        const response = await api.get('/api/users')
        assert.strictEqual(response.body.length, 1)
    })

    test('cant create user with invalid username', async () => {
        const invalidUser = {
            username: 'in',
            name: 'invalid',
            password: 'invalid',
        }
        await api.post('/api/users')
        .send(invalidUser)
        .expect(400)
    })

    test('cant create user with invalid password', async () => {
        const invalidUser = {
            username: 'invalid',
            name: 'invalid',
            password: 'in',
        }
        await api.post('/api/users')
        .send(invalidUser)
        .expect(400)
    })

  })



after(async () => {
  await mongoose.connection.close()
})