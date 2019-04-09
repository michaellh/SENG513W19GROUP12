import React from 'react'

export default function Friends(props) {
    
    const friends = props.friends.map((d,i) => {
        return (
            <li key={i} className='list-group-item text-primary'>{d}</li>
        )
    });

    return (
        <div className='row'>
            <div className='col-12'>
                <ul className='list-group-flush text-center'>
                    {friends}
                </ul>
            </div>
        </div>
    )
}
