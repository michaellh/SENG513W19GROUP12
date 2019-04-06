import React, {Component} from 'react';

export default class Controls extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }
        this.style = {
            //   position: 'absolute',
            //   bottom:'0',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.textInput = React.createRef();
    }

    componentDidUpdate(){
        // this.textInput.current.focus();
    }
    


    handleSubmit(e) {
        e.preventDefault();
        let input = e.target.querySelector('input');
        this.props.onMessage(input.value);
        input.value = '';
    }
    
    render() {
        const deadChat = !this.props.chat.group && this.props.chat.members.length <= 1;
        return (
            <div className={`${this.props.className} mt-2`} id={this.props.id} style={this.style}>
                <div className='col-12'>
                <form onSubmit={this.handleSubmit}>
                    <div className='input-group'>
                        <input ref={this.textInput} type="text" className='form-control' placeholder={deadChat ? "Other user has left" : "Type a message..."} disabled={deadChat}/>
                        <div className='input-group-append'>
                            <button className='btn btn-primary btn-lg'><i className='fas fa-paper-plane'></i></button>
                            <button className='btn btn-outline-primary'><i className='fas fa-smile'></i></button>
                            <button className='btn btn-outline-primary'>GIF</button>
                        </div>
                    </div>
                </form>
                </div>
            </div>
        )
    }
}