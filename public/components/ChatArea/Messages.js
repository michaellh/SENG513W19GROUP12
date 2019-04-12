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
        const bgColourConv = {
            White: '#ffffff',
            Black: '#262626',
            Grey: '#b3b3b3',
            Red: '#dc3545',
            Blue:  '#007bff',
            Green: '#28a745',
            Purple: '#6f42c1',
            Yellow: '#ffff99',
            Orange: '#fd7e14',
        }
        const messages = this.props.messages.map((message,i) => {
            const isSelf = message.userID == this.props.user.id;
            return (
                <div key={i} className={`row ${isSelf ? 'justify-content-end' : 'justify-content-start'}`} style={{textAlign: isSelf ? 'right':'left'}}>
                    <MessageUnit socket={this.props.socket} chatID={this.props.chat.id} searchTerm={this.props.searchTerm} message={message} isSelf={isSelf} index={i} fontObj={this.props.fontObj} bubbleColours={this.props.bubbleColours}/>
                </div>
            )
        });

        let style = {
            height:this.props.height,
        }
        if (this.props.bgColour != 'image' && this.props.bgColour != 'imageURL'){
            style.background = bgColourConv[this.props.bgColour];
        }else{
            style.backgroundImage = `url(${this.props.bgImage})`;
            style.backgroundRepeat = 'no-repeat';
            style.backgroundSize = '100% 100%';
        }
        return (
            <div className={this.props.className} id={this.props.id} style={style}>
                <div className='col-12'>
                    {messages}
                    <div ref={this.endMessageRef}></div>
                </div>
            </div>
        )
    }
}
