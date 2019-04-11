import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import logo from '../resources/logo.png';
import '../css/Login.css';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: {hasError: false, value: ""},
      Password: {hasError: false, value: ""},
      "Confirm Password": {hasError: false, value: ""},
      Email: {hasError: false, value: ""},
      Success: false
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.validatePasswordMatch = this.validatePasswordMatch.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }

  validateFields() {
    this.validateUsername()
    this.validatePassword()
    this.validatePasswordMatch()
    this.validateEmail()

    if (this.validateUsername() && this.validatePassword() && this.validatePasswordMatch() && this.validateEmail()) {
      return true
    }
    return false
  }

  validateUsername() {
    if (this.state.Username.value.length < 3) {
      this.setState({Username: {value: this.state.Username.value, hasError: true, errorMessage: "Username must have a minimum length of 3 characters"}})
      return false
    }
    else {
      this.setState({Username: {value: this.state.Username.value, hasError: false, errorMessage: "Username must have a minimum length of 3 characters"}})
      return true
    }
  }

  validatePassword() {
    if (this.state.Password.value.length < 3) {
      this.setState({Password: {value: this.state.Password.value, hasError: true, errorMessage: "Password must have a minimum length of 3"}})
      return false
    }
    else {
      this.setState({Password: {value: this.state.Password.value, hasError: false, errorMessage: "Password must have a minimum length of 3"}})
      return true
    }
  }

  validatePasswordMatch() {
    if (this.state.Password.value !== this.state["Confirm Password"].value) {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: true}})
      return false
    } else {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: false}})
      return true
    }
  }

  validateEmail() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.Email.value.length < 1) {
      this.setState({Email: {value: this.state.Email.value, hasError: true, errorMessage: "Email address is required"}})
      return false
    }
    else if (!re.test(String(this.state.Email.value).toLowerCase())) {
      this.setState({Email: {value: this.state.Email.value, hasError: true, errorMessage: "Please enter a valid email address"}})
      return false
    }
    else {
      this.setState({Email: {value: this.state.Email.value, hasError: false, errorMessage: "Please enter a valid email address"}})
      return true
    }
  }

  handleFieldChange(fieldId, val) {
    this.setState({ [fieldId]: { value : val, hasError: false }});
  }

  handleSubmit(event) {
      event.preventDefault()

      if (this.validateFields()) {
        const userInfo = {
          name: this.state.Username.value,
          password: this.state.Password.value,
          email: this.state.Email.value
        }

        fetch("/register", {
                  method: "POST",
                  headers: new Headers({
                      "Content-Type": "application/x-www-form-urlencoded",
                  }),
                  body: $.param(userInfo)
              })
              .then(response => {
                  if (!response.ok) {
                    if (response.status === 409) {
                      return response.json()
                    }
                    throw new Error(response.status);
                  }
                  else {
                    return response.json();
                  }
              }).then(data => {
                if (data === "Error: An account with that entered email already exists.") {
                  this.setState({
                    Email: { value: this.state.Email.value, hasError: true, errorMessage: "Please choose a different email address"}
                  })
                }
                else if (data === "Error: An account with that entered username already exists.") {
                    this.setState({
                      Username: { value: this.state.Username.value, hasError: true, errorMessage: "Please choose a different username"}
                    })
                }
                else if (data.auth_token != null) {
                  console.log("SUCCESS")
                  alert("Signup Sucessful")
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
  }

  render() {
    if (this.state.Success === true ) {
      return <Redirect to="/login" />
    }

    const fields = [{name: "Email", hasError: this.state.Email.hasError, placeholder:"Enter email", errorMessage: this.state.Email.errorMessage},
                    {name: "Username", hasError: this.state.Username.hasError, placeholder:"Enter username", errorMessage: this.state.Username.errorMessage},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password", type: "password", errorMessage: this.state.Password.errorMessage},
                    {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Confirm password", type: "password", errorMessage:"Passwords do not match"}];

    return (
      <div className="container">
        <div className="login-form">
          <form onSubmit={this.handleSubmit}>
            <div className="logo"><img src={logo} alt="Logo" /></div>
            <h1 className="title">NetChatter</h1>
            <h4 className="sub-title">Sign Up</h4>
            <FormEditor fields={fields} onChange={this.handleFieldChange}/>
            <div className="row" style={{flex:1}}>
              <div className="col-md-6">
                <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="submit">Sign Up</button>
              </div>
              <div className="col-md-6">
                <Link to="/login"><button className="btn btn-outline-primary btn-lg" style={{"width" : "100%"}} type="button">Back to Login</button></Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default SignUp
