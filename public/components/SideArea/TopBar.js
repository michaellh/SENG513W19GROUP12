import React from 'react'
import Settings from '../Modal/Settings';

export default function TopBar(props) {

    let handleSettings = () => {
        const title = <span><i className='fas fa-cog'></i>  Settings</span>
        const body = <Settings socket={props.socket}/>;

        props.modal(title,body);
    }

  return (
    <div className='row top-bar'>
        <div className='col-3'>
            <h2>LOGO</h2>
        </div>
        <div className='col-6'>
            <h2>NetChatter</h2>
        </div>
        <div className='col-3'>
            <button className='btn btn-outline-light text-dark btn-lg'  onClick={handleSettings}><i className='fas fa-cog'></i></button>
        </div>
    </div>
  )
}
