import React, { Component } from 'react'

export default class ManageUser extends Component{
    constructor(props) {
        super(props)
        
        this.state ={
            isAdmin : props.role == 'admin',
            members: props.chat.members,
        }

        this.changesMade = {};

        this.handleOnChange = this.handleOnChange.bind(this);
        this.handleSave = this.handleSave.bind(this);

    }

    componentWillReceiveProps(props){
        this.setState({isAdmin : props.role == 'admin'});
        this.setState({members: props.chat.members});
    }
    
    handleOnChange(userID, e) {
        this.changesMade[userID] = e.target.value;
    }
    
    handleSave() {
        const chatID = this.props.chat.id;
        Object.keys(this.changesMade).forEach(userID => {
            if(this.changesMade[userID] == 'remove'){
                this.props.socket.emit('removeFromChat', {chatID, chatName:this.props.chatName, userID});
            }else{
                this.props.socket.emit('roleChange', {chatID, userID, role:this.changesMade[userID]});
            }
        });
    }
    
    render(){
        const members = this.state.members.map((d,i) => {
            return (
                <div key={i} className='row'>
                    <div className='col-5'>
                        <h5>{d.name}</h5>
                    </div>
                    <div className='col-5 form-group'>
                        {
                            d.role=='member'?
                            <select className='form-control' disabled={!this.state.isAdmin} onChange={(e)=>this.handleOnChange(d.id,e)}>
                                <option value='member'>Member</option>
                                <option value='admin'>Admin</option>
                                <option className='text-light bg-danger' value='remove'>Remove</option>
                            </select>
                            :
                            <select className='form-control' disabled={!this.state.isAdmin} onChange={(e)=>this.handleOnChange(d.id,e)}>
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
                    {this.state.isAdmin ? <button className='btn btn-primary' data-dismiss='modal' onClick={this.handleSave}>Save</button> : ''}
                </div>
            </div>
        )       
    }
}
