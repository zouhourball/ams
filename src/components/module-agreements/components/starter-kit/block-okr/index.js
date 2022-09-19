import okrIcon from 'images/apps/okrs.svg'
import PropTypes from 'prop-types'

import './styles.scss'

export default function BlockOKR (props) {
  const { title, ...rest } = props
  return (
    <section className="app-starterkit-blockokr-container" {...rest}>
      <img className="app-starterkit-blockokr-icon" src={okrIcon} />
      <h2 className="app-starterkit-blockokr-title">{title}</h2>
    </section>
  )
}

BlockOKR.defaultProps = {
  title: 'OKR',
}

BlockOKR.propTypes = {
  title: PropTypes.string,
}
