import React, { Component } from 'react'

export default class Customize extends Component{
    constructor(props) {
        super(props)

        this.state = {
            font: 'Arial',
            fontSize: 16,
            fontColour: 'Black',
        }

        this.setFontSize = this.setFontSize.bind(this);
        this.setFontColour = this.setFontColour.bind(this);
        this.setFont = this.setFont.bind(this);
        this.handleClick = this.handleClick.bind(this);

        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                mode: false,
                text:'',
            })
        });
    }

    setFontSize(e){
        this.setState({fontSize: e.target.value});
    }

    setFontColour(e){
        this.setState({fontColour: e.target.value});
    }

    setFont(e){
        this.setState({font: e.target.value});
    }

    handleClick(e)  {
 
    }

    render() {

        return (
            <div>
                <div className='modal-body' id='modalBody'>
                    <div className='row mb-2'>
                    <h6 className='col-6'> Font Size: </h6>
                     <div className='dropdown col-6'>
                          <button type='button' className='btn btn-primary dropdown-toggle' data-toggle='dropdown'>
                            {this.state.fontSize}
                          </button>
                          <div className='dropdown-menu'>
                            <button className='dropdown-item' onClick={this.setFontSize} value='16'>16</button>
                            <button className='dropdown-item' onClick={this.setFontSize} value='18'>18</button>
                            <button className='dropdown-item' onClick={this.setFontSize} value='20'>20</button>
                          </div>
                        </div> 
                    </div>
                    <div className='row mb-2'>
                    <h6 className='col-6'> Font Colour: </h6>
                     <div className='dropdown col-6'>
                          <button type='button' className='btn btn-primary dropdown-toggle' data-toggle='dropdown'>
                            {this.state.fontColour}
                          </button>
                          <div className='dropdown-menu'>
                            <button className='dropdown-item' onClick={this.setFontColour} value='Black'>Black</button>
                            <button className='dropdown-item' onClick={this.setFontColour} value='Blue'>Blue</button>
                            <button className='dropdown-item' onClick={this.setFontColour} value='Red'>Red</button>
                          </div>
                        </div> 
                    </div>
                    <div className='row mb-2'>
                    <h6 className='col-6'> Font: </h6>
                     <div className='dropdown col-6'>
                          <button type='button' className='btn btn-primary dropdown-toggle' data-toggle='dropdown'>
                            {this.state.font}
                          </button>
                          <div className='dropdown-menu'>
                            <button className='dropdown-item' onClick={this.setFont} value='Arial'>Arial</button>
                            <button className='dropdown-item' onClick={this.setFont} value='Helvetica'>Helvetica</button>
                            <button className='dropdown-item' onClick={this.setFont} value='...'>...</button>
                          </div>
                        </div> 
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button className="btn btn-danger" data-dismiss="modal" onClick={this.handleClick}>Okay</button>
                </div>
            </div>
        )
    }
}
