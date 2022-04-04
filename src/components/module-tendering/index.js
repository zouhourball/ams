import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  lazy,
  Suspense,
  useRef,
} from 'react'
import { Router, navigate, Redirect } from '@reach/router'
import { get } from 'lodash-es'
import { connect, useSelector } from 'react-redux'
import { graphql } from 'react-apollo'
import { QueryClient, QueryClientProvider } from 'react-query'

import { UploaderDialog } from '@target-energysolutions/supporting-documents'

import { usePrevious } from 'libs/utils/use-previous'
import { getAuthToken } from 'libs/utils/oauth-token'
import workspacesByID from 'libs/queries/workspace-by-id.gql'
import {
  submitProposal,
  clarifyProposal,
  clarifiedProposal,
  approvedProposal,
  rejectedProposal,
  underReviewProposal,
  createAnnualPlan,
  getProposalByRefNumber,
  getProposalById,
  updateProposal,
  publishProposal,
  getDelegation,
  getAccess,
} from 'libs/api/api-tendering'
import mutate from 'libs/hocs/mutate'

import * as act from 'modules/app/actions'

import CreateNewProposal from './components/create-new-proposal'
import CreateNewAnnualPlan from './components/annual-plan-dialog'
import ProcessHistorianSection from './components/process-historian-section'
import AnnualPlanDetail from './components/annual-plan-detail'
// import AnnualComparison from './components/annual-comparison'
// import ActualPerformanceReport from './components/actual-performance-report'
import AnnualPlan from './components/annual-plan'
import AddComment from './components/add-comment'

import NavBar from 'components/nav-bar'
import TopBar from 'components/top-bar'

import closeimg from './images/close_out.svg'
import newimg from './images/new.svg'
import ongoingimg from './images/onGoing.svg'
import approved from './images/file_approved.svg'
import { fbpTableData, fbpConfig } from './fbp-helper'

import { PrimeContext } from 'components/app/context'

import './style.scss'

import ToastMsg from './components/toast-msg'

// const SubMenuBar = lazy(() => import('./components/sub-menu-bar'))
const FunctionBusinessProcess = lazy(() =>
  import('./components/function-business-process'),
)
const FunctionBusinessProcessByOrg = lazy(() =>
  import('./components/function-business-process-by-org'),
)
const CreateProposal = lazy(() => import('./components/create-proposal'))
const VendorDevelopment = lazy(() => import('./components/vendor-development'))
const TableViewDetails = lazy(() => import('./components/table-view-details'))
// const MeetingsList = lazy(() => import('./components/meetings-list'))
// const AgendaRequest = lazy(() => import('./components/agenda-request'))
const Reports = lazy(() => import('./components/reports'))
const queryClient = new QueryClient()

const initProposal = {
  companyName: '',
  referenceNumber: '',
  blockNumber: '',
  contractType: '',
  threadHoldLevel: '',
  tenderStatus: '',
  budgetApprovedByJMC: '',
  originalCostEstimate: 0,
  originalACVApproved: '',
  tenderObjective: '',
  originalDuration: '',
  estimatedDurationPerJob: '',
  fileAttachment: [],
  estimatedDurationPerPeriodType: 'Firm',
  estimatedDurationPerPeriodOptionValue: [],
  comment: '',
  title: '',
}

