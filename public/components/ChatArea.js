import React, {Component} from 'react';
import TopBar from './TopBar'
import Messages from './Messages'
import Controls from './Controls';


export default class ChatArea extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages:[]
        }

        this.onMessage = this.onMessage.bind(this);
    }
    
    onMessage(message){
        this.setState({messages : [...this.state.messages, message]});
    }

    render() {
        return (
            <div className={this.props.className}>
                <TopBar />
                <Messages messages={this.state.messages} />
                <Controls onMessage={this.onMessage}/>
            </div>
        )
    }
}