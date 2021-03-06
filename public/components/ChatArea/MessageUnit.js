import React, { Component } from 'react'

import { UncontrolledPopover } from 'reactstrap';

export default class MessageUnit extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message : props.message,
            popoverOpen : false,
            editMode : false,
            editMessage : props.message.message,
	    file: null,
            leaveCount : props.leaveCount,
        }

        this.endMessageRef = React.createRef();

        this.fmtDate = this.fmtDate.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleDislike = this.handleDislike.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleEditOnChange = this.handleEditOnChange.bind(this);

        this.togglePopover = this.togglePopover.bind(this);
        this.toggleEdit = this.toggleEdit.bind(this);

	this.getDownload = this.getDownload.bind(this);

    }

    fmtDate(date){
        const time = `${date.getHours() < 10 ? '0'+date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()}`;
        return `${date.toLocaleDateString()} ${time}`;
    }

    componentWillReceiveProps({message, searchTerm, leaveCount}){
        const msg = {...message};
        // Highlighting Text
        if(searchTerm){
            msg.message = msg.message.split(searchTerm).join(`<span style='background-color:yellow'>${searchTerm}</span>`);
        }
        this.setState({message:msg});
        this.setState({reactions: message.reactions});

        if(leaveCount != this.state.leaveCount){
            this.setState({popoverOpen:false});
            this.setState({leaveCount});
        }
    }

    handleLike(){
        const {date, userID, reactions} = this.state.message;
        this.props.socket.emit('messageReact', {chatID : this.props.chatID, userID, date, reactions, incReaction:'like'});
        this.setState({popoverOpen:false});
    }

    handleDislike(){
        const {date, userID, reactions} = this.state.message;
        this.props.socket.emit('messageReact', {chatID : this.props.chatID, userID, date, reactions, incReaction:'dislike'});
        this.setState({popoverOpen:false});
    }

    handleDelete(){
        const {date, userID} = this.state.message;
        this.props.socket.emit('messageDelete', {chatID : this.props.chatID, userID, date});
    }

    handleEdit(){
        const {date, userID} = this.state.message;
        // Message to be edited to
        let message = this.state.editMessage;
        this.props.socket.emit('messageEdit', {chatID : this.props.chatID, userID, date, message})
        this.toggleEdit();
    }

    handleEditOnChange(e){
        this.setState({editMessage:e.target.value});
    }

    togglePopover(){
        this.setState({popoverOpen: !this.state.popoverOpen});
    }

    toggleEdit(){
        !this.state.editMode && this.setState({editMessage:this.props.message.message});
        this.setState({editMode: !this.state.editMode});
    }

    getDownload(message){
        const [name, type, url] = message.split(',');
	console.log('Fetching file from: ', url);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://cors-anywhere.herokuapp.com/' + url, true);
	xhr.responseType = 'blob';
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4 && xhr.status == 200) {
		var uri = (window.webkitURL || window.URL).createObjectURL(xhr.response);
		this.setState({file: uri});
            }
        };

        xhr.send();
        return name;
    }

    render() {
        const {searchTerm, isSelf, index} = this.props;
        const {date, userName, userID, message, reactions, type} = this.state.message;
        const fontObj = this.props.fontObj;
        const bubbleColours = this.props.bubbleColours;
        const bubbleColoursConv = {
            darkGrey: 'alert-dark',
            White: 'alert-light',
            Grey: 'alert-secondary',
            Blue: 'alert-primary',
            Red: 'alert-danger',
            Green: 'alert-success',
            Yellow: 'alert-warning',
        };

        return (
        <div>
            <div id={`message_${this.props.chatID}_${index}`} className={`alert m-2 ${isSelf ? bubbleColoursConv[bubbleColours.myBubbleColour] : bubbleColoursConv[bubbleColours.otherBubbleColour]}`}>
                <div className='text-dark'>
                    <strong>{userName}&nbsp;&nbsp;</strong><small>{this.fmtDate(date)}</small>
                </div>
                { //Change to Edit Mode
                    this.state.editMode ?
                    <div>
                        <textarea className='form-control' onChange={this.handleEditOnChange} value={this.state.editMessage}></textarea>
                        <div className='btn-group input-group-lg'>
                            <button className='btn btn-outline-primary' onClick={this.handleEdit}><i className='fas fa-check'></i></button>
                            <button className='btn btn-outline-primary' onClick={this.toggleEdit}><i className='fas fa-times'></i></button>
                        </div>
                    </div>
                    :
                    <div style={{fontSize: fontObj.fontSize, fontFamily: fontObj.font, color: fontObj.fontColour}}>
                        {
                            type == 'GIF' ? 
                            <img height={message.split(',')[0]} style={{maxWidth: document.querySelector('#chat-messages').clientWidth - 100}} src={message.split(',')[1]}></img>
                            :(
                            type == 'FILE' ?
                                (this.state.file ? <span><i class="fas fa-file-download"></i> <a href={this.state.file} download={message.split(',')[0]}>{message.split(',')[0]}</a></span> : <span>Preparing file: <i>{this.getDownload(message)}...</i></span>)
                            :
                            (searchTerm ? <span dangerouslySetInnerHTML={{__html:message}}></span> : message))
                        }
                    </div> 
                }
                { // Show reaction div if there is a reaction
                    reactions ? 
                    <div>
                        <small style={{float: isSelf ? 'left' : 'right'}} className='mt-1'>
                            {reactions && reactions.like ? 
                                <span className='badge badge-pill badge-success'>{reactions.like} <i className='fas fa-thumbs-up'></i></span> 
                            : ''} {reactions && reactions.dislike ? 
                                <span className='badge badge-pill badge-danger'>{reactions.dislike} <i className='fas fa-thumbs-down'></i></span> 
                            : ''}
                        </small>
                    </div>
                    :
                    ''
                }
                <UncontrolledPopover trigger='legacy' isOpen={this.state.popoverOpen} toggle={this.togglePopover} placement="right" target={`message_${this.props.chatID}_${this.props.index}`}>
                    <div className='btn-group input-group-lg'>
                        <button className='btn btn-outline-primary' onClick={this.handleLike}><i className='fas fa-thumbs-up'></i></button>
                        <button className='btn btn-outline-primary' onClick={this.handleDislike}><i className='fas fa-thumbs-down'></i></button>
                        {/* Only addlow edit when message is text */}
                        {!type && isSelf ?
                            <button className={`btn ${this.state.editMode ? 'btn-primary' : 'btn-outline-primary'}`} onClick={this.toggleEdit} ><i className='fas fa-edit'></i></button>
                        : ''}
                        {isSelf ?
                            <button className='btn btn-outline-primary' onClick={this.handleDelete}><i className='fas fa-trash-alt'></i></button>
                        : ''}
                    </div>
                </UncontrolledPopover>
            </div>
        </div>
        )
    }
}
