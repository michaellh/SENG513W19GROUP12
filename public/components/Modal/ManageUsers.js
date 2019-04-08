import React, { Component } from 'react'

export default class ManageUser extends Component{
    constructor(props) {
        super(props)

        this.state ={
            
        }

        this.isAdmin = this.props.role == 'admin';
        this.changesMade = {};

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSave - this.handleSave.bind(this);

    }    
    
    handleOnChange(userID, e) {
        this.changesMade[userID] = e.target.value;
    }
    
    handleSave() {
        const chatID = this.props.chat.id;
        Object.keys(this.changesMade).forEach(userID => {
            if(this.changesMade[userID] == 'remove'){
                // console.log('removed');
                this.props.socket.emit('removeFromChat', {chatID,userID});
            }else{
                // console.log('Emit', changesMade[userID]);
                this.props.socket.emit('roleChange', {chatID, userID, role:changesMade[userID]});
            }
        });
        // changesMade.forEach(change => console.log(change));
    }
    
    render(){
        const members = this.props.chat.members.map((d,i) => {
            return (
                <div key={i} className='row'>
                    <div className='col-5'>
                        <h5>{d.name}</h5>
                    </div>
                    <div className='col-5 form-group'>
                        {
                            d.role=='member'?
                            <select className='form-control' disabled={!this.isAdmin} onChange={(e)=>this.handleOnChange(d.id,e)}>
                                <option value='member'>Member</option>
                                <option value='admin'>Admin</option>
                                <option className='text-light bg-danger' value='remove'>Remove</option>
                            </select>
                            :
                            <select className='form-control' disabled={!this.isAdmin} onChange={(e)=>this.handleOnChange(d.id,e)}>
                                <option value='admin'>Admin</option>
                                <option value='member'>Member</option>
                                <option className='text-light bg-danger' value='remove'>Remove</option>
                            </select>
                        }
                    </div>
                </div>
            )
        });
        return (
            <div>
                <div className='modal-body' id='modalBody'>
                    {members}
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-secondary' data-dismiss='modal'>Cancel</button>
                    {this.isAdmin ? <button className='btn btn-primary' data-dismiss='modal' onClick={this.handleSave}>Save</button> : ''}
                </div>
            </div>
        )       
    }
}
