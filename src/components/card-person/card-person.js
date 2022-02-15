import { Avatar, Button } from 'react-md'

import './style.scss'

const CardPerson = ({ personInfo, rightIcon, selected }) => {
  const { image, fullName } = personInfo

  return (
    <div className="cardPerson">
      <Avatar src={image} className="cardPerson-image" />
      <div className="cardPerson-info">
        <div className="cardPerson-info-header">
          <div
            className={`cardPerson-info-fullName ${selected ? 'selected' : ''}`}
          >
            {fullName}
          </div>
        </div>
      </div>
      <div className="cardPerson-rightSide">{rightIcon}</div>
    </div>
  )
}
export default CardPerson
CardPerson.defaultProps = {
  personInfo: {
    image: 'https://picsum.photos/100/100',
    fullName: 'Hammad Ahmed',
  },
  rightIcon: <Button icon>delete</Button>,
}
