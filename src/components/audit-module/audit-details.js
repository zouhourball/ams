import { useState, useEffect } from 'react'
// import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
// import moment from 'moment'
import { useDispatch, useSelector } from 'react-redux'

import UserInfoBySubject from 'components/user-info-by-subject'

import TopBarDetailAudit from 'components/top-bar-detail-audit'
import SupportedDocumentAudit from 'components/supported-document-audit'
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
import fileDataFormatter from 'libs/hooks/file-data-formatter'
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
  getActions,
  submitResolutionForAction,
  getResponses,
  getResolutions,
  submitResponses,
  resolutionApproval,
  supportingDocuments,
} from 'libs/api/api-audit'

import {
  requestConfigs,
  responseConfigs,
  actionConfigs,
  resolutionConfigs,
  enquiryActionsHeader,
} from './helpers'

const AuditDetails = ({ subkey, auditId, navigate }) => {
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
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const role = useRole('audit')
  useEffect(() => {
    subkey !== 'enquiries' && setView(subkey)
    setSelectedRow([])
  }, [subkey])
  const { data: requestDetail, refetch: refetchEnq } = useQuery(
    ['requestDetail', auditId],
    view === 'default' && auditId && getEnquiries,
  )
  const { data: auditDetails, refetch: refetchAudit } = useQuery(
    ['auditDetails', auditId],
    (view === 'default' || view === 'actions') && auditId && getAuditByID,
  )

  const { data: responseDetails, refetch: refetchResponses } = useQuery(
    ['responseDetail', auditId],
    view === 'response' && auditId && getResponses,
  )
  const { data: actionsList, refetch: refetchActions } = useQuery(
    ['actionsList', auditId],
    view === 'actions' && auditId && getActions,
  )
  const { data: resolutionsList, refetch: refetchResolutions } = useQuery(
    ['resolutionsList', auditId],
    view === 'resolutions' && auditId && getResolutions,
  )
  const successFn = {
    onSuccess: (res) => {
      if (res?.success) {
        showCreateSpaceDialog(false)
        showAssignDialog(false)
        showActionDialog(false)
        showResponseDetailsDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchEnq()
        refetchAudit()
        setSelectedRow([])
        view === 'actions' && refetchActions()
        view === 'resolutions' && refetchResolutions()
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
  const successResponseFn = {
    onSuccess: (res) => {
      if (res?.success) {
        showResponseDetailsDialog(false)
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchResponses()
        setSelectedRow([])
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
      ...successResponseFn,
    },
  )
  const createResolutionMutation = useMutation(submitResolutionForAction, {
    ...successFn,
  })
  const submitResponseMutation = useMutation(submitResponses, {
    ...successResponseFn,
  })
  const updateResolutionMutation = useMutation(resolutionApproval, {
    ...successFn,
  })
  const uploadSupportingDocuments = useMutation(supportingDocuments, {
    onSuccess: (res) => {
      if (res.success) {
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchAudit()
        setShowSupportedDocumentDialog(false)
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
          attachedDocsObj: el?.enquiryResponseDocuments[0],
        }))
      case 'actions':
        return actionsList?.data?.map((el) => ({
          actionId: el?.id,
          date: moment(el?.deadline).format('DD MMM YYYY'),
          assignee: el?.assignedParticipants?.map((sub) => (
            <UserInfoBySubject key={sub} subject={sub}>
              {(res) => (
                <div className="subject">{res ? res.fullName : 'N/A'}</div>
              )}
            </UserInfoBySubject>
          )),
          description: el?.description?.replace(/<\/?[^>]+(>|$)/g, ''),
          status: el?.status,
          auditId: el?.auditReportID,
          resolutions: el?.resolutions,
        }))
      case 'resolutions':
        return (
          resolutionsList?.data?.map((el) => ({
            resolutionId: el?.id,
            description: el?.description?.replace(/<\/?[^>]+(>|$)/g, ''),
            status: el?.status,
            attachedDocs: el?.resolutionDocuments?.map(
              (file) => file?.filename,
            ),
            date: moment(el?.createdAt).format('DD MMM YYYY'),
            attachedDocsObj: el?.resolutionDocuments[0],
          })) || []
        )
      /* [
          {
            resolutionId: '123',
            enquireId: '111',
            attachedDocs: 'file',
            date: 'date',
            description: 'el?.metaData?.description',
            status: 'el?.metaData?.status',
          },
        ] */
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
    // addSupportingDocuments(
    //   data,
    //   requestDetail?.metaData?.processInstanceId,
    //   // closeDialog,
    // )
    uploadSupportingDocuments.mutate({
      data: fileDataFormatter(data),
      id: auditId,
    })
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

  const createEnquiryOnSubmit = (description, files) => {
    const body = {
      description,
      enquiryDocuments: fileDataFormatter(files),
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
        enquiryResponseDocuments: fileDataFormatter(files),
      },
    })
  }
  const createResolutionOnSubmit = (description, files) => {
    const body = {
      description,
      resolutionDocuments: fileDataFormatter(files),
    }
    createResolutionMutation.mutate({
      body,
      actionId: selectedRow[0]?.actionId,
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
  const submitResponse = (id) => {
    submitResponseMutation.mutate({
      id,
    })
  }
  const updateResolution = (status) => {
    updateResolutionMutation.mutate({
      resolutionId: selectedRow[0]?.resolutionId,
      status,
    })
  }
  /* const dummyBodyAction = {
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
  } */
  const submitAction = () => {
    const body = {
      assignedParticipants: information?.assignedParticipants?.map(
        (el) => el?.subject,
      ),
      deadline: moment(new Date(information?.deadline))?.format('YYYY-MM-DD'),
      description: information?.description,
      priority: information?.priority,
    }

    submitActionMutation.mutate({
      body,
      auditId,
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
      case 'actions':
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
    role === 'FP' && (
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
      </Button>
    ),
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
        {!auditDetails?.data?.isAcknowledged &&
          (role === 'FP' || role === 'AP') && (
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
        {role === 'FP' && (
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
        )}
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
  const returnBackward = () => {
    setView('default')
    navigate(
      `/ams/audit/audit-details/enquiries/${renderHeaderDetails()?.auditId}`,
    )
  }
  return (
    <div>
      <TopBarDetailAudit
        onClickBack={() => {
          subkey === 'enquiries' || subkey === 'actions'
            ? navigate(`/ams/audit/audit-details`)
            : returnBackward()
        }}
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
                  // showResolutionDialog,
                )}
              />
            )) || <div />
          }
        />
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocumentAudit
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          // readOnly={role === 'regulator'}
          id={auditId}
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
          // readOnly={view === 'resolutions'}
          role={role}
          title={
            (view === 'resolutions' && 'Resolution Details') ||
            (view === 'actions' && 'Action Details') ||
            'Response Details'
          }
          descriptionValue={
            view === 'resolutions' || view === 'actions'
              ? selectedRow[0]?.description
              : selectedRow[0]?.response
          }
          file={selectedRow[0]?.attachedDocsObj}
          descriptionLabel={
            (view === 'resolutions' && 'Resolution Description') ||
            (view === 'actions' && 'Action Description') ||
            'Response'
          }
          status={selectedRow[0]?.status}
          onAccept={() =>
            view === 'resolutions'
              ? updateResolution('ACCEPTED')
              : updateEnquiryByResponse('ACCEPTED')
          }
          onReject={() =>
            view === 'resolutions'
              ? updateResolution('REJECTED')
              : updateEnquiryByResponse('REJECTED')
          }
          onSubmit={() => submitResponse(selectedRow[0]?.responseId)}
          view={view}
        />
      )}
      {actionDialog && (
        <CreateActionDialog
          information={information}
          setInformation={setInformation}
          visible={actionDialog}
          onHide={() => showActionDialog(false)}
          onSubmit={() => submitAction()}
          reportId={auditDetails?.data?.report?.id}
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
