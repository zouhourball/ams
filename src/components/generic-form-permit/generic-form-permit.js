import { TextField, Checkbox, SelectField, DatePicker } from 'react-md'

const GenericForm = () => {
  const fields = [
    { id: '1',
      label: 'one',
      cellWidth: 'md-cell-6',
      input: 'textField',
      required: true,
    },
    { id: '2', label: 'two', cellWidth: 'md-cell md-cell--8', input: 'checkbox' },
    { id: '3', label: 'three', cellWidth: 'md-cell md-cell--4', input: 'select' },
    { id: '4', label: 'four', cellWidth: 'md-cell md-cell--6', input: 'date', required: true },
    { id: '5', label: 'five', cellWidth: 'md-cell md-cell--6', input: 'textField' },
    { id: '6', label: 'six', cellWidth: 'md-cell md-cell--6', input: 'textField' },
    { id: '7', label: 'seven', cellWidth: 'md-cell md-cell--6', rows: 5, input: 'textArea' },
  ]
  const renderFields = () =>
    fields.map((field) => {
      if (field.input === 'checkbox') {
        return <Checkbox id={field.id} className={`${field.cellWidth}`} />
      } else if (field.input === 'select') {
        return <SelectField id={field.id} className={`${field.cellWidth}`} />
      } else if (field.input === 'date') {
        return <DatePicker id={field.id} className={`${field.cellWidth}`} />
      } else if (field.input === 'textArea') {
        return <TextField id={field.id} rows={field.rows} className={`${field.cellWidth}`} />
      } else return <TextField id={field.id} className={`${field.cellWidth}`} />
    })

  return (
    <div className="md-grid">
      {renderFields()}
    </div>
  )
}
export default GenericForm
