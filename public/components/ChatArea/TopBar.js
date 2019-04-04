import React from 'react'
import AddUser from '../Modal/AddUser';
import LeaveChat from '../Modal/LeaveChat'
import Customize from '../Modal/Customize'
import ManageUsers from '../Modal/ManageUsers'
import SearchBar from '../Popover/SearchBar';
import createPopover from '../Popover';

export default function TopBar(props) {

	// Using group chatname from chat if groupchat. Else use the name from the user's table
	let chatName = props.chat.group ? props.chat.name : props.user.chats.find(({id}) => id == props.chat.id).name;
	let role = props.chat.members.find(({id}) => id == props.user.id).role;

	let handleAddUser = () => {
	    const title = <span><i className='fas fa-user-plus'></i>  Add User</span>
	    const body = <AddUser socket={props.socket} chat={props.chat}/>;

	    props.modal(title,body);
  	}
  
  	let handleLeaveChat = () => {
		// console.log(props.chat.id);
		
		
		const title = <span><i className='fas fa-trash-alt'></i>  {role == 'member' ? 'Leave' : 'Delete'} {chatName}?</span>
		const body = <LeaveChat socket={props.socket} chat={props.chat}/>;

		props.modal(title,body);
  	}

  	let handleCustomize = () => {
		// console.log(props.chat.id);
		
		const title = <span><i className='fas fas fa-tools'></i>  Customize</span>
		const body = <Customize socket={props.socket} chat={props.chat}/>;

		props.modal(title,body);
  	}

	let handleManageUsers = () => {
		// console.log(props.chat.id);
		
		const title = <span><i className='fas fas fa-user-cog'></i>  Manage Users</span>
		const body = <ManageUsers socket={props.socket} chat={props.chat}/>;

		props.modal(title,body);
  	}

	createPopover('chatAreaSearch', <SearchBar id='chatAreaSearch' filterMessages={props.filterMessages}/>, {placement:'bottom'});

	return (
		<div className='col-12 top-bar'>
			<div className='row'>
				<h4 className='col-10 text-center'>{chatName}</h4>
				<div className='col-2 btn-group input-group-lg'>
					<button className='btn btn-outline-primary' id='chatAreaSearch'><i className='fas fa-search'></i></button>
					<button className='btn btn-outline-primary' onClick={handleManageUsers}><i className='fas fa-user-cog'></i></button>
					<button className='btn btn-outline-primary' onClick={handleAddUser}><i className='fas fa-user-plus'></i></button>
					<button className='btn btn-outline-primary' onClick={handleCustomize}><i className='fas fa-tools'></i></button>
					<button className='btn btn-outline-primary' onClick={handleLeaveChat}><i className='fas fa-sign-out-alt'></i></button>
				</div>
			</div>
		</div>
	)
}
