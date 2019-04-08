import React, { Component } from 'react'

export default function ManageUser(props) {
    const isAdmin = props.role == 'admin';
    const members = props.chat.members.map((d,i) => {
        return (
            <div key={i} className='row'>
                <div className='col-5'>
                    <h5>{d.name}</h5>
                </div>
                <div className='col-5 form-group'>
                    {
                        d.role=='member'?
                        <select className='form-control' disabled={!isAdmin} onChange={(e) => {handleOnChange(d.id, e.target.value)}}>
                            <option value='member'>Member</option>
                            <option value='admin'>Admin</option>
                            <option className='text-light bg-danger' value='remove'>Remove</option>
                        </select>
                        :
                        <select className='form-control' disabled={!isAdmin} onChange={(e) => {handleOnChange(d.id, e.target.value)}}>
                            <option value='admin'>Admin</option>
                            <option value='member'>Member</option>
                            <option className='text-light bg-danger' value='remove'>Remove</option>
                        </select>
                    }
                </div>
            </div>
        )
    });

    
    let changesMade = {};
    
    let handleOnChange = (userID, role) => {
        changesMade[userID] = role;
    }
    
    let handleSave = () => {
        const chatID = props.chat.id;
        Object.keys(changesMade).forEach(userID => {
            if(changesMade[userID] == 'remove'){
                // console.log('removed');
                props.socket.emit('removeFromChat', {chatID,userID});
            }else{
                // console.log('Emit', changesMade[userID]);
                props.socket.emit('roleChange', {chatID, userID, role:changesMade[userID]});
            }
        });
        // changesMade.forEach(change => console.log(change));
    }
    
    return (
        <div>
            <div className='modal-body' id='modalBody'>
                {members}
            </div>
            <div className='modal-footer'>
                <button className='btn btn-secondary' data-dismiss='modal'>Cancel</button>
                {isAdmin ? <button className='btn btn-primary' data-dismiss='modal' onClick={handleSave}>Save</button> : ''}
            </div>
        </div>
    )
}
