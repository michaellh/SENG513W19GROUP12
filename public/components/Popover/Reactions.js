import React from 'react'

export default function Reactions(props) {
    
    let handleClick = () => {

        $(`#${props.id}`).popover('hide');
    }
    return (
        <div>
            <button className='form-control' onClick={handleClick}>Sup</button>
        </div>
    )
}
