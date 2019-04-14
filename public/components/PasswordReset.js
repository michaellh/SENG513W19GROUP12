import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';
import { Redirect } from 'react-router';

const resetRoute = "/reset/";

export default class PasswordReset extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            "New Password": {hasError: false, value: ""},
            "Confirm Password": {hasError: false, value: ""}
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange(fieldId, val) {
        this.setState({ [fieldId]: { value : val, hasError: false}});
    }

    handleSubmit(e) {
        e.preventDefault();
        
        // Error-handle if the passwords don't match
        if(this.state["NewPassword"].value !== this.state["Confirm Password"].value) {
            alert("The passwords don't match!");
        }
        else {
            fetch(resetRoute + this.props.match.params.token, {
                method: "POST",
                mode: 'no-cors',
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                body: "password=" + this.state["New Password"].value
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
                if(resData != "ok") {
                    throw new Error(resData);
                }
                else {
                    alert("Password reset completed! A confirmation email will be sent!");
                    this.setState({
                        Success: true
                    });
                }
            })
            .catch((error) => {
                console.error(error);
            });
        }
    }

    render() {
        if (this.state.Success === true ) {
            return <Redirect to="/login" />
        }
      
        const fields = [{name: "New Password", hasError: this.state["New Password"].hasError, placeholder:"Enter new password", type: "password"},
                        {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Enter new password again", type: "password"}]

        return (
            <div className="container">
                <h1 style={{"textAlign" : "center"}}>NetChatter</h1>
                <form onSubmit={this.handleSubmit}>
                    <FormEditor fields={fields} onChange={this.handleFieldChange}/>
                    <div className="row" style={{flex:1}}>
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="submit">Change</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}