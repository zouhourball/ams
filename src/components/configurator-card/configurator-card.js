import { useState, useEffect } from 'react'

import { TextField, MenuButton, FontIcon, Button } from 'react-md'

import cls from 'classnames'

import ConfirmationDialog from 'components/confirmation-dialog'

import './style.scss'

const ConfiguratorCard = ({
  currentItem,
  setCurrentItem,
  id,
  title,
  onSelectItem,
  onDelete,
  onEdit,
}) => {
  const [disabled, setDisabled] = useState(true)
  const [titleCard, setTitleCard] = useState('')
  const [ConfirmationDialogVisible, setConfirmationDialogVisible] =
    useState(false)

  useEffect(() => {
    setTitleCard(title)
  }, [title])

  const menuCard = () => {
    let buttons = []

    if (onEdit) {
      buttons.push({
        primaryText: 'Edit',
        leftIcon: <FontIcon>edit</FontIcon>,
        onClick: () => {
          setDisabled(false)
        },
      })
    }

    if (onDelete) {
      buttons.push({
        primaryText: 'Delete',
        leftIcon: <FontIcon>delete</FontIcon>,
        onClick: () => {
          // onDelete()
          setConfirmationDialogVisible(true)
        },
      })
    }
    return buttons
  }

  return (
    <div
      className={cls(
        'configurator-card',
        currentItem && currentItem === id && 'active', // suppose to be id
      )}
      onClick={setCurrentItem}
    >
      <TextField
        id="title"
        lineDirection="center"
        block
        value={titleCard}
        disabled={disabled}
        onChange={setTitleCard}
      />
      {disabled === false && (
        <>
          <Button
            icon
            onClick={() => {
              setDisabled(true)
              setTitleCard(title)
            }}
          >
            close
          </Button>
          <Button
            icon
            onClick={() => {
              onEdit(titleCard, id)
              setDisabled(true)
            }}
          >
            check
          </Button>
        </>
      )}
      {disabled && (
        <MenuButton
          icon
          className="configurator-card-menuButton"
          menuItems={menuCard()}
          anchor={{
            x: MenuButton.HorizontalAnchors.INNER_RIGHT,
            y: MenuButton.VerticalAnchors.BOTTOM,
          }}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          more_vert
        </MenuButton>
      )}

      <ConfirmationDialog
        visible={ConfirmationDialogVisible}
        onClick={() => {
          onDelete(id)
          setConfirmationDialogVisible(false)
        }}
        onHide={() => setConfirmationDialogVisible(false)}
      />
    </div>
  )
}
export default ConfiguratorCard

ConfiguratorCard.defaultProps = {
  id: '1',
  title: 'Company A',
  // currentItem: '2',
}
