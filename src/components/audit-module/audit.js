import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-md'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'
import moment from 'moment'
import useRole from 'libs/hooks/use-role'

import {
  getStateAudit,
  submitAudits,
  closureReport,
  closingAudit,
  supportingDocuments,
} from 'libs/api/api-audit'
// import documents from 'libs/hooks/documents'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import HeaderTemplate from 'components/header-template'
import SupportedDocumentAudit from 'components/supported-document-audit'
import NewAuditRequestDialog from 'components/new-audit-request-dialog'
import AuditClosureDialog from 'components/audit-closure-dialog'
import AuditClosureDetailsDialog from 'components/audit-closure-details-dialog'
import fileDataFormatter from 'libs/hooks/file-data-formatter'
import ToastMsg from 'components/toast-msg'

import { addToast } from 'modules/app/actions'

import { configs, actionsHeader } from './helpers'

const Audit = () => {
  const [currentTab, setCurrentTab] = useState(0)
  // const [page, setPage] = useState(0)
  // const [size, setSize] = useState(20)
  const [uploadDialog, showUploadDialog] = useState(false)
  const [newAuditClosureDialog, showAuditClosureDialog] = useState(false)
  const [closureReportDetails, showClosureReport] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const successFn = {
    onSuccess: (res) => {
      if (res.success) {
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchListStateAudit()
        setSelectedRow([])
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
  const [participants, setParticipants] = useState([])

  // const { addSupportingDocuments } = documents()
  const role = useRole('audit')
  const renderData = () => {
    return (
      listStateAudit?.data?.map((el) => ({
        title: el?.title,
        auditId: el?.id,
        requestDate: moment(el?.createdAt).format('DD MMM YYYY'),
        description: el?.description?.replace(/<\/?[^>]+(>|$)/g, ''),
        status: el?.auditStatus,
        report: el?.report,
        actions: el?.actions,
        enquiries: el?.enquiries,
      })) || []
    )
  }
  useEffect(() => {
    setSelectedRow([])
    setParticipants([])
  }, [])
  const dispatch = useDispatch()
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))

  const { data: listStateAudit, refetch: refetchListStateAudit } = useQuery(
    ['getStateAudit'],
    getStateAudit,
  )
  /* const updateRequestStatus = useMutation(updateAudit, {
    onSuccess: (res) => {
      if (!res.error) {
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
  }) */
  const uploadSupportingDocuments = useMutation(supportingDocuments, {
    onSuccess: (res) => {
      if (res.success) {
        dispatch(
          addToast(
            <ToastMsg text={res.message || 'success'} type="success" />,
            'hide',
          ),
        )
        refetchListStateAudit()
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
  const submitAuditsMutation = useMutation(submitAudits, {
    ...successFn,
  })
  const submitClosureReportMutation = useMutation(closureReport, {
    ...successFn,
  })
  const closeAuditMutation = useMutation(closingAudit, {
    ...successFn,
  })
  const handleSupportingDocs = (data) => {
    uploadSupportingDocuments.mutate({
      data: fileDataFormatter(data),
      id: selectedRow[0]?.auditId || showSupportedDocumentDialog?.auditId,
    })
  }
  const selectedRow = selectedRowSelector?.map((el) => renderData()[el])

  const actions = [
    role === 'AU' && (
      <Button
        key={`audit-btn-1`}
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          showUploadDialog(true)
        }}
      >
        New Audit Request
      </Button>
    ),
  ]
  const submitRequest = (body) => {
    submitAuditsMutation.mutate({
      body,
    })
  }
  const submitClosureReport = (body) => {
    submitClosureReportMutation.mutate({
      body,
      auditId: selectedRow[0]?.auditId,
    })
  }
  /* const updateStatus = (status) => {
    updateRequestStatus.mutate({
      auditId: selectedRow[0]?.auditId,
      status,
    })
  } */
  const closeAudit = () => {
    closeAuditMutation.mutate({
      auditId: selectedRow[0]?.auditId,
    })
  }
  return (
    <>
      <TopBar
        title="Audit"
        actions={actions}
        menuItems={() => {
          // const ids = selectedRow?.map((el) => el?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () => {},
              /* deleteAll(ids, renderSectionKey()?.name).then((res) => {
                  dispatch(
                    addToast(
                      <ToastMsg text={'Successfully deleted'} type="success" />,
                      'hide',
                    ),
                  )
                  renderSectionKey().refetch()
                }) */
            },
          ]
        }}
        // role={role}
      />
      <div className="subModule">
        <NavBar
          tabsList={['State Audit']}
          activeTab={currentTab}
          setActiveTab={(tab) => {
            setCurrentTab(tab)
            // setSelectedRow([])
          }}
        />
        <div className="subModule--table-wrapper">
          <Mht
            hideTotal={false}
            singleSelect={true}
            withFooter
            configs={configs}
            tableData={renderData()?.length ? renderData() : []}
            // tableData={dummyData}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            // onSelectRows={setSelectedRow}
            withChecked
            withDownloadCsv
            defaultCsvFileTitle={'state-audit'}
            selectedRow={selectedRow}
            /* footerTemplate={
              listStateAudit?.totalElements > 1 && (
                <>
                  &nbsp;|&nbsp;Page
                  <TextField
                    id="page_num"
                    lineDirection="center"
                    block
                    type={'number'}
                    className="page"
                    value={page + 1}
                    onChange={(v) =>
                      v >= listStateAudit?.totalElements
                        ? setPage(listStateAudit?.totalElements - 1)
                        : setPage(parseInt(v) - 1)
                    }
                    // disabled={status === 'closed'}
                  />
                  of {listStateAudit?.totalElements}
                  &nbsp;|&nbsp;Show
                  <TextField
                    id="el_num"
                    lineDirection="center"
                    block
                    className="show"
                    value={size}
                    onChange={(v) =>
                      v > listStateAudit?.totalElements
                        ? setSize(listStateAudit?.totalElements)
                        : setSize(v)
                    }
                  />
                </>
              )
            } */
            headerTemplate={
              (selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow.length} Row Selected`}
                  actions={actionsHeader(
                    role,
                    selectedRow[0],
                    setShowSupportedDocumentDialog,
                    showAuditClosureDialog,
                    showClosureReport,
                    // updateStatus,
                    closeAudit,
                  )}
                />
              )) || <div />
            }
          />
        </div>
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocumentAudit
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          // readOnly={role === 'regulator'}
          id={selectedRow[0]?.auditId || showSupportedDocumentDialog?.auditId}
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
      {uploadDialog && (
        <NewAuditRequestDialog
          title={'New Audit Request'}
          visible={uploadDialog}
          onHide={() => showUploadDialog(false)}
          onSave={submitRequest}
        />
      )}
      {newAuditClosureDialog && (
        <AuditClosureDialog
          title={'Send Audit Closure Report'}
          visible={newAuditClosureDialog}
          onHide={() => showAuditClosureDialog(false)}
          onSave={submitClosureReport}
          setParticipants={setParticipants}
          participants={participants}
        />
      )}
      {closureReportDetails && (
        <AuditClosureDetailsDialog
          onDiscard={() => showClosureReport(false)}
          visible={closureReportDetails}
          title={'Audit Closure Report'}
          report={selectedRow[0]?.report}
        />
      )}
    </>
  )
}
export default Audit
