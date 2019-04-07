import React from 'react'

export default function Chats(props) {

    let chosen = props.chosenChat && props.chosenChat.id;
    // console.log(props);
    const style = {width:'100%'};

    const groupChats = props.chats.filter(chat => chat.group).map((d,i) => {
        return (
            //${d.group ? 'alert-info' : 'alert-secondary' }
            <li key={i} className={`list-group-item ${chosen == d.id ? 'list-group-item-action active' : 'list-group-item-action' } `} 
                onClick={() => {console.log(d.group);props.chooseChat(d)}}
                >
                {d.name}
            </li>
        )
    });

    const singleChats = props.chats.filter(chat => !chat.group).map((d,i) => {
        return (
            //${d.group ? 'alert-info' : 'alert-secondary' }
            <li key={i} className={`list-group-item ${chosen == d.id ? 'list-group-item-action active' : 'list-group-item-action' } `} 
                onClick={() => {console.log(d.group);props.chooseChat(d)}}
                >
                {d.name}
            </li>
        )
    });

    return (
        <div className='row'>
            {/* Only Render when there is Elements */}
            {!groupChats.length ? '' :
            <div className='col-12 card' style={style}>
                <h5 className="card-header text-center" 
                    data-toggle="collapse" data-target="#collapseGroupChat" 
                    aria-expanded="true" aria-controls="collapseGroupChat">
                    Group Chats
                </h5>
                <ul id='collapseGroupChat' className='list-group-flush text-center collapse show'>
                    {groupChats}
                </ul>
            </div>
            }
            {/* Only Render when there is Elements */}
            {!singleChats.length ? '' :
            <div className='col-12 card' style={style}>
                <h5 className="card-header text-center"
                    data-toggle="collapse" data-target="#collapseSingleChat" 
                    aria-expanded="true" aria-controls="collapseSingleChat">
                    Individual Chats
                </h5>
                <ul id='collapseSingleChat' className='list-group-flush text-center collapse show'>
                    {singleChats}
                </ul>
            </div>
            }
        </div>
    )
}
