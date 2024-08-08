import { useQueryClient , useMutation } from "@tanstack/react-query"
import { createAnecdote } from "../requests"
import { useNotificationDispatch } from "../NotificationContext"
const AnecdoteForm = () => {

  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
      dispatch({type: 'ADD_NOTIFICATION', payload: `Anecdote created: ${anecdote.content}`})
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION' })
      }, 5000)
    },
    onError: () => {
      dispatch({type: 'ADD_NOTIFICATION', payload: 'Anecdote is too short, minimium length is 5'})
      setTimeout(() => {
        dispatch({ type: 'REMOVE_NOTIFICATION' })
      }, 5000)
    }
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content , votes:0})
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
