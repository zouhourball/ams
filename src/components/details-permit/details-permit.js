import pdfIcon from 'images/pdfIcon.png'

import './style.scss'

const DetailsPermit = ({ fields }) => {
  // test to push
  const generateValues = () => {
    return fields?.map((field) => {
      switch (field?.input) {
        case 'fileInput':
          return (
            <div className="md-cell md-cell--12" key={field?.id}>
              <div className="title">{field?.title}</div>
              <div className="md-grid">
                {field?.value && (
                  <div
                    className="file md-cell md-cell--1"
                    // key={val?.fileName}
                    onClick={() =>
                      window.open(`${PRODUCT_APP_URL_API}/fm${field?.value}`)
                    }
                  >
                    <img src={pdfIcon} />
                    {/* <div>
                        <span className="croppedText">{val?.fileName}</span>
                        <span>{val?.size}</span>
                      </div> */}
                  </div>
                )}
              </div>
            </div>
          )
        case 'checkbox':
          return (
            <div className="field md-cell md-cell--4" key={field.id}>
              <span>{field.title}</span> {field.checked ? 'yes' : 'no'}
            </div>
          )
        default:
          return (
            <div className="field md-cell md-cell--4" key={field.id}>
              <span>{field.title}</span> {field.value}
            </div>
          )
      }
    })
  }
  return <div className="details-permit md-grid">{generateValues()}</div>
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
