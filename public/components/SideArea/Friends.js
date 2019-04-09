import React from 'react'

export default function Friends(props) {

    const singleChats = props.chats.filter(chat => !chat.group);
    const chosenChatNames = props.chosenChat.map(chat => chat && chat.members.map(member => member.name));
    
    let handleOnClick = (friend) => {
	let friendChat = singleChats.filter(chat => chat.name == friend);
	if (friendChat.length){
	    if (chosenChatNames[0] && chosenChatNames[0].includes(friendChat[0].name)){
		props.resetChat(1);
	    }
	    else if(chosenChatNames[1] && chosenChatNames[1].includes(friendChat[0].name)){
		props.resetChat(2);
	    }
	    else{
		props.chooseChat(friendChat[0]);
	    }
	}
	else{
	    props.socket.emit('createSingleChat', friend);
	}
    }
    
    const friends = props.friends.map((d,i) => {
        return (
		<li key={i} className={`list-group-item ${chosenChatNames.some(nameList => nameList && nameList.includes(d)) ? 'list-group-item-action active' : 'list-group-item-action' } `}
	    onClick={() => {handleOnClick(d)}}
		>
		{d}
	    </li>
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
