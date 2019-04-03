import React from 'react'
import AddChat from '../Modal/AddChat';

export default function SideControl(props) {

    let friendMode = () => {
        props.updateMode('friends');
        console.log(props.mode);
    }

    let chatMode = () => {
        props.updateMode('chats')
        console.log(props.mode);
    }

    let handleSearch = (e) => {
        props.filterResult(e.target.value);
    }

    // Add Modal
    let handleAdd = () => {
        
        const title = <span><i className='fas fa-plus-circle'></i>  Add Chat</span>
        const body = <AddChat socket={props.socket}/>;

        props.modal(title,body);
    }
    
    return (
        <div className='row'>
            {
                props.mode=="friends"?

                <div className='col-12 btn-group'>
                    <button className='btn btn-primary' onClick={friendMode} ><i className='fas fa-user-friends'></i>  Friends</button>
                    <button className='btn btn-outline-primary' onClick={chatMode} >Chats  <i className='fas fa-comments'></i></button>
                </div>
                :
                <div className='col-12 btn-group'>
                    <button className='btn btn-outline-primary' onClick={friendMode} ><i className='fas fa-user-friends'></i>  Friends</button>
                    <button className='btn btn-primary' onClick={chatMode} >Chats  <i className='fas fa-comments'></i></button>
                </div>
            }
            <div className='col-12'>
                <div className='input-group'>
                    <div className='input-group-prepend'>
                        <span className="input-group-text"><i className='fas fa-search'></i></span>
                    </div>
                    <input type='text' className='form-control' placeholder="Search..." onChange={handleSearch} />
                </div>
            </div>
            <div className='col-12'>
                <button className='btn btn-outline-primary btn-block' onClick={handleAdd} ><i className='fas fa-plus-circle'></i>  Add</button>
            </div>
        </div>
    )
}
