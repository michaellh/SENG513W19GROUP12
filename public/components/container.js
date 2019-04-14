import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';
import Modal from './Modal';
import Toast from './Toast';

export default class Container extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            user : null,
            chat : null,
            modal : {title: 'Title', component: 'component', custom: false},
            switchRoom : false,
            splitScreen : false,
            chat2 : null,
            notification : true,
        }

        this.chooseChat = this.chooseChat.bind(this);
        this.openModal = this.openModal.bind(this);
        this.updateUser = this.updateUser.bind(this);
        this.updateSwitchRoom = this.updateSwitchRoom.bind(this);
        this.toggleSplitScreen = this.toggleSplitScreen.bind(this);
        this.toggleNotification = this.toggleNotification.bind(this);
        this.resetChat = this.resetChat.bind(this);
        
        this.chatAreaRef = React.createRef();
        // 
        // this.socket = io("http://localhost:3000");
        this.socket = io();
        // Debuging function
        this.socket.on('debug', message => console.log('DEBUG', message));
        this.socket.emit('debug', 'sendback("Hello")');
        
        this.socket.on('userInfo', user => {
            this.setState({user});
            console.log(user);
        });

        this.socket.on('chatInfo', chat => {
            if (this.state.splitScreen){
                // Depending on which one is empty, set to that one
                if (!this.state.chat) {
                    this.setState({chat});
                }
                else if (!this.state.chat2){
                    this.setState({chat2:chat})
                }
            }else{
                this.setState({chat});
            }
            //console.log(chat);
        });

        this.socket.on('chatInfoUpdate', chat => {
            // Updating chat Info for delete chat, and chat renames
            if (this.state.chat && this.state.chat.id == chat.id){
                this.setState({chat});
            }
            if (this.state.chat2 && this.state.chat2.id == chat.id){
                this.setState({chat2:chat});
            }
        });

        this.socket.on('notification', notifications => {
            // console.log('gotNotification');
            let user = {...this.state.user};
            user.notifications = notifications;
            this.setState({user});
        });

        this.socket.on('resetChat', chatID => {
            console.log('resetChatGot')
            // Only reset chat if we are on it
            if (this.state.chat && this.state.chat.id == chatID){
                console.log('actual reset Chat')
                this.resetChat(1);
            }
            if (this.state.chat2 && this.state.chat2.id == chatID){
                console.log('actual reset Chat')
                this.resetChat(2);
            }
        });
        // this.socket.emit('joinRoom', this.state.chatName);
    }

    updateUser(user){
        this.setState({user});
    }

    updateSwitchRoom(switchRoom){
        this.setState({switchRoom})
    }

    chooseChat(chat){
        // console.log(chat);
        if (this.state.splitScreen){
            // If both chats are occupied, we don't choose chats
            if (!this.state.chat || !this.state.chat2){
                this.socket.emit('reqChatInfo', chat.id);
                this.socket.emit('joinRoom', chat.id);
                this.socket.emit('resetUnread', chat.id);
                this.setState({switchRoom:true});
            }else{
                let user = this.state.user;
                const notification = {
                    title: 'Chat Area Full',
                    message: `Please close one of open the chat before trying again`,
                    color: 'lightpink',
                }
                this.socket.emit('notifySelf', notification);
                this.setState({user});
            }
        }
        else{
            this.state.chat && this.socket.emit('leaveRoom', this.state.chat.id);
            this.socket.emit('reqChatInfo', chat.id);
            this.socket.emit('joinRoom', chat.id);
            this.socket.emit('resetUnread', chat.id);
            this.setState({switchRoom:true});
        }
        // console.log(this.state.chat);
        // this.setState({chat: chat});
        // console.log(chat);
    }

    toggleSplitScreen(splitScreen){
        this.setState({splitScreen});
    }

    toggleNotification(notification){
        this.setState({notification});
        // notification && this.setState({user:this.state.user});
    }

    resetChat(num){
        if (num == 1){
            this.state.chat && this.socket.emit('leaveRoom', this.state.chat.id);
            this.setState({chat:null});
        }
        else{
            this.state.chat2 && this.socket.emit('leaveRoom', this.state.chat2.id);
            this.setState({chat2:null});
        }
    }

    openModal(title, component, custom = false){
        this.setState({modal: {title, component, custom}});
        $('#myModal').modal();
    }
    
    render() {
        return (
            <div className='container-fluid h-100'>
                <div className='row'>
                    <div className='col-md-3 col-lg-2' id='side-area'>
                        <nav className='navbar navbar-expand-md' style={{padding:0,margin:0}}>
                            <span class="navbar-brand d-md-none">NetChatter</span>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                                <i className='fas fa-bars'></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarToggler">
                            <SideArea className='' id='' updateUser={this.updateUser} user={this.state.user} socket={this.socket} modal={this.openModal} 
                                chooseChat={this.chooseChat} chosenChat={[this.state.chat,this.state.chat2]} resetChat={this.resetChat} 
                                toggleSplitScreen={this.toggleSplitScreen} toggleNotification={this.toggleNotification} 
                                splitScreenState={this.state.splitScreen} notificationState={this.state.notification}/>
                            </div>
                        </nav>
                    </div>
                    {this.state.splitScreen ? 
                        (
                            <div className='col-md-9 col-lg-10'>
                                <div className='row  h-100'>
                                    {
                                        this.state.chat ? 
                                        <ChatArea split={1} className='col-6' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.state.user} modal={this.openModal} switchRoom={this.state.switchRoom} updateSwitchRoom={this.updateSwitchRoom} />
                                        :
                                        <h1 className='col text-center align-self-center'>Open a chat...</h1>
                                    }
                                    {
                                        this.state.chat2 ? 
                                        <ChatArea split={2} className='col-6' id='chat-area' chat={this.state.chat2} socket={this.socket} user={this.state.user} modal={this.openModal} switchRoom={this.state.switchRoom} updateSwitchRoom={this.updateSwitchRoom} />
                                        :
                                        <h1 className='col text-center align-self-center'>Open a chat...</h1>
                                    }
                                </div>
                            </div>
                        )
                        :
                        (
                            this.state.chat ? 
                            <ChatArea split={1} className='col-md-9 col-lg-10' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.state.user} modal={this.openModal} switchRoom={this.state.switchRoom} updateSwitchRoom={this.updateSwitchRoom} />
                            :
                            <h1 className='col-md-9 col-lg-10 text-center align-self-center'>Open a chat...</h1>
                        )
                    
                    }
                    {/* {
                        this.state.chat ? 
                        <ChatArea className='col-10' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.state.user} modal={this.openModal} switchRoom={this.state.switchRoom} updateSwitchRoom={this.updateSwitchRoom} />
                        :
                        <h1 className='col-10 text-center align-self-center'>Open a chat...</h1>
                    } */}
                    
                    <Modal modal={this.state.modal} />
                    {this.state.notification ? <Toast user={this.state.user} socket={this.socket} /> : ''}
                </div>
            </div>
        );
    }
}