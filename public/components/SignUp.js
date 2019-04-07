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
  }

  handleFieldChange(fieldId, val) {
    this.setState({ [fieldId]: { value : val, hasError: false}});
  }

  handleSubmit(event) {
      event.preventDefault()
      //this.setState({ Username: { value : this.state.Username.value, hasError: !this.state.Username.hasError}});

      // TODO Handle Validiation

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

  render() {
    if (this.state.Success === true ) {
      return <Redirect to="/login" />
    }

    const fields = [{name: "Username", hasError: this.state.Username.hasError, placeholder:"Enter username"},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password"},
                    {name: "Confirm Password", hasError: this.state["Confirm Password"].hasError, placeholder:"Confirm password"},
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
