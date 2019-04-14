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

        var makeToken = false;

        // Verify that the emails and passwords match
        if((this.state.NewUsername !== this.state.Confirmusername) || 
            (this.state.NewUsername === this.props.user.name)) {
            console.log("The username entered is invalid!");
        }
        else if((this.state.NewEmail !== this.state.ConfirmEmail) || 
            (this.state.NewEmail === this.props.user.email)) {
            console.log("The email entered is invalid!");
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

            fetch("/account-settings/username", {
                method: "POST",
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
                if(!((resData === "ok") || (resData === "no"))) {
                    console.log("username error: " + resData);
                    // Display error and return to exit function
                    return;
                }
                if(resData === "ok") {
                    makeToken = true;
                }
                
                fetch("/account-settings/email", {
                    method: "POST",
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
                    if(!((resData === "ok") || (resData === "no"))) {
                        console.log("email error: " + resData);
                        // Display error
                        return;
                    }
                    if(resData === "ok") {
                        makeToken = true;
                    }
                    fetch("/account-settings/password", {
                        method: "POST",
                        headers: new Headers({
                            "Content-Type": "application/x-www-form-urlencoded",
                        }),
                        body: $.param(accountSettingsBody)
                    })
                    .then(res => {
                        if (!res.ok) {
                            if (res.status === 404) {
                              return res.json();
                            }
                            throw new Error(res.status);
                        }
                        else {
                            return res.json();
                        }
                    })
                    .then(resData => {
                        console.log("makeToken: " + makeToken);
                        if(makeToken) {
                            fetch("/account-settings/token", {
                                method: "POST",
                                headers: new Headers({
                                    "Content-Type": "application/x-www-form-urlencoded",
                                }),
                                body: $.param(accountSettingsBody)
                            })
                            .then(res => {
                                if (!res.ok) {
                                    if (res.status === 404) {
                                      return res.json();
                                    }
                                    throw new Error(res.status);
                                }
                                else {
                                    return res.json();
                                }
                            })
                            .then(resData => {
                                console.log("token data: " + resData);
                                if(resData) {
                                    window.location.reload();
                                }
                            })
                            .catch((error) => {
                                console.error(error);
                            });  
                        } 
                    })
                    .catch((error) => {
                        console.error(error);
                    });   
        
                })
                .catch((error) => {
                    console.error(error);
                });
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
                    <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
                </div>
            </form>
        )
    }
}
