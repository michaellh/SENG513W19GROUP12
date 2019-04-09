import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';

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

    if (this.state.Username.hasError || this.state.Password.hasError || this.state["Confirm Password"].hasError || this.state.Email.hasError) {
      return false
    }
    return true
  }

  validateUsername() {
    if (this.state.Username.value.length < 3) {
      this.setState({Username: {value: this.state.Username.value, hasError: true, errorMessage: "Username must have a minimum length of 3 characters"}})
    }
  }

  validatePassword() {
    if (this.state.Username.value.length < 3) {
      this.setState({Password: {value: this.state.Password.value, hasError: true, errorMessage: "Password must have a minimum length of 3"}})
    }
  }

  validatePasswordMatch() {
    if (this.state.Password.value !== this.state["Confirm Password"].value) {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: true}})
    } else {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: false}})
    }
  }

  validateEmail() {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.state.Email.value.length < 1) {
      this.setState({Email: {value: this.state.Email.value, hasError: true, errorMessage: "Email address is required"}})
    }
    else if (!re.test(String(this.state.Email.value).toLowerCase())) {
      this.setState({Email: {value: this.state.Email.value, hasError: true, errorMessage: "Please enter a valid email address"}})
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
                else {
                  console.log("SUCCESS")
                  alert("Signup Sucessful")
                  console.log(data)
                  this.setState({
                    Success: true
                  })
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

    const fields = [{name: "Username", hasError: this.state.Username.hasError, placeholder:"Enter username", errorMessage: this.state.Username.errorMessage},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password", type: "password", errorMessage: this.state.Password.errorMessage},
                    {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Confirm password", type: "password", errorMessage:"Passwords do not match"},
                    {name: "Email", hasError: this.state.Email.hasError, placeholder:"Enter username", errorMessage: this.state.Email.errorMessage}];

    return (
      <div className="container">
        <h1 style={{"textAlign" : "center"}}>NetChatter</h1>
        <form onSubmit={this.handleSubmit}>
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
    )
  }
}

export default SignUp
