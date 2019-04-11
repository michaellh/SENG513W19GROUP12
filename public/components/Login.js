import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom'
import logo from '../resources/logo.png';
import '../css/Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: {hasError: false, value: ""},
      Password: {hasError: false, value: ""},
      Success: false
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFieldChange(fieldId, val) {
    this.setState({ [fieldId]: { value : val, hasError: false}});
  }

  handleSubmit(event) {
      event.preventDefault()

      const userInfo = {
        email: this.state.Email.value,
        password: this.state.Password.value
      }

      fetch("/sign-in", {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/x-www-form-urlencoded",
                }),
                body: $.param(userInfo)
            })
            .then(response => {
                if (!response.ok) {
                  if (response.status === 401) {
                    return response.json();
                  }
                  throw new Error(response.status);
                }
                else {
                  return response.json();
                }
            }).then(data => {
              if (data.message === "Missing credentials") {
                this.setState({
                  Email: { value: this.state.Email.value, hasError: true, errorMessage: "Invalid Email"},
                  Password: { value: this.state.Password.value, hasError: true, errorMessage: "Invalid Password"}
                })
              }
              else if(data.message === "The specified account does not exist.") {
                this.setState({
                  Email: { value: this.state.Email.value, hasError: true, errorMessage: data.message}
                })
              }
              else if (data.message === "Incorrect password") {
                this.setState({
                  Password: { value: this.state.Password.value, hasError: true, errorMessage: data.message}
                })
              }
              else if (data.auth_token != null) {
                console.log("SUCCESS")
                alert("Sigin Sucessful")
                console.log(data)
                this.setState({
                  Success: true
                })
              }
              else {
                this.setState({
                  Email: { value: this.state.Email.value, hasError: true, errorMessage: "An unknown occured. Please try again later."},
                  Username: { value: this.state.Username.value, hasError: true, errorMessage: "An unknown occured. Please try again later."}
                })
                console.error(data)
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

    const fields = [{name: "Email", hasError: this.state.Email.hasError, placeholder:"Enter email"},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password", type: "password"}]

    return (
      <div className="container">
        <div className="login-form">
          <form onSubmit={this.handleSubmit}>
            <div className="logo"><img src={logo} alt="Logo" /></div>
            <h1 className="title">NetChatter</h1>
            <h4 className="sub-title">Login</h4>
            <FormEditor fields={fields} onChange={this.handleFieldChange}/>
            <div className="btn-toolbar">
              <div className="row" style={{flex:1}}>
                <div className="col-md-6">
                  <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="submit">Login</button>
                </div>
              <div className="col-md-6">
                <Link to="/signup"><button className="btn btn-outline-primary btn-lg" style={{"width" : "100%"}} type="button">Sign Up</button></Link>
              </div>
            </div>
          </div>
          <Link to="/forgot-password"><button className="btn btn-link" style={{paddingLeft:0}}>Forgot Password?</button></Link>
        </form>
        </div>
      </div>
    )
  }
}

export default Login
