import React, {Component} from 'react';
import MessageContainer from '../components/message-container';
import Messages from '../components/messages';

class Container extends Component {
    render() {
        return (
            <div>
                <div id='content'>
                    <div id='messageContainer'><MessageContainer />
                        <div id='messages'></div>
                    </div>
                    <div id='userContainer'>
                        <div id='users'></div>
                    </div>
                </div>
                <div id='controls'>
                </div>
            </div>
        );
    }
}

export default Container;