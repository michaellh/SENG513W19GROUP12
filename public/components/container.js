import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';
import Modal from './Modal';

export default class Container extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            chat : null,
            modal: {title: 'Title', component: 'component', custom: false}   
        }

        this.chooseChat = this.chooseChat.bind(this);
        this.openModal = this.openModal.bind(this);
        
        this.socket = io("http://localhost:3000");
        // this.socket = io();
        // Debuging function
        this.socket.on('debug', message => console.log('DEBUG', message));
        this.socket.emit('debug', 'sendback("Hello")');
        this.socket.on('chatInfo', chat => {
            this.setState({chat});
            console.log(chat);
        });
        // this.socket.emit('joinRoom', this.state.chatName);
    }

    chooseChat(chat){
        this.state.chat && this.socket.emit('leaveRoom', this.state.chat);
        this.socket.emit('reqChatInfo', chat.id);
        this.socket.emit('joinRoom', chat);
        // this.setState({chat: chat});
        // console.log(chat);
    }

    openModal(title, component, custom = false){
        this.setState({modal: {title, component, custom}});
        $('#myModal').modal();
    }
    
    render() {
        return (
            <div className='container-fluid h-100'>
                <div className='row h-100'>
                    <SideArea className='col-2' id='side-area' chooseChat={this.chooseChat} socket={this.socket} modal={this.openModal}/>
                    {
                        this.state.chat ? 
                        <ChatArea className='col-10' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.props.user} modal={this.openModal}/>
                        :
                        <h1 className='col-10 text-center align-self-center'>You have no chats...</h1>
                    }
                    <Modal modal={this.state.modal}/>
                </div>
            </div>
        );
    }
}