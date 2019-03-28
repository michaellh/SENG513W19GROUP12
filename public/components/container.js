import React, {Component} from 'react';
import MessageContainer from '../components/message-container';
import UserContainer from './user-container';
import Controls from './controls';

export default class Container extends Component {
    render() {
        return (
            <div>
                <div id='content'>
                    <div id='messageContainer'><MessageContainer />
                        <div id='messages'></div>
                    </div>
                    <div id='userContainer'><UserContainer />
                        <div id='users'></div>
                    </div>
                </div>
                <div><Controls /></div>
            </div>
        );
    }
}