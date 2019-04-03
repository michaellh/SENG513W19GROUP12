import React from 'react'
import AddUser from '../Modal/AddUser';

export default function TopBar(props) {

	let handleAddUser = () => {
	    const title = <span><i className='fas fa-user-plus'></i>  Add User</span>
	    const body = <AddUser socket={props.socket} chat={props.chat}/>;

	    props.modal(title,body);
  	}
  
  	let handleLeaveChat = () => {
		// console.log(props.chat);
		props.socket.emit('leaveChat', props.chat);
  	}
	
	// Using group chatname from chat if groupchat. Else use the name from the user's table
	let chatName = props.chat.group ? props.chat.name : props.user.chats.find(({id}) => id == props.chat.id).name

	return (
		<div className='col-12 top-bar'>
			<div className='row'>
				<h2 className='col-10 text-center'>{chatName}</h2>
				<div className='col-2 btn-group input-group-lg'>
					<button className='btn btn-outline-dark' onClick={handleLeaveChat}><i className='fas fa-trash-alt'></i></button>
					<button className='btn btn-outline-dark'><i className='fas fa-search'></i></button>
					<button className='btn btn-outline-dark'><i className='fas fa-user-cog'></i></button>
					<button className='btn btn-outline-dark' onClick={handleAddUser}><i className='fas fa-user-plus'></i></button>
					<button className='btn btn-outline-dark'><i className='fas fa-tools'></i></button>
				</div>
			</div>
		</div>
	)
}
