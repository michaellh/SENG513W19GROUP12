import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';

export default class Container extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            chatName : 'Chat1',   
        }

        this.chooseChat = this.chooseChat.bind(this);
        
        this.socket = io("http://localhost:3000");
        // Debuging function
        this.socket.on('debug', message => console.log('DEBUG', message));
        this.socket.emit('debug', 'sendback("Hello")');
        this.socket.emit('joinRoom', this.state.chatName);
    }

    chooseChat(name){
        this.socket.emit('leaveRoom', this.state.chatName);
        this.setState({chatName: name});
        this.socket.emit('joinRoom', name);
        console.log(name);
    }
    
    render() {
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <SideArea className='col-2' chooseChat={this.chooseChat} />
                    <ChatArea className='col-10' chatName={this.state.chatName} socket={this.socket} user={this.props.user}/>
                </div>
            </div>
        );
    }
}