import React, { Component } from 'react'

export default class AddUser extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            text:'',
        }

        this.handleText = this.handleText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                text:'',
            })
        });
    }

    handleText(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        if(this.props.chat.group){
            this.props.socket.emit('addToChat', {name:this.state.text, chatID:this.props.chat.id});
        }
        else{
            alert('Only Avaliable to Group Chats');
        }
    }
    
    render() {
        return (
                // Add User Mode
                <form style={{margin:0,padding:0}}>
                    <div className="modal-body" id='modalBody'>                       
                        <h6>User Name</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleText} value={this.state.text}></input>
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                    </div>
                </form>
        )
    }
}
