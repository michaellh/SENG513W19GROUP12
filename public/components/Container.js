import React, {Component} from 'react';
import ChatArea from './ChatArea';
import SideArea from './SideArea';
import Modal from './Modal';
import { Redirect } from 'react-router';
import Toast from './Toast';

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default class Container extends Component {
    constructor(props) {
        super(props)

        this.state = {
            redirect: true,
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
        this.logout = this.logout.bind(this);


        this.chatAreaRef = React.createRef();

        var jwt = getCookie('token');
        if (jwt) {
            this.state.redirect = false;
            this.socket = io();
            this.socket.on('connect',  () => {
                this.socket.emit('authenticate', {token: jwt}) //send the jwt
                .on('authenticated', () => {
                  this.socket.on('userInfo', user => {
                      this.setState({user});
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
                      let user = {...this.state.user};
                      user.notifications = notifications;
                      this.setState({user});
                  });

                  this.socket.on('resetChat', chatID => {
                      // Only reset chat if we are on it
                      if (this.state.chat && this.state.chat.id == chatID){
                          this.resetChat(1);
                      }
                      if (this.state.chat2 && this.state.chat2.id == chatID){
                          this.resetChat(2);
                      }
                  });
                })
                .on('unauthorized', (msg) => {
                  this.setState({ redirect: true });
                  throw new Error(msg.data.type);
                })
            });
        }
    }

    updateUser(user){
        this.setState({user});
    }

    updateSwitchRoom(switchRoom){
        this.setState({switchRoom})
    }

    chooseChat(chat){
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
    }

    toggleSplitScreen(splitScreen){
        this.setState({splitScreen});
    }

    toggleNotification(notification){
        this.setState({notification});
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

    logout(){
        document.cookie = `token=""`;
        this.setState({redirect:true});
    }

    render() {
        if (this.state.loading) {
            return null;
        }
        if (this.state.redirect){
            return <Redirect to='/login' />;
        }
        return (
            <div className='container-fluid h-100'>
                <div className='row'>
                    <div className='col-md-3 col-xl-2' id='side-area'>
                        <nav className='navbar navbar-expand-md' style={{padding:0,margin:0}}>
                            <span class="navbar-brand d-md-none">NetChatter</span>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggler" aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                                <i className='fas fa-bars'></i>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarToggler">
                            <SideArea updateUser={this.updateUser} user={this.state.user} socket={this.socket} modal={this.openModal} 
                                chooseChat={this.chooseChat} chosenChat={[this.state.chat,this.state.chat2]} resetChat={this.resetChat} 
                                toggleSplitScreen={this.toggleSplitScreen} toggleNotification={this.toggleNotification} 
                                splitScreenState={this.state.splitScreen} notificationState={this.state.notification} logout={this.logout}/>
                            </div>
                        </nav>
                    </div>
                    {this.state.splitScreen ? 
                        (
                            <div className='col-md-9 col-xl-10'>
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
                            <ChatArea split={1} className='col-md-9 col-xl-10' id='chat-area' chat={this.state.chat} socket={this.socket} user={this.state.user} modal={this.openModal} switchRoom={this.state.switchRoom} updateSwitchRoom={this.updateSwitchRoom} />
                            :
                            <h1 className='col-md-9 col-xl-10 text-center align-self-center'>Open a chat...</h1>
                        )

                    }
                    <Modal modal={this.state.modal} />
                    {this.state.notification ? <Toast user={this.state.user} socket={this.socket} /> : ''}
                </div>
            </div>
        );
    }
}
