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
                    <div className='input-group'>
                        <input type="text" className='form-control' />
                        <div className='input-group-append'>
                            <button className='btn btn-dark'>Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}