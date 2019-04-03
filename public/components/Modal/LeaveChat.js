import React, { Component } from 'react'

export default class LeaveChat extends Component {
    constructor(props) {
        super(props)

        this.handleSubmit = this.handleSubmit.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                text:'',
            })
        });
    }


    handleSubmit(e) {
        //props.socket.emit('leaveChat', props.chat.id);
        this.props.socket.emit('leaveChat', this.props.chat);
    }
    
    render() {
        return (
                // Add User Mode
                <form style={{margin:0,padding:0}}>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-danger" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                    </div>
                </form>
        )
    }
}
