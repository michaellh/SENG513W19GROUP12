import React, { Component } from 'react'

export default class Customize extends Component{
    constructor(props) {
        super(props)

        this.state = {
            chosenFontSize: 14,
            chosenFont: 'Helvetica',
            chosenFontColour: 'black',
        }

        this.setFontSize = this.setFontSize.bind(this);
        this.setFontColour = this.setFontColour.bind(this);
        this.setFont = this.setFont.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSaveGroupName = this.handleSaveGroupName.bind(this);

        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                mode: false,
                text:'',
            })
        });
    }

    setFontSize(e){
        //console.log(e.target.value);
        this.setState({chosenFontSize: e.target.value});
    }

    setFontColour(e){
        this.setState({chosenFontColour: e.target.value});
    }

    setFont(e){
        this.setState({chosenFont: e.target.value});
    }


    handleSaveGroupName(e) {
    }

    handleSave(e)  {
        this.props.setFontState('fontSize', this.state.chosenFontSize);
        this.props.setFontState('font', this.state.chosenFont);
        this.props.setFontState('fontColour', this.state.chosenFontColour);
    }

    render() {

        return (
            <div>
                <div className='modal-body' id='modalBody'>
                    <div className='row mb-2'>
                        <div className='form-group col-12'>
                            <label htmlFor='usr'>Chat Name:</label>
                            <div className='input-group'>
                                <input type='text' className='form-control' placeholder={this.props.chat.name}></input>
                                <div className='input-group-append'>
                                    <button className='btn btn-outline-primary' onClick={this.handleSaveGroupName}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row mb-2'>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel1'>Font Size:</label>
                            <select className='form-control' id='sel1' onChange={this.setFontSize} defaultValue={this.state.chosenFontSize}>
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
                            <select className='form-control' id='sel2' onChange={this.setFont}  defaultValue={this.state.chosenFont}>
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
                            <select className='form-control' id='sel3' onChange={this.setFontColour} defaultValue={this.state.chosenFontColour}>
                                <option value='black'>Black</option>
                                <option value='White'>White</option>
                                <option value='Grey'>Grey</option>
                                <option value='red'>Red</option>
                                <option value='blue'>Blue</option>
                                <option value='green'>Green</option>
                                <option value='purple'>Purple</option>
                                <option value='Yellow'>Yellow</option>
                                <option value='Orange'>Orange</option>
                            </select>
                        </div> 
                    </div>
                    <div className='row mb-2'>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel3'>My Bubble Colour:</label>
                            <select className='form-control' id='sel3' onChange={this.setFontColour}>
                                <option value='black'>black</option>
                                <option value='red'>red</option>
                                <option value='blue'>blue</option>
                                <option value='green'>green</option>
                            </select>
                        </div>
                        <div className='col-2'></div>
                        <div className='col-5 form-group'>
                            <label htmlFor='sel3'>Bubble Color:</label>
                            <select className='form-control' id='sel3' onChange={this.setFontColour}>
                                <option value='black'>black</option>
                                <option value='red'>red</option>
                                <option value='blue'>blue</option>
                                <option value='green'>green</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        )
    }
}
