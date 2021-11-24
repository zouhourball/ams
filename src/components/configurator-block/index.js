import { FontIcon } from 'react-md'

import './style.scss'

const ConfiguratorBlock = ({ children, status, title }) => {
  return (
    <div className={`configurator-block ${status}`}>
      <div className="dashed-underline">
        <h3>{title}</h3>
        {status === 'closed' && <FontIcon className="mdi mdi-lock-outline" />}
      </div>
      {children}
    </div>
  )
}

export default ConfiguratorBlock
