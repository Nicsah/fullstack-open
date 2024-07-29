import { useState } from 'react'

const Button =(props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Value =(props) => (
  <p>{props.name} {props.value}</p>
)
const Statistics = (props) => {
  const all = props.good + props.neutral + props.bad
  const average = (props.good - props.bad) / all
  const positive = props.good / all * 100

  if (all>0){
    return (
      <div>
        <table>
          <tbody>
            <tr>
              <td>good</td>
              <td>{props.good}</td>
            </tr>
            <tr>
              <td>neutral</td>
              <td>{props.neutral}</td>
            </tr>
            <tr>
              <td>bad</td>
              <td>{props.bad}</td>
            </tr>
            <tr>
              <td>all</td>
              <td>{all}</td>
            </tr>
            <tr>
              <td>average</td>
              <td>{average}</td>
            </tr>
            <tr>
              <td>positive</td>
              <td>{positive} %</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }else return(
    <p>No feedback given</p>
  )

}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)



  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={()=> setGood(good+1)} text="good"/>
      <Button handleClick={()=> setNeutral(neutral+1)} text="neutral"/>
      <Button handleClick={()=> setBad(bad+1)} text="bad"/>
      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App

//step1 tehty 1.6
//step2 tehty 1.7
//step3 tehty 1.8
//step4 tehty 1.9
//step5 tehty 1.10
//step6 tehty 1.11
