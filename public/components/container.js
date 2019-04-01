import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';
import Modal from './Modal';

export default class Container extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            chat : {id:'1',name:'chat1'},
            modal: {title: 'Title', body: 'body', submit: null, fullCustom: false}   
        }

        this.chooseChat = this.chooseChat.bind(this);
        this.openModal = this.openModal.bind(this);
        
        this.socket = io("http://localhost:3000");
        // this.socket = io();
        // Debuging function
        this.socket.on('debug', message => console.log('DEBUG', message));
        this.socket.emit('debug', 'sendback("Hello")');
        // this.socket.emit('joinRoom', this.state.chatName);
    }

    chooseChat(chat){
        this.socket.emit('leaveRoom', this.state.chat);
        this.setState({chat: chat});
        this.socket.emit('joinRoom', chat);
        console.log(chat);
    }

    openModal(title, body, submit, fullCustom = false){
        this.setState({modal: {title, body, submit, fullCustom}});
        $('#myModal').modal();
    }
    
    render() {
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <SideArea className='col-2' chooseChat={this.chooseChat} socket={this.socket} modal={this.openModal}/>
                    <ChatArea className='col-10' chat={this.state.chat} socket={this.socket} user={this.props.user} />
                    <Modal modal={this.state.modal}/>
                </div>
            </div>
        );
    }
}