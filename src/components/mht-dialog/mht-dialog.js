import { DialogContainer } from 'react-md'

import Mht from '@target-energysolutions/mht'

import './style.scss'

import { flaringDetailsConfigs, flaringDetailsData } from './helpers'
const MHTDialog = ({ mhtData, title, visible, onHide, onSave }) => {
  const actions = [
    {
      children: 'Discard',
      primary: false,
      flat: true,
      swapTheming: true,
      onClick: () => onHide && onHide(),
    },
    {
      children: 'Commit',
      primary: true,
      flat: true,
      swapTheming: true,
      onClick: () => {
        onSave && onSave()
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
        configs={flaringDetailsConfigs}
        tableData={flaringDetailsData}
        withSearch
        title={title}
        commonActions
        withSubColumns
      />
    </DialogContainer>
  )
}

export default MHTDialog
MHTDialog.defaultProps = {
  title: 'Annual Report 2021.xlsx',
}
