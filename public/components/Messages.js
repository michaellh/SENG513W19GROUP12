import React from 'react'

export default function Messages(props) {
    console.log(props);
    const messages = props.messages.map((d,i) => {
        return (
            <div key={i}>
                Messaged: {d}
            </div>
        )
    })
    return (
    <div>
      {messages}
    </div>
  )
}
