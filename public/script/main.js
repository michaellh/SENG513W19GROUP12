import React from 'react';
import ReactDOM from 'react-dom';
import Container from '../components/Container';
import Navigation from '../components/Navigation';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import { Route, BrowserRouter as Router } from 'react-router-dom'

// import routes from './routes'

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Navigation} />
      <Route path="/login" component={Login} />
      <Route path="/reset-password" component={SignUp} />
      <Route path="/signup" component={SignUp} />
    </div>
  </Router>
)

// import './socket-calls.js'
// import './socket.io.js'
import '../css/main.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

let name = 'userAlex';
while(!(name = prompt("Please enter your name")));
document.cookie = `user=${name}`;

ReactDOM.render(routing, document.getElementById('container'));
