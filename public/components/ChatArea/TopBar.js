import React from 'react'
import AddUser from '../Modal/AddUser';

export default function TopBar(props) {

	let handleAddUser = () => {
	    const title = 'Add User'
	    const body = <AddUser socket={props.socket}/>;

	    props.modal(title,body);
	}

  return (
  	<div className='col-12 top-bar'>
  		<div className='row'>
	    	<h2 className='col-9 text-center'>{props.name}</h2>
		    <div className='col-3 btn-group input-group-lg'>
		    	<button className='btn btn-outline-dark'><i className='fas fa-trash-alt'></i></button>
		    	<button className='btn btn-outline-dark'><i className='fas fa-search'></i></button>
		    	<button className='btn btn-outline-dark'><i className='fas fa-user-cog'></i></button>
		    	<button className='btn btn-outline-dark' onClick={handleAddUser}><i className='fas fa-user-plus'></i></button>
		    	<button className='btn btn-outline-dark'><i className='fas fa-tools'></i></button>
		    </div>
		</div>
    </div>
  )
}
