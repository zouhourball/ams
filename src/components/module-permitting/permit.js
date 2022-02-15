import { useState, useMemo, useEffect } from 'react'
import { Button, TextField, SelectField, Switch } from 'react-md'
import { navigate } from '@reach/router'
import { useQuery, useMutation } from 'react-query'

import Mht, {
  setSelectedRow as setSelectedRowAction,
} from '@target-energysolutions/mht'

import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { addToast } from 'modules/app/actions'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadPermitDialog from './upload-permit-dialog'
import HeaderTemplate from 'components/header-template'
import SupportedDocument from 'components/supported-document'

import ToastMsg from 'components/toast-msg'

import useRole from 'libs/hooks/use-role'
import {
  listPermitsByLoggedUser,
  deleteAll,
  deletePermit,
  updatePermit,
} from 'libs/api/permit-api'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import {
  permitDrillConfigs,
  permitSuspendConfigs,
  permitAbandonConfigs,
  reportsConfigs,
  // permitDrillData,
  // permitSuspendData,
  // permitAbandonData,
  actionsHeader,
} from './helpers'

import './style.scss'
import placeholder from 'images/phase.png'

const Permit = ({ subModule }) => {
  const company = getOrganizationInfos()
  const [currentTab, setCurrentTab] = useState(
    subModule === 'dr' ? 0 : subModule === 'sr' ? 1 : 2,
  )
  const [reportCurrentTab, setReportCurrentTab] = useState(0)
  const [showPermitDialog, setShowPermitDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [information, setInformation] = useState({ date: new Date() })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [view, setView] = useState('default')
  const [filterValue, setFilterValue] = useState('')

  const blockList = getBlocks()
  const { addSupportingDocuments } = documents()
  const dispatch = useDispatch()

  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )
  const reportsData = []
  useEffect(() => {
    setInformation({
      ...information,
      company: company?.name,
      permitType:
        currentTab === 0
          ? 'Drill'
          : currentTab === 1
            ? 'Suspend'
            : currentTab === 2
              ? 'Abandon'
              : '',
    })
  }, [company, currentTab])
  useEffect(() => {
    setSelectedRow([])
  }, [])
  const setSelectedRow = (data) => dispatch(setSelectedRowAction(data))
  const { data: permitListData, refetch: refetchList } = useQuery(
    [
      'listPermitsByLoggedUser',
      {
        permitType:
          currentTab === 0
            ? 'Drill'
            : currentTab === 1
              ? 'Suspend'
              : currentTab === 2
                ? 'Abandon'
                : '',
      },
      {
        size: size,
        page: page,
      },
      // },
    ],
    listPermitsByLoggedUser,
  )

  const role = useRole('permitting')
  const reportsActions = [
    { id: 'downTemp', label: 'Download Template', onClick: () => {} },
    { id: 'uplRep', label: 'Upload Report', onClick: () => {} },
  ]
  const actions =
    currentTab === 0
      ? [
        <Button
          key="0"
          id="save"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => setShowPermitDialog(true)}
        >
            Upload Permit to Drill Report
        </Button>,
      ]
      : currentTab === 1
        ? [
          <Button
            key="0"
            id="save"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => setShowPermitDialog(true)}
          >
            Upload Permit to Suspend Report
          </Button>,
        ]
        : [
          <Button
            key="0"
            id="save"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => setShowPermitDialog(true)}
          >
            Upload Permit to Abandon Report
          </Button>,
        ]
  const handleDeletePermit = (id) => {
    deletePermit(id).then((res) => {
      if (res) {
        setSelectedRow([])

        dispatch(
          addToast(
            <ToastMsg text={'Successfully deleted'} type="success" />,
            'hide',
          ),
        )
        refetchList()
      } else {
        refetchList()
        dispatch(
          addToast(
            <ToastMsg text={'Something went wrong'} type="error" />,
            'hide',
          ),
        )
      }
    })
  }
  const tabsList = ['Permit to Drill', 'Permit to Suspend', 'Permit to Abandon']
  const reportTabsList = [
    'End Of Well Report.xlsx',
    'Quarterly Well Integrity Report.xlsx',
    'Annual Drilling Report.xls',
  ]
  const cards = [
    { id: 1, name: 'org1', icon: placeholder },
    { id: 2, name: 'org2', icon: placeholder },
    { id: 3, name: 'org3', icon: placeholder },
  ]
  const permitData = permitListData?.content?.map((el) => {
    return {
      id: el.id,
      company: el?.metaData?.company,
      block: el?.metaData?.block,
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: el?.metaData?.createdBy?.name,
      referenceDate: moment(el?.metaData?.referenceDate).format('DD MMM, YYYY'),
      statusDate: el?.metaData?.updatedAt
        ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
        : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      supportingDocuments: '',
      status: el?.metaData?.status,
    }
  })
  const selectedRow = selectedRowSelector?.map((id) =>
    permitData ? permitData[id] : null,
  )
  // const renderCurrentTabData = () => {
  //   switch (currentTab) {
  //     case 1:
  //       return permitSuspendData
  //     case 2:
  //       return permitAbandonData
  //     case 0:
  //       return permitDrillData
  //     default:
  //       break
  //   }
  //   return []
  // }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 1:
        return permitSuspendConfigs(UploadSupportedDocumentFromTable)
      case 2:
        return permitAbandonConfigs(UploadSupportedDocumentFromTable)
      case 0:
        return permitDrillConfigs(UploadSupportedDocumentFromTable)
      default:
        return permitDrillConfigs(UploadSupportedDocumentFromTable)
    }
  }
  const navigateTo = () => {
    switch (currentTab) {
      case 1:
        localStorage.setItem('suspend-report', JSON.stringify(information))
        navigate(`/ams/permitting/suspend-report`)
        break
      case 2:
        localStorage.setItem('abandon-report', JSON.stringify(information))
        navigate(`/ams/permitting/abandon-report`)
        break
      case 0:
        localStorage.setItem('drill-report', JSON.stringify(information))
        navigate(`/ams/permitting/drill-report`)
        break
      default:
        localStorage.setItem('drill-report', JSON.stringify(information))
        navigate(`/ams/permitting/drill-report`)
    }
  }
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const permittingSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.id || showSupportedDocumentDialog?.id,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    permittingSuppDocs(data)
  }
  const renderKey = () => {
    switch (currentTab) {
      case 1:
        return 'suspend-report'
      case 2:
        return 'abandon-report'
      case 0:
        return 'drill-report'
      default:
        return 'drill-report'
    }
  }
  useMemo(() => {
    setPage(0)
  }, [currentTab])
  const updatePermitMutation = useMutation(updatePermit, {
    onSuccess: (res) => {
      refetchList()
    },
  })
  const submitDraft = (id) => {
    updatePermitMutation.mutate({
      id: id,
      status: 'SUBMITTED',
    })
  }
  const renderOrgs = () =>
    cards?.map((card) => {
      return (
        <div className="card" key={card?.id}>
          <div>
            <img src={card?.icon} />
            <span>{card?.name}</span>
            <span>
              <Switch />
            </span>
          </div>{' '}
          <SelectField
            id={'orgblocks'}
            className={`selectField`}
            menuItems={['item1', 'item2']}
            position={SelectField.Positions.BELOW}
            sameWidth
            simplifiedMenu={false}
            placeholder={'Select Blocks'}
            block
            onChange={setFilterValue}
            value={filterValue}
          />
        </div>
      )
    })

  return (
    <>
      <TopBar
        title="Permitting"
        actions={role === 'operator' && view === 'default' ? actions : null}
        changeView={setView}
        menuItems={() => {
          // string array of Ids
          const ids = selectedRow?.map((el) => el?.id)
          return [
            /* { key: 1, primaryText: 'Edit', onClick: () => null }, */
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () => {
                deleteAll(ids).then((res) => {
                  dispatch(
                    addToast(
                      <ToastMsg text={'Deleted successfully'} type="success" />,
                      'hide',
                    ),
                  )
                  refetchList()
                })
              },
            },
          ]
        }}
        role={role}
      />
      <div className="subModule">
        {view === 'default' && (
          <>
            <NavBar
              tabsList={tabsList}
              activeTab={currentTab}
              setActiveTab={(tab) => {
                setCurrentTab(tab)
                setSelectedRow([])
              }}
            />
            <div className="subModule--table-wrapper">
              <Mht
                hideTotal={false}
                withFooter
                configs={renderCurrentTabConfigs()}
                tableData={permitData || []}
                withSearch={selectedRow?.length === 0}
                commonActions={
                  selectedRow?.length === 0 || selectedRow?.length > 1
                }
                // onSelectRows={setSelectedRow}
                withChecked
                singleSelect={true}
                selectedRow={selectedRow}
                withDownloadCsv
                defaultCsvFileTitle={renderKey()}
                headerTemplate={
                  selectedRow?.length === 1 && (
                    <HeaderTemplate
                      title={`${selectedRow.length} Row Selected`}
                      actions={actionsHeader(
                        renderKey(),
                        selectedRow[0],
                        role,
                        setShowSupportedDocumentDialog,
                        handleDeletePermit,
                        submitDraft,
                      )}
                    />
                  )
                }
                footerTemplate={
                  permitData?.totalPages > 1 && (
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
                          v >= permitData?.totalPages
                            ? setPage(permitData?.totalPages - 1)
                            : setPage(parseInt(v) - 1)
                        }
                        // disabled={status === 'closed'}
                      />
                      of {permitData?.totalPages}
                      &nbsp;|&nbsp;Show
                      <TextField
                        id="el_num"
                        lineDirection="center"
                        block
                        placeholder={`Max number is ${permitData?.totalElements}`}
                        className="show"
                        value={size}
                        onChange={(v) =>
                          v > permitData?.totalElements
                            ? setSize(permitData?.totalElements)
                            : setSize(v)
                        }
                      />
                    </>
                  )
                }
              />
            </div>
          </>
        )}
        {view === 'reports' && (
          <>
            <NavBar
              tabsList={reportTabsList}
              activeTab={reportCurrentTab}
              setActiveTab={(tab) => {
                setReportCurrentTab(tab)
                setSelectedRow([])
              }}
              actions={reportsActions}
            />
            <div className="subModule--table-wrapper reports">
              <div className="header">
                <h3 className="top-bar-title">Organizations</h3>
              </div>
              <div className="cards">{renderOrgs()}</div>
            </div>
            <div className="subModule--table-wrapper">
              <Mht
                hideTotal={false}
                withFooter
                configs={reportsConfigs}
                tableData={reportsData || []}
                withSearch
                commonActions={
                  selectedRow?.length === 0 || selectedRow?.length > 1
                }
                // onSelectRows={setSelectedRow}
                // withChecked
                // singleSelect={true}
                // selectedRow={selectedRow}
                // withDownloadCsv
                // defaultCsvFileTitle={renderKey()}
                headerTemplate={
                  selectedRow?.length === 1 && (
                    <HeaderTemplate
                      title={`${selectedRow.length} Row Selected`}
                      actions={actionsHeader(
                        renderKey(),
                        selectedRow[0],
                        role,
                        setShowSupportedDocumentDialog,
                        handleDeletePermit,
                        submitDraft,
                      )}
                    />
                  )
                }
                footerTemplate={
                  permitData?.totalPages > 1 && (
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
                          v >= permitData?.totalPages
                            ? setPage(permitData?.totalPages - 1)
                            : setPage(parseInt(v) - 1)
                        }
                        // disabled={status === 'closed'}
                      />
                      of {permitData?.totalPages}
                      &nbsp;|&nbsp;Show
                      <TextField
                        id="el_num"
                        lineDirection="center"
                        block
                        placeholder={`Max number is ${permitData?.totalElements}`}
                        className="show"
                        value={size}
                        onChange={(v) =>
                          v > permitData?.totalElements
                            ? setSize(permitData?.totalElements)
                            : setSize(v)
                        }
                      />
                    </>
                  )
                }
              />
            </div>
          </>
        )}
      </div>
      {showPermitDialog && (
        <UploadPermitDialog
          visible={showPermitDialog}
          onHide={() => setShowPermitDialog(false)}
          title={'Upload Permit to Drill Report'}
          datePlaceholder={'Spud Date'}
          information={information}
          setInformation={setInformation}
          onContinue={() => navigateTo()}
          blockList={blockList?.map((el) => el.block)}
        />
      )}
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            selectedRow[0]?.id || showSupportedDocumentDialog?.id
          }
          onSaveUpload={(data) => handleSupportingDocs(data)}
          readOnly={role === 'regulator'}
        />
      )}
    </>
  )
}
export default Permit
