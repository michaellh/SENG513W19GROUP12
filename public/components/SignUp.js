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
    // TODO
    this.setState({Username: {value: this.state.Username.value, hasError: true, errorMessage: "Invalid Username"}})
    return false
  }

  validatePassword() {
    // TODO
    this.setState({Password: {value: this.state.Password.value, hasError: true, errorMessage: "Invalid Password"}})
    return false
  }

  validatePasswordMatch() {
    if (this.state.Password.value !== this.state["Confirm Password"].value) {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: true}})
    } else {
      this.setState({"Confirm Password": {value: this.state["Confirm Password"].value, hasError: false}})
    }
  }

  validateEmail() {
    // TODO
    this.setState({Email: {value: this.state.Email.value, hasError: true}})
    return false
  }

  handleFieldChange(fieldId, val) {
    this.setState({ [fieldId]: { value : val, hasError: false}});
  }

  handleSubmit(event) {
      event.preventDefault()

      if (this.validateFields()) {
        const userInfo = {
          name: this.state.Username.value,
          password: this.state.Password.value,
          email: this.state.Email.value
        }

        fetch("http://localhost:3000/register", {
                  method: "POST",
                  headers: new Headers({
                      "Content-Type": "application/x-www-form-urlencoded",
                  }),
                  body: $.param(userInfo)
              })
              .then(response => {
                  if (!response.ok) {
                    if (response.status === 409) {
                      this.setState({
                        // TODO
                        Username: { value: this.state.Username.value, hasError: true}
                      })
                    }
                    throw new Error(response.status);
                  }
                  else {
                    return response.json();
                  }
              }).then(data => {
                console.log("SUCCESS")
                alert("Signup Sucessful")
                console.log(data)
                this.setState({
                  Success: true
                })
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

    const fields = [{name: "Username", hasError: this.state.Username.hasError, placeholder:"Enter username"},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password", type: "password"},
                    {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Confirm password", type: "password", errorMessage:"Passwords do not match"},
                    {name: "Email", hasError: this.state.Email.hasError, placeholder:"Enter username"}];

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
