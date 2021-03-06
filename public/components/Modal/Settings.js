import React, { Component } from 'react'
import AccountSettings from './AccountSettings';

export default class Settings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            modeN: this.props.notificationState,
            modeS: this.props.splitScreenState,
        }

        this.handleClickAccountSettings = this.handleClickAccountSettings.bind(this);
        this.handleClickNotifcations = this.handleClickNotifcations.bind(this);
        this.handleClickScreen = this.handleClickScreen.bind(this)
        this.handleLogout = this.handleLogout.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({
                modeN: this.props.notificationState,
                modeS: this.props.splitScreenState,
            });
        });
    }

    componentWillReceiveProps(props){
        this.setState({modeN: props.notificationState, modeS: props.splitScreenState});
    }

    handleClickAccountSettings(e) {
        e.preventDefault();

        const title = <span><i className='fas fas fa-cog'></i> Account Settings</span>
        const body = <AccountSettings socket={this.props.socket} user={this.props.user}/>;

        this.props.modal(title, body);
    }

    handleClickNotifcations(e) {
        e.preventDefault();
        this.setState({modeN: !this.state.modeN});
        this.props.toggleNotification(!this.state.modeN);
    }

    handleClickScreen(e) {
        e.preventDefault();
        this.setState({modeS: !this.state.modeS});
        this.props.toggleSplitScreen(!this.state.modeS);
        this.state.modeS && this.props.resetChat(2);
    }

    handleLogout() {
        document.cookie = `token=""`;
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
                            <button className='btn btn-secondary btn-block d-none d-md-block' onClick={this.handleClickScreen}>Screen: <b>Split</b></button>
                            :
                            <button className='btn btn-secondary btn-block d-none d-md-block' onClick={this.handleClickScreen}>Screen: <b>Single</b></button>
                        }
                        <button className='btn btn-danger btn-block' onClick={this.handleLogout}>Log Out</button>
                    </div>
                </form>
        )
    }
}
