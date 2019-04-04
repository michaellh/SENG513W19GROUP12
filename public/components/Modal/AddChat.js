import React, { Component } from 'react'

export default class AddChat extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            mode : false,
            text:'',
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleText = this.handleText.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('hidden.bs.modal', (e) => {
            this.setState({mode : false});
        });
    }

    handleClick(e) {
        e.preventDefault();
        console.log(e.target.value);
        this.setState({mode: e.target.value, text:''});
    }

    handleText(e) {
        this.setState({text: e.target.value});
    }

    handleSubmit() {
        if(this.state.mode == 'single'){
            console.log('Single', this.state.text);
            this.props.socket.emit('createSingleChat', this.state.text);
        }
        else{
            this.props.socket.emit('createGroupChat', this.state.text);
        }
        // Reseting State
        // this.setState({
        //     mode : false,
        //     text:'',
        // })
        // this.props.socket.emit('addChat', '')
    }
    
    render() {
        return (
                !this.state.mode ? 
                // Selection Mode
                <form style={{margin:0,padding:0}}>
                    <div className="modal-body text-center" id='modalBody'>
                        <button className='btn btn-primary btn-block' onClick={this.handleClick} value='single'>Create One on One Chat</button>
                        <br />
                        <button className='btn btn-secondary btn-block' onClick={this.handleClick} value='group'>Create Group Chat</button>
                    </div>
                </form>
                :
                // Individual Form Mode
                <form style={{margin:0,padding:0}}>
                    <div className="modal-body" id='modalBody'>
                        {
                            this.state.mode == 'single' ?
                            // Adding User
                            <div>
                                <h6>User Name</h6>
                                <input type='text' className='form-control' autoFocus={true} onChange={this.handleText} value={this.state.text}></input>
                            </div> 
                            :
                            // Adding Group
                            <div>
                                <h6>Chat Name</h6>
                                <input type='text' className='form-control' autoFocus={true} onChange={this.handleText} value={this.state.text}></input>
                            </div>
                        }
                    </div>
                    <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                    </div>
                </form>
        )
    }
}
