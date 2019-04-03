import React from 'react'

export default function Messages(props) {
    let fmtDate = (date) => `${date.getHours() < 10 ? '0'+date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;
    // console.log(props);

    let handleReact = (date, userID, reactions, incReaction) => {
        props.socket.emit('messageReact', {chatID : props.chat.id, userID, date, reactions, incReaction});
    }

    let handleDelete = (date, userID) => {
        props.socket.emit('messageDelete', {chatID : props.chat.id, userID, date})

    }

    const messages = props.messages.map((d,i) => {
        return (
            <div key={i} style={{textAlign: d.userID == props.user.id  ? 'right':'left'}}>
                <div className='alert alert-primary'>
                    [{fmtDate(d.date)}] {d.userName}: {d.message}
                    {
                        // SHow reaction div if there is a reaction
                        d.reactions ? 
                        <div className='alert alert-secondary'>
                            {`[like:${d.reactions.like},${d.reactions.dislike}]`}
                        </div>
                        :
                        ''
                    }
                    <button onClick={() => handleReact(d.date, d.userID, d.reactions,'like')}>Like</button>
                    <button onClick={() => handleReact(d.date, d.userID, d.reactions,'dislike')}>Dislike</button>
                    <button onClick={() => handleDelete(d.date, d.userID)}>delete</button>
                </div>
                 
            </div>
        )
    })
    return (
        <div className={props.className} id={props.id}>
            {messages}
        </div>
    )
}
