import React from 'react'

export default function Messages(props) {
    // console.log(props);
    const messages = props.messages.map((d,i) => {
        return (
            <div key={i} style={{textAlign: d.user == props.user ? 'right':'left'}}>
                {d.user}: {d.message}
            </div>
        )
    })
    return (
        <div className={props.className} id={props.id}>
        {messages}
        </div>
    )
}
