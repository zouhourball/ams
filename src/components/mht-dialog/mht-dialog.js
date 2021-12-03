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
  propsDataTable,
  propsConfigs,
  headerTemplate = {},
}) => {
  const actions = [
    {
      children: 'Discard',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onHide && onHide(),
    },
    {
      children: 'Save',
      primary: true,
      flat: true,
      swapTheming: true,
      onClick: () => {
        onSave && onSave()
      },
    },
    {
      children: 'Commit',
      primary: true,
      flat: true,
      swapTheming: true,
      onClick: () => {
        onCommit && onCommit()
      },
    },
  ]

  return (
    <DialogContainer
      className="mht-dialog"
      visible={visible}
      onHide={onHide}
      actions={actions}
    >
      <Mht
        id="mht-dialog"
        configs={propsConfigs}
        tableData={propsDataTable}
        withSearch
        title={title}
        commonActions
        withSubColumns
        headerTemplate={headerTemplate}
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
