import { useState, useEffect , useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Logout from './components/Logout'
import CreateBlog from './components/CreateBlog'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from  './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({ message: null, action: null })


    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs.sort((a,b) => b.likes - a.likes) )
        )
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    },[])


    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const user = await loginService.login({
                username, password
            })
            window.localStorage.setItem('loggedBlogUser',JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            setPassword('')
            setUsername('')
            setNotification({ message: `Tervetuloa ${user.name}`, action: 'onnistunut' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }catch {
            setNotification({ message: 'Virheellinen käyttäjänimi tai salasana', action: 'virhe' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }
    }

    const createBlogRef = useRef()

    const addBlog = async (blogObject) => {
        createBlogRef.current.toggleVisibility()
        try {
            const returnedBlog = await blogService
                .create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            setNotification({ message: `Uusi blogi ${returnedBlog.title} lisätty`, action: 'onnistunut' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }catch {
            setNotification({ message: 'Puutteelliset blogin tiedot', action: 'virhe' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }
    }


    const deleteBlog = async (blogObject) => {
        if (window.confirm(`Poista blog ${blogObject.title}`)){
            try {
                await blogService
                    .remove(blogObject)
                setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
                setNotification({ message: `Blogi ${blogObject.title} poistettu`, action: 'onnistunut' })
                setTimeout(() => {
                    setNotification({ message:null, action:null })
                }, 5000)
            }catch {
                setNotification({ message: 'Blogin poistaminen epäonnistui', action: 'virhe' })
                setTimeout(() => {
                    setNotification({ message:null, action:null })
                }, 5000)
            }
        }
    }


    const likeBlog = async (blogObject) => {
        try {
            const updatedBlog = { ...blogObject, likes: blogObject.likes +1 }
            await blogService
                .update(updatedBlog)
            setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : updatedBlog).sort((a, b) => b.likes - a.likes))
            setNotification({ message: `Tykätty ${updatedBlog.title}`, action: 'onnistunut' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }catch {
            setNotification({ message: 'Virhe tykkäyksessä', action: 'virhe' })
            setTimeout(() => {
                setNotification({ message:null, action:null })
            }, 5000)
        }
    }


    return (
        <div>

            {!user && <div>
                <Notification message={notification.message} action={notification.action}/>
                <LoginForm
                    handleLogin={handleLogin}
                    username={username}
                    password={password}
                    setUsername={setUsername}
                    setPassword={setPassword}
                />
            </div>
            }


            {user && <div>
                <h2>blogs</h2>
                <Notification message={notification.message} action={notification.action}/>
                <Logout name={user.name}/>

                <Togglable
                    buttonLabel="create new blog"
                    ref={createBlogRef}>
                    <CreateBlog createBlog={addBlog}/>
                </Togglable>

                {blogs.map(blog =>
                    <Blog key={blog.id} blog={blog} likeBlog={likeBlog} user={user.username} deleteBlog={deleteBlog} />
                )}
            </div>
            }

        </div>
    )
}

export default App
