import React from 'react'

export default function Chats(props) {

    let chosen = props.chosenChat && props.chosenChat.id;
    // console.log(props);
    const chats = props.chats.map((d,i) => {
        return (
            //${d.group ? 'alert-info' : 'alert-secondary' }
            <li key={i} className={`list-group-item ${chosen == d.id ? 'list-group-item-action active' : 'list-group-item-action' } `} 
                onClick={() => {props.chooseChat(d)}}
                >
                {d.name}
            </li>
        )
    });

    return (
        <div className='row'>
            <div className='col-12'>
                <ul className='list-group text-center'>
                    {chats}
                </ul>
            </div>
        </div>
    )
}
