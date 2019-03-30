import React from 'react'

export default function Messages(props) {
    // console.log(props);
    const messages = props.messages.map((d,i) => {
        return (
            <div key={i} style={{textAlign: i%2 ? 'right':'left'}}>
                Messaged: {d}
            </div>
        )
    })
    return (
        <div className={props.className}>
        {messages}
        </div>
    )
}
