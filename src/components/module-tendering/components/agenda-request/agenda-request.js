import { useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import { stateFromHTML } from 'draft-js-import-html'
import { EditorState } from 'draft-js'

import AgendaContainer, {
  AgendaContainerBody,
  AgendaContainerFooter,
} from '../../components/agenda-container'
import MeetingCard from '../../components/meeting-card'

import './styles.scss'

const AgendaRequest = ({ className, children }) => {
  const [valueEditor, setValueEditor] = useState(
    EditorState.createWithContent(stateFromHTML('')),
  )

  const onEditorStateChange = (value) => {
    setValueEditor(value)
  }

  return (
    <div className={`agenda-request ${className}`}>
      <AgendaContainer>
        <AgendaContainerBody>New Agenda Request</AgendaContainerBody>
      </AgendaContainer>
      <div className="column-list ">
        <div className="column-list-item">
          <AgendaContainer title="Agenda">
            <AgendaContainerBody>
              <p>
                Thie agenda of this meeting is the approval of lorem ipusm euis-
                mod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut
                wisi enim ad minim veniam, quis nostrud exerci tation ullamcorp-
                er suscipit lobortis nisl ut aliquip ex ea commodo consequat.
                Duis autem vel eum iriure dolor in hendrerit in vulputate velit
                esse molestie consequat, vel illum dolore eu feugiat nulla
                facilisis at
              </p>
            </AgendaContainerBody>
            <AgendaContainerFooter
              onEdit={() => null}
              onAttachFiles={() => null}
            />
          </AgendaContainer>
          <AgendaContainer title="Meeting Objectives">
            <AgendaContainerBody>
              <p>
                To see in depth details of Abc Agenda, we will review the
                following :
              </p>
              <ul>
                <li>1) Estimated Cost and Duration of the tender submitted</li>
                <li>2) Generated 10 viable ideas for proposed agenda</li>
                <li>3) Threshold and Estimated and Approved Budge</li>
              </ul>
            </AgendaContainerBody>
            <AgendaContainerFooter
              onEdit={() => null}
              onAttachFiles={() => null}
            />
          </AgendaContainer>
          <AgendaContainer title="Meeting Objectives">
            <AgendaContainerBody>
              <ul>
                <li>1) The minutes of the last meeting were not approved.</li>
                <li>
                  2) Muhammed Mustafa reported availability of exploring
                  overseas market.
                </li>
                <li>
                  3) Shafeeq Ahmed announced that he was retiring March 1st .
                </li>
                <li>4) Mary Johnson will provide an updated minutes. .</li>
              </ul>
            </AgendaContainerBody>
            <AgendaContainerFooter
              onEdit={() => null}
              onAttachFiles={() => null}
            />
          </AgendaContainer>
        </div>
        <div className="column-list-item">
          <AgendaContainer title="Endorsement">
            <AgendaContainerBody>attachment list goes here</AgendaContainerBody>
            <AgendaContainerFooter onAttachFiles={() => null} />
          </AgendaContainer>
          <AgendaContainer title="Endorsement">
            <AgendaContainerBody>
              <Editor
                placeholder={'Write Meeting Objective here...'}
                toolbarClassName={`editorToolbar `}
                wrapperClassName={`editorWrapper `}
                editorClassName={`editorContent `}
                editorState={valueEditor}
                onEditorStateChange={onEditorStateChange}
                readOnly={false}
              />
            </AgendaContainerBody>
            <AgendaContainerFooter
              onEmoji={() => null}
              onImage={() => null}
              onAttachFiles={() => null}
            />
          </AgendaContainer>
        </div>
        <div className="column-list-item">
          <AgendaContainer title="Actions">
            <AgendaContainerBody>Actions list goes here</AgendaContainerBody>
            <AgendaContainerFooter onAddTask={() => null} />
          </AgendaContainer>
          <AgendaContainer title="Attendees(3)">
            <AgendaContainerBody>Users list goes here</AgendaContainerBody>
          </AgendaContainer>

          <AgendaContainer title="Endorsement">
            <AgendaContainerBody>
              <MeetingCard
                key={1}
                meetingId={1}
                status={'pending'}
                requestTitle={'Agenda Decision'}
                meetingTitle={
                  'This is the plan decision statement, card that will display only for chairman role. He can either accept or reject it.'
                }
                onAcceptMeeting={(id) => null}
                onRejectMeeting={(id) => null}
              />
            </AgendaContainerBody>
          </AgendaContainer>
        </div>
      </div>
    </div>
  )
}
export default AgendaRequest
