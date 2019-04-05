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

    let handleEdit = (date, userID) => {
        // Message to be edited to
        let message = 'boo';
        props.socket.emit('messageEdit', {chatID : props.chat.id, userID, date, message})
    }

    let filterMessage = (searchTerm, message) => {
       return searchTerm ? message.split(searchTerm).join(`<span style='background-color:yellow'>${searchTerm}</span>`) : message
    };

    const messages = props.messages.map((d,i) => {
        return (
            <div key={i} style={{textAlign: d.userID == props.user.id  ? 'right':'left'}}>
                <div className='alert alert-primary m-2'>
                    [{fmtDate(d.date)}] {d.userName}: 
                    {props.searchTerm ? <span dangerouslySetInnerHTML={{__html:filterMessage(props.searchTerm, d.message)}}></span> : d.message}
                    
                    {/* {d.message} */}
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
                    <button onClick={() => handleEdit(d.date, d.userID, d.message)}>Edit</button>

                    {/* <button className='btn btn-outline-primary' id={`message${i}`}><i className='fas fa-search'></i></button>
                    {createPopover(`message${i}`, <Reactions id={`message${i}`} />, {placement:'bottom'})} */}
                </div>
            </div>
        )
    })
    return (
        <div className={props.className} id={props.id} style={{height:props.height}}>
            <div className='col-12'>
                {messages}
            </div>
        </div>
    )
}
