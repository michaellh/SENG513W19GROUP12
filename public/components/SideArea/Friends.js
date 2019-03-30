import React from 'react'

export default function Friends(props) {
    const friends = props.friends.map((d,i) => {
        return (
            <div key={i} className='alert alert-warning'>{d}</div>
        )
    });

    return (
        <div>
            {friends}
        </div>
    )
}
