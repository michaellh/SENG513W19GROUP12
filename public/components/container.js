import React, {Component} from 'react';
import ChatArea from './chatArea';
import SideArea from './SideArea';
import Controls from './Controls';

export default class Container extends Component {
    render() {
        return (
            <div className='container-fluid'>
                <div className='row'>
                    <SideArea className='col-3'/>
                    <ChatArea className='col-9'/>
                </div>
            </div>
        );
    }
}