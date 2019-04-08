import React, { Component } from 'react'
import MessageUnit from './MessageUnit';

export default class Messages extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            
        }

        this.endMessageRef = React.createRef();
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }

    scrollToBottom(){
        this.endMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    render() {
        const messages = this.props.messages.map((message,i) => {
            const isSelf = message.userID == this.props.user.id;
            return (
                <div key={i} className={`row ${isSelf ? 'justify-content-end' : 'justify-content-start'}`} style={{textAlign: isSelf ? 'right':'left'}}>
                    <MessageUnit socket={this.props.socket} chatID={this.props.chat.id} searchTerm={this.props.searchTerm} message={message} isSelf={isSelf} index={i} fontObj={this.props.fontObj}/>
                </div>
            )
        });

        return (
            <div className={this.props.className} id={this.props.id} style={{height:this.props.height}}>
                <div className='col-12'>
                    {messages}
                    <div ref={this.endMessageRef}></div>
                </div>
            </div>
        )
    }
}
