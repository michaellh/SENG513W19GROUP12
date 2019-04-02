import React, {Component} from 'react';
import TopBar from './ChatArea/TopBar'
import Messages from './ChatArea/Messages'
import Controls from './ChatArea/Controls';


export default class ChatArea extends Component {
    constructor(props) {
        super(props)

        this.state = {
            chat: props.chat,
            messages:[]
        };
        
        this.style = {
            height: '100%',
            border: '2px solid black'
        };

        this.onMessage = this.onMessage.bind(this);

        this.props.socket.emit('reqHistory', this.props.chat.id);

        props.socket.on('message', msg => {
            // console.log(msg);
            this.setState({messages : [...this.state.messages, msg]});
        });

        props.socket.on('loadHistory', msg => {
            // console.log(msg);
            this.setState({messages : msg});
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
        this.props.socket.emit('message', {chat : this.props.chat, msg : {user: this.props.user, message}});
        // this.setState({messages : [...this.state.messages, message]});
    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                <div className='row' style={this.style}>
                    <TopBar className='col-12 align-self-start' chat={this.state.chat} socket={this.props.socket} modal={this.props.modal}/>
                    <Messages className='col-12 align-self-start' messages={this.state.messages} user={this.props.user} />
                    <Controls className='col-12 align-self-end' onMessage={this.onMessage} />
                </div>
            </div>
        )
    }
}