import { Button } from 'react-md'

import './style.scss'

const HeaderTemplate = ({ title, actions = [] }) => {
  return (
    <div className="header-template">
      <h6 className="header-template-tile">{title}</h6>
      <div className="header-template-actions">
        {actions?.map((el) => (
          <Button
            primary
            onClick={el?.onClick}
            flat
            className="header-template-actions-btn"
            key={el?.id}
            id={el?.id}
          >
            {el?.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
export default HeaderTemplate