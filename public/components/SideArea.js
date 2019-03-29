import React, {Component} from 'react';

export default class SideArea extends Component {
    render() {
        const style = {
        }
        return (
            <div className={this.props.className}>
                <h2>Connected Users</h2>
            </div>
        )
    }
}