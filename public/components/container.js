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
    }

    chooseChat(name){
        this.setState({chatName: name});
        console.log(name);
    }
    
    render() {
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <SideArea className='col-2' chooseChat={this.chooseChat} />
                    <ChatArea className='col-10' chatName={this.state.chatName} />
                </div>
            </div>
        );
    }
}