import React, {Component} from 'react';
import FormEditor from './Forms/FormEditor';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Username: {hasError: false, value: ""},
      Password: {hasError: false, value: ""},
    };

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFieldChange(fieldId, val) {
    this.setState({ [fieldId]: { value : val, hasError: this.state[fieldId].hasError}});
  }

  handleSubmit(event) {
      this.setState({ Username: { value : this.state.Username.value, hasError: !this.state.Username.hasError}});
      event.preventDefault()
  }

  render() {
    const fields = [{name: "Username", hasError: this.state.Username.hasError, placeholder:"Enter username"},
                    {name: "Password", hasError: this.state.Password.hasError, placeholder:"Enter password"}]

    return (
      <div className="container">
        <h1 style={{"textAlign" : "center"}}>NetChatter</h1>
        <form onSubmit={this.handleSubmit}>
          <FormEditor fields={fields} onChange={this.handleFieldChange}/>
          <div className="btn-toolbar">
            <div className="row" style={{flex:1}}>
              <div className="col-md-6">
                <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="submit">Login</button>
              </div>
              <div className="col-md-6">
                <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="button">Sign Up</button>
              </div>
            </div>
          </div>
        </form>
        <div>{JSON.stringify(this.state)}</div>
      </div>
    )
  }
}

export default Login