import React from 'react'

export default function TopBar() {
  return (
    <div className="row">
        <div className='col-3'>
            <h2>LOGO</h2>
        </div>
        <div className='col-6'>
            <h2>NetChatter</h2>
        </div>
        <div className='col-3'>
            <button className='btn btn-outline-light text-dark btn-lg'><i className='fas fa-cog'></i></button>
        </div>
    </div>
  )
}
