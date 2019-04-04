import React, {Component} from 'react';
import TopBar from './ChatArea/TopBar'
import Messages from './ChatArea/Messages'
import Controls from './ChatArea/Controls';


export default class ChatArea extends Component {
    constructor(props) {
        super(props)

        this.messages = [];
        
        this.state = {
            chat: props.chat,
            messages:[],
            searchTerm:'',
        };

        this.onMessage = this.onMessage.bind(this);
        this.filterMessages = this.filterMessages.bind(this);

        this.props.socket.emit('reqHistory', this.props.chat.id);

        props.socket.on('message', msg => {
            // console.log(msg);
            msg.date = new Date(msg.date);
            this.setState({messages : [...this.state.messages, msg]});
        });

        props.socket.on('loadHistory', messages => {
            // console.log(msg);
            messages.forEach(d => d.date = new Date(d.date));
            this.messages = messages;
            this.setState({messages});
            this.filterMessages(this.state.searchTerm);
        });        
    }

    componentWillReceiveProps(newProp){
        // console.log(newProp.chat);
        if(this.state.chat.id != newProp.chat.id){
            this.setState({chat:newProp.chat});
            this.props.socket.emit('reqHistory', newProp.chat.id);
        }
    }

    onMessage(message){
        const {id:userID, name:userName} =this.props.user;
        this.props.socket.emit('message', {chat : this.props.chat, msg : {userID, userName, message}});
        // this.setState({messages : [...this.state.messages, message]});
    }

    filterMessages(searchTerm){
        this.setState({searchTerm});
        let messages = this.messages.filter(d => d.message.includes(searchTerm));
        this.setState({messages});
    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                    <TopBar className='row' chat={this.state.chat} user={this.props.user} socket={this.props.socket} modal={this.props.modal} filterMessages={this.filterMessages}/>
                    <Messages className='row' messages={this.state.messages} chat={this.state.chat} user={this.props.user} socket={this.props.socket} id='messages'/>
                    <Controls className='row' onMessage={this.onMessage} chat={this.state.chat} />
            </div>
        )
    }
}