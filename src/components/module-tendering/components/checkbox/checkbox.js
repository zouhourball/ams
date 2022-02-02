import { SelectField } from 'react-md'

import './style.scss'
const Checkbox = ({ onCheck, data, clicked, index }) => {
  return (
    <div
      id={`checkbox-${index}`}
      className={`checkbox ${clicked} `}
      onClick={() => onCheck(data.id)}
    >
      <div className="checkbox-key">{data.key}</div>
      <div className="checkbox-imageContainer">
        <img
          src={
            'https://previews.123rf.com/images/ngonhan/ngonhan1210/ngonhan121000852/15872847-dark-blue-abstract-art-backgrounds.jpg'
          }
          className="checkbox-imageContainer-image"
        />
      </div>
      <div className="checkbox-select">
        <span className="checkbox-value">{data.value}</span>
        <SelectField
          menuItems={[]}
          onChange={() => {}}
          className="checkbox-menu"
        />
      </div>
    </div>
  )
}
export default Checkbox
