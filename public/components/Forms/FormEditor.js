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
        errorMessage={field.errorMessage != null ? field.errorMessage : "Invalid " + field.name}
        onChange={this.handleFieldChange}
        value={this.props[field.name]}
        type={field.type != null ? field.type : "text"}
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
