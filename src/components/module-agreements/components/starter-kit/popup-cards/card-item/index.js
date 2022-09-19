import { memo } from 'react'
import { Button, FontIcon } from 'react-md'
import './styles.scss'

const CardItem = ({ action = {} }) => {
  const {
    label,
    mdIcon,
    iconSrc,
    onClick,
    onBtnClick,
    iconClassName,
    withoutBtn,
  } = action
  return (
    <div
      onClick={() => {
        onClick && onClick()
      }}
      className="ws-bigcard-item"
    >
      <div className="ws-bigcard-item-inner-wrap">
        <div className="ws-bigcard-item-icon">
          {mdIcon ? (
            <FontIcon iconClassName={mdIcon} />
          ) : (
            <img src={iconSrc} className={iconClassName} />
          )}
        </div>
        <div className="ws-bigcard-item-label"> {label} </div>
      </div>
      {!withoutBtn ? (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            if (onBtnClick) {
              onBtnClick()
            } else {
              onClick && onClick()
            }
          }}
          icon
          className="ws-bigcard-item-btn"
          iconClassName="mdi mdi-arrow-right ws-bigcard-item-btn-icon"
        />
      ) : null}
    </div>
  )
}

export default memo(CardItem)
