import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { beforeEach, describe, expect } from 'vitest'

describe('<Blog />', () => {
    const blog = {
        title: 'Test title',
        author: 'Test author',
        url: 'https://testurl.com',
        likes: 0,
        user: {
            username: 'testuser',
            id: '1'
        }
    }

    const kayttaja = 'testuser'
    const likeBlog = vi.fn()
    const deleteBlog = vi.fn()

    let container

    beforeEach(() => {
        container = render(
            <Blog
                blog={blog}
                likeBlog={likeBlog}
                user={kayttaja}
                deleteBlog={deleteBlog}
            />
        ).container
    })


    test('<Blog /> renders only title and author by default', () => {

        expect(screen.getByText('Test title Test author')).toBeDefined()
        const div = container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })

    test('<Blog /> shows url and likes when toggle button is clicked', async () => {

        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)

        const div = container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('<Blog /> clicking like button twice requests same event twice', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('like')
        await user.click(button)
        await user.click(button)
        expect(likeBlog).toHaveBeenCalledTimes(2)
    })
})