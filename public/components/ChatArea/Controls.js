import React, {Component} from 'react';
import { UncontrolledPopover } from 'reactstrap';
import EmojiPicker from 'emoji-picker-react';
import Picker from 'react-giphy-component';
import Dropzone from 'react-dropzone';

export default class Controls extends Component {
    constructor(props) {
        super(props)
	
        this.state = {
            text:'',
	    uploading:false,
	    width: 0
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
	this.onDrop = this.onDrop.bind(this);
	this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }


    componentDidMount() {
	this.updateWindowDimensions();
	window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
	window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
	this.setState({ width: window.innerWidth });
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

    // Upload files to catbox.moe. Files are stored for 30 days with size limit of 100MB.
    // Images can then be retrieved and displayed exactly like Giphy GIFs.
    onDrop(files) {
	this.setState({uploading:true});
	
	const exts = ['jpg', 'jpeg', 'png', 'gif'];
	const url = 'https://cors-anywhere.herokuapp.com/https://catbox.moe/user/api.php';
	files.forEach(file => {
	    let http = new XMLHttpRequest();
	    let formData = new FormData();
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
				this.props.onMessage(`${Math.max(image.height, 720)},${res}`, 'GIF');
				this.setState({uploading:false});
			    }
			    image.src = reader.result;
			}
			reader.readAsDataURL(file);
		    } else {
			this.props.onMessage(`${file.name},${file.type},${res}`, 'FILE');
			this.setState({uploading:false});
			console.log('File was not an image, sending link to arbitrary file.');
		    }
		} else {
		    this.setState({uploading:false});
		    console.log('File upload failed', http.status);
		}
	    };
	    http.send(formData);
	});
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
			       <span id={`control_${this.props.chat.id}_emojiPicker`} className='btn btn-outline-primary' onClick={this.handleClick} style={{fontSize:23}}><i className='fas fa-smile'></i></span>
			       <span id={`control_${this.props.chat.id}_GifPicker`} className='btn btn-outline-primary' onClick={this.handleClick}>GIF</span>
			   </div>
		           <Dropzone onDrop={this.onDrop}>
			       {({getRootProps, getInputProps}) => (
				   <span {...getRootProps({className: 'dropzone'})}>
				       <input {...getInputProps} ref={this.textInput} type="text" className='form-control' onChange={this.handleTextChange} value={this.state.text} placeholder={this.state.uploading ? "Uploading file..." : (deadChat ? "Other user has left" : "Type a message or drop a file...")} disabled={deadChat || this.state.uploading} style={{width: (this.state.width*this.state.width*0.0002) + (this.state.width*0.35)}}/>
				   </span>
			       )}
			   </Dropzone>
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
