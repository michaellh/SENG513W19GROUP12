import React from 'react'
import Settings from '../Modal/Settings';
import logo from '../../resources/logo.png'

export default function TopBar(props) {

    let handleSettings = () => {
        const title = <span><i className='fas fas fa-cog'></i>  Settings</span>
        const body = <Settings socket={props.socket} modal={props.modal} user={props.user} toggleSplitScreen={props.toggleSplitScreen} toggleNotification={props.toggleNotification}  splitScreenState={props.splitScreenState} notificationState={props.notificationState} resetChat={props.resetChat} logout={props.logout}/>;

        props.modal(title,body);
    }

  return (
    <div className='row mb-2 mt-2'>
        <div className='col-3'>
            <img src={logo} style={{"width" : "50px"}} alt="Logo"></img>
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
