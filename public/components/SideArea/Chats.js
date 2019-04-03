import React from 'react'

export default function Chats(props) {

    // console.log(props);
    const chats = props.chats.map((d,i) => {
        return (
            <div key={i} className={`alert ${d.group ? 'alert-info' : 'alert-secondary' }`} 
                onClick={() => {props.chooseChat(d)}}
                >
                {d.name}
            </div>
        )
    });

    return (
        <div>
            {chats}
        </div>
    )
}
