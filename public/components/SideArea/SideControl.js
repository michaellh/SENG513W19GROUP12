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

    return (
        <div className='row'>
            <div className='col'>
                <button className='btn btn-primary' onClick={friendMode} >Friends</button>
            </div>
            <div className='col'>
                <button className='btn btn-secondary' onClick={chatMode} >Chats1</button>
            </div>
            <div className='col-12'>
                <input type='text' className='form-control' onChange={handleSearch} />
            </div>
        </div>
    )
}
