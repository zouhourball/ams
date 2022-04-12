import { useState, useRef, useEffect } from 'react'
import {
  DialogContainer,
  Button,
  TextField,
  FontIcon,
  Avatar,
  // SelectField,
} from 'react-md'
import HtmlEditor from './html-editor'
import { connect } from 'react-redux'
import { ReactMic } from 'react-mic'
import moment from 'moment'
import { graphql } from 'react-apollo'
import { get } from 'lodash-es'
import UserInfoBySubject from 'components/user-info-by-subject'

import { DatePicker } from '@target-energysolutions/date-picker'

import workspacesByID from 'libs/queries/workspace-by-id.gql'
import meWorkspacesByOrganization from 'libs/queries/me-workspaces.gql'
import { cls } from 'reactutils'
import { getPublicUrl } from 'libs/utils/custom-function'
import { uploadFile } from 'libs/api/api-file-uploader-tus'

import * as act from 'modules/app/actions'

import ToastMsg from 'components/toast-msg'

import './style.scss'

const CreateAgenda = ({
  visible,
  onHideDialog,
  onSave,
  workspacesByID,
  currentUser,
  disabled,
  proposalList,
  addToast,
  workspaces,
  workspace,
  members,
  // setWorkspace,
}) => {
  const formatDefaultDescription = (
    referenceNumber,
    companyName,
    contractTitle,
  ) => {
    return `<p><strong>Reference Number: </strong>${referenceNumber}, &nbsp &nbsp &nbsp <strong>Company: </strong>${companyName}, &nbsp &nbsp &nbsp <strong>Contract Title: </strong>${contractTitle}</p>`
  }
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [selectedItems, setSelectedItems] = useState([])
  const [visibleDate, setVisibleDate] = useState(false)
  const [VisibleStartDatePicker, setVisibleStartDatePicker] = useState(false)
  const [VisibleEndDatePicker, setVisibleEndDatePicker] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState(proposalList[0].id)
  const [step, setStep] = useState(1)
  const [searchText, setSearchText] = useState('')
  const [record, setRecord] = useState(false)
  const [chapters, setChapters] = useState(
    proposalList.map(({ id, companyName, referenceNumber, contractTitle }) => ({
      id,
      chapter: referenceNumber,
      voiceMemos: [],
      objective: '',
      agenda: formatDefaultDescription(
        referenceNumber,
        companyName,
        contractTitle,
      ),
    })),
  )
  const [allMembers, setMembers] = useState([])
  useEffect(() => {
    members().then((res) => {
      setMembers(res?.data)
    })
  }, [])

  const handleStartDate = (date) => {
    const validDate = moment(date.timestamp).format('DD-MM-YYYY')
    setDate(validDate)
    setVisibleDate(false)
  }

  const onHide = () => {
    setTitle('')
    setDate('')
    setStartTime('')
    setEndTime('')
    setSelectedItems([])
    onHideDialog()
  }
  const handleStartTime = (startTime) => {
    setStartTime(moment(startTime.timestamp).format(`HH:mm`))
    setVisibleStartDatePicker(false)
  }
  const cancelStartTime = () => {
    setVisibleStartDatePicker(false)
  }
  const handleEndTime = (endTime) => {
    setEndTime(moment(endTime.timestamp).format(`HH:mm`))
    setVisibleEndDatePicker(false)
  }
  const cancelEndTime = () => {
    setVisibleEndDatePicker(false)
  }
  const validDialog = () => {
    let notValid = false
    if (!date) {
      notValid = true
    }
    if (!title) {
      notValid = true
    }
    if (!startTime) {
      notValid = true
    }
    if (!endTime) {
      notValid = true
    }
    // if (selectedItems.length === 0) {
    //   notValid = true
    // }
    return notValid
  }

  const actions = []
  actions.push(
    <div>
      <Button flat onClick={onHide}>
        DISCARD
      </Button>
      <Button flat onClick={() => setStep(1)}>
        BACK
      </Button>
      <Button
        flat
        primary
        disabled={validDialog() || disabled}
        onClick={() =>
          onSave({
            date,
            title,
            endTime,
            startTime,
            selectedItems,
            chapters,
            workspace: workspaces.find((el) => el.id === workspace) || {},
          })
        }
      >
        CREATE
      </Button>
    </div>,
  )
  const nextActions = []
  nextActions.push(
    <div>
      <Button flat onClick={onHide}>
        CANCEL
      </Button>
      <Button flat primary onClick={() => setStep(2)}>
        NEXT
      </Button>
    </div>,
  )

  const renderMembers = () => {
    // const members =
    /* [
      { user: get(workspacesByID, 'workspaceByID.createdBy', { profile: {} }) },
      ...get(workspacesByID, 'workspaceByID.wsUsers.wsUsers', []),
    ].filter(({ user: { subject } }) => subject !== currentUser) */
    // const test = allMembers.map((sub) => {
    //   return (
    //     <UserInfoBySubject key={sub} subject={sub}>
    //       {(res) => res}
    //     </UserInfoBySubject>
    //   )
    // })
    // console.log(test, 'test')
    // let formatedMembers = allMembers.map((sub) => {
    //   return (
    //     <UserInfoBySubject key={sub} subject={sub}>
    //       {(res) => {
    //         // console.log(res, 'responseeeeeeee')
    //         return {
    //           subject: sub,
    //           name: res?.fullName,
    //           // imageUrl: res?.,
    //           // email: get(el, 'user.profile.email', ''),
    //         }
    //       }}
    //     </UserInfoBySubject>
    //   )
    // })
    if (searchText) {
      // const expr = new RegExp(searchText, 'i')
      /* let formattedMembers = allMembers?.filter(
        (nal) => expr.test(nal['email']) || expr.test(nal['name']),
      ) */
    }
    const memberSelected = selectedItems.map((el) => el.subject)
    return allMembers?.map((sub, index) => {
      return (
        <UserInfoBySubject key={sub} subject={sub}>
          {(res) =>
            res?.fullName && (
              <div
                key={index}
                className={cls(
                  'member md-cell md-cell--4',
                  memberSelected.includes(res?.subject) ? 'selected' : '',
                )}
                onClick={() => onSelectMember(res)}
              >
                <Avatar
                  src={getPublicUrl(res?.photo?.aPIURL)}
                  className="member_avatar"
                />

                <div className="member_info">
                  <div className="member_info_fullName">{res?.fullName}</div>
                  <div className="member_info_email">{res?.email}</div>
                </div>
              </div>
            )
          }
        </UserInfoBySubject>
      )
    })
  }

  const startRecording = () => {
    setRecord(true)
  }

  const stopRecording = () => {
    setRecord(false)
  }

  const onDeleteRecording = (position) => {
    setChapters(
      chapters.map((elem) =>
        elem.id === selectedProposal
          ? {
            ...elem,
            voiceMemos: elem.voiceMemos.filter(
              (elem, index) => index !== position,
            ),
          }
          : elem,
      ),
    )
  }

  const onStop = (recordedBlob) => {
    const onError = (error) => {
      addToast(
        <ToastMsg
          text={get(
            error,
            'message',
            'Something went wrong. Please try again later.',
          )}
          type="error"
        />,
      )
    }

    // const onProgress = (bytesUploaded, bytesTotal) => {
    //   var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
    //   console.log(bytesUploaded, bytesTotal, percentage + '%')
    // }

    const onProgress = () => null

    const onSuccess = (blob, url, name) => {
      const voiceMemo = {
        blob,
        url,
        name,
      }
      setChapters(
        chapters.map((elem) =>
          elem.id === selectedProposal
            ? { ...elem, voiceMemos: [...elem.voiceMemos, voiceMemo] }
            : elem,
        ),
      )
    }
    uploadFile(
      recordedBlob.blob,
      moment().format('YYYY/MM/DD HH:mm:ss'),
      onError,
      onProgress,
      onSuccess,
      workspace,
      'tendering-agenda',
    )
  }
  const onSelectMember = (member) => {
    const memberSelected = selectedItems.map((el) => el.subject)
    if (memberSelected.includes(member.subject)) {
      setSelectedItems([
        ...selectedItems.filter((el) => el.subject !== member.subject),
      ])
    } else {
      setSelectedItems([...selectedItems, member])
    }
  }

  const renderListProposal = () => {
    return chapters.map((chapter, index) => (
      <ProposalChips
        key={index}
        proposal={chapter}
        index={index}
        selectedProposal={selectedProposal}
        setSelectedProposal={setSelectedProposal}
        chapters={chapters}
        setChapters={setChapters}
      />
    ))
  }

  return (
    <DialogContainer
      id="add-new-agenda"
      className="add-new-agenda"
      title={step === 1 ? 'Create Agenda' : 'Invite Members'}
      onHide={onHide}
      actions={step === 1 ? nextActions : actions}
      visible={visible}
    >
      {step === 1 ? (
        <div className="md-grid">
          <TextField
            required
            id="meeting-title"
            label="Meeting Title"
            className="add-new-agenda-textField md-cell md-cell--12"
            onChange={(value) => setTitle(value)}
            value={title}
          />
          {/* <SelectField
            required
            id="workspace-id"
            menuItems={workspaces}
            itemLabel="name"
            itemValue="id"
            label="Select Workspace"
            position={SelectField.Positions.BELOW}
            className="add-new-agenda-selectField md-cell md-cell--6"
            onChange={(value) => setWorkspace(value)}
            value={workspace}
            block
          /> */}
          <TextField
            required
            id="agenda-date"
            label="Meeting Date"
            className="add-new-agenda-textField md-cell md-cell--4"
            value={date}
            onClick={() => setVisibleDate(true)}
            rightIcon={<FontIcon iconClassName="mdi mdi-calendar" />}
          />

          {visibleDate && (
            <DatePicker
              singlePick
              startView="year"
              endView="day"
              defaultView="day"
              className="meeting-date"
              translation={{ update: 'select' }}
              onUpdate={handleStartDate}
              onCancel={() => setVisibleDate(false)}
              startDate={
                date
                  ? {
                    year: date.split('-')[2],
                    month: date.split('-')[1],
                    day: date.split('-')[0],
                  }
                  : {
                    year: new Date().getFullYear(),
                    month: new Date().getMonth() + 1,
                    day: new Date().getDate(),
                  }
              }
            />
          )}
          <TextField
            required
            className="add-new-agenda-textField md-cell md-cell--4"
            id="calendar-end-date"
            label={'Select Start Time'}
            value={startTime}
            onClick={() => setVisibleStartDatePicker(true)}
            rightIcon={<FontIcon iconClassName="mdi mdi-clock" />}
            onChange={() => null}
          />
          {VisibleStartDatePicker && (
            <div className="overlay">
              <DatePicker
                translation={{ update: 'select' }}
                startView="time"
                startDate={{
                  year: date ? date.split('-')[2] : new Date().getFullYear(),
                  month: date ? date.split('-')[1] : new Date().getMonth(),
                  day: date ? date.split('-')[0] : new Date().getDate(),
                  hour: startTime
                    ? startTime.split(':')[0]
                    : new Date().getHours(),
                  minute: startTime
                    ? startTime.split(':')[1]
                    : new Date().getMinutes(),
                }}
                className="calendar-time-picker start-time"
                singlePick
                onUpdate={(startTime) => handleStartTime(startTime)}
                onCancel={() => cancelStartTime()}
              />
            </div>
          )}
          <TextField
            required
            className="add-new-agenda-textField md-cell md-cell--4"
            id="calendar-end-date"
            label={'Select End Time'}
            value={endTime}
            onClick={() => setVisibleEndDatePicker(true)}
            rightIcon={<FontIcon iconClassName="mdi mdi-clock" />}
            onChange={() => null}
          />
          {VisibleEndDatePicker && (
            <div className="overlay">
              <DatePicker
                translation={{ update: 'select' }}
                startView="time"
                startDate={{
                  year: date ? date.split('-')[2] : new Date().getFullYear(),
                  month: date ? date.split('-')[1] : new Date().getMonth(),
                  day: date ? date.split('-')[0] : new Date().getDate(),
                  hour: endTime ? endTime.split(':')[0] : new Date().getHours(),
                  minute: endTime
                    ? endTime.split(':')[1]
                    : new Date().getMinutes(),
                }}
                className="calendar-time-picker end-time"
                singlePick
                onUpdate={(endTime) => handleEndTime(endTime)}
                onCancel={() => cancelEndTime()}
              />
            </div>
          )}
          <div className="md-cell md-cell--12">Chapters</div>
          <div className="proposalList">{renderListProposal()}</div>
          <div className="voiceMemo md-cell md-cell--12">
            <div
              key={get(
                chapters.find(({ id }) => id === selectedProposal) || {},
                'voiceMemos',
                [],
              )}
              className="voiceMemo_content"
            >
              <ReactMic
                record={record}
                className="voiceMemo_reactMic"
                onStop={onStop}
                // onData={onData}
                strokeColor="#000000"
                // backgroundColor="#FF4081"
              />
              <p>Voice Memo</p>
              {!record ? (
                <Button
                  icon
                  iconClassName="mdi mdi-microphone-outline"
                  onClick={startRecording}
                  className="micButton startButton"
                />
              ) : (
                <Button
                  icon
                  iconClassName="mdi mdi-microphone-outline"
                  onClick={stopRecording}
                  className="micButton stopButton"
                />
              )}
            </div>
          </div>
          {get(
            chapters.find(({ id }) => id === selectedProposal) || {},
            'voiceMemos',
            [],
          ).map(({ name }, index) => (
            <div key={index} className="voiceMemo md-cell md-cell--12">
              <div className="voiceMemo_content">
                <p>{name}</p>
                <Button
                  icon
                  iconClassName="mdi mdi-delete"
                  onClick={() => onDeleteRecording(index)}
                  className="micButton"
                />
              </div>
            </div>
          ))}
          <div className="md-cell md-cell--12">Agenda</div>
          <div className="md-cell md-cell--12">
            <HtmlEditor
              key={selectedProposal}
              value={get(
                chapters.find(({ id }) => id === selectedProposal) || {},
                'agenda',
                '',
              )}
              onChange={(agenda) =>
                setChapters(
                  chapters.map((elem) =>
                    elem.id === selectedProposal ? { ...elem, agenda } : elem,
                  ),
                )
              }
              customToolbar={{
                options: [
                  'inline',
                  'list',
                  'textAlign',
                  'link',
                  'fontSize',
                  'fontFamily',
                  'blockType',
                  'image',
                  'remove',
                  'history',
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
          <div className="md-cell md-cell--12">Objective</div>
          <div className="md-cell md-cell--12">
            <HtmlEditor
              key={selectedProposal}
              value={get(
                chapters.find(({ id }) => id === selectedProposal) || {},
                'objective',
                '',
              )}
              onChange={(objective) =>
                setChapters(
                  chapters.map((elem) =>
                    elem.id === selectedProposal
                      ? { ...elem, objective }
                      : elem,
                  ),
                )
              }
              customToolbar={{
                options: [
                  'inline',
                  'list',
                  'textAlign',
                  'link',
                  'fontSize',
                  'fontFamily',
                  'blockType',
                  'image',
                  'remove',
                  'history',
                ],
                inline: { inDropdown: true },
                list: { inDropdown: true },
                textAlign: { inDropdown: true },
                link: { inDropdown: true },
                history: { inDropdown: true },
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="selectMembers_header">
            <TextField
              id="members"
              value={searchText}
              placeholder="Invite member by searching name or email"
              leftIcon={<FontIcon>search</FontIcon>}
              onChange={setSearchText}
              className="selectMembers_header_textField"
              block
            />
            <Button
              icon
              iconClassName="mdi mdi-tune"
              className="selectMembers_header_btn"
            />
          </div>
          <div className="selectMembers md-grid">{renderMembers()}</div>
        </>
      )}
    </DialogContainer>
  )
}

// graphql(workspacesByID, {
//   options: () => {
//     return {
//       variables: { id: '1619' },
//       notifyOnNetworkStatusChange: true,
//       context: {
//         uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
//       },
//     }
//   },
//   props: ({ data }) => {
//     return { workspaceName: get(data, 'workspaceByID.name', '') }
//   },
// })
// ------------------

// graphql(meWorkspacesByOrganization, {
//   options: ({ organizationID }) => {
//     return {
//       variables: { organizationID: organizationID || '313' },
//       notifyOnNetworkStatusChange: true,
//       context: {
//         uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
//       },
//     }
//   },

//   props: ({ data }) => {
//     return {
//       workspaces: get(data, 'meWorkspacesByOrganization.workspaces', []),
//     }
//   },
// })
// ------------------------
export default graphql(meWorkspacesByOrganization, {
  options: ({ organizationID }) => {
    return {
      variables: { organizationID: organizationID || '313' },
      notifyOnNetworkStatusChange: true,
      context: {
        uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
      },
    }
  },

  props: ({ data }) => {
    return {
      workspaces: get(data, 'meWorkspacesByOrganization.workspaces', []),
    }
  },
})(
  graphql(workspacesByID, {
    options: ({ workspace }) => {
      // debugger
      return {
        variables: { id: '2749' },
        notifyOnNetworkStatusChange: true,
        context: {
          uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
        },
      }
    },

    props: ({ data }) => {
      return { workspacesByID: data }
    },
  })(
    connect(
      ({ query }) => ({
        currentUser: get(query, 'DEFAULT.me.data.subject', null),
      }),
      {
        addToast: act.addToast,
      },
    )(CreateAgenda),
  ),
)

CreateAgenda.defaultProps = {
  proposalList: [
    {
      chapter: 'Proposal A',
      id: 1,
    },
    {
      chapter: 'Proposal B',
      id: 2,
    },
    {
      chapter: 'Proposal C',
      id: 3,
    },
  ],
}
const ProposalChips = ({
  proposal,
  selectedProposal,
  setSelectedProposal,
  chapters,
  setChapters,
}) => {
  const [editMode, setEditMode] = useState(false)
  const [newContractTitle, setNewContractTitle] = useState(proposal.chapter)

  const myRef = useRef(null)

  const outSideClick = {
    [`outSideClick-${proposal.id}`]: (e) => {
      if (myRef.current && myRef.current.contains(e.target)) {
        return
      }
      setEditMode(false)
    },
  }

  useEffect(() => {
    document.addEventListener(
      'mousedown',
      outSideClick[`outSideClick-${proposal.id}`],
    )
    return () => {
      document.removeEventListener(
        'mousedown',
        outSideClick[`outSideClick-${proposal.id}`],
      )
    }
  }, [])

  useEffect(() => {
    if (!editMode) {
      setChapters(
        chapters.map((elem) =>
          elem.id === proposal.id
            ? { ...elem, chapter: newContractTitle }
            : elem,
        ),
      )
    }
  }, [editMode])

  return (
    <div
      ref={myRef}
      className={cls(
        'proposalItem',
        selectedProposal === proposal.id ? 'checked' : '',
        editMode ? 'checkedTextField' : '',
      )}
      onClick={() => {
        setSelectedProposal(proposal.id)
      }}
    >
      <Button icon iconClassName="mdi mdi-drag" className="proposalItem_btn" />
      {editMode ? (
        <TextField
          className="proposalItem-textField"
          block
          value={newContractTitle}
          onChange={(v) => setNewContractTitle(v)}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              setEditMode(false)
              ev.preventDefault()
            }
          }}
        />
      ) : (
        <span className="proposalItem_name">{proposal.chapter}</span>
      )}
      {!editMode && (
        <Button
          icon
          iconClassName="mdi mdi-pencil"
          className="proposalItem_editBtn"
          onClick={() => setEditMode(true)}
        />
      )}
    </div>
  )
}
