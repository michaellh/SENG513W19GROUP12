import React, { Component } from 'react'

export default class Settings extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            modeN: this.props.notificationState,
            modeS: this.props.splitScreenState,
        }

        this.handleClickNotifcations = this.handleClickNotifcations.bind(this);
        this.handleClickScreen = this.handleClickScreen.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                mode: false,
                text:'',
            })
        });
    }

    handleClickNotifcations(e) {
        e.preventDefault();
        // console.log(e.target.value);
        this.setState({modeN: !this.state.modeN});
        this.props.toggleNotification(this.state.modeN);
        !this.state.modeN && console.log('notifiy')
    }

    handleClickScreen(e) {
        e.preventDefault();
        // console.log(e.target.value);
        this.setState({modeS: !this.state.modeS});
        this.props.toggleSplitScreen(!this.state.modeS);
        this.state.modeS && this.props.resetChat(2);
    }

    handleSubmit() {
    }
    
    render() {
        return (
                <form style={{margin:0,padding:0}}>
                    <div className="modal-body text-center" id='modalBody'>                       
                        <button className='btn btn-primary btn-block'>Account Settings</button>
                        {
                            this.state.modeN?
                            <button className='btn btn-secondary btn-block' onClick={this.handleClickNotifcations}>Notifications: <b>On</b></button>
                            :
                            <button className='btn btn-secondary btn-block' onClick={this.handleClickNotifcations}>Notifications: <b>Off</b></button>
                        }
                        {
                            this.state.modeS?
                            <button className='btn btn-secondary btn-block' onClick={this.handleClickScreen}>Screen: <b>Split</b></button>
                            :
                            <button className='btn btn-secondary btn-block' onClick={this.handleClickScreen}>Screen: <b>Single</b></button>
                        }
                        <button className='btn btn-danger btn-block'>Log Out</button>
                    </div>
                    {/* <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                    </div> */}
                </form>
        )
    }
}
