import React from 'react'
import CardItem from '../card-item'
import cls from 'classnames'
import './styles.scss'

const CardLayout = ({
  title,
  subTitle,
  description,
  className,
  actions,
  iconSrc,
  background,
  style = {},
  ...rest
}) => {
  return (
    <div
      style={{ ...style, background }}
      className={cls('ws-bigcard-layout', className || '')}
      {...rest}
    >
      <div className="ws-bigcard-layout-content">
        <div className="ws-bigcard-layout-content-title">{title}</div>
        <div className="ws-bigcard-layout-content-bottom">
          <div className="ws-bigcard-layout-content-text">
            {subTitle ? (
              <div className="ws-bigcard-layout-content-subtitle">
                {subTitle}
              </div>
            ) : null}
            {description}
          </div>
          <div className="ws-bigcard-layout-content-right">
            <img className="ws-bigcard-layout-icon" src={iconSrc} />
          </div>
        </div>
      </div>
      <div>
        {actions.map(i => (
          <CardItem key={i.label} action={i} />
        ))}
      </div>
    </div>
  )
}

export default CardLayout
