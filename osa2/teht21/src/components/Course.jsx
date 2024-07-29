import React from "react"

const Course = (props) => {
    console.log(props)
    const {course} = props
    const Header = course.name
    const Content = course.parts
    const Total = Content.reduce((sum, part) => sum + part.exercises, 0)
    return (
      <div>
        <h3>{Header}</h3>
        {Content.map((part) => (
          <div key={part.id}>{part.name} {part.exercises}</div>
        ))}
        <strong>total of {Total} exercises</strong>
      </div>
    )
  }

  export default Course