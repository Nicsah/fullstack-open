import { useState } from 'react'
import PropTypes from 'prop-types'
const Blog = ({ blog, likeBlog , user, deleteBlog }) => {

    const [showAllInfo, setShowAllInfo]=useState(false)
    const [buttonLabel, setButtonLabel] = useState('view')

    const showWhenShow = { display: showAllInfo ? '' : 'none' }

    const toggleInfo = () => {
        setShowAllInfo(!showAllInfo)
        if (showAllInfo) {
            setButtonLabel('view')
        } else {
            setButtonLabel('hide')
        }
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }


    return(
        <div style={blogStyle} data-testid="blog">
            <div>
                <div>
                    {blog.title} {blog.author}
                    <button onClick={toggleInfo}>{buttonLabel}</button>
                </div>
                <div style={showWhenShow} className='togglableContent'>
                    <a href={blog.url}>{blog.url}</a>
                    <div>likes {blog.likes}
                        <button onClick={() => likeBlog(blog)}>like</button>
                    </div>
                    <div>
                        {blog.user.name}
                    </div>
                    {user === blog.user.username &&
        <button onClick={() => deleteBlog(blog)}>remove</button>}
                </div>
            </div>
        </div>
    )}

Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    deleteBlog: PropTypes.func.isRequired,
    user: PropTypes.string.isRequired
}

export default Blog