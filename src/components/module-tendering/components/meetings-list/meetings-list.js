import { useEffect } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'

import MeetingSection from '../../components/meeting-section'

import './styles.scss'

const MeetingsList = ({ proposalId, setIsVisibleTopBar, role }) => {
  useEffect(() => {
    setIsVisibleTopBar(true)
  }, [])

  return (
    <div className="meetings-list">
      <div className="white-box">
        <div className="backButton">
          <Button
            onClick={() => navigate(`/tendering/fbp/${proposalId}`)}
            icon
            primary
          >
            arrow_back
          </Button>
        </div>
        <strong>Description:</strong> Some description of the workspace can be
        mentioned here and its size can vary as per content.
      </div>
      <MeetingSection proposalId={proposalId} role={role} />
    </div>
  )
}

export default MeetingsList
