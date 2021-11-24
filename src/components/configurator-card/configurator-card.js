import { useState, useEffect } from 'react'

import { TextField, MenuButton, FontIcon, Button } from 'react-md'

import { cls } from 'reactutils'

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

  const menuCard = [
    {
      primaryText: 'Edit',
      leftIcon: <FontIcon>edit</FontIcon>,
      onClick: () => {
        setDisabled(false)
      },
    },
    {
      primaryText: 'Delete',
      leftIcon: <FontIcon>delete</FontIcon>,
      onClick: () => {
        // onDelete()
        setConfirmationDialogVisible(true)
      },
    },
  ]
  return (
    <div
      className={cls(
        'configurator-card',
        currentItem && currentItem === title && 'active', // suppose to be id
      )}
      onClick={() => {
        setCurrentItem(title) // suppose to be id
      }}
    >
      <TextField
        id="title"
        lineDirection="center"
        block
        value={titleCard}
        disabled={disabled}
        onChange={(v) => setTitleCard(v)}
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
          <Button icon onClick={onEdit && onEdit}>
            check
          </Button>
        </>
      )}
      {disabled && (
        <MenuButton
          icon
          className="configurator-card-menuButton"
          menuItems={menuCard}
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
          onDelete()
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
