import { DialogContainer } from 'react-md'

import Mht from '@target-energysolutions/mht'

import './style.scss'

import { propsConfigs, propsDataTable } from './helpers'
const MHTDialog = ({
  mhtData,
  title,
  visible,
  onHide,
  onSave,
  onCommit,
  onUpdate,
  propsDataTable,
  propsConfigs,
  headerTemplate,
  footerTemplate = <div />,
  id,
}) => {
  const actions = () => {
    let buttons = [
      {
        children: 'Discard',
        primary: false,
        flat: true,
        swapTheming: true,
        onClick: () => onHide && onHide(),
      },
    ]

    if (onSave && !id) {
      buttons.push({
        children: 'Save',
        primary: true,
        flat: true,
        swapTheming: true,
        onClick: () => {
          onSave && onSave()
        },
      })
    }
    if (onCommit && !id) {
      buttons.push({
        children: 'Commit',
        primary: true,
        flat: true,
        swapTheming: true,
        onClick: () => {
          onCommit && onCommit()
        },
      })
    }
    if (onUpdate && id) {
      buttons.push({
        children: 'Update',
        primary: true,
        flat: true,
        swapTheming: true,
        onClick: () => {
          onUpdate && onUpdate()
        },
      })
    }
    return buttons
  }

  return (
    <DialogContainer
      className="mht-dialog"
      visible={visible}
      onHide={onHide}
      actions={actions()}
    >
      <Mht
        id="mht-dialog"
        configs={propsConfigs}
        tableData={propsDataTable}
        withSearch
        title={title}
        commonActions
        withFooter
        withSubColumns
        headerTemplate={headerTemplate}
        footerTemplate={footerTemplate}
      />
    </DialogContainer>
  )
}

export default MHTDialog
MHTDialog.defaultProps = {
  title: 'Annual Report 2021.xlsx',
  propsConfigs,
  propsDataTable,
}
