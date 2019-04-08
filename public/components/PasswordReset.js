import React, {Component} from 'react';

const resetRoute = "/reset/";

export default class PasswordReset extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            newPassword: '',
            confirmPassword: ''
        };

        this.handleNewPasswordTextChange = this.handleNewPasswordTextChange.bind(this);
        this.handleConfirmNewPasswordTextChange = this.handleConfirmNewPasswordTextChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleNewPasswordTextChange(e) {
        this.setState({newPassword: e.target.value});
    }

    handleConfirmNewPasswordTextChange(e) {
        this.setState({confirmPassword: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Error-handle if the passwords don't match
        if(this.state.newPassword !== this.state.confirmPassword) {
            alert("The passwords don't match!");
        }
        else {
            fetch(resetRoute + this.props.match.params.token, {
                method: "POST",
                mode: 'no-cors',
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                body: "password=" + this.state.newPassword
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        return (
            <div>
                <h1 style={{"textAlign" : "center"}}>NetChatter</h1>
                <form id="reset-password-form">
                    <p>New Password</p>
                    <input type="text" id="new-password" onChange={this.handleNewPasswordTextChange} autoComplete="off"/>
                    <p>Confirm New Password</p>
                    <input type="text" id="confirm-password" onChange={this.handleConfirmNewPasswordTextChange} autoComplete="off"/>
                    <div className="btn btn-primary">
                        <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Change</button>
                    </div>
                </form>
            </div>
        )
    }
}