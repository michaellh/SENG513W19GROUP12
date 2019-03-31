import React, {Component} from 'react';
import TopBar from './ChatArea/TopBar'
import Messages from './ChatArea/Messages'
import Controls from './ChatArea/Controls';
import socket from '../script/main';


export default class ChatArea extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: props.chatName,
            messages:[]
        };
        
        this.style = {
            height: '100%',
            border: '2px solid black'
        };

        this.onMessage = this.onMessage.bind(this);

        props.socket.on('message', msg => {
            console.log(msg);
            this.setState({messages : [...this.state.messages, msg]});
        });

        props.socket.on('loadHistory', msg => {
            console.log(msg);
            this.setState({messages : msg});
        });        
    }

    componentWillReceiveProps(newProp){
        this.setState({name:newProp.chatName});
        this.props.socket.emit('reqHistory', newProp.chatName);
    }

    onMessage(message){
        this.props.socket.emit('message', {room : this.props.chatName, msg : {user: this.props.user, message}});
        // this.setState({messages : [...this.state.messages, message]});
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className='row' style={this.style}>
                    <TopBar className='col-12 align-self-start' name={this.state.name}/>
                    <Messages className='col-12 align-self-start' messages={this.state.messages} user={this.props.user} />
                    <Controls className='col-12 align-self-end' onMessage={this.onMessage} />
                </div>
            </div>
        )
    }
}