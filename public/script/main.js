import React from 'react';
import ReactDOM from 'react-dom';
import Container from '../components/Container';

// import './socket-calls.js'
// import './socket.io.js'
// import '../css/main.css'

let name;
while(!(name = prompt("Please enter your name")));
document.cookie = `user='${name}'`;

ReactDOM.render(<Container user={name} />, document.getElementById('container'));