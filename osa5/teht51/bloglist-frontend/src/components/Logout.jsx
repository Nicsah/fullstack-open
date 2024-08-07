const Logout = ({ name }) => (
    <div>
        {name} logged in
        <button onClick={() => window.localStorage.removeItem('loggedBlogUser')}>
            logout
        </button>
    </div>
)
export default Logout