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
    <div className='row m-2'>
        <img src={logo} style={{"width" : "50px", "height" : "50px", float:'left'}} alt="Logo"></img>
        <h5 className='col text-center mt-2'></h5>
        <div className='' style={{float:"right"}}>
            <button className='btn btn-light btn-lg'  onClick={handleSettings}><i className='fas fa-cog'></i></button>
        </div>
    </div>
  )
}
