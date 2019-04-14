import React, { Component } from 'react'

export default function LeaveChat(props) {

    let handleClick = (e) => {
        //props.socket.emit('leaveChat', props.chat.id);
        props.socket.emit('leaveChat', {chat:props.chat, chatName:props.chatName});
    }
    
    return (
        <div className="modal-footer">
            <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
            <button className="btn btn-danger" data-dismiss="modal" onClick={handleClick}>Okay</button>
        </div>
    )
}
