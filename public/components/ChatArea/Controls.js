import React, {Component} from 'react';
import { UncontrolledPopover } from 'reactstrap';
import EmojiPicker from 'emoji-picker-react';
import Picker from 'react-giphy-component';

export default class Controls extends Component {
    constructor(props) {
        super(props)
	
        this.state = {
            text:'',
        }
        this.style = {
            //   position: 'absolute',
            //   bottom:'0',
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.textInput = React.createRef();
        this.handleClick = this.handleClick.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.handleEmojiClick = this.handleEmojiClick.bind(this);
        this.handleGifClick = this.handleGifClick.bind(this);
	}
	
    componentDidUpdate(){
        // this.textInput.current.focus();
    }

    handleGifClick(gif){
        // console.log(gif);
        // this.props.onMessage(gif.downsized_large.url, 'GIF');
        this.props.onMessage(`${gif.downsized_medium.height},${gif.downsized_medium.url}`, 'GIF');
    }

    handleEmojiClick(emoji){
        this.setState({text : this.state.text + String.fromCodePoint(parseInt (emoji, 16)) });
    }

    handleTextChange(e){
        this.setState({text:e.target.value});
    }
    
    handleClick(e) {
        e.preventDefault();
    }

    handleSubmit(e) {
        e.preventDefault();
        this.state.text !== '' && this.props.onMessage(this.state.text);
        this.setState({text:''});
    }

    // Note that wrapping the <input> in the <Dropzone> messes with the width so we need to manually resize it.
    render() {
        const deadChat = !this.props.chat.group && this.props.chat.members.length <= 1;
        return (
	    <div className={`${this.props.className} mt-2`} id={this.props.id} style={this.style}>
	       <div className='col-12'>
		   <form onSubmit={this.handleSubmit}>
		       <div className='input-group'>
			   <div className='input-group-prepend'>
			       <span id={`control_${this.props.chat.id}_emojiPicker`} className='btn btn-outline-primary d-none d-md-block' onClick={this.handleClick} style={{fontSize:23}}><i className='fas fa-smile'></i></span>
			       <span id={`control_${this.props.chat.id}_GifPicker`} className='btn btn-outline-primary d-none d-md-block' onClick={this.handleClick}>GIF</span>
			   </div>
					<input ref={this.textInput} type="text" className='form-control' onChange={this.handleTextChange} value={this.state.text} placeholder={deadChat ? "Other user has left" : "Type a message or drop a file..."} disabled={deadChat}/>
					<div className='input-group-append'>
						<button type='submit' className='btn btn-primary btn-lg'><i className='fas fa-paper-plane'></i></button>
					</div>
					<UncontrolledPopover trigger='legacy' placement='top' target={`control_${this.props.chat.id}_emojiPicker`}>
						<EmojiPicker onEmojiClick={this.handleEmojiClick}/>
					</UncontrolledPopover>
					<UncontrolledPopover trigger='legacy' placement='top' target={`control_${this.props.chat.id}_GifPicker`}>
						<Picker onSelected={this.handleGifClick} />
					</UncontrolledPopover>
		       </div>
		   </form>
	       </div>
	   </div>
	)
    }
}
