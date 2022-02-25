import React from 'react'

const Header = ({name}) => {
  return ( 
    <h1>{name}</h1>
  )
}

const Part = ({coursename, exercises}) => {
  return (
    <p>{coursename} {exercises}</p>
  )
}

const Sum = ({sum}) => {
  return(
    <p><b>total of {sum} exercises</b></p>
  )
}

const Content = ({course}) => {
  return (
    <>
      {course.parts.map(part => <Part key={part.id} coursename={part.name} exercises={part.exercises}/>)}
      <Sum sum={course.parts.reduce((sum, part) => sum + part.exercises, 0)} />
    </>
  
  )
} 

const Course = ({courses}) => {
  return(
    <>
      {courses.map((course) => [
      <Header key={course.id+"h"} name={course.name} />,
      <Content key={course.id+"c"} course={course} />])}
      
    </>
      
  )
}

export default Course