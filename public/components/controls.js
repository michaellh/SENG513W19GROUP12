import React, {Component} from 'react';

export default class Controls extends Component {
    render() {
        return (
            <div>
                <form id="controls">
                    <input type="text" id="data" autocomplete="off" autofocus/>
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}