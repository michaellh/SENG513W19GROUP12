import React, {Component} from 'react';

export default class Controls extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
      this.style = {
        //   position: 'absolute',
        //   bottom:'0',
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
            <div className={this.props.className} style={this.style}>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" />
                    <button>Submit</button>
                </form>
            </div>
        )
    }
}