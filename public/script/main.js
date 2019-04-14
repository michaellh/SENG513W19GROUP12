import React from 'react';
import ReactDOM from 'react-dom';
import Container from '../components/Container';
import Login from '../components/Login';
import SignUp from '../components/SignUp';
import ForgotPassword from '../components/ForgotPassword';
import PasswordReset from '../components/PasswordReset';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'

// import routes from './routes'

const routing = (
  <Router>
    <Switch>
      <Route exact path="/" component={Container}/>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password/:token" component={PasswordReset} />
    </Switch>
  </Router>
)

import '../css/main.css'

ReactDOM.render(routing, document.getElementById('container'));
