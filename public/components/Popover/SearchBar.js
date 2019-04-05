import React, { Component } from 'react'

export default class SearchBar extends Component {
    
    constructor(props) {
        super(props)

        this.state = {
            text : ''
        }
        
        this.textInput = React.createRef();
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentWillUnmount() {
        this.props.filterMessages('');
    }
    
    componentDidMount(){
        this.textInput.current.focus();
    }
    
    handleOnChange(e) {
        this.props.filterMessages(e.target.value);  
    }
  
    render() {
        return (
        <div>
            <input ref={this.textInput} className='form-control' onChange={this.handleOnChange}></input>
        </div>
        )
    }
}

// import React from 'react'

// export default function SearchBar(props) {
//     let handleOnChange = (e) => {
//        props.filterMessages(e.target.value);
//     }
//     return (
//         <div>
//             <input className='form-control' onChange={handleOnChange}></input>
//         </div>
//     )
// }
