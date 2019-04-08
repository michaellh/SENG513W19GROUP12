import React from 'react';
import ReactDOM from 'react-dom';
import Container from '../components/Container';

// import './socket-calls.js'
// import './socket.io.js'
import '../css/main.css'
// import 'bootstrap/dist/css/bootstrap.min.css';

let name = 'userAlex';
while(!(name = prompt("Please enter your name")));
document.cookie = `user=${name}`;

ReactDOM.render(<Container />, document.getElementById('container'));