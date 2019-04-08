import React, {Component} from 'react';

const forgotURLExt = "/forgot";

export default class ForgotPassword extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            email: '',
            token: '' 
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch(forgotURLExt, {
            method: "POST",
            mode: 'no-cors',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded",
            }),
            body: "email=" + this.state.email
        })
        .catch((error) => {
            console.error(error);
        });
    }

    render() {
        return (
            <div>
                <form id="forgot-password-form" onSubmit={this.handleSubmit}>
                    <p>Email</p>
                    <input type="text" id="email" onChange={e => this.setState({email: e.target.value})} autoComplete="off"/>
                    <p>We will send an email to reset your password</p>
                    <div className="btn btn-primary">
                        <button className="btn btn-primary" data-dismiss="modal" onClick={this.handleSubmit}>Send Reset</button>
                    </div>
                </form>
            </div>
        )
    }
}