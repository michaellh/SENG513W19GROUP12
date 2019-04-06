import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import Container from './container'

class Navigation extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    ReactDOM.render(<Container />, document.getElementById('container'));
  }

  render() {
    return (
      <div className="container">
        <div className="btn-toolbar">
          <div className="row" style={{flex:1}}>
            <div className="col-md-4">
              <button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="button" onClick={this.handleClick}>Chat</button>
            </div>
            <div className="col-md-4">
              <Link to="/login"><button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="button">Login</button></Link>
            </div>
            <div className="col-md-4">
              <Link to="/signup"><button className="btn btn-primary btn-lg" style={{"width" : "100%"}} type="button">Sign Up</button></Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Navigation
