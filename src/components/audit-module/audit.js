import { useDispatch, useSelector } from 'react-redux'
import { Button, TextField } from 'react-md'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'react-query'
import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'
import moment from 'moment'

import { getStateAudit, submitAudits, closureReport } from 'libs/api/api-audit'
import documents from 'libs/hooks/documents'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import HeaderTemplate from 'components/header-template'
import SupportedDocument from 'components/supported-document'
import NewAuditRequestDialog from 'components/new-audit-request-dialog'
import AuditClosureDialog from 'components/audit-closure-dialog'
import { configs, actionsHeader, dummyData } from './helpers'

const Audit = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [uploadDialog, showUploadDialog] = useState(false)
  const [auditClosureDialog, showAuditClosureDialog] = useState(false)
  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const { addSupportingDocuments } = documents()

  const renderData = () => {
    return (
      listStateAudit?.content?.map((el) => ({
        title: el?.metaData?.title,
        auditId: el?.id,
        requestDate: el?.metaData?.createdAt
          ? moment(el?.metaData?.createdAt).format('DD MMM YYYY')
          : '',
        description: el?.metaData?.description,
        status: el?.metaData?.status,
      })) || []
    )
  }
  const selectedRow = selectedRowSelector.map((id) => renderData()[id])
  useEffect(() => {
    setSelectedRow([])
  }, [])
  const dispatch = useDispatch()
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))

  const { data: listStateAudit } = useQuery(
    [
      'getStateAudit',
      {
        size: size,
        page: page,
      },
    ],
    getStateAudit,
  )
  const submitAuditsMutation = useMutation(submitAudits)
  const submitClosureReportMutation = useMutation(closureReport)

  const handleSupportingDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      // closeDialog,
    )
  }
  const actions = [
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
    </Button>,
  ]
  const submitRequest = (body) => {
    submitAuditsMutation.mutate(
      {
        body,
      },
      {
        onSuccess: (res) => {},
      },
    )
  }
  const submitClosureReport = (body) => {
    submitClosureReportMutation.mutate({
      body,
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
            tableData={renderData()?.length ? renderData() : dummyData}
            // tableData={dummyData}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0}
            // onSelectRows={setSelectedRow}
            withChecked
            withDownloadCsv
            defaultCsvFileTitle={'state-audit'}
            selectedRow={selectedRow}
            footerTemplate={
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
            }
            headerTemplate={
              (selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow.length} Row Selected`}
                  actions={actionsHeader(
                    selectedRow[0],
                    setShowSupportedDocumentDialog,
                    showAuditClosureDialog,
                  )}
                />
              )) || <div />
            }
          />
        </div>
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          // readOnly={role === 'regulator'}
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
      {uploadDialog && (
        <NewAuditRequestDialog
          title={''}
          visible={uploadDialog}
          onHide={() => showUploadDialog(false)}
          onSave={submitRequest}
        />
      )}
      {auditClosureDialog && (
        <AuditClosureDialog
          title={'Send Audit Closure Report'}
          visible={auditClosureDialog}
          onHide={() => showAuditClosureDialog(false)}
          onSave={submitClosureReport}
        />
      )}
    </>
  )
}
export default Audit
