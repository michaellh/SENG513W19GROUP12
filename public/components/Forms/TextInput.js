import React, {Component} from 'react';

class FieldEditor extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const text = event.target.value;
    this.props.onChange(this.props.id, text);
  }

  render() {
    return (
      <div className="field-editor">
        <input onChange={this.handleChange} value={this.props.value} />
      </div>
    );
  }
}


// class TextInput extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       name: this.props.name,
//       value: "",
//       hasError: false,
//     }
//
//     this.handleChange = this.handleChange.bind(this)
//     // this.componentDidUpdate = this.componentDidUpdate.bind(this)
//     this.validate = this.validate.bind(this)
//   }
//
//   handleChange(event) {
//     this.setState({
//       value: event.target.value
//     })
//   }
//
//   validate() {
//     this.setState({
//       hasError:true
//     })
//     return true
//   }
//
//   render() {
//     const errorStyle = {
//       color: 'red',
//       display: this.state.hasError ? 'block' : 'none'
//     }
//
//     return (
//       <div className="form-group">
//         <label style={{marginBottom:0}}><b>{this.state.name}</b></label>
//         <input className={"form-control " + (this.state.hasError ? 'is-invalid' : '')} name="value" placeholder={"Enter " + this.state.name} onChange={this.handleChange} required/>
//         <div style={errorStyle}>Invalid Username</div>
//       </div>
//     )
//   }
// }

export default TextInput
