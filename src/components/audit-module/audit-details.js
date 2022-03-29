import { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'
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
import useRole from 'libs/hooks/use-role'
import moment from 'moment'

import {
  getEnquiries,
  getAuditByID,
  getEnquiryByID,
  createWorkspace,
  updateAudit,
  acknowledgeEnquiry,
  createEnquiry,
  assignParticipant,
  createResponse,
  updateEnquiryByGivenResponse,
  submitNewAction,
  // getActions,
  submitResolutionForAction,
  getResponses,
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
    subkey === 'enquiries' ? useState('default') : useState(subkey)
  // console.log('view', view)
  const { addSupportingDocuments } = documents()
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const role = useRole('audit')
  useEffect(() => {
    subkey !== 'enquiries' && setView(subkey)
  }, [subkey])
  const { data: requestDetail, refetch: refetchEnq } = useQuery(
    ['requestDetail', auditId],
    view === 'default' && auditId && getEnquiries,
  )
  const { data: auditDetails } = useQuery(
    ['auditDetails', auditId],
    view === 'default' && auditId && getAuditByID,
  )

  const { data: responseDetails } = useQuery(
    ['responseDetail', auditId],
    view === 'response' && auditId && getResponses,
  )
  // const { data: actionsList } = useQuery(
  //   ['actionsList', auditId],
  //   getActions && auditId,
  // )
  // const { data: resolutionsList } = useQuery(
  //   ['resolutionsList', auditId],
  //   getResolutions && auditId,
  // )
  // console.log(getActions, 'sup')
  const company = getOrganizationInfos()
  const successFn = {
    onSuccess: (res) => {
      if (res?.success) {
        showCreateSpaceDialog(false)
        showAssignDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchEnq()
      } else {
        showCreateSpaceDialog(false)

        dispatch(
          addToast(
            <ToastMsg
              text={res?.errorMsg || 'Something went wrong'}
              type="error"
            />,
            'hide',
          ),
        )
      }
    },
  }
  useEffect(() => {
    setSelectedRow([])
  }, [])

  const auditWorkspace = useMutation(createWorkspace, {
    ...successFn,
  })
  const updateRequestStatus = useMutation(updateAudit, {
    ...successFn,
  })
  const updateRowStatus = useMutation(acknowledgeEnquiry, {
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

  const renderData = () => {
    switch (view) {
      case 'response':
        return responseDetails?.data?.map((el) => ({
          responseId: el?.id,
          respDate: moment(el?.createdAt).format('DD MMM YYYY'),
          response: el?.description?.replace(/<\/?[^>]+(>|$)/g, ''),
          attachedDocs: el?.enquiryResponseDocuments[0]?.filename,
          status: el?.responseStatus,
        }))
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
        return requestDetail?.data?.map((el) => ({
          enquireId: el?.id,
          auditId,
          date: moment(el?.createdAt).format('DD MMM YYYY'),
          assignee: el?.participants[0],
          description: el?.description?.replace(/<\/?[^>]+(>|$)/g, ''),
          status: el?.status,
        }))
    }
  }
  const selectedRow = selectedRowSelector.map((id) => renderData()?.[id])
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  const { data: enquiryDetails } = useQuery(
    [
      'enquiryDetails',
      selectedRow[0]?.enquireId ? selectedRow[0]?.enquireId : auditId,
    ],
    (view === 'response' || selectedRow[0]?.enquireId) &&
      auditId &&
      getEnquiryByID,
  )
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
  const updateRow = (id, status) => {
    updateRowStatus.mutate({
      id,
      status,
    })
  }
  const filteredFilesAttr = (files) =>
    files?.map((file) => ({
      apiID: file?.id,
      url: file?.url,
      size: file?.size,
      bucket: file?.bucket,
      filename: file?.filename,
      subject: file?.subject,
      contentType: file?.contentType,
    }))
  const createEnquiryOnSubmit = (description, files) => {
    const body = {
      description,
      enquiryDocuments: filteredFilesAttr(files),
    }
    createEnquiryMutation.mutate({
      auditId,
      body,
    })
  }
  const createResponseOnSubmit = (description, files) => {
    createResponseMutation.mutate({
      enquiryID: selectedRow[0]?.enquireId,
      body: {
        description,
        enquiryResponseDocuments: filteredFilesAttr(files),
      },
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
  const submitAssignee = () => {
    createAssignee.mutate({
      participants: participants?.map((el) => el?.subject),
      enquiryID: selectedRow[0]?.enquireId,
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
  const updateEnquiryByResponse = (status) => {
    updateEnquiryByResponseMutation.mutate({
      responseId: selectedRow[0]?.responseId,
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
      case 'response':
        return {
          title: enquiryDetails?.data?.id,
          purpose: enquiryDetails?.data?.purpose,
          // missing from api
          auditId: enquiryDetails?.data?.auditId,
          date: moment(enquiryDetails?.data?.createdAt).format('DD-MM-YYYY'),
          description: enquiryDetails?.data?.description?.replace(
            /<\/?[^>]+(>|$)/g,
            '',
          ),
        }
      default:
        return {
          title: auditDetails?.data?.title,
          purpose: auditDetails?.data?.purpose,
          auditId: auditDetails?.data?.id,
          date: moment(auditDetails?.data?.createdAt).format('DD-MM-YYYY'),
          scope: auditDetails?.data?.scope,
          expectedDeliv: moment(
            auditDetails?.data?.expectedDeliverables,
          ).format('DD-MM-YYYY'),
          status: auditDetails?.data?.auditStatus,
          description: auditDetails?.data?.description?.replace(
            /<\/?[^>]+(>|$)/g,
            '',
          ),
        }
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
    role === 'AU' ? (
      <>
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
        </Button>
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
        </Button>
      </>
    ) : role === 'FP' ? (
      <>
        <Button
          key="2"
          id="viewDoc"
          className="top-bar-buttons-list-item-btn view-doc"
          flat
          swapTheming
          onClick={() => {}}
        >
          Clarify
        </Button>

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
        </Button>
        {!auditDetails?.data?.isAcknowledged && (
          <Button
            key="4"
            id="viewDoc"
            className="top-bar-buttons-list-item-btn view-doc"
            flat
            swapTheming
            onClick={() => {
              updateStatus('acknowledge')
            }}
          >
            Acknowledge
          </Button>
        )}
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
        </Button>
      </>
    ) : role === 'AP' ? (
      <>
        <Button
          key="2"
          id="viewDoc"
          className="top-bar-buttons-list-item-btn view-doc"
          flat
          swapTheming
          onClick={() => {}}
        >
          Clarify
        </Button>
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
        </Button>
      </>
    ) : (
      <></>
    ),
  ]

  //  (
  //   (requestDetail?.metaData?.status !== 'ACKNOWLEDGED' && (
  //     <Button
  //       key="4"
  //       id="viewDoc"
  //       className="top-bar-buttons-list-item-btn view-doc"
  //       flat
  //       swapTheming
  //       onClick={() => {
  //         updateStatus('ACKNOWLEDGED')
  //       }}
  //     >
  //       Acknowledge
  //     </Button>
  //   ),
  //     (
  //       <Button
  //         key="5"
  //         id="viewDoc"
  //         className="top-bar-buttons-list-item-btn view-doc"
  //         flat
  //         swapTheming
  //         onClick={() => {
  //           showNewEnquiryDialog(true)
  //         }}
  //       >
  //       Create New Enquiry
  //       </Button>
  //     ))
  // ),
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
                  updateRow,
                  showAssignDialog,
                  showNewResponseDialog,
                  setView,
                  view,
                  showResponseDetailsDialog,
                  showNewResolutionDialog,
                  role,
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
          title={'Enquiry Details'}
          enquiryDetails={enquiryDetails?.data}
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
          readOnly={role !== 'AU'}
          title={'Response Details'}
          descriptionValue={selectedRow[0]?.response}
          file={selectedRow[0]?.attachedDocs}
          descriptionLabel={'Response'}
          status={selectedRow[0]?.status}
          onAccept={() => updateEnquiryByResponse('ACCEPTED')}
          onReject={() => updateEnquiryByResponse('REJECTED')}
        />
      )}
      {actionDialog && (
        <CreateActionDialog
          information={information}
          setInformation={setInformation}
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
