import React, { Component } from 'react'

export default class Customize extends Component{
    constructor(props) {
        super(props)

        const {chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour} = props.getStyle();

        this.state = {
            chosenFontSize,
            chosenFont,
            chosenFontColour,
            chosenMyBubbleColour,
            chosenOtherBubbleColour,
            chosenBgColour,
        }

        this.setFontSize = this.setFontSize.bind(this);
        this.setFont = this.setFont.bind(this);
        this.setFontColour = this.setFontColour.bind(this);
        this.setBgColour = this.setBgColour.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDeleteChat = this.handleDeleteChat.bind(this);
        this.setMyBubbleColour = this.setMyBubbleColour.bind(this);
        this.setOtherBubbleColour = this.setOtherBubbleColour.bind(this);
 
        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            const {chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour} = props.getStyle();
            this.setState({chosenFontSize,chosenFont,chosenFontColour,chosenMyBubbleColour,chosenOtherBubbleColour, chosenBgColour})
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
        this.props.socket.emit('deleteChat', this.props.chat.id);
    }

    handleSave(e)  {  
        const style = {
            'fontSize': this.state.chosenFontSize,
            'font': this.state.chosenFont,
            'fontColour': this.state.chosenFontColour,
            'myBubbleColour': this.state.chosenMyBubbleColour,
            'otherBubbleColour': this.state.chosenOtherBubbleColour,
            'bgColour': this.state.chosenBgColour,
        }
        console.log(style);
        this.props.socket.emit('setStyle',{userID: this.props.userID, chatID:this.props.chat.id, style});
    }

    render() {
        return (
            <div>
                <div className='modal-body' id='modalBody'>
                    <div className='row mb-2'>
                        <div className='form-group col-12'>
                            <label htmlFor='usr'>Chat Name:</label>
                            <div className='input-group'>
                                <input type='text' className='form-control' placeholder={this.props.chatName}></input>
                                <div className='input-group-append'>
                                    <button className='btn btn-outline-primary' onClick={this.handleSaveGroupName}>Save</button>
                                </div>
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
                </div>
                <div className="modal-footer">
                    <button className="btn btn-danger mr-auto" data-dismiss="modal" onClick={this.handleDeleteChat}>Delete Chat</button>
                    <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        )
    }
}
