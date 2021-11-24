import { DialogContainer, Button } from 'react-md'

import deleteIcon from './images/delete-company.png'

import './style.scss'
const ConfirmationDialog = ({
  onClick,
  title,
  description,
  btnTitle,
  imgCard,
  visible,
  onHide,
}) => {
  return (
    <DialogContainer
      className="confirmation-dialog"
      visible={visible}
      onHide={() => {}}
      title={
        <Button className="close-btn" icon onClick={() => onHide && onHide()}>
          close
        </Button>
      }
      id="confirmationDialog"
    >
      <div className="confirmation-dialog-information">
        {imgCard && <img src={imgCard} className="illustration" />}
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
      <Button
        swapTheming
        flat
        // primary
        className="confirmation-dialog-button"
        onClick={(e) => {
          e.stopPropagation()
          onClick && onClick()
        }}
      >
        {btnTitle}
      </Button>
    </DialogContainer>
  )
}

ConfirmationDialog.defaultProps = {
  title: 'Delete Company',
  description: 'Are you sure you want to delete this Company?',
  btnTitle: 'Yes, Delete',
  imgCard: deleteIcon,
}

export default ConfirmationDialog
