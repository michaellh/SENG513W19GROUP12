import React, {Component} from 'react';

export default class MessageContainer extends Component {
    render() {
        return (
            <div>
                <h2>You Are <i><span id="userID"></span></i></h2>
            </div>
        )
    }
}