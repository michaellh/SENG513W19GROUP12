import React from 'react'

export default function Chats(props) {

    // console.log(props);
    const chats = props.chats.map((d,i) => {
        return (
            <div key={i} className='alert alert-info' onClick={() => {props.chooseChat(d)}}>{d}</div>
        )
    });

    return (
        <div>
            {chats}
        </div>
    )
}
