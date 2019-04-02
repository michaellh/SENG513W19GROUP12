import React from 'react'

export default function Messages(props) {
    let fmtDate = (date) => `${date.getHours() < 10 ? '0'+date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;
    // console.log(props);
    const messages = props.messages.map((d,i) => {
        return (
            <div key={i} style={{textAlign: d.userID == props.user.id  ? 'right':'left'}}>
                [{fmtDate(d.date)}] {d.userName}: {d.message}
            </div>
        )
    })
    return (
        <div className={props.className}>
        {messages}
        </div>
    )
}
