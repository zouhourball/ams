import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { graphql } from 'react-apollo'
import { DialogContainer, Button } from 'react-md'
import { navigate } from '@reach/router'

import { UploaderDialog } from '@target-energysolutions/supporting-documents'

import NavigateMenu from '../../components/navigate-menu'
import CustomDataTable from '../../components/custom-data-table/'
import FilterDevelopementAnalysis from '../../components/filter-developement-analysis'

import {
  getProposalById,
  clarifyProposal,
  createMeeting,
} from 'libs/api/api-tendering'
import workspacesByID from 'libs/queries/workspace-by-id.gql'
import mutate from 'libs/hocs/mutate'
import { get } from 'lodash-es'
import { usePrevious } from 'libs/utils/use-previous'
import { getAuthToken } from 'libs/utils/oauth-token'
// import { useTranslation } from 'libs/langs'

import './styles.scss'
function TableViewDetails ({
  config,
  openAddComment = false,
  openViewSupportDoc = false,
  setOpenAddComment,
  setOpenViewSupportDoc,
  openRejectComment = false,
  setOpenRejectComment,
  renderTree,
  titleTable,
  activeTab,
  setIsVisibleTopBar,
  filterControls,
  filterControlsCheckedDefault,
  proposalId,
  mutations: { getProposalById, clarifyProposal },
  getProposalByIdStatus,
  userRole,
  clarifyProposalStatus,
}) {
  // const { t } = useTranslation()
  const [displayFilter, setDisplayFilter] = useState(false)
  const [openViewComment, setOpenViewComment] = useState(false)

  useEffect(() => {
    setIsVisibleTopBar && setIsVisibleTopBar(true)
    if (proposalId) {
      getProposalById(proposalId)
    }
  }, [])

  useEffect(() => {
    return () => {
      setIsVisibleTopBar && setIsVisibleTopBar(false)
    }
  }, [])

  const prevClarifyProposalStatus = usePrevious(clarifyProposalStatus)
  useEffect(() => {
    if (
      prevClarifyProposalStatus &&
      prevClarifyProposalStatus !== clarifyProposalStatus &&
      !clarifyProposalStatus.pending &&
      clarifyProposalStatus.data &&
      clarifyProposalStatus.data.success
    ) {
      navigate('/tendering/fbp')
    }
  }, [clarifyProposalStatus])

  const renderProposalData = () => {
    return [
      {
        ...get(getProposalByIdStatus, 'data.data', ''),
        referenceNo: get(
          getProposalByIdStatus,
          'data.data.referenceNumber',
          '',
        ),
        blockNo: get(getProposalByIdStatus, 'data.data.blockNumber', ''),
        threadsHoldLevel: get(
          getProposalByIdStatus,
          'data.data.threadHoldLevel',
          '',
        ),
        approvedBudgetByJMC: get(
          getProposalByIdStatus,
          'data.data.budgetApprovedByJMC',
          '',
        ),
        originalACVApproved: get(
          getProposalByIdStatus,
          'data.data.originalACV',
          '',
        ),
        estimatedDuration: get(
          getProposalByIdStatus,
          'data.data.estimateDuration',
          '',
        ),
      },
    ]
  }

  const menuBarRenderActions = () => {
    switch (userRole) {
      case 'secretary':
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
            label: 'CLARIFY',
            action: () => {
              setOpenAddComment(true)
            },
            isVisible: ['New', 'Clarified'].includes(
              get(getProposalByIdStatus, 'data.data.proposalStateEnum', ''),
            ),
            swapTheming: false,
            active: true,
          },
          // {
          //   label: 'REVIEW',
          //   action: () => {
          //     underReviewProposal(proposalId, {
          //       workspaceName: getCookie('workspaceName'),
          //       workspaceId: getCookie('workspaceId'),
          //     })
          //   },
          //   isVisible: ['New', 'Clarified'].includes(
          //     get(getProposalStatus, 'data.data.proposalStateEnum', ''),
          //   ),
          //   swapTheming: false,
          //   active: true,
          // },
          // {
          //   label: 'APPROVE',
          //   action: () => {
          //     approvedProposal(proposalId, {
          //       workspaceName: getCookie('workspaceName'),
          //       workspaceId: getCookie('workspaceId'),
          //     })
          //   },
          //   isVisible:
          //     get(getProposalStatus, 'data.data.proposalStateEnum', '') ===
          //     'PassedToAgenda',
          //   swapTheming: false,
          //   active: true,
          // },
          {
            label: 'REJECT',
            action: () => {
              setOpenRejectComment(true)
              // rejectedProposal(proposalId)
            },
            isVisible:
              get(getProposalByIdStatus, 'data.data.proposalStateEnum', '') ===
              'PassedToAgenda',
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
        ]
      case 'operator':
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
            label: 'FEEDBACKS',
            action: () => {
              setOpenViewComment(true)
            },
            isVisible: ['Clarify'].includes(
              get(getProposalByIdStatus, 'data.data.proposalStateEnum', ''),
            ),
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
            label: 'VIEW SUPPORT DOCUMENTS',
            action: () => {
              setOpenViewSupportDoc(true)
            },
            isVisible: true,
            swapTheming: false,
            active: true,
          },
        ]
    }
  }

  const attachments = get(
    getProposalByIdStatus,
    'data.data.attachments',
    [],
  ).map((item) => {
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
  const onUploadDocumentsSuccess = (uploadedDocuments, apiResponse) => {
    // const {
    //   mutations: { commitTaskSupport },
    //   processInstanceId,
    // } = this.props
    // let arrayDocument = []
    // if (apiResponse.success) {
    //   const currentFiles = apiResponse.files
    //   if (Array.isArray(currentFiles)) {
    //     arrayDocument = currentFiles.map(elem => {
    //       return {
    //         processInstanceId,
    //         fileId: elem.id,
    //         url: elem.url,
    //         description: t('userInputDescToProcess'),
    //       }
    //     })
    //   }
    //   commitTaskSupport(arrayDocument)
    // }
  }
  return (
    <div className="TableViewDetails">
      <div className="TableViewDetails-NavigateMenu">
        <NavigateMenu tree={renderTree} actions={menuBarRenderActions()} />
      </div>
      <div className="TableViewDetails-content">
        <div className="TableViewDetails-content-table">
          <CustomDataTable
            className="statued-table"
            title={titleTable}
            showTabs={false}
            showFilter
            activeTab={activeTab}
            onClickFilter={() => setDisplayFilter(true)}
            onChangeTab={() => {}}
            data={renderProposalData()}
            config={config}
            actions={[]}
            CustomFilterComponent={
              <FilterDevelopementAnalysis
                visible={displayFilter}
                controls={filterControls || []}
                defaultChecked={filterControlsCheckedDefault || ''}
                onApply={(e) => {}}
                onHide={() => setDisplayFilter(false)}
              />
            }
          />
        </div>
        <div className="TableViewDetails-content-clarify">
          {openViewComment && (
            <DialogContainer
              id="viewComment"
              title={'Clarify Comment'}
              className="viewComment"
              visible={openViewComment}
              onHide={() => setOpenViewComment(false)}
              actions={[
                <div key={0}>
                  <Button
                    flat
                    className="md-text--secondary"
                    onClick={() => setOpenViewComment(false)}
                  >
                    CLOSE
                  </Button>
                </div>,
              ]}
            >
              <div className="viewComment-dialog-body">
                {get(getProposalByIdStatus, 'data.data.toClarifyComment', '')}
              </div>
            </DialogContainer>
          )}
          <UploaderDialog
            key={'upload-button'}
            className="UploaderButton__UploaderDialog"
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
            onHide={() => setOpenViewSupportDoc(false)}
            onUploadDocumentsSuccess={onUploadDocumentsSuccess}
            fileManagerURL={
              process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''
            }
          />
        </div>
      </div>
    </div>
  )
}

export default graphql(workspacesByID, {
  options: () => {
    return {
      variables: { id: '1619' },
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
  connect(({ shell }) => ({
    organizationID: shell.organizationId,
  }))(
    mutate({
      moduleName: 'proposalDetail',
      mutations: {
        getProposalById,
        clarifyProposal,
        createMeeting,
      },
    })(TableViewDetails),
  ),
)
