import React, {Component} from 'react';

class FieldEditor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const text = event.target.value;
    this.props.onChange(this.props.id, text);
  }

  render() {
    const errorStyle = {
      color: 'red',
      display: this.props.hasError ? 'block' : 'none'
    }

    return (
      <div className="form-group">
        <label style={{marginBottom:0}}><b>{this.props.id}</b></label>
        <input className={"form-control " + (this.props.hasError ? 'is-invalid' : '')} onChange={this.handleChange} value={this.props.value} placeholder={this.props.placeholder} />
        <div style={errorStyle}>Invalid {this.props.id}</div>
      </div>
    );
  }
}

export default FieldEditor
