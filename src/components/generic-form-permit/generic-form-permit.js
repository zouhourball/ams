import { TextField, Checkbox, SelectField, DatePicker, FontIcon } from 'react-md'

import './style.scss'

const GenericForm = ({ fields }) => {
  const renderFields = () =>
    fields.map((field) => {
      if (field.input === 'checkbox') {
        return (
          <Checkbox
            id={field.id}
            className={`${field.cellWidth} checkBox `}
            required={field.required}
            label={field.title}
          />
        )
      } else if (field.input === 'select') {
        return (
          <SelectField
            id={field.id}
            className={`${field.cellWidth} field selectField`}
            required={field.required}
            menuItems={field.menuItems}
            position={SelectField.Positions.BOTTOM_RIGHT}
            sameWidth
            placeholder={field.title}
            block
          />
        )
      } else if (field.input === 'date') {
        return (
          <DatePicker
            id={field.id}
            className={`${field.cellWidth} field datePicker`}
            required={field.required}
            placeholder={field.title}
            icon={false}
            rightIcon={<FontIcon className="mdi mdi-calendar" />}
            block
          />
        )
      } else if (field.input === 'textArea') {
        return (
          <TextField
            id={field.id}
            rows={field.rows}
            className={`${field.cellWidth} field`}
            required={field.required}
            placeholder={field.title}
            block
          />
        )
      } else {
        return (
          <TextField
            id={field.id}
            className={`${field.cellWidth} field`}
            required={field.required}
            placeholder={field.title}
            block
          />
        )
      }
    })

  return <div className="md-grid genericForm">{renderFields()}</div>
}
export default GenericForm
GenericForm.defaultProps = {
  fields: [
    {
      id: '1',
      title: 'one',
      cellWidth: 'md-cell md-cell-4',
      input: 'textField',
      required: true,
    },
    {
      id: '2',
      title: 'two',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
    },
    {
      id: '3',
      title: 'three',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: ['item1', 'item2', 'item3', 'item4'],
    },
    {
      id: '4',
      title: 'four',
      cellWidth: 'md-cell md-cell--4',
      input: 'date',
      required: true,
    },
    {
      id: '5',
      title: 'five',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
    },
    {
      id: '6',
      title: 'six',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
    },
    {
      id: '7',
      title: 'seven',
      cellWidth: 'md-cell md-cell--12',
      rows: 5,
      input: 'textArea',
    },
  ],
}
