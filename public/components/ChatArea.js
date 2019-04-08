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
            chatHeight: 0,
            fontSize: 14,
            font: 'Helvetica',
            fontColour: 'black',
            myBubbleColour: 'Blue',
            otherBubbleColour: 'darkGrey',
        };

        this.onMessage = this.onMessage.bind(this);
        this.filterMessages = this.filterMessages.bind(this);
        this.updateChatHeight = this.updateChatHeight.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getStyle = this.getStyle.bind(this);

        this.messageRef = React.createRef();

        this.props.socket.emit('reqHistory', this.props.chat.id);

        props.socket.on('message', ({chatID, message}) => {
            // console.log(message);
            if (chatID == this.state.chat.id){
                message.date = new Date(message.date);
                this.setState({messages : [...this.state.messages, message]});
                // console.log(this.state.chat.name + 'Got Here');
                this.scrollToBottom();
            }
        });

        props.socket.on('loadHistory', ({chatID, messages}) => {
            // console.log(messages);
            console.log(this.state.chatID, chatID);
            if (this.state.chat.id == chatID){
                messages.forEach(d => d.date = new Date(d.date));
                this.messages = messages;
                this.setState({messages});
                this.filterMessages(this.state.searchTerm);
                // If we are switching rooms
                if (this.props.switchRoom){
                    this.scrollToBottom();
                    this.props.updateSwitchRoom(false);
                }
            }
        });        
    }

    componentWillReceiveProps(props){
        // Only load messages for room change
        if(this.state.chat.id != props.chat.id){
            this.props.socket.emit('reqHistory', props.chat.id);
        }
        // Load Styles for the room
        let style = props.user.chats.find(({id}) => id == props.chat.id).style;
        if (style){
            const {fontSize,font,fontColour,myBubbleColour,otherBubbleColour} = style;
            this.setState({fontSize,font,fontColour,myBubbleColour,otherBubbleColour});
        }else{
            // Set to default state if style is not found
            this.setState({
                    fontSize: 14,
                    font: 'Helvetica',
                    fontColour: 'black',
                    myBubbleColour: 'Blue',
                    otherBubbleColour: 'darkGrey',
                });
        }
        // Update the chat propertys
        this.setState({chat:props.chat});
    }

    componentDidMount(){
        this.updateChatHeight();
        window.addEventListener('resize', this.updateChatHeight);
    }

    updateChatHeight(){
        const windowHeight = parseInt(window.innerHeight);     
        const topBarHeight = $('#chat-topBar').outerHeight(true);
        const controlsHeight = $('#chat-controls').outerHeight(true);;

        const chatHeight = windowHeight - topBarHeight - controlsHeight + 'px';
        this.setState({chatHeight})
    }

    onMessage(message){
        const {id:userID, name:userName} =this.props.user;
        this.props.socket.emit('message', {chat : this.props.chat, msg : {userID, userName, message}});
        // this.setState({messages : [...this.state.messages, message]});
    }

    scrollToBottom(){
        this.messageRef.current && this.messageRef.current.scrollToBottom();
    }

    filterMessages(searchTerm){
        this.setState({searchTerm});
        let messages = this.messages.filter(d => d.message.includes(searchTerm))
        this.setState({messages});
    }

    getStyle() {
        return {
            chosenFont:this.state.font,
            chosenFontColour:this.state.fontColour,
            chosenFontSize:this.state.fontSize,
            chosenMyBubbleColour:this.state.myBubbleColour,
            chosenOtherBubbleColour:this.state.otherBubbleColour,
        }
    }

    render() {
        return (
            <div className={this.props.className} id={this.props.id}>
                <TopBar  id='chat-topBar' className='row' chat={this.state.chat} user={this.props.user} socket={this.props.socket} modal={this.props.modal} filterMessages={this.filterMessages} getStyle={this.getStyle}/>
                <Messages ref={this.messageRef} className='row' id='chat-messages' messages={this.state.messages} chat={this.state.chat} user={this.props.user} socket={this.props.socket} searchTerm={this.state.searchTerm} height={this.state.chatHeight} fontObj={{fontSize: this.state.fontSize, font: this.state.font, fontColour: this.state.fontColour}} bubbleColours={{myBubbleColour: this.state.myBubbleColour, otherBubbleColour: this.state.otherBubbleColour}}/>
                <Controls  id='chat-controls' className='row' onMessage={this.onMessage} chat={this.state.chat} />
            </div>
        )
    }
}