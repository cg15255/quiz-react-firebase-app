import React from 'react'

export default function CategoryChooser({ setChoice }) {
  return (
    <div className='container--categories'>
      <h1>Choose A Category</h1>
      <div>
        <button className='btn' onClick={() => setChoice(27)}>
          Animals
        </button>
        <button className='btn' onClick={() => setChoice(21)}>
          Sports
        </button>
        <button className='btn' onClick={() => setChoice(11)}>
          Films
        </button>
        <button className='btn' onClick={() => setChoice(9)}>
          General
        </button>
      </div>
    </div>
  )
}
