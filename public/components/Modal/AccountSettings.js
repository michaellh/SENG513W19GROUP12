import React, { Component } from 'react'
import FormEditor from '../Forms/FormEditor';

export default class AccountSettings extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            "New Username": {hasError: false, value: ""},
            "Confirm Username": {hasError: false, value: ""},
            "New Email": {hasError: false, value: ""},
            "Confirm Email": {hasError: false, value: ""},
            "New Password": {hasError: false, value: ""},
            "Confirm Password": {hasError: false, value: ""},
            makeToken: false,
            changes: false
        }

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.validateUsername = this.validateUsername.bind(this);
        this.validateUsernameMatch = this.validateUsernameMatch.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
        this.validateEmailMatch = this.validateEmailMatch.bind(this);
        this.validatePassword = this.validatePassword.bind(this);
        this.validatePasswordMatch = this.validatePasswordMatch.bind(this);

        $('#myModal').on('show.bs.modal', (e) => {
            this.setState({mode : false});
        });
    }

    validateFields() {
        this.validateUsername()
        this.validateUsernameMatch();
        this.validateEmail()
        this.validateEmailMatch();
        this.validatePassword()
        this.validatePasswordMatch()
    
        if (this.validateUsername() && this.validateUsernameMatch() &&
            this.validateEmail() && this.validateEmailMatch() &&
            this.validatePassword() && this.validatePasswordMatch()) {
          return true
        }
        return false
    }
    
    validateUsername() {
        if (this.state["New Username"].value === "") {
            this.setState({"New Username": {value: this.state["New Username"].value, hasError: false, errorMessage: "Username must have a minimum length of 3 characters"}})
            return true  
        }
        else if (this.state["New Username"].value.length < 3) {
          this.setState({"New Username": {value: this.state["New Username"].value, hasError: true, errorMessage: "Username must have a minimum length of 3 characters"}})
          return false
        }
        else {
            this.setState({"New Username": {value: this.state["New Username"].value, hasError: false, errorMessage: "Username must have a minimum length of 3 characters"}})
            return true
        }
    }

    validateUsernameMatch() {
        if (this.state["New Username"].value !== this.state["Confirm Username"].value) {
          this.setState({"Confirm Username": {value: this.state["Confirm Username"].value, hasError: true}})
          return false
        } else {
          this.setState({"Confirm Username": {value: this.state["Confirm Username"].value, hasError: false}})
          return true
        }
    }

    validateEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.state["New Email"].value === "") {
            this.setState({["New Email"]: {value: this.state["New Email"].value, hasError: false, errorMessage: ""}})
            return true
        }
        else if (this.state["New Email"].value.length < 1) {
          this.setState({["New Email"]: {value: this.state["New Email"].value, hasError: true, errorMessage: "Email address is required"}})
          return false
        }
        else if (!re.test(String(this.state["New Email"].value).toLowerCase())) {
          this.setState({["New Email"]: {value: this.state["New Email"].value, hasError: true, errorMessage: "Please enter a valid email address"}})
          return false
        }
        else {
          this.setState({["New Email"]: {value: this.state["New Email"].value, hasError: false, errorMessage: "Please enter a valid email address"}})
          return true
        }
    }

    validateEmailMatch() {
        if (this.state["New Email"].value !== this.state["Confirm Email"].value) {
          this.setState({"Confirm Email": {value: this.state["Confirm Email"].value, hasError: true}})
          return false
        } else {
          this.setState({"Confirm Email": {value: this.state["Confirm Email"].value, hasError: false}})
          return true
        }
    }
    
    validatePassword() {
        if (this.state["New Password"].value === "") {
            this.setState({["New Password"]: {value: this.state["New Password"].value, hasError: false, errorMessage: ""}})
            return true
        }
        else if (this.state["New Password"].value.length < 3) {
          this.setState({["New Password"]: {value: this.state["New Password"].value, hasError: true, errorMessage: "Password must have a minimum length of 3"}})
          return false
        }
        else {
          this.setState({["New Password"]: {value: this.state["New Password"].value, hasError: false, errorMessage: "Password must have a minimum length of 3"}})
          return true
        }
    }
    
    validatePasswordMatch() {
        if (this.state["New Password"].value !== this.state["Confirm Password"].value) {
          this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: true}})
          return false
        } else {
          this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: false}})
          return true
        }
    }

    handleFieldChange(fieldId, val) {
        this.setState({ [fieldId]: { value : val, hasError: false }});
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.validateFields()) {
            let accountSettingsBody = {
                name : this.props.user.name,
                email : this.props.user.email,
                newName : this.state["New Username"].value,
                newEmail : this.state["New Email"].value,
                newPassword : this.state["New Password"].value
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
                    this.setState({
                        "New Username": { value: this.state["New Username"].value, hasError: true, errorMessage: resData}
                    });
                }
                if(resData === "ok") {
                    this.setState({changes : true});
                    this.setState({makeToken : true});
                    accountSettingsBody.name = accountSettingsBody.newName;
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
                        this.setState({
                            "New Email": { value: this.state["New Email"].value, hasError: true, errorMessage: resData}
                        });
                    }
                    if(resData === "ok") {
                        this.setState({changes : true});
                        this.setState({makeToken : true});
                        accountSettingsBody.email = accountSettingsBody.newEmail;
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
                        if(resData === "ok") {
                            this.setState({changes : true});
                        }

                        if(this.state.makeToken) {
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
                                    setTimeout(function() {
                                        window.location.reload();
                                    }, 2000)
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
        const fields = [{name: "New Username", hasError: this.state["New Username"].hasError, placeholder:"Current username: " + this.props.user.name, errorMessage: this.state["New Username"].errorMessage},
                        {name: "Confirm Username", hasError: this.state["Confirm Username"].hasError, placeholder:"Confirm your new username", errorMessage: "Usernames do not match"},
                        {name: "New Email", hasError: this.state["New Email"].hasError, placeholder:"Current email: " + this.props.user.email, errorMessage: this.state["New Email"].errorMessage},
                        {name: "Confirm Email", hasError: this.state["Confirm Email"].hasError, placeholder:"Confirm your email", errorMessage: "Emails do not match"},
                        {name: "New Password", hasError: this.state["New Password"].hasError, placeholder:"Enter password", type: "password", errorMessage: this.state["New Password"].errorMessage},
                        {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Confirm your password", type: "password", errorMessage: "Passwords do not match"}];

        return (
            <form style={{margin:0,padding:0}}>
                <div className="modal-body" id='modalBody'>
                    <FormEditor fields={fields} onChange={this.handleFieldChange}/>
                </div>
                <div className="modal-footer">
                    {
                        this.state.changes?
                        <p>Changes applied</p>
                        :
                        <p>No changes applied</p>
                    }
                    <button type="button" className="btn btn-outline-primary" data-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Save</button>
                </div>
            </form>
        )
    }
}
