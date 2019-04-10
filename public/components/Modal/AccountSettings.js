import React, { Component } from 'react'

export default class AccountSettings extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            NewUsername:"",
            Confirmusername:"",
            NewEmail:"",
            ConfirmEmail:"",
            NewPassword:"",
            ConfirmPassword:""
        }

        this.handleNewUsername = this.handleNewUsername.bind(this);
        this.handleConfirmUsername = this.handleConfirmUsername.bind(this);
        this.handleNewEmail = this.handleNewEmail.bind(this);
        this.handleConfirmEmail = this.handleConfirmEmail.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleConfirmPassword = this.handleConfirmPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        // When animation finished, and modal closed, reset state
        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({mode : false});
        });
    }

    handleNewUsername(e) {
        this.setState({NewUsername: e.target.value});
    }

    handleConfirmUsername(e) {
        this.setState({Confirmusername: e.target.value});
    }

    handleNewEmail(e) {
        this.setState({NewEmail: e.target.value});
    }

    handleConfirmEmail(e) {
        this.setState({ConfirmEmail: e.target.value});
    }

    handleNewPassword(e) {
        this.setState({NewPassword: e.target.value});
    }

    handleConfirmPassword(e) {
        this.setState({ConfirmPassword: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // let consolePrintInputs = {
        //     "New Username: " : this.state.NewUsername,
        //     "New Email: " : this.state.NewEmail,
        //     "Confirm Email: " : this.state.ConfirmEmail,
        //     "New Password: " : this.state.NewPassword,
        //     "Confirm Password: " : this.state.ConfirmPassword
        // }
        // console.log(consolePrintInputs);

        // Verify that the emails and passwords match
        if(this.state.NewUsername !== this.state.Confirmusername) {
            console.log("The usernames don't match!");
        }
        else if(this.state.NewEmail !== this.state.ConfirmEmail) {
            console.log("The emails don't match!");
        }
        else if(this.state.NewPassword !== this.state.ConfirmPassword) {
            console.log("The passwords don't match!");
        }
        else {
            let accountSettingsBody = {
                name : this.props.user.name,
                email : this.props.user.email,
                newName : this.state.NewUsername,
                newEmail : this.state.NewEmail,
                newPassword : this.state.NewPassword
            }
    
            // Make the fetch call to /account-settings here
            fetch("/account-settings", {
                method: "POST",
                mode: 'no-cors',
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                body: $.param(accountSettingsBody)
            })
            .then(res => {
                if (!res.ok) {
                    if ((res.status === 404) || (res.status === 409)) {
                      return res.json();
                    }
                    throw new Error(res.status);
                }
                else {
                    return res.json();
                }
            })
            .then(resData => {
                console.log(resData);
                // If the request went well, refresh the page for a new token
                if(resData === "ok") {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }
    
    render() {
        return (
            <form style={{margin:0,padding:0}}>
                <div className="modal-body" id='modalBody'>
                    <div>
                        <h6>New Username:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleNewUsername} value={this.state.text}></input>
                        <h6>Confirm Username:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleConfirmUsername} value={this.state.text}></input>
                        <h6>New Email:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleNewEmail} value={this.state.text}></input>
                        <h6>Confirm Email:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleConfirmEmail} value={this.state.text}></input>
                        <h6>New Password:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleNewPassword} value={this.state.text}></input>
                        <h6>Confirm Password:</h6>
                        <input type='text' className='form-control' autoFocus={true} onChange={this.handleConfirmPassword} value={this.state.text}></input>
                    </div> 
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Save</button>
                </div>
            </form>
        )
    }
}
