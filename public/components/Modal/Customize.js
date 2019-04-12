import React, { Component } from 'react'

export default class Customize extends Component{
    constructor(props) {
        super(props)

        const {chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour, bgImage, bgFilename} = props.getStyle();

        this.state = {
            uploading: false,
            chosenFontSize,
            chosenFont,
            chosenFontColour,
            chosenMyBubbleColour,
            chosenOtherBubbleColour,
            chosenBgColour,
            chatName:'',
            bgImage,
            bgFilename,
        }

        this.setFontSize = this.setFontSize.bind(this);
        this.setFont = this.setFont.bind(this);
        this.setFontColour = this.setFontColour.bind(this);
        this.setBgColour = this.setBgColour.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDeleteChat = this.handleDeleteChat.bind(this);
        this.setMyBubbleColour = this.setMyBubbleColour.bind(this);
        this.setOtherBubbleColour = this.setOtherBubbleColour.bind(this);
        this.handleChatNameChange = this.handleChatNameChange.bind(this);
        this.handleBgImgChange = this.handleBgImgChange.bind(this);
        this.handleImgUpload = this.handleImgUpload.bind(this);
        
        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            let {chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour, bgImage, bgFilename} = props.getStyle();
            bgFilename = bgFilename == 'Failed' ? '' : bgFilename;
            this.setState({chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour, bgImage, bgFilename});
            this.setState({chatName:''});
        });
    }

    setFontSize(e){
        //console.log(e.target.value);
        this.setState({chosenFontSize: e.target.value});
    }

    setFont(e){
        this.setState({chosenFont: e.target.value});
    }

    setFontColour(e){
        this.setState({chosenFontColour: e.target.value});
    }

    setBgColour(e) {
        this.setState({chosenBgColour: e.target.value});
    }

    setMyBubbleColour(e) {
        this.setState({chosenMyBubbleColour: e.target.value});
    }

    setOtherBubbleColour(e) {
        this.setState({chosenOtherBubbleColour: e.target.value});
    }

    handleDeleteChat(e) {
        this.props.socket.emit('deleteChat', {chatID: this.props.chat.id, chatName: this.props.chatName});
    }

    handleChatNameChange(e){
        this.setState({chatName: e.target.value});
    }
    
    handleBgImgChange(e){
        this.setState({bgImage: e.target.value});
    }

    handleSave(e)  {  
        let style = {
            'fontSize': this.state.chosenFontSize,
            'font': this.state.chosenFont,
            'fontColour': this.state.chosenFontColour,
            'myBubbleColour': this.state.chosenMyBubbleColour,
            'otherBubbleColour': this.state.chosenOtherBubbleColour,
            'bgColour': this.state.chosenBgColour,
            'bgImage': this.state.bgImage,
            'bgFilename': this.state.bgFilename,
        }
        // Clear File Name if we switch to url
        if (style.bgColour == 'imageURL'){
            style.bgFilename = '';
        }
        console.log(style);
        this.props.socket.emit('setStyle',{userID: this.props.userID, chatID:this.props.chat.id, style});

        this.state.chatName && this.props.socket.emit('renameChat', {chat:this.props.chat, name: this.state.chatName});
    }

    handleImgUpload(e){
        let files = e.target.files;
        if (files.length){
            this.setState({uploading:true});
            let file = files['0'];
            this.setState({bgFilename: file.name});
            // setTimeout(() => this.setState({uploading:false}), 5000)
            
            const url = 'https://cors-anywhere.herokuapp.com/https://catbox.moe/user/api.php';
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
                     this.setState({uploading:false});
                     this.setState({bgFilename: file.name});
                     this.setState({bgImage:res});
                    //  console.log(res);
                 } else {
                    //  console.log('here');
                     this.setState({bgFilename:'Failed'});
                     this.setState({uploading:false});
                     // console.log('File upload failed', http.status);
                 }
             };
             http.send(formData);
 
        }else{
            this.setState({bgFilename:''});
        }
    }

    render() {
        const isAdmin = this.props.role == 'admin';
        const isGroup = this.props.chat.group;
        return (
            <div>
                <div className='modal-body' id='modalBody'>
                    <div className='row mb-2'>
                        <div className='form-group col-12'>
                            <label htmlFor='usr'>Chat Name:</label>
                            <div className='input-group'>
                                <input type='text' className='form-control' onChange={this.handleChatNameChange} value={this.state.chatName} placeholder={this.props.chatName} disabled={isGroup && !isAdmin}></input>
                            </div>
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel1'>Font Size:</label>
                            <select className='form-control' id='sel1' onChange={this.setFontSize} value={this.state.chosenFontSize}>
                                {/*<option value="" selected disabled hidden>{this.state.chosenFontSize}</option>*/}
                                <option value='12'>12</option>
                                <option value='14'>14</option>
                                <option value='16'>16</option>
                                <option value='18'>18</option>
                                <option value='20'>20</option>
                                <option value='22'>22</option>
                                <option value='24'>24</option>
                            </select>
                        </div> 
                        <div className='col-2'></div>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel2'>Font:</label>
                            <select className='form-control' id='sel2' onChange={this.setFont}  value={this.state.chosenFont}>
                                <option value='Helvetica'>Helvetica</option>
                                <option value='Arial'>Arial</option>
                                <option value='Times New Roman'>Times New Roman</option>
                                <option value='Georgia'>Georgia</option>
                                <option value='Courier New'>Courier New</option>
                                <option value='Lucida Console'>Lucida Console</option>
                            </select>
                        </div> 
                    </div>
                    <div className='row mb-2'>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel3'>Font Colour:</label>
                            <select className='form-control' id='sel3' onChange={this.setFontColour} value={this.state.chosenFontColour}>
                                <option value='Black'>Black</option>
                                <option value='White'>White</option>
                                <option value='Grey'>Grey</option>
                                <option value='Red'>Red</option>
                                <option value='Blue'>Blue</option>
                                <option value='Green'>Green</option>
                                <option value='Purple'>Purple</option>
                                <option value='Yellow'>Yellow</option>
                                <option value='Orange'>Orange</option>
                            </select>
                        </div> 
                        <div className='col-2'></div>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel4'>Background Colour:</label>
                            <select className='form-control' id='sel4' onChange={this.setBgColour}  value={this.state.chosenBgColour}>
                                <option value='White'>White</option>
                                <option value='Black'>Black</option>
                                <option value='Grey'>Grey</option>
                                <option value='Red'>Red</option>
                                <option value='Blue'>Blue</option>
                                <option value='Green'>Green</option>
                                <option value='Purple'>Purple</option>
                                <option value='Yellow'>Yellow</option>
                                <option value='Orange'>Orange</option>
                                <option className='text-info' value='image'>Image</option>
                                <option className='text-info' value='imageURL'>Image URL</option>
                            </select>
                        </div> 
                    </div>
                    <div className='row mb-2'>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel53'>My Bubble Colour:</label>
                            <select className='form-control' id='sel5' onChange={this.setMyBubbleColour} value={this.state.chosenMyBubbleColour}>
                                <option value='darkGrey'>Dark Grey</option>
                                <option value='White'>White</option>
                                <option value='Grey'>Grey</option>
                                <option value='Blue'>Blue</option>
                                <option value='Red'>Red</option>
                                <option value='Green'>Green</option>
                                <option value='Yellow'>Yellow</option>
                            </select>
                        </div>
                        <div className='col-2'></div>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel6'>Other Bubble Color:</label>
                            <select className='form-control' id='sel6' onChange={this.setOtherBubbleColour} value={this.state.chosenOtherBubbleColour}>
                                <option value='darkGrey'>Dark Grey</option>
                                <option value='White'>White</option>
                                <option value='Grey'>Grey</option>
                                <option value='Blue'>Blue</option>
                                <option value='Red'>Red</option>
                                <option value='Green'>Green</option>
                                <option value='Yellow'>Yellow</option>
                            </select>
                        </div>
                    </div>
                    { this.state.chosenBgColour == 'imageURL' ?
                        <div className='form-group col-12'>
                            <label >Background Image URL: </label>
                            <div className='input-group'>
                                <input type='text' className='form-control' onChange={this.handleBgImgChange} placeholder='Use Image URL' value={this.state.bgImage}></input>
                            </div>
                        </div>
                        :
                        this.state.chosenBgColour == 'image' ?
                        <div className='form-group col-12'>
                        <label >Background Image: </label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="inputGroupFileAddon01">{this.state.uploading ? <span><span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Uploading...</span> : 'Upload'}</span>
                                </div>
                                <div className="custom-file">
                                    <input type="file" onInput={this.handleImgUpload} accept="image/png, image/jpeg, image/gif" disabled={this.state.uploading} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                                    <label className="custom-file-label" htmlFor='inputGroupFileAddon01'>{this.state.bgFilename || 'Choose file'}</label>
                                </div>
                            </div>
                        </div>
                        :
                        ''
                    }
                    <div className='row mb-2'></div>
                </div>
                <div className="modal-footer">
                    {(isGroup && isAdmin) || !isGroup  ?
                        <button className="btn btn-danger mr-auto" data-dismiss="modal" onClick={this.handleDeleteChat}>Delete Chat</button>
                    : ''}
                    <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleSave} disabled={this.state.uploading}>{this.state.uploading ? 'Uploading...' : 'Save'}</button>
                </div>
            </div>
        )
    }
}
