import React from 'react'

export default function SideMode(props) {


    let friendMode = () => {
        props.updateMode('friend');
    }

    let chatMode = () => {
        props.updateMode('chat')
    }

    return (
        <div className='row'>
            <div className='col'>
                <button className='btn btn-primary' onClick={friendMode} >Friends</button>
            </div>
            <div className='col'>
                <button className='btn btn-secondary' onClick={chatMode} >Chats</button>
            </div>
        </div>
    )
}
