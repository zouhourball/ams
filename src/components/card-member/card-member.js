import { Avatar, FontIcon, Button } from 'react-md'
import { cls } from 'reactutils'

import avatar from 'images/avatar.png'

import './style.scss'
const CardMember = ({
  data,
  className,
  onSelectItem,
  selected,
  view,
  onDelete,
}) => {
  const { fullName, title, image } = data
  return (
    <div
      className={cls('cardMember', className)}
      onClick={() => onSelectItem && onSelectItem(data)}
    >
      {!view && (
        <FontIcon
          iconClassName={`avatarCompanyCheckbox mdi mdi-checkbox${
            selected ? '-marked selected' : '-blank-outline'
          }`}
        />
      )}
      <Avatar src={image || avatar} />
      <div className="cardItem-info">
        <div className="cardItem-info-fullName">{fullName || ''}</div>
        <div className="cardItem-info-job">{ title || ''}</div>
      </div>
      {view && (
        <Button
          icon
          iconClassName="mdi mdi-delete"
          onClick={onDelete}
          className="delete-button"
        />
      )}
    </div>
  )
}
export default CardMember