const TenderingModule = ({
  addToast,
  location: { pathname },
  mutations: {
    submitProposal,
    clarifyProposal,
    clarifiedProposal,
    approvedProposal,
    rejectedProposal,
    underReviewProposal,
    createAnnualPlan,
    getProposalByRefNumber,
    getProposalById,
    updateProposal,
    publishProposal,
    getDelegation,
    getAccess,
  },
  // userRoles,
  organizationId,
  submitProposalStatus,
  clarifiedProposalStatus,
  createAnnualPlanStatus,
  workspaceName,
  subject,
  getDelegationStatus,
}) => {
  const userRoles = useSelector(({ query }) => query?.DEFAULT?.me?.data?.roles)
  const roles = {
    Start: 'operator',
    [`target:tendering:secretary`]: 'secretary',
    [`target-subscription-store:${organizationId}:tendering:member`]: 'member',
    [`target-subscription-store:${organizationId}:target:tendering:operator`]:
      'operator',
    [`target-subscription-store:${organizationId}:target:tendering:chairman`]:
      'chairman',
  }

  const [hidePrimaryTopBar, setHidePrimaryTopBar] = useState(false)
  const [newProposalVisible, setNewProposalVisible] = useState(false)
  // const [ongoingProposalVisible, setOngoingProposalVisible] = useState(false)
  const [newPlanVisible, setNewPlanVisible] = useState(false)
  const [proposal, setProposal] = useState(initProposal)
  const [openAddComment, setOpenAddComment] = useState(false)
  const [openCreateAgenda, setOpenCreateAgenda] = useState(false)
  const [openCreateAgendaProposal, setOpenCreateAgendaProposal] =
    useState(false)
  const [openViewSupportDoc, setOpenViewSupportDoc] = useState(false)
  const [openRejectComment, setOpenRejectComment] = useState(false)
  // const [searchValue, setSearchValue] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [proposalId, setProposalId] = useState(null)
  const [attachedFiles, setAttachedFiles] = useState([])
  const [annualPlanType, setAnnualPlanType] = useState('')
  const [, source, subSource, section] = pathname
    .split('/')
    .filter((url) => url !== '')

  const [currentTab, setCurrentTab] = useState()

  useEffect(() => {
    setCurrentTab(source)
  }, [source])

  const role = userRoles.find(
    (role) =>
      role === `target:tendering:secretary` ||
      role ===
        `target-subscription-store:${organizationId}:target:tendering:chairman` ||
      role ===
        `target-subscription-store:${organizationId}:target:tendering:operator` ||
      role === `target-subscription-store:${organizationId}:tendering:member`,
  )

  const userRole = useMemo(() => {
    let userRoleState = null
    const delegateRoles = getDelegationStatus?.data?.data
    if (
      delegateRoles &&
      delegateRoles[0]?.['ac_roles']?.find(
        (el) =>
          el ===
          `target-subscription-store:${organizationId}:target:tendering:chairman`,
      )
    ) {
      userRoleState = 'chairman'
    } else if (role) {
      userRoleState = roles[role]
    } else {
      userRoleState = 'operator'
    }
    return userRoleState
  }, [userRoles, getDelegationStatus, organizationId])

  const updateControl = useRef(false)

  useEffect(() => {
    if (updateControl.current) {
      navigate(`/tendering/fbp`)
    } else {
      updateControl.current = true
    }

    subject && getDelegation(organizationId, subject)
  }, [userRole, organizationId, subject])

  useEffect(() => {
    setSelectedRows([])
    if (
      userRole === 'operator' &&
      source === 'fbp' &&
      typeof section === 'undefined' &&
      (typeof subSource === 'undefined' || subSource !== organizationId) &&
      !(
        getDelegationStatus?.data?.data &&
        getDelegationStatus?.data?.data[0]?.['ac_roles']?.find(
          (el) =>
            el ===
            `target-subscription-store:${organizationId}:target:tendering:chairman`,
        )
      )
    ) {
      navigate(`/tendering/fbp/${organizationId}`)
    }
  }, [
    source,
    subSource,
    section,
    userRole,
    organizationId,
    getDelegationStatus,
  ])

  const onEditProposal = (key, value) => {
    setProposal({ ...proposal, [key]: value })
  }
  const prevSubmitProposalStatus = usePrevious(submitProposalStatus)
  useEffect(() => {
    if (
      prevSubmitProposalStatus &&
      prevSubmitProposalStatus !== submitProposalStatus &&
      !submitProposalStatus.pending &&
      submitProposalStatus.data &&
      submitProposalStatus.data.success
    ) {
      setProposal(initProposal)
      addToast(
        <ToastMsg text={'New Proposal Created successfully'} type="success" />,
      )
      navigate(`/tendering/fbp`)
    } else if (
      prevSubmitProposalStatus &&
      prevSubmitProposalStatus !== submitProposalStatus &&
      !submitProposalStatus.pending &&
      submitProposalStatus.data &&
      !submitProposalStatus.data.success
    ) {
      addToast(
        <ToastMsg text={'This Reference number is used before'} type="error" />,
      )
    }
  }, [submitProposalStatus])
  const prevClarifiedProposalStatus = usePrevious(clarifiedProposalStatus)
  useEffect(() => {
    if (
      prevClarifiedProposalStatus &&
      prevClarifiedProposalStatus !== clarifiedProposalStatus &&
      !clarifiedProposalStatus.pending &&
      clarifiedProposalStatus.data &&
      clarifiedProposalStatus.data.success
    ) {
      setProposal(initProposal)
      navigate(`/tendering/fbp`)
    }
  }, [clarifiedProposalStatus])
  const submitProposalData = () => {
    const proposalData = {
      comment: proposal.comment,
      title: proposal.title,
      orgId: organizationId,
      workspaceName: 'placeholder',
      workspaceId: '0',
      companyName: proposal.companyName,
      companyId: proposal.companyId + '',
      referenceNumber: proposal.referenceNumber,
      blockNumber: proposal.blockNumber,
      contractTitle: proposal.contractType,
      contractType: proposal.contractType,
      threadHoldLevel: proposal.threadHoldLevel,
      tenderStatus: proposal.tenderStatus,
      budgetApprovedByJMC: parseInt(proposal.budgetApprovedByJMC),
      originalCostEstimate: parseInt(proposal.originalCostEstimate),
      estimatedDurationPerJob: proposal.estimatedDurationPerJob,
      estimatedDurationPerPeriodType: proposal.estimatedDurationPerPeriodType,
      estimatedDurationPerPeriodFirmStartValue:
        proposal.estimatedDurationPerPeriodFirmStartValue,
      estimatedDurationPerPeriodFirmEndValue:
        proposal.estimatedDurationPerPeriodFirmEndValue,
      estimatedDurationPerPeriodOptionValue:
        proposal.estimatedDurationPerPeriodOptionValue,
      attachments: proposal.fileAttachment.map((el) => {
        return {
          id: el.id,
          url: el.url,
          size: el.size,
          bucket: el.bucket,
          object: el.object,
          fileName: el.filename || el.fileName,
          subject: el.subject,
          contentType: el.contentType,
        }
      }),
    }

    if (proposal.id && proposal.id !== null) {
      clarifiedProposal(proposal.id, proposalData)
    } else {
      submitProposal(proposalData)
    }
  }

  const menuBarRenderActions = () => {
    switch (userRole) {
      case 'operator':
      case 'secretary':
      case 'chairman':
        return [
          {
            label: 'CLOSE',
            action: () => {
              navigate('/tendering/fbp')
            },
            isVisible: true,
            swapTheming: false,
            active: true,
          },
          // {
          //   label: 'To CLARIFY',
          //   action: () => {
          //     clarifyProposal(proposalId)
          //   },
          //   isVisible: true,
          //   swapTheming: false,
          //   active: true,
          // },
          {
            label: 'CLARIFY',
            action: () => {
              setOpenAddComment(true)
            },
            isVisible: true,
            swapTheming: false,
            active: true,
          },
          {
            label: 'VIEW SUPPORT DOCUMENTS',
            action: () => {
              setOpenViewSupportDoc(true)
            },
            isVisible: true,
            swapTheming: false,
            active: true,
          },
          {
            label: 'CREATE AGENDA',
            action: () => {
              setOpenCreateAgenda(true)
            },
            isVisible: true,
            swapTheming: true,
            active: true,
          },
        ]
      case 'member':
        return [
          {
            label: 'CLOSE',
            action: () => {
              navigate('/tendering/fbp')
            },
            isVisible: true,
            swapTheming: false,
            active: true,
          },
          {
            label: 'MEETING',
            action: () => {
              navigate('/tendering/meeting')
            },
            isVisible: true,
            swapTheming: true,
            active: true,
          },
        ]
    }
  }

  const menuBarRenderTree = () => {
    switch (userRole) {
      case 'operator':
      case 'secretary':
      case 'chairman':
        return [
          {
            name: 'Tender Requests',
            link: () => navigate('/tendering/fbp'),
          },
          {
            name: 'View Details',
          },
        ]
      case 'member':
        return [
          {
            name: 'Agenda Requests',
            link: () => navigate('/tendering/fbp'),
          },
          {
            name: 'New Agenda Request',
          },
        ]

      default:
        break
    }
  }

  const onDelete = (id) => {
    const newFiles = proposal.fileAttachment.filter((item) => item.id !== id)
    setProposal({ ...proposal, fileAttachment: [...newFiles] })
  }
  const onHideDialog = () => {
    setNewProposalVisible(false)
    setProposal(initProposal)
  }

  const handlePublishProposal = (id) => {
    publishProposal(id, {
      workspaceName: 'placeholder',
      workspaceId: '0',
    }).then((res) => {
      if (!res.data.error) {
        addToast(
          <ToastMsg text={'Proposal published successfully'} type="success" />,
        )
      } else {
        addToast(
          <ToastMsg
            text={get(res, 'data.error.body.message', 'Proposal not published')}
            type="error"
          />,
        )
      }
    })
  }
  const formatEditableProposal = useCallback((proposal) => {
    return {
      // orgId: 1,
      id: proposal.id,
      company: proposal.companyName,
      referenceNumber: proposal.referenceNumber,
      block: proposal.blockNumber,
      contractTitle: proposal.contractTitle,
      contractType: proposal.contractType,
      threadSholdLevel: proposal.threadHoldLevel,
      tenderStatus: proposal.tenderStatus,
      budgetApprovedByJMC: proposal.budgetApprovedByJMC + '',
      originalCostEstimate: proposal.originalCostEstimate + '',
      originalACVApproved: proposal.originalACV + '',
      originalDuration: parseInt(proposal.originalDuration),
      estimatedDuration: parseInt(proposal.estimateDuration),
      tenderObjective: proposal.tenderObjective,
      estimatedDurationPerDay: proposal.estimatedDurationPerJob,
      estimatedDurationPerPeriod: proposal.estimatedDurationPerPeriodType,
      estimatedDurationPerPeriodFirmStartValue:
        proposal.estimatedDurationPerPeriodType === 'Firm'
          ? proposal.estimatedDurationPerPeriodFirmStartValue
          : 0,
      estimatedDurationPerPeriodFirmEndValue:
        proposal.estimatedDurationPerPeriodType === 'Firm'
          ? proposal.estimatedDurationPerPeriodFirmEndValue
          : 0,
      estimatedDurationPerPeriodOptionValue:
        proposal.estimatedDurationPerPeriodType === 'Option'
          ? proposal.estimatedDurationPerPeriodOptionValue
          : 0,
      fileAttachment: proposal.fileAttachment.map((el) => {
        return {
          id: el.id,
          url: el.url,
          size: el.size,
          bucket: el.bucket,
          object: el.object,
          filename: el.filename || el.fileName,
          subject: el.subject,
          contentType: el.contentType,
        }
      }),
    }
  }, [])

  // NOTE Top bar functions
  const topBarMainButton = useMemo(() => {
    // if (source === 'fbp' && typeof subSource === 'undefined') {
    //   return []
    // } else {

    switch (userRole) {
      case 'operator':
        // console.log(subSource, 'subSourceee')

        if (source === 'fbp' && subSource) {
          return [
            // {
            //   label: 'Close Out',
            //   icon: closeimg,
            //   onClick: () => navigate('/tendering/closeoutfbp'),
            // },

            // {
            //   label: 'Ongoing & Close Out',
            //   icon: ongoingimg,
            //   onClick: () => navigate('/tendering/ongoingfbp'),
            // },
            {
              label: 'New Proposal',
              icon: newimg,
              onClick: () => navigate('/tendering/newfbp'),
            },
          ]
        } else if (source === 'bs') {
          return [
            {
              label: 'Close Out',
              icon: closeimg,
              onClick: () => {
                setNewPlanVisible(true)
                setAnnualPlanType('Closeout')
              },
            },

            {
              label: 'Ongoing',
              icon: ongoingimg,
              onClick: () => {
                setNewPlanVisible(true)
                setAnnualPlanType('Ongoing')
              },
            },
            {
              label: 'New',
              icon: newimg,
              onClick: () => {
                setNewPlanVisible(true)
                setAnnualPlanType('New')
              },
            },
          ]
        } else {
          return []
        }

      case 'secretary':
        if (
          source === 'fbp' &&
          typeof subSource !== 'undefined' &&
          section !== 'historian'
        ) {
          return [
            selectedRows.length === 1 &&
              (selectedRows[0].proposalStateEnum === 'Approved' ||
                selectedRows[0].proposalStateEnum === 'Rejected') && {
              label: 'Publish',
              icon: approved,
              onClick: () => {
                setProposalId(selectedRows[0].id)
                handlePublishProposal(selectedRows[0].id)
              },
            },
            // selectedRows.length === 1 &&
            //   selectedRows[0].proposalStateEnum === 'PassedToAgenda' && {
            //   label: 'Reject',
            //   icon: approved,
            //   onClick: () => {
            //     setProposalId(selectedRows[0].id)
            //     setOpenRejectComment(true)
            //   },
            // },
            // selectedRows.length === 1 &&
            //   selectedRows[0].proposalStateEnum === 'PassedToAgenda' && {
            //   label: 'Approve',
            //   icon: approved,
            //   onClick: () => {
            //     approvedProposal(selectedRows[0].id, {
            //       workspaceName: 'placeholder',
            //       workspaceId: '0',
            //     })
            //   },
            // },
            {
              label: 'Create Agenda',
              icon: newimg,
              onClick: () => {
                setOpenCreateAgendaProposal(true)
              },
              disabled: !(
                selectedRows.length &&
                selectedRows.filter(
                  ({ proposalStateEnum }) =>
                    proposalStateEnum === 'UnderReview',
                ).length !== 0
              ),
            },
          ]
        } else if (source === 'bs') {
          return []
        } else {
          return []
        }
      case 'chairman':
        if (
          source === 'fbp' &&
          typeof subSource !== 'undefined' &&
          section !== 'historian'
        ) {
          return [
            selectedRows.length === 1 &&
              selectedRows[0].proposalStateEnum === 'PassedToAgenda' && {
              label: 'Reject',
              icon: approved,
              onClick: () => {
                setProposalId(selectedRows[0].id)
                setOpenRejectComment(true)
              },
            },
            selectedRows.length === 1 &&
              selectedRows[0].proposalStateEnum === 'PassedToAgenda' && {
              label: 'Approve',
              icon: approved,
              onClick: () => {
                approvedProposal(
                  selectedRows[0].id,
                  {
                    workspaceName: 'placeholder',
                    workspaceId: '0',
                  },
                  organizationId,
                )
              },
            },
            // {
            //   label: 'Create Agenda',
            //   icon: newimg,
            //   onClick: () => {
            //     setOpenCreateAgendaProposal(true)
            //   },
            //   disabled: !(
            //     selectedRows.length &&
            //       selectedRows.filter(
            //         ({ proposalStateEnum }) =>
            //           proposalStateEnum === 'UnderReview',
            //       ).length === selectedRows.length
            //   ),
            // },
          ]
        } else if (source === 'bs') {
          return []
        } else {
          return []
        }
      case 'member':
        if (source === 'fbp' && typeof subSource !== 'undefined') {
          return [
            {
              label: 'Join Meeting',
              icon: newimg,
              onClick: () => {
                navigate(`${PRODUCT_WORKSPACE_URL}/${subSource}/meetings`)
              },
            },
          ]
        } else if (source === 'bs') {
          return []
        } else {
          return []
        }
      default:
        return []
    }
    // }
  })

  const toClarifyProposal = (body) => {
    const clarifyComment = {
      workspaceName: 'placeholder',
      workspaceId: '0',
      toClarifyComment: body.comment,
      toClarifyAttachments: body.checkedFiles,
    }
    clarifyProposal(proposalId?.id, clarifyComment)
    setOpenAddComment(false)
    setProposalId(null)
  }
  const rejectProposal = (comment) => {
    const rejectComment = {
      workspaceName: 'placeholder',
      workspaceId: '0',
      rejectionComment: comment,
    }
    rejectedProposal(proposalId, rejectComment, organizationId)
    setOpenRejectComment(false)
    setProposalId(null)
  }
  const attachments = attachedFiles.map((item) => {
    let mimeType
    if (item.contentType === 'application/zip') {
      const extension = item.fileName.split('.').reverse()[0]
      mimeType = `application/${
        extension.includes('doc')
          ? 'msword'
          : extension.includes('xls')
            ? 'vnd.ms-excel'
            : extension.includes('ppt')
              ? 'vnd.ms-powerpoint'
              : 'zip'
      }`
    } else {
      mimeType = item.contentType
    }
    return {
      ...item,
      title: item.fileName,
      mimeType,
      id: item.id,
      objectID: item.id,
    }
  })

  const onCreateNewAnnualPlan = (annualPlan) => {
    const newPlan = {
      ...annualPlan,
      companyName: annualPlan.operatorName,
      fileName: annualPlan.fileUrl.split('/').pop(),
      planType: annualPlanType,
      orgId: +organizationId,
    }
    createAnnualPlan(newPlan).then((response) => {
      if (response.success) {
        setNewPlanVisible(false)
      }
    })
  }

  const handleExistProposal = async (refNumber, proposalId) => {
    const { data: tender } = !proposalId
      ? await getProposalByRefNumber(refNumber)
      : await getProposalById(proposalId)
    if (tender.data) {
      setProposal({
        ...tender.data,
        fileAttachment: get(tender, 'data.attachments', []) || [],
        tenderStatus: proposalId ? get(tender, 'data.tenderStatus', '') : '',
        id: proposalId ?? null,
      })
    }
  }

  const barView = () => {
    switch (userRole) {
      case 'operator':
      default:
        return true

      case 'secretary':
      case 'chairman':
        return source !== 'newfbp' && subSource !== 'plan' ? !subSource : true
    }
  }

  const tabsList = [
    {
      // linkToNewTab: `/tendering/fbp/${organizationId}`,
      linkToNewTab: `/tendering/fbp`,
      label: 'Function Business Process',
      key: 'fbp',
    },

    {
      linkToNewTab: `/tendering/bs/plan`,
      label: 'Business Submission',
      key: 'bs',
    },
    {
      linkToNewTab: `/tendering/vd`,
      label: 'Vendor Development',
      key: 'vd',
    },
    {
      linkToNewTab: `/tendering/rp`,
      label: 'Reports',
      key: 'rp',
    },
  ]
  return (
    <div className="tendering">
      {source !== 'newfbp' && section !== 'details' && barView() && (
        <TopBar title="Tendering" actions={null} />
      )}
      {source !== 'newfbp' && section !== 'details' && barView() && (
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={(tab) => {
            setCurrentTab(tab)
          }}
          actions={topBarMainButton}
        />
      )}

      {/* <Suspense fallback={<div>Loading ...</div>}>
        {!hidePrimaryTopBar && (
          <SubMenuBar
            source={source}
            subSource={subSource}
            section={section}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            mainButton={topBarMainButton}
            resetProposal={() => setProposal(initProposal)}
            userRole={userRole}
          />
        )}
      </Suspense> */}
      {/* {newProposalVisible && (
        <CreateNewProposal
          visible={newProposalVisible}
          onHideDialog={() => {
            onHideDialog()
          }}
          onSubmitDialog={submitProposalData}
          onEditProposal={onEditProposal}
          proposal={proposal}
          onDelete={file => onDelete(file.id)}
          // blocs={blocs}
          isEdit={
            typeof newProposalVisible === 'boolean' ? false : newProposalVisible
          }
          // company={company}
        />
      )} */}
      {/* {ongoingProposalVisible && (
        <CreateNewProposal
          visible={ongoingProposalVisible}
          onHideDialog={() => {
            setOngoingProposalVisible(false)
            setProposal(initProposal)
          }}
          onEditProposal={onEditProposal}
          onSubmitDialog={() => {}}
          proposal={proposal}
          // blocs={blocs}
          // company={company}
          ongoing
        />
      )} */}

      {/* {newPlanVisible && (
        <CreateNewAnnualPlan
          visible={newPlanVisible}
          onHideDialog={() => {
            setNewPlanVisible(false)
          }}
          onSubmitDialog={onCreateNewAnnualPlan}
          disabled={get(createAnnualPlanStatus, 'pending', false)}
        />
      )} */}
      {openAddComment && (
        <AddComment
          onHideDialog={() => setOpenAddComment(false)}
          visible={openAddComment}
          onSubmitDialogClarify={toClarifyProposal}
          proposalStatus={proposalId?.proposalStatus}
          type="request-information"
        />
      )}
      {openRejectComment && (
        <AddComment
          onHideDialog={() => setOpenRejectComment(false)}
          visible={openRejectComment}
          onSubmitDialog={rejectProposal}
        />
      )}
      {openViewSupportDoc && (
        <UploaderDialog
          key={'upload-button'}
          // className="UploaderButton__UploaderDialog"
          readOnly={true}
          documents={attachments}
          visible={openViewSupportDoc}
          isAwaitingCallbackFromParent={false}
          accessToken={getAuthToken()}
          deleteDocument={() => null}
          searchDisabled
          viewDisabled
          multiple={true}
          bucketKey="supportingdocs"
          onHide={() => {
            setAttachedFiles([])
            setOpenViewSupportDoc(false)
          }}
          onUploadDocumentsSuccess={() => null}
          fileManagerURL={
            process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''
          }
        />
      )}
      <div
        className={`${
          hidePrimaryTopBar ? 'global-container-not-topbar' : 'global-container'
        } `}
      >
        <PrimeContext.Provider>
          <QueryClientProvider client={queryClient}>
            {newPlanVisible && (
              <CreateNewAnnualPlan
                visible={newPlanVisible}
                onHideDialog={() => {
                  setNewPlanVisible(false)
                }}
                onSubmitDialog={onCreateNewAnnualPlan}
                disabled={get(createAnnualPlanStatus, 'pending', false)}
              />
            )}
            {newProposalVisible && (
              <CreateNewProposal
                visible={newProposalVisible}
                onHideDialog={() => {
                  onHideDialog()
                }}
                onSubmitDialog={submitProposalData}
                onEditProposal={onEditProposal}
                proposal={proposal}
                onDelete={(file) => onDelete(file.id)}
                // blocs={blocs}
                isEdit={
                  typeof newProposalVisible === 'boolean'
                    ? false
                    : newProposalVisible
                }
                // company={company}
              />
            )}
            <Suspense fallback={<div>Loading ...</div>}>
              <Router>
                <Redirect from="/" to="/tendering/fbp" noThrow />
                <Redirect from="/bs" to="/tendering/bs/plan" noThrow />
                <FunctionBusinessProcess
                  path="/fbp"
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  role={userRole}
                />
                <FunctionBusinessProcessByOrg
                  path="/fbp/:orgId"
                  role={userRole}
                  onHideDialog={onHideDialog}
                  onEditProposal={(proposal) => {
                    handleExistProposal(proposal.referenceNumber, proposal.id)
                    navigate(`/tendering/newfbp/${proposal.id}`)
                  }}
                  selectedRows={selectedRows}
                  setSelectedRows={setSelectedRows}
                  onClarify={(id, proposalStatus) => {
                    setProposalId({ id, proposalStatus })
                    setOpenAddComment(true)
                  }}
                  openCreateAgenda={openCreateAgendaProposal}
                  setOpenCreateAgenda={setOpenCreateAgendaProposal}
                  handleAttachedFiles={(row) => {
                    setAttachedFiles(row.attachments || [])
                    setOpenViewSupportDoc(true)
                  }}
                  onReview={(proposalId) =>
                    underReviewProposal(proposalId, {
                      workspaceName: 'placeholder',
                      workspaceId: '0',
                    })
                  }
                  onPublish={(row) => {
                    setProposalId(row.id)
                    handlePublishProposal(row.id)
                  }}
                  approvedProposal={approvedProposal}
                />
                <CreateProposal
                  path="/newfbp"
                  handleExistProposal={handleExistProposal}
                  onSubmitReview={submitProposalData}
                  onCancel={() => {
                    setProposal(initProposal)
                    navigate(`/tendering/fbp/`)
                  }}
                  onHideDialog={() => {
                    onHideDialog()
                  }}
                  onEditProposal={onEditProposal}
                  proposal={proposal}
                  onDelete={(file) => onDelete(file.id)}
                  setProposal={setProposal}
                  canSubmitReview={
                    !submitProposalStatus.pending &&
                    !clarifiedProposalStatus.pending
                  }
                  setIsVisibleTopBar={setHidePrimaryTopBar}
                />
                <CreateProposal
                  path="/newfbp/:proposalId"
                  handleExistProposal={handleExistProposal}
                  onSubmitReview={submitProposalData}
                  onCancel={() => {
                    setProposal(initProposal)
                    navigate('/tendering/fbp')
                  }}
                  onHideDialog={() => {
                    onHideDialog()
                  }}
                  onEditProposal={onEditProposal}
                  proposal={proposal}
                  onDelete={(file) => onDelete(file.id)}
                  setProposal={setProposal}
                  canSubmitReview={
                    !submitProposalStatus.pending &&
                    !clarifiedProposalStatus.pending
                  }
                />
                <ProcessHistorianSection path="/fbp/:orgId/historian/:id" />
                <VendorDevelopment
                  path="/vd/*"
                  role={userRole}
                  onClickDetails={(id) =>
                    navigate(`/tendering/vd/details/${id}`)
                  }
                  onClickDelete={() => {}}
                  setIsVisibleTopBar={setHidePrimaryTopBar}
                  onEditProposal={(proposal) => {
                    setNewProposalVisible(proposal)
                    setProposal(formatEditableProposal(proposal))
                  }}
                />
                <TableViewDetails
                  path="/vd/:proposalId"
                  setIsVisibleTopBar={setHidePrimaryTopBar}
                  titleTable={<span>TITLE SHOULD BE MENTIONED HERE</span>}
                  activeTab={'all'}
                  tableData={fbpTableData}
                  config={fbpConfig}
                  openAddComment={openAddComment}
                  openCreateAgenda={openCreateAgenda}
                  openViewSupportDoc={openViewSupportDoc}
                  setOpenAddComment={(value) => setOpenAddComment(value)}
                  setOpenCreateAgenda={(value) => setOpenCreateAgenda(value)}
                  setOpenViewSupportDoc={(value) =>
                    setOpenViewSupportDoc(value)
                  }
                  renderTree={menuBarRenderTree()}
                  renderActions={menuBarRenderActions()}
                />
                {/* <ProcessHistorianSection
              setIsVisibleTopBar={setHidePrimaryTopBar}
              renderTree={[
                {
                  name: 'Function Business Process',
                  link: () => navigate('/tendering'),
                },
                {
                  name: 'Process Historian',
                },
              ]}
              renderActions={[
                {
                  label: 'CLOSE',
                  action: () => {
                    navigate('/tendering')
                  },
                  isVisible: true,
                  swapTheming: false,
                  active: true,
                },
              ]}
              path="/vd/historian/:id"
            /> */}
                {/* <AnnualComparison
              path="/bs/comparison/*"
              role={userRole}
              onClickCheckbox={() => {}}
            />
            <ActualPerformanceReport
              path="/bs/report/*"
              onClickDetails={id =>
                navigate(`/tendering/bs/report/details/${id}`)
              }
              onClickDelete={() => {}}
              setIsVisibleTopBar={setHidePrimaryTopBar}
              role={userRole}
              onEditProposal={proposal => {
                setNewProposalVisible(proposal)
                setProposal(formatEditableProposal(proposal))
              }}
            /> */}
                <AnnualPlan
                  path="/bs/plan"
                  userRole={userRole}
                  currentUserSubject={subject}
                  onViewDetails={(id, planType) =>
                    navigate(`/tendering/bs/plan/details/${id}/${planType}`)
                  }
                  onClickDelete={() => {}}
                  setIsVisibleTopBar={setHidePrimaryTopBar}
                  role={userRole}
                  onEditProposal={(proposal) => {
                    setNewProposalVisible(proposal)
                    setProposal(formatEditableProposal(proposal))
                  }}
                  createAnnualPlanStatus={createAnnualPlanStatus}
                />
                <AnnualPlanDetail
                  path="/bs/plan/details/:annualPlanId/:planType"
                  setIsVisibleTopBar={setHidePrimaryTopBar}
                  userRole={userRole}
                  currentUserSubject={subject}
                />
                {/* <TableViewDetails
              path="/bs/plan/:proposalId"
              setIsVisibleTopBar={setHidePrimaryTopBar}
              titleTable={<span>TITLE SHOULD BE MENTIONED HERE</span>}
              activeTab={'all'}
              tableData={fbpTableData}
              config={fbpConfig}
              openAddComment={openAddComment}
              openCreateAgenda={openCreateAgenda}
              openViewSupportDoc={openViewSupportDoc}
              setOpenAddComment={value => setOpenAddComment(value)}
              setOpenCreateAgenda={value => setOpenCreateAgenda(value)}
              setOpenViewSupportDoc={value => setOpenViewSupportDoc(value)}
              renderTree={menuBarRenderTree()}
              renderActions={menuBarRenderActions()}
            /> */}
                {/* <TableViewDetails
              path="/bs/report/:proposalId"
              setIsVisibleTopBar={setHidePrimaryTopBar}
              titleTable={<span>TITLE SHOULD BE MENTIONED HERE</span>}
              activeTab={'all'}
              tableData={fbpTableData}
              config={fbpConfig}
              openAddComment={openAddComment}
              openCreateAgenda={openCreateAgenda}
              openViewSupportDoc={openViewSupportDoc}
              setOpenAddComment={value => setOpenAddComment(value)}
              setOpenCreateAgenda={value => setOpenCreateAgenda(value)}
              setOpenViewSupportDoc={value => setOpenViewSupportDoc(value)}
              renderTree={menuBarRenderTree()}
              renderActions={menuBarRenderActions()}
            /> */}
                {/* <TableViewDetails
              path="/bs/comparison/:proposalId"
              setIsVisibleTopBar={setHidePrimaryTopBar}
              titleTable={<span>TITLE SHOULD BE MENTIONED HERE</span>}
              activeTab={'all'}
              tableData={fbpTableData}
              config={fbpConfig}
              openAddComment={openAddComment}
              openCreateAgenda={openCreateAgenda}
              openViewSupportDoc={openViewSupportDoc}
              setOpenAddComment={value => setOpenAddComment(value)}
              setOpenCreateAgenda={value => setOpenCreateAgenda(value)}
              setOpenViewSupportDoc={value => setOpenViewSupportDoc(value)}
              renderTree={menuBarRenderTree()}
              renderActions={menuBarRenderActions()}
            />
            <MeetingsList
              path="/meeting/:proposalId"
              setIsVisibleTopBar={setHidePrimaryTopBar}
              role={userRole}
            />
            <AgendaRequest path="/agenda-request" /> */}
                <Reports path="/rp" />
              </Router>
            </Suspense>
          </QueryClientProvider>
        </PrimeContext.Provider>
      </div>
    </div>
  )
}

export default connect(
  ({ app, shell }) => ({
    userRoles: get(app, 'userInfos.roles', []),
    organizationId: get(shell, 'organizationId', null),
    subject: get(app, 'userInfos.ssoSubject', null),
  }),
  {
    addToast: act.addToast,
  },
)(
  mutate({
    moduleName: 'proposals',
    mutations: {
      submitProposal,
      clarifyProposal,
      clarifiedProposal,
      approvedProposal,
      rejectedProposal,
      underReviewProposal,
      createAnnualPlan,
      getProposalByRefNumber,
      getProposalById,
      updateProposal,
      publishProposal,
      getDelegation,
      getAccess,
    },
  })(
    graphql(workspacesByID, {
      options: () => {
        return {
          variables: { id: '0' },
          notifyOnNetworkStatusChange: true,
          context: {
            uri: `${PRODUCT_WORKSPACE_URL}/graphql`,
          },
        }
      },
      props: ({ data }) => {
        return { workspaceName: get(data, 'workspaceByID.name', '') }
      },
    })(TenderingModule),
  ),
)
