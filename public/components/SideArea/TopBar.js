import React from 'react'
import Settings from '../Modal/Settings';

export default function TopBar(props) {

    let handleSettings = () => {
        const title = <span><i className='fas fas fa-cog'></i>  Settings</span>
        const body = <Settings socket={props.socket} toggleSplitScreen={props.toggleSplitScreen} toggleNotification={props.toggleNotification}  splitScreenState={props.splitScreenState} notificationState={props.notificationState} resetChat={props.resetChat}/>;

        props.modal(title,body);
    }
    
  return (
    <div className='row m-2'>
        <h5 className='col text-center mt-2'> LOGO </h5>
        <div className='' style={{float:"right"}}>
            <button className='btn btn-light btn-lg'  onClick={handleSettings}><i className='fas fa-cog'></i></button>
        </div>
    </div>
  )
}
