import { useState } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from /*, {
  setSelectedRow as setSelectedRowAction,
} */ '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
// import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

import TopBarDetailAudit from 'components/top-bar-detail-audit'
import SupportedDocument from 'components/supported-document'
import CreateAuditSpace from 'components/audit-module/create-audit-space'
import ToastMsg from 'components/toast-msg'
import EnquiryDialog from 'components/enquiry-dialog'
import HeaderTemplate from 'components/header-template'
import EnquireDetailsDialog from 'components/audit-module/enquire-details-dialog'
import InviteParticipantDialog from 'components/audit-module/invite-participant-dialog'
import ResponseDetailsDialog from 'components/audit-module/response-details-dialog'
import CreateActionDialog from 'components/audit-module/create-action-dialog'

import { addToast } from 'modules/app/actions'

import {
  getEnquiries,
  createWorkspace,
  updateAudit,
  createEnquiry,
  assignParticipant,
  createResponse,
  updateEnquiryByGivenResponse,
  submitNewAction,
  // getActions,
  submitResolutionForAction,
  // getResponses,
  // getResolutions,
} from 'libs/api/api-audit'
import documents from 'libs/hooks/documents'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import {
  requestConfigs,
  responseConfigs,
  actionConfigs,
  resolutionConfigs,
  enquiryActionsHeader,
} from './helpers'

