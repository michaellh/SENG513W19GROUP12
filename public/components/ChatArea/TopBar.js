import React from 'react'

export default function TopBar(props) {
  return (
    <div className={props.className}>
      <div className='alert alert-primary'>{props.name}</div>
    </div>
  )
}
