import React, { Component } from 'react'
import AccountSettings from './AccountSettings';

export default class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modeN: this.props.notificationState,
            modeS: this.props.splitScreenState,
        }

        console.log(this.state);
        this.handleClickAccountSettings = this.handleClickAccountSettings.bind(this);
        this.handleClickNotifcations = this.handleClickNotifcations.bind(this);
        this.handleClickScreen = this.handleClickScreen.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                modeN: this.props.notificationState,
                modeS: this.props.splitScreenState,
            });
        });
    }

    handleClickAccountSettings(e) {
        e.preventDefault();

        const title = <span><i className='fas fas fa-cog'></i> Account Settings</span>
        const body = <AccountSettings socket={this.props.socket} user={this.props.user}/>;

        this.props.modal(title, body);
    }

    handleClickNotifcations(e) {
        e.preventDefault();
        // console.log(e.target.value);
        this.setState({modeN: !this.state.modeN});
        this.props.toggleNotification(!this.state.modeN);
    }

    handleClickScreen(e) {
        e.preventDefault();
        // console.log(e.target.value);
        this.setState({modeS: !this.state.modeS});
        this.props.toggleSplitScreen(!this.state.modeS);
        this.state.modeS && this.props.resetChat(2);
    }

    handleLogout() {
        //this.props.logout();
        document.cookie = `token=""`;
    }

    handleSubmit() {
    }

    render() {
        return (
                <form style={{margin:0,padding:0}}>
                    <div className="modal-body text-center" id='modalBody'>
                        <button className='btn btn-primary btn-block' onClick={this.handleClickAccountSettings}>Account Settings</button>
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
                        <button className='btn btn-danger btn-block' onClick={this.handleLogout}>Log Out</button>
                    </div>
                    {/* <div className="modal-footer">
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Okay</button>
                    </div> */}
                </form>
        )
    }
}
