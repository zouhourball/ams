import { Button } from 'react-md'

import GenericForm from 'components/generic-form-permit'
import TopBar from 'components/top-bar'

import { navigate } from '@reach/router'

import './style.scss'

const DrillReport = () => {
  const actions = [
    <Button
      key="1"
      id="discard"
      className="top-bar-buttons-list-item-btn discard"
      flat
      onClick={() => {
        navigate(`/ams/permitting`)
      }}
    >
      Discard
    </Button>,
    <Button
      key="2"
      id="save"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Save
    </Button>,
    <Button
      key="3"
      id="submit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {}}
    >
      Submit
    </Button>,
  ]
  return (
    <div className="drill-report">
      <TopBar title="Permit to Drill Report" actions={actions} />
      <GenericForm />
    </div>
  )
}
export default DrillReport
