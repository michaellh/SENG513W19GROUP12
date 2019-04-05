import React, {Component} from 'react';
import FieldEditor from './FieldEditor';

class FormEditor extends Component {
  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  handleFieldChange(fieldId, value) {
    this.props.onChange(fieldId, value);
  }

  render() {
    const fields = this.props.fields.map(field => (
      <FieldEditor
        key={field.name}
        id={field.name}
        placeholder={field.placeholder}
        hasError={field.hasError}
        onChange={this.handleFieldChange}
        value={this.props[field.name]}
      />
    ));

    return (
      <div>
        {fields}
      </div>
    );
  }
}

export default FormEditor
