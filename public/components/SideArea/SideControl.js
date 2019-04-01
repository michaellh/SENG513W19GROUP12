import React from 'react'

export default function SideControl(props) {


    let friendMode = () => {
        props.updateMode('friends');
    }

    let chatMode = () => {
        props.updateMode('chats')
    }

    let handleSearch = (e) => {
        props.filterResult(e.target.value);
    }

    let handleAdd = () => {
        
        let handleSubmit = (target) => {
            let name = target.querySelector('input').value;
            props.socket.emit('createChat', name);
        }

        const title = 'Add Chat'
        
        const body = (
            <div>
                <h6>Chat Name</h6>
                <input type='text' className='form-control' autoFocus={true}></input>
            </div>
        );

        props.modal(title,body,handleSubmit);
    }

    return (
        <div className='row'>
            <div className='col'>
                <button className='btn btn-primary' onClick={friendMode} >Friends</button>
            </div>
            <div className='col'>
                <button className='btn btn-secondary' onClick={chatMode} >Chats</button>
            </div>
            <div className='col-12'>
                <input type='text' className='form-control' onChange={handleSearch} />
            </div>
            <div className='col-12'>
                <button className='btn btn-danger btn-block' onClick={handleAdd} >Add</button>
            </div>
        </div>
    )
}
