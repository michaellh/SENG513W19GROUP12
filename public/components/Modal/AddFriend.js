import React, { Component } from 'react'

export default class AddFriend extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
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
        this.props.socket.emit('addFriend', this.state.text);
    }
    
    render() {
        return (
            <form style={{margin:0,padding:0}}>
                <div className="modal-body" id='modalBody'>
                    <div>
                        <h6>Friend Name</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleText} value={this.state.text}></input>
                    </div> 
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                </div>
            </form>
        )
    }
}
