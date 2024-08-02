const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    :blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favouriteBlog = (blogs) => {

    if (blogs.length === 0) return null

    const suosituin = blogs.reduce((acc, blog) => {
        return blog.likes > acc.likes ? blog : acc
    })

    return {title: suosituin.title, author: suosituin.author, likes: suosituin.likes}
}


const mostBlogs = (blogs) => {
    
    if (blogs.length === 0) return null

    const authorBlogs = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + 1
        return acc
    }, {})

    const authorWithMostBlogs = Object.keys(authorBlogs).reduce((acc, author) => {
        return authorBlogs[author] > authorBlogs[acc] ? author : acc
    })
        
    return  {author: authorWithMostBlogs, blogs: authorBlogs[authorWithMostBlogs]}
        
}

const mostLikes = (blogs) => {

    if (blogs.length === 0) return null

    const authorLikes = blogs.reduce((acc, blog) => {
        acc[blog.author] = (acc[blog.author] || 0) + blog.likes
        return acc
    }, {})

    const authorWithMostLikes = Object.keys(authorLikes).reduce((acc, author) => {
        return authorLikes[author] > authorLikes[acc] ? author : acc
    })

    return  {author: authorWithMostLikes, likes: authorLikes[authorWithMostLikes]}
}

  
module.exports = {
    dummy, totalLikes,favouriteBlog, mostBlogs, mostLikes
}
