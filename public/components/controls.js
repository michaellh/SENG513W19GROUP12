import React, {Component} from 'react';

export default class Controls extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }

      this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        let input = e.target.querySelector('input');
        this.props.onMessage(input.value);
        input.value = '';
    }
    
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" />
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}