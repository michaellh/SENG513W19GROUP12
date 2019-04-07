import React from 'react'

export default function Chats(props) {

    const chosenChatIDs = props.chosenChat.map(d => d && d.id);
    // console.log(props);
    const style = {width:'100%'};

    let handleOnClick = (chat) => {
        if (chat.id == chosenChatIDs[0]){
            props.resetChat(1);
        }
        else if (chat.id == chosenChatIDs[1]) {
            props.resetChat(2);
        }
        else{
            props.chooseChat(chat);
        }
    }

    const groupChats = props.chats.filter(chat => chat.group).map((d,i) => {
        return (
            //${d.group ? 'alert-info' : 'alert-secondary' }
            <li key={i} className={`list-group-item ${chosenChatIDs.includes(d.id) ? 'list-group-item-action active' : 'list-group-item-action' } `} 
                onClick={() => {handleOnClick(d)}}
                >
                {d.name} {d.unread ? <span className="badge badge-light">{d.unread}</span> : ''}
                {chosenChatIDs.includes(d.id) ? <span style={{float:'right'}}><i className="fas fa-window-close"></i></span> : ''}
            </li>
        )
    });

    const singleChats = props.chats.filter(chat => !chat.group).map((d,i) => {
        return (
            //${d.group ? 'alert-info' : 'alert-secondary' }
            <li key={i} className={`list-group-item ${chosenChatIDs.includes(d.id) ? 'list-group-item-action active' : 'list-group-item-action' } `} 
                onClick={() => {handleOnClick(d)}}
                >
                {d.name} {d.unread ? <span className="badge badge-light">{d.unread}</span> : ''}
                {chosenChatIDs.includes(d.id) ? <span style={{float:'right'}}><i className="fas fa-window-close"></i></span> : ''}
            </li>
        )
    });

    return (
        <div id={props.id} className='row'>
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
