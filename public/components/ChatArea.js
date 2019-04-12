import React, {Component} from 'react';
import TopBar from './ChatArea/TopBar'
import Messages from './ChatArea/Messages'
import Controls from './ChatArea/Controls';


export default class ChatArea extends Component {
    constructor(props) {
        super(props)

        this.messages = [];
        
        this.state = {
            dragOver: false,
            uploading: false,
            chat: props.chat,
            messages:[],
            searchTerm:'',
            chatHeight: 0,
            fontSize: 14,
            font: 'Helvetica',
            fontColour: 'black',
            myBubbleColour: 'Blue',
            otherBubbleColour: 'darkGrey',
            bgColour: 'white',
        };

        this.onMessage = this.onMessage.bind(this);
        this.filterMessages = this.filterMessages.bind(this);
        this.updateChatHeight = this.updateChatHeight.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
        this.getStyle = this.getStyle.bind(this);
        this.handleOnDragEnter = this.handleOnDragEnter.bind(this);
        this.handleOnDragLeave = this.handleOnDragLeave.bind(this);
        this.handleOnDrop = this.handleOnDrop.bind(this);
        this.handlePreventDefault = this.handlePreventDefault.bind(this);

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
            const {fontSize,font,fontColour,myBubbleColour,otherBubbleColour, bgColour} = style;
            this.setState({fontSize,font,fontColour,myBubbleColour,otherBubbleColour, bgColour});
        }else{
            // Set to default state if style is not found
            this.setState({
                    fontSize: 14,
                    font: 'Helvetica',
                    fontColour: 'black',
                    myBubbleColour: 'Blue',
                    otherBubbleColour: 'darkGrey',
                    bgColour: 'white',
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
        const controlsHeight = $('#chat-controls').outerHeight(true);

        const chatHeight = windowHeight - topBarHeight - controlsHeight + 'px';
        this.setState({chatHeight})
    }

    onMessage(message, type = null){
        const {id:userID, name:userName} =this.props.user;
        this.props.socket.emit('message', {chat : this.props.chat, msg : {userID, userName, message, type}});
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
            chosenBgColour:this.state.bgColour,
        }
    }
    
    handleOnDrop(e){
        e.preventDefault();
        this.setState({uploading:true});
        let fileList = e.dataTransfer.files;
        // console.log('eDropped');
        // Upload files to catbox.moe. Files are stored for 30 days with size limit of 100MB.
        // Images can then be retrieved and displayed exactly like Giphy GIFs.
        // console.log(e.dataTransfer.items, e.dataTransfer.files);
        const exts = ['jpg', 'jpeg', 'png', 'gif'];
        const url = 'https://cors-anywhere.herokuapp.com/https://catbox.moe/user/api.php';
        Object.keys(fileList).forEach(fileIndex => {
            let file = fileList[fileIndex];
            // console.log(file);
            // Upload File
            let http = new XMLHttpRequest();
            let formData = new FormData();
            // console.log(file);
            formData.append('reqtype', 'fileupload');
            formData.append('fileToUpload', file);
            http.open('POST', url, true);

            http.onreadystatechange = () => {
                if (http.readyState == 4 && http.status == 200) {
                    const res = http.responseText;
                    if (exts.some((ext) => file.type.endsWith(ext))) {
                    let reader = new FileReader();
                    reader.onload = () => {
                        let image = new Image();
                        image.onload = () => {
                        this.onMessage(`${Math.min(image.height, 720)},${res}`, 'GIF');
                        this.setState({uploading:false});
                        this.setState({dragOver:false});
                        }
                        image.src = reader.result;
                    }
                    reader.readAsDataURL(file);
                    } else {
                    this.onMessage(`${file.name},${file.type},${res}`, 'FILE');
                    this.setState({uploading:false});
                    this.setState({dragOver:false});
                    // console.log('File was not an image, sending link to arbitrary file.');
                    }
                } else {
                    this.setState({uploading:false});
                    this.setState({dragOver:false});
                    // console.log('File upload failed', http.status);
                }
            };
            http.send(formData);
        });
    }

    handleOnDragEnter(e){
        console.log('dragEnter');
        // e.preventDefault();
        this.setState({dragOver:true});
    }

    handleOnDragLeave(e){
        console.log('dragLeave');
        // e.preventDefault();
        this.setState({dragOver:false});
    }

    handlePreventDefault(e){
        e.preventDefault();
    }

    render() {
        let overlayStyle = {
            width: '100%',
            height: '100%',
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(173,216,230,0.5)',
            display:'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '20px dashed lightblue',
            borderRadius: '5%',
        }
        return (
            <div className={this.props.className} id={this.props.id} onDragEnter={this.handleOnDragEnter}>
                <TopBar  id='chat-topBar' className='row' chat={this.state.chat} user={this.props.user} socket={this.props.socket} modal={this.props.modal} filterMessages={this.filterMessages} getStyle={this.getStyle}/>
                <Messages ref={this.messageRef} className='row' id='chat-messages' messages={this.state.messages} chat={this.state.chat} user={this.props.user} socket={this.props.socket} searchTerm={this.state.searchTerm} height={this.state.chatHeight} fontObj={{fontSize: this.state.fontSize, font: this.state.font, fontColour: this.state.fontColour}} bubbleColours={{myBubbleColour: this.state.myBubbleColour, otherBubbleColour: this.state.otherBubbleColour}} bgColour={this.state.bgColour}/>
                <Controls  id='chat-controls' className='row' onMessage={this.onMessage} chat={this.state.chat} />
                { this.state.dragOver ? 
                    <div style={overlayStyle} onDragLeave={this.handleOnDragLeave} onDrop={this.handleOnDrop} onDrag={this.handlePreventDefault} onDragOver={this.handlePreventDefault}>
                        {this.state.uploading ?
                            <div>
                                <div className="spinner-border text-info" role="status">
                                    <span class="sr-only">Loading...</span>
                                </div>
                                <h1 className='text-info' style={{display:'inline'}}> Uploading...</h1>
                            </div>
                        :
                            <h1 className='text-info' style={{pointerEvents:'none'}}><i class="fas fa-upload"></i> Drop File To Upload</h1>
                        }
                        
                    </div>
                :''}
            </div>
        )
    }
}