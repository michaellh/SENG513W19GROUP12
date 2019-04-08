import React from 'react'
import AddUser from '../Modal/AddUser';
import LeaveChat from '../Modal/LeaveChat'
import Customize from '../Modal/Customize'
import ManageUsers from '../Modal/ManageUsers'
import SearchBar from '../Popover/SearchBar';
import { UncontrolledPopover } from 'reactstrap';

export default function TopBar(props) {

	// Using group chatname from chat if groupchat. Else use the name from the user's table
	let chatName = props.chat && props.chat.group ? props.chat.name : props.user.chats.find(({id}) => id == props.chat.id).name;
	let role = props.chat && props.chat.group && props.chat.members.find(({id}) => id == props.user.id).role;

	let handleAddUser = () => {
	    const title = 'Add User'
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
		const body = <Customize socket={props.socket} chat={props.chat} setFontState={props.setFontState}/>;

		props.modal(title,body);
  	}

	let handleManageUsers = () => {
		// console.log(props.chat.id);
		
		const title = <span><i className='fas fas fa-user-cog'></i>  Manage Users</span>
		const body = <ManageUsers socket={props.socket} chat={props.chat}/>;

		props.modal(title,body);
  	}

	return (
		<div className='col-12 mb-2 mt-2' id={props.id}>
			{
				props.chat.group?
				<div className='row'>
					<h4 className='col text-center'>{chatName}</h4>
					<div className='btn-group input-group-lg' style={{float:"right"}}>
						<button className='btn btn-outline-primary' id={`chatAreaSearch_${props.chat.id}`}><i className='fas fa-search'></i></button>
						<button className='btn btn-outline-primary' onClick={handleManageUsers}><i className='fas fa-user-cog'></i></button>
						<button className='btn btn-outline-primary' onClick={handleAddUser}><i className='fas fa-user-plus'></i></button>
						<button className='btn btn-outline-primary' onClick={handleCustomize}><i className='fas fa-tools'></i></button>
						<button className='btn btn-outline-primary' onClick={handleLeaveChat}><i className='fas fa-sign-out-alt'></i></button>
					</div>
					<UncontrolledPopover placement="left" target={`chatAreaSearch_${props.chat.id}`}>
						<SearchBar filterMessages={props.filterMessages}/>
					</UncontrolledPopover>
				</div>
				:
				<div className='row'>
					<h4 className='col text-center'>{chatName}</h4>
					<div className='btn-group input-group-lg' style={{float:"right"}}>
						<button className='btn btn-outline-primary' id={`chatAreaSearch_${props.chat.id}`}><i className='fas fa-search'></i></button>
						<button className='btn btn-outline-primary' onClick={handleCustomize}><i className='fas fa-tools'></i></button>
						<button className='btn btn-outline-primary' onClick={handleLeaveChat}><i className='fas fa-sign-out-alt'></i></button>
					</div>
					<UncontrolledPopover placement="left" target={`chatAreaSearch_${props.chat.id}`}>
						<SearchBar filterMessages={props.filterMessages}/>
					</UncontrolledPopover>
				</div>
			}
		</div>
	)
}
