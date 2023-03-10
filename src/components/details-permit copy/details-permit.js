const DetailsPermit = ({ fields }) => {
  const generateValues = () => {
    return fields.map((field) => {
      switch (field.input) {
        case 'fileInput':
          return field.value.map((val) => {
            return <h1 key={val.fileName}>{val.fileName}</h1>
          })
        case 'checkbox':
          return <div key={field.id}>{field.checked ? 'yes' : 'no'}</div>
        default:
          return <div key={field.id}>{field.value}</div>
      }
    })
  }
  return <div>{generateValues()}</div>
}
export default DetailsPermit
DetailsPermit.defaultProps = {
  fields: [
    {
      id: '1',
      title: 'one',
      cellWidth: 'md-cell md-cell-4',
      input: 'textField',
      required: true,
      value: 'some value',
    },
    {
      id: '2',
      title: 'two',
      cellWidth: 'md-cell md-cell--4',
      input: 'checkbox',
      checked: true,
    },
    {
      id: '3',
      title: 'three',
      cellWidth: 'md-cell md-cell--4',
      input: 'select',
      menuItems: ['item1', 'item2', 'item3', 'item4'],
      value: 'some value2',
    },
    {
      id: '4',
      title: 'four',
      cellWidth: 'md-cell md-cell--4',
      input: 'date',
      required: true,
      value: '15 Aug 2021',
    },
    {
      id: '5',
      title: 'five',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      value: 'some value',
    },
    {
      id: '6',
      title: 'six',
      cellWidth: 'md-cell md-cell--4',
      input: 'textField',
      value: 'some value',
    },
    {
      id: '7',
      title: 'seven',
      cellWidth: 'md-cell md-cell--12',
      rows: 5,
      input: 'textArea',
      value: 'some value',
    },
    {
      id: '8',
      title: 'eight',
      cellWidth: 'md-cell md-cell--12',
      rows: 5,
      input: 'fileInput',
      value: [
        { fileName: 'file.pdf', size: '22Ko' },
        { fileName: 'file.pdf', size: '22Ko' },
        { fileName: 'file.pdf', size: '22Ko' },
      ],
    },
  ],
}
