import React from 'react'
import AddUser from '../Modal/AddUser';

export default function TopBar(props) {

	let handleAddUser = () => {
	    const title = 'Add User'
	    const body = <AddUser socket={props.socket} chat={props.chat}/>;

	    props.modal(title,body);
  	}
  
  	let handleLeaveChat = () => {
		// console.log(props.chat.id);
		props.socket.emit('leaveChat', props.chat.id);
  	}

	return (
		<div className='col-12 top-bar'>
			<div className='row'>
				<h2 className='col-9 text-center'>{props.chat.name}</h2>
				<div className='col-3 btn-group input-group-lg'>
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
