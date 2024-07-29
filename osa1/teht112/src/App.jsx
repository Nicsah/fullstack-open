import { useState } from 'react'


const ButtonNext = (props) => {
  const handleClick = () => {
    const luku = Math.floor(Math.random()*props.anecdotes.length);
    props.setSelected(luku);
  }

  return(
    <button onClick={handleClick}>next anecdote</button>
  )
}

const Vote = (props) => {
  const handleClick = () => {
    props.onVote(props.selected);
  }

  return(
    <button onClick={handleClick}>vote</button>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(anecdotes.length).fill(0))

  const handleVote = (index) => {
    const newVote = [...vote];
    newVote[index]++;
    setVote(newVote);
  }

  return (
    <div>
      <h2>Anecdote of the day</h2>
      {anecdotes[selected]}
      <br />
      has {vote[selected]} votes
      <br />
      <Vote onVote={handleVote} selected={selected} />
      <ButtonNext setSelected={setSelected} anecdotes={anecdotes} vote={vote} />
      <h2>Anecdote with most votes</h2>
      {anecdotes[vote.indexOf(Math.max(...vote))]}
    </div>
  )
}

export default App

