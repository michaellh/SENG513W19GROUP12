import React from 'react'
import AddChat from '../Modal/AddChat';

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

    // Add Modal
    let handleAdd = () => {

        
        // const body = (
            // <div>
            //     <div onClick={() => {single = !single; this.forceUpdate()}}>Toggle</div>
            //     {
            //         single ?
            //         <div>
            //             <h6>User Name</h6>
            //             <input type='text' className='form-control' autoFocus={true}></input>
            //         </div> 
            //         :
            //         <div>
            //             <h6>Chat Name</h6>
            //             <input type='text' className='form-control' autoFocus={true}></input>
            //         </div>
            //     }s
            // </div>
        // );
        
        const title = 'Add Chat'
        const body = <AddChat socket={props.socket}/>;

        props.modal(title,body);
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
