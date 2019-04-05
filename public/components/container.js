import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';
import Modal from './Modal';

export default class Container extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            user : null,
            chat : null,
            modal: {title: 'Title', component: 'component', custom: false}   
        }

        this.chooseChat = this.chooseChat.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateUser = this.updateUser.bind(this);
        
        // 
        this.socket = io("http://localhost:3000");
        // this.socket = io();
        // Debuging function
        this.socket.on('debug', message => console.log('DEBUG', message));
        this.socket.emit('debug', 'sendback("Hello")');
        
        this.socket.on('userInfo', user => {
            this.setState({user});
            console.log(user);
        });

        this.socket.on('chatInfo', chat => {
            this.setState({chat});
            //console.log(chat);
        });

        this.socket.on('chatInfoUpdate', chat => {
            // Updating chat Info for delete chat, and chat renames
            if (this.state.chat && this.state.chat.id == chat.id){
                this.setState({chat});
            }
        });

        this.socket.on('resetChat', chatID => {
            console.log('resetChatGot')
            // Only reset chat if we are on it
            if (this.state.chat && this.state.chat.id == chatID){
                console.log('actual reset Chat')
                this.state.chat && this.socket.emit('leaveRoom', this.state.chat);
                this.setState({chat:null});
            }
        });
        // this.socket.emit('joinRoom', this.state.chatName);
    }

    updateUser(user){
        this.setState({user});
    }

    chooseChat(chat){
        // console.log(chat);
        this.state.chat && this.socket.emit('leaveRoom', this.state.chat);
        this.socket.emit('reqChatInfo', chat.id);
        this.socket.emit('joinRoom', chat);
        // console.log(this.state.chat);
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
                    <SideArea className='col-2' id='side-area' updateUser={this.updateUser} user={this.state.user} chooseChat={this.chooseChat} socket={this.socket} modal={this.openModal} chosenChat={this.state.chat}/>
                    {
                        this.state.chat ? 
                        <ChatArea className='col-10' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.state.user} modal={this.openModal}/>
                        :
                        <h1 className='col-10 text-center align-self-center'>You have no chats...</h1>
                    }
                    <Modal modal={this.state.modal}/>
                </div>
            </div>
        );
    }
}