const AuditDetails = ({ subkey, auditId = 1 }) => {
  const dispatch = useDispatch()

  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [createSpaceDialog, showCreateSpaceDialog] = useState(false)
  const [newEnquiryDialog, showNewEnquiryDialog] = useState(false)
  const [newResponseDialog, showNewResponseDialog] = useState(false)
  const [information, setInformation] = useState({})
  const [detailsDialog, showDetailsDialog] = useState(false)
  const [responseDetailsDialog, showResponseDetailsDialog] = useState(false)
  const [assignDialog, showAssignDialog] = useState(false)
  const [actionDialog, showActionDialog] = useState(false)
  const [newResolutionDialog, showNewResolutionDialog] = useState(false)
  const [participants, setParticipants] = useState([])
  const [view, setView] =
    subkey === 'actions' ? useState('actions') : useState('default')
  const { addSupportingDocuments } = documents()
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const { data: requestDetail } = useQuery(
    ['requestDetail', auditId],
    auditId && getEnquiries,
  )
  // const { data: responseDetails } = useQuery(['responseDetail'], getResponses)
  // const { data: actionsList } = useQuery(['actionsList'], getActions)
  /* const { data: resolutionsList } = useQuery(
    ['resolutionsList'],
    getResolutions,
  ) */
  const company = getOrganizationInfos()
  const successFn = {
    onSuccess: (res) => {
      if (!res.error) {
        showCreateSpaceDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg
              text={res.error?.body?.message || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  }
  const auditWorkspace = useMutation(createWorkspace, {
    ...successFn,
  })
  const updateRequestStatus = useMutation(updateAudit, {
    ...successFn,
  })
  const createEnquiryMutation = useMutation(createEnquiry, {
    ...successFn,
  })
  const createAssignee = useMutation(assignParticipant, {
    ...successFn,
  })
  const createResponseMutation = useMutation(createResponse, {
    ...successFn,
  })
  const submitActionMutation = useMutation(submitNewAction, {
    ...successFn,
  })
  const updateEnquiryByResponseMutation = useMutation(
    updateEnquiryByGivenResponse,
    {
      ...successFn,
    },
  )
  const createResolutionMutation = useMutation(submitResolutionForAction, {
    ...successFn,
  })
  const dummyDetailData = {
    title: 'New Audit Request',
    purpose: 'purpose',
    auditId: '1111',
    date: '11/12/2022',
    scope: 'scooope',
    expectedDeliv: '12/22/2022',
    status: 'preloaded',
    description: 'description test',
  }
  const renderData = () => {
    switch (view) {
      case 'response':
        return [
          {
            responseId: '123',
            respDate: '111',
            response: 'response',
            attachedDocs: 'date',
            status: 'el?.metaData?.status',
          },
        ]
      /* responseDetails?.content?.map((el) => ({
          responseId: el?.id,
          respDate: moment(el?.metaData?.createdAt).format('DD MMM YYYY'),
          response: el?.description,
          attachedDocs: el?.attachments[0]?.filename,
          status: el?.metaData?.status,
        })) */
      case 'actions':
        return [
          {
            actionId: '111',
            date: 'action',
            assignee: 'date',
            description: 'description',
            status: 'el?.metaData?.status',
          },
        ]
      /*
          actionsList?.content?.map((el) => ({
          actionId: el?.id,
          date: moment(el?.metaData?.createdAt).format('DD MMM YYYY'),
          assignee: el?.assignees[0]?.name,
          description: el?.description,
          status: el?.metaData?.status,
          auditId: el?.auditId,
        })) */
      case 'resolutions':
        return [
          {
            resolutionId: '123',
            enquireId: '111',
            attachedDocs: 'file',
            date: 'date',
            description: 'el?.metaData?.description',
            status: 'el?.metaData?.status',
          },
        ] /* (
          resolutionsList?.content?.map((el) => ({
            resolutionId: el?.id,
            description: el?.description,
            status: el?.metaData?.status,
            attachedDocs: el?.attachments[0]?.filename,
            date: moment(el?.metaData?.createdAt).format('DD MMM YYYY'),
          })) || []
        ) */
      default:
        return [
          {
            enquireId: '111',
            auditId: 'enquire',
            date: 'date',
            assignee: 'test',
            description: 'el?.metaData?.description',
            status: 'el?.metaData?.status',
          },
        ]
      /* requestDetail?.content?.map((el) => ({
          enquireId: el?.id,
          auditId: el?.id,
          date: el?.metaData?.createdAt
            ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
            : '',
          assignee: 'test',
          description: el?.description,
          status: el?.metaData?.status,
        })) */
    }
  }
  const selectedRow = selectedRowSelector.map((id) => renderData()[id])
  // const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))

  const handleSupportingDocs = (data) => {
    addSupportingDocuments(
      data,
      requestDetail?.metaData?.processInstanceId,
      // closeDialog,
    )
  }
  const createSpace = () => {
    auditWorkspace.mutate(
      {
        auditId,
        body: information,
      },
      {
        onSuccess: () => {},
      },
    )
  }
  const updateStatus = (status) => {
    updateRequestStatus.mutate({
      auditId,
      status,
    })
  }
  const createEnquiryOnSubmit = (description, files) => {
    const body = {
      assignee: {
        email: 'string',
        name: 'string',
        sub: 'string',
      },
      auditId,
      company: company?.name,
      description,
      processInstanceId: uuidv4(),
      // uploads: files,
    }
    createEnquiryMutation.mutate({
      body,
    })
  }
  const createResponseOnSubmit = (description, files, enquiryId = '111') => {
    const body = {
      enquiryId,
      company: company?.name,
      description,
      processInstanceId: uuidv4(),
      // uploads: files,
    }
    createResponseMutation.mutate({
      body,
    })
  }
  const createResolutionOnSubmit = (description, files, actionId = '111') => {
    const body = {
      actionId,
      company: company?.name,
      description,
      processInstanceId: uuidv4(),
      // uploads: files,
    }
    createResolutionMutation.mutate({
      body,
    })
  }
  const submitAssignee = (assignee) => {
    createAssignee.mutate({
      body: participants[0] || {
        email: 'string',
        name: 'string',
        sub: 'string',
      },
      auditId,
    })
  }
  const configsByView = () => {
    switch (view) {
      case 'response':
        return responseConfigs
      case 'actions':
        return actionConfigs
      case 'resolutions':
        return resolutionConfigs
      default:
        return requestConfigs
    }
  }
  const responseId = '111'
  const updateEnquiryByResponse = (status) => {
    updateEnquiryByResponseMutation.mutate({
      responseId,
      status,
    })
  }
  const dummyBodyAction = {
    assignees: [
      {
        email: 'string',
        name: 'string',
        sub: 'string',
      },
    ],
    auditId: '111',
    auditReportReference: 'string',
    company: 'string',
    deadLine: '12-11-2022',
    description: 'string',
    priority: 'HIGH',
    processInstanceId: uuidv4(),
    uploads: ['string'],
  }
  const submitAction = (body = dummyBodyAction) => {
    submitActionMutation.mutate({
      body,
    })
  }
  const renderHeaderDetails = () => {
    switch (view) {
      case 'resolutions':
        return {
          title: 'Resolutions',
        }
      default:
        return dummyDetailData
    }
  }

  const actions = [
    <Button
      key="2"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        showActionDialog(true)
      }}
    >
      Create New Action
    </Button>,
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      Supporting documents
    </Button>,
  ]
  const defaultActions = [
    <Button
      key="2"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {}}
    >
      Clarify
    </Button>,
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      Supporting documents
    </Button>,
    <Button
      key="3"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        showCreateSpaceDialog(true)
      }}
    >
      Create Audit Space
    </Button>,
    requestDetail?.metaData?.status !== 'ACKNOWLEDGED' && (
      <Button
        key="4"
        id="viewDoc"
        className="top-bar-buttons-list-item-btn view-doc"
        flat
        swapTheming
        onClick={() => {
          updateStatus('ACKNOWLEDGED')
        }}
      >
        Acknowledge
      </Button>
    ),
    <Button
      key="5"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        showNewEnquiryDialog(true)
      }}
    >
      Create New Enquiry
    </Button>,
  ]
  return (
    <div>
      <TopBarDetailAudit
        onClickBack={() => navigate(`/ams/audit`)}
        actions={
          view === 'default'
            ? defaultActions
            : view === 'actions'
              ? actions
              : []
        }
        detailData={renderHeaderDetails()}
        view={view}
      />
      <div className="subModule--table-wrapper">
        <Mht
          id="audit-details"
          configs={configsByView()}
          tableData={renderData() || []}
          withSearch={selectedRow?.length === 0}
          commonActions={selectedRow?.length === 0}
          withChecked
          selectedRow={selectedRow}
          hideTotal={false}
          withFooter
          singleSelect={true}
          headerTemplate={
            (selectedRow?.length === 1 && (
              <HeaderTemplate
                title={`${selectedRow.length} Row Selected`}
                actions={enquiryActionsHeader(
                  selectedRow[0],
                  showDetailsDialog,
                  updateStatus,
                  showAssignDialog,
                  showNewResponseDialog,
                  setView,
                  view,
                  showResponseDetailsDialog,
                  showNewResolutionDialog,
                )}
              />
            )) || <div />
          }
        />
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          // readOnly={role === 'regulator'}
          processInstanceId={
            requestDetail?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
      {createSpaceDialog && (
        <CreateAuditSpace
          information={information}
          setInformation={setInformation}
          visible={createSpaceDialog}
          onHide={() => showCreateSpaceDialog(false)}
          onSubmit={createSpace}
        />
      )}
      {newEnquiryDialog && (
        <EnquiryDialog
          title={'Create New Enquiry'}
          visible={newEnquiryDialog}
          docLabel={'Choose File'}
          btnLabel={'Create'}
          onHide={() => {
            showNewEnquiryDialog(false)
          }}
          onSave={createEnquiryOnSubmit}
        />
      )}
      {detailsDialog && (
        <EnquireDetailsDialog
          visible={detailsDialog}
          onHide={() => showDetailsDialog(false)}
        />
      )}
      {assignDialog && (
        <InviteParticipantDialog
          visible={assignDialog}
          onHide={() => showAssignDialog(false)}
          onSubmit={submitAssignee}
          setParticipants={setParticipants}
          participants={participants}
        />
      )}
      {newResponseDialog && (
        <EnquiryDialog
          title="Response to Enquiry"
          btnLabel="Submit"
          docLabel="Attach Document"
          visible={newResponseDialog}
          onHide={() => {
            showNewResponseDialog(false)
          }}
          onSave={createResponseOnSubmit}
        />
      )}
      {responseDetailsDialog && (
        <ResponseDetailsDialog
          visible={responseDetailsDialog}
          onHide={() => showResponseDetailsDialog(false)}
          // readOnly
          title={'Response Details'}
          descriptionLabel={'Response'}
          onAccept={() => updateEnquiryByResponse('ACCEPTED')}
          onReject={() => updateEnquiryByResponse('REJECTED')}
        />
      )}
      {actionDialog && (
        <CreateActionDialog
          // information={information}
          // setInformation={setInformation}
          visible={actionDialog}
          onHide={() => showActionDialog(false)}
          onSubmit={() => submitAction()}
        />
      )}
      {newResolutionDialog && (
        <EnquiryDialog
          title="New Resolution"
          btnLabel="Submit"
          docLabel="Attach Document"
          visible={newResolutionDialog}
          onHide={() => showNewResolutionDialog(false)}
          onSave={createResolutionOnSubmit}
        />
      )}
    </div>
  )
}
export default AuditDetails
