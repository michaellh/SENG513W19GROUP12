import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

const forgotRoute = "/forgot";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            Email: {hasError: false, value: ""}
        };

        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange(fieldId, val) {
        this.setState({ [fieldId]: { value : val, hasError: false}});
      }

    handleSubmit(e) {
        e.preventDefault();

        fetch(forgotRoute, {
            method: "POST",
            mode: 'no-cors',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
            }),
            body: "email=" + this.state.Email.value
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
                this.setState({
                    Email: { value: this.state.Email.value, hasError: true, errorMessage: resData}
                })
            }
            else {
                alert("Email sent!");
                this.setState({
                    Success: true
                })
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        if (this.state.Success === true ) {
            return <Redirect to="/" />
        }

        const fields = [{name: "Email", hasError: this.state.Email.hasError, placeholder:"Enter email"}]

        return (
            <div className="container">
                <h1 style={{"textAlign" : "center"}}>NetChatter</h1>
                <form onSubmit={this.handleSubmit}>
                    <FormEditor fields={fields} onChange={this.handleFieldChange}/>
                    <div className="row" style={{flex:1}}>
                        <div className="col-md-6">
                            <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="submit">Send Reset</button>
                        </div>
                        <div className="col-md-6">
                            <Link to="/login"><button className="btn btn-outline-primary btn-lg" style={{"width" : "100%"}} type="button">Back to Login</button></Link>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}