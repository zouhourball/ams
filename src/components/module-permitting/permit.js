import { useState, useEffect } from 'react'
import {
  Button,
  TextField,
  SelectField,
  SelectionControl,
  FontIcon,
} from 'react-md'
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
import UploadReportByTemplate from 'components/upload-report-by-template'
// import PreviewDialog from 'components/module-permitting/preview-dialog'
import ReportsFilePreview from 'components/module-tendering/components/reports-file-preview'

import UploadDrillingFileDialog from 'components/upload-drilling-file-dialog'
// import * as apiR from 'libs/api/api-reports'

import ToastMsg from 'components/toast-msg'

import useRole from 'libs/hooks/use-role'
import {
  listPermitsByLoggedUser,
  deleteAll,
  deleteReports,
  deletePermit,
  updatePermit,
  getTemplates,
  getReportsByTemplate,
  addReportForSelectedTemplate,
  addTemplate,
  deleteRegulations,
  getListOfCompaniesBlocks,
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
  actionsHeaderReports,
} from './helpers'

import './style.scss'
import placeholder from 'images/phase.png'

const Permit = ({ subModule }) => {
  const company = getOrganizationInfos()
  const [currentTab, setCurrentTab] = useState(
    subModule === 'dr' ? 0 : subModule === 'sr' ? 1 : 2,
  )
  const [reportCurrentTab, setReportCurrentTab] = useState(null)
  const [showPermitDialog, setShowPermitDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [information, setInformation] = useState({ date: new Date() })
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)
  const [view, setView] = useState('default')
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)

  const [showUploadDrillingFileDialog, setShowUploadDrillingFileDialog] =
    useState(false)
  const [filesList, setFileList] = useState([])
  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])

  const [preview, setPreview] = useState(false)

  const blockList = getBlocks()
  const { addSupportingDocuments } = documents()
  const dispatch = useDispatch()

  const selectedRowSelector = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

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

  const { data: permitTemplates, refetch: refetchTemplates } = useQuery(
    ['getTemplates'],
    getTemplates,
  )

  const { data: listCompaniesBlocks, refetch: refetchListOfCompaniesBlocks } =
    useQuery(
      ['getListOfCompaniesBlocks', reportCurrentTab],
      reportCurrentTab && getListOfCompaniesBlocks,
    )

  const addReportsByTemplate = useMutation(addReportForSelectedTemplate, {
    onSuccess: (res) => {
      refetchTemplateList()
      setShowUploadRapportDialog(false)
      refetchListOfCompaniesBlocks()
    },
  })
  const addTemplateMutation = useMutation(addTemplate, {
    onSuccess: (res) => {
      refetchTemplates()
      setShowUploadDrillingFileDialog(false)
    },
  })

  const {
    data: reportsByTemplateList,
    refetch: refetchTemplateList,
    // isLoading: loadingTemplate,
  } = useQuery(
    [
      'getReportsByTemplate',
      {
        textSearch: '',
        filters: [],
        companies: selectedCompanies,
        blocks: selectedBlocks.filter(
          (item, index) => selectedBlocks.indexOf(item) === index,
        ),
      },
      reportCurrentTab,
      0,
      200,
    ],
    getReportsByTemplate,
    {
      refetchOnWindowFocus: false,
    },
  )
  // const renderOrganizations = () => {
  //   let listOrganizations = []
  //   if (reportsByTemplateList && !isEmpty(reportsByTemplateList?.data)) {
  //     ;(reportsByTemplateList?.data || []).forEach((el) => {
  //       if (el?.companies.length !== 0) {
  //         listOrganizations.push(el?.companies[0])
  //       }
  //     })
  //   }
  //   return listOrganizations
  // }

  // const listOrgs = renderOrganizations().filter(
  //   (item, index) => renderOrganizations().indexOf(item) === index,
  // )

  const reportsData = (reportsByTemplateList?.data || []).map((el) => ({
    id: el?.id,
    fileName: el?.filename,
    company: el?.companies[0],
    block: el?.block,
    submittedDate: moment(el?.uploadDate).format('DD MMM, YYYY'),
    submittedBy: el?.author,
    referenceDate: moment(el?.referenceDate).format('DD MMM, YYYY'),
    url: el?.url,
    file: el,
  }))

  const role = useRole('permitting')
  const roleRegulation = useRole('regulation')
  const onDownloadTemplate = (url) => {
    window.open(`${PRODUCT_APP_URL_API}/fm${url}`)
  }
  const reportActions = () => {
    switch (roleRegulation) {
      case 'regulator':
        return [
          // { id: 'downTemp', label: 'Download Template', onClick: () => {} },
          {
            id: 'uplTemplate',
            label: 'Upload Template',
            onClick: () => {
              setShowUploadDrillingFileDialog(true)
            },
          },
        ]

      case 'operator':
        return [
          {
            id: 'uplRep',
            label: 'Upload Report',
            onClick: () => {
              setShowUploadRapportDialog(true)
            },
          },
        ]
      default:
        return []
    }
  }

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
  const cards = listCompaniesBlocks?.map((el, index) => ({
    id: index,
    name: el?.company,
    icon: placeholder,
    blocks: el?.blocks,
  }))
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
      updatedBy: el?.metaData?.updatedBy?.email,
    }
  })
  const selectedRow = selectedRowSelector?.map((id) =>
    view === 'reports' ? reportsData[id] : permitData ? permitData[id] : null,
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
        localStorage.setItem('reports', JSON.stringify(information))
        navigate(`/ams/permitting/reports`)
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
        return 'reports'
    }
  }
  useEffect(() => {
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
              <SelectionControl
                id={`company-${card.id}`}
                type="switch"
                onChange={() => {
                  setSelectedCompanies((prev) =>
                    !prev?.includes(card.name)
                      ? [...prev, card.name]
                      : prev.filter((el) => el !== card.name),
                  )
                }}
                className="selection-control selection-control-small"
              />
            </span>
          </div>{' '}
          <SelectField
            id={'orgblocks'}
            className={`selectField`}
            menuItems={card?.blocks?.map((el) => {
              return {
                label: (
                  <div id="checkbox-active" className="card-menuItem">
                    <FontIcon
                      iconClassName={`mdi mdi-checkbox${
                        selectedBlocks?.includes(el)
                          ? '-marked selected'
                          : '-blank-outline'
                      }`}
                    />
                    <div className="card-menuItem-text">{el}</div>
                  </div>
                ),
                value: el,
              }
            })}
            position={SelectField.Positions.BELOW}
            sameWidth
            simplifiedMenu={false}
            placeholder={'Select Blocks'}
            block
            onChange={(item) => {
              setSelectedBlocks((prev) =>
                !prev?.includes(item)
                  ? [...prev, item]
                  : prev.filter((el) => el !== item),
              )
            }}
            value={''}
          />
        </div>
      )
    })
  const onUpload = (data) => {
    addReportsByTemplate.mutate({
      body: [
        {
          url: data?.file?.url,
          fileId: data?.file?.id,
          category: 'C : Reporting Templates',
          subject: 'MOG-S03-WELLS & DRILLING MANAGEMENT',
          description: '',
          company: company?.name,
          block: data?.block,
          referenceDate: `${data?.referenceDate?.year}-${data?.referenceDate?.month}-${data?.referenceDate?.day}`,
        },
      ],
      templateId: reportCurrentTab,
    })
  }

  const onAddTemplate = (data) => {
    const body = [
      {
        url: data?.file?.url,
        fileId: data?.file?.id,
        filename: data?.file?.filename,
        category: 'C : Reporting Templates',
        subject: 'MOG-S03-WELLS & DRILLING MANAGEMENT',
        size: data?.file?.size.toString(),
        description: data?.title,
        contentType: data?.file?.contentType,
      },
    ]
    addTemplateMutation.mutate(body)
  }
  const tabsListReports =
    permitTemplates && permitTemplates?.length !== 0
      ? permitTemplates?.map((el) => ({
        linkToNewTab: `/ams/permitting/dr`,
        label: el?.filename,
        key: el?.id,
      }))
      : []
  useEffect(() => {
    permitTemplates && permitTemplates?.length !== 0
      ? setReportCurrentTab(permitTemplates[0]?.id)
      : setReportCurrentTab(tabsListReports[0]?.key)
  }, [permitTemplates])
  const onDeleteReports = (id) => {
    deleteReports([id]).then((res) => {
      if (res) {
        setSelectedRow([])
        setPreview(false)

        dispatch(
          addToast(
            <ToastMsg text={'Successfully deleted'} type="success" />,
            'hide',
          ),
        )
        refetchTemplateList()
      } else {
        refetchTemplateList()
        dispatch(
          addToast(
            <ToastMsg text={'Something went wrong'} type="error" />,
            'hide',
          ),
        )
      }
    })
  }
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
                view === 'default'
                  ? deleteAll(ids).then((res) => {
                    dispatch(
                      addToast(
                        <ToastMsg
                          text={'Deleted successfully'}
                          type="success"
                        />,
                        'hide',
                      ),
                    )
                    refetchList()
                  })
                  : deleteRegulations(ids).then((res) => {
                    dispatch(
                      addToast(
                        <ToastMsg
                          text={'Deleted successfully'}
                          type="success"
                        />,
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
                  permitListData?.totalPages > 1 && (
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
                          v >= permitListData?.totalPages
                            ? setPage(permitListData?.totalPages - 1)
                            : setPage(parseInt(v) - 1)
                        }
                        // disabled={status === 'closed'}
                      />
                      of {permitListData?.totalPages}
                      &nbsp;|&nbsp;Show
                      <TextField
                        id="el_num"
                        lineDirection="center"
                        block
                        placeholder={`Max number is ${permitListData?.totalElements}`}
                        className="show"
                        value={size}
                        onChange={(v) =>
                          v > permitListData?.totalElements
                            ? setSize(permitListData?.totalElements)
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
              tabsList={tabsListReports}
              activeTab={reportCurrentTab}
              setActiveTab={(tab) => {
                setReportCurrentTab(tab)
                setSelectedRow([])
              }}
              actions={reportActions()}
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
                singleSelect={true}
                commonActions={
                  selectedRow?.length === 0 || selectedRow?.length > 1
                }
                // onSelectRows={setSelectedRow}
                withChecked
                // singleSelect={true}
                // selectedRow={selectedRow}
                // withDownloadCsv
                // defaultCsvFileTitle={renderKey()}
                headerTemplate={
                  selectedRow?.length === 1 && (
                    <HeaderTemplate
                      title={`${selectedRow.length} Row Selected`}
                      actions={actionsHeaderReports(
                        renderKey(),
                        selectedRow[0],
                        role,
                        setShowSupportedDocumentDialog,
                        onDeleteReports,
                        setPreview,
                      )}
                    />
                  )
                }
                footerTemplate={
                  permitListData?.totalPages > 1 && (
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
                          v >= permitListData?.totalPages
                            ? setPage(permitListData?.totalPages - 1)
                            : setPage(parseInt(v) - 1)
                        }
                        // disabled={status === 'closed'}
                      />
                      of {permitListData?.totalPages}
                      &nbsp;|&nbsp;Show
                      <TextField
                        id="el_num"
                        lineDirection="center"
                        block
                        placeholder={`Max number is ${permitListData?.totalElements}`}
                        className="show"
                        value={size}
                        onChange={(v) =>
                          v > permitListData?.totalElements
                            ? setSize(permitListData?.totalElements)
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
          blockList={
            Array.isArray(blockList)
              ? blockList?.map((el) => ({
                label: el.block,
                value: el?.block,
              }))
              : []
          }
        />
      )}
      {showUploadDrillingFileDialog && (
        <UploadDrillingFileDialog
          title={'Upload Drilling File'}
          visible={showUploadDrillingFileDialog}
          onHide={() => {
            setShowUploadDrillingFileDialog(false)
            setFileList([])
          }}
          filesList={filesList}
          setFileList={setFileList}
          uploadLabel="Attach Spreadsheet"
          onUploadTemplate={(data) => onAddTemplate(data)}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportByTemplate
          setFileList={setFileList}
          filesList={filesList}
          blockList={
            Array.isArray(blockList) && blockList?.length > 0
              ? blockList?.map((el) => ({ label: el?.block, value: el?.block }))
              : []
          }
          // onDisplayMHT={onDisplayMHT}
          title={'Upload Report'}
          optional={'Attach Supporting Documents'}
          visible={showUploadRapportDialog}
          uploadLabel={'Attach Spreadsheet'}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            onUpload(data)
          }}
          onUploadTemp={(data) => onUpload(data)}
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
      {/* {preview && (
        <PreviewDialog
          title={'Preview'}
          visible={preview}
          onDiscard={() => setPreview(false)}
          file={selectedRow[0]}
        />
      )} */}
      {preview && (
        <ReportsFilePreview
          hideDialog={() => setPreview(false)}
          visible={preview}
          file={selectedRow[0]?.file}
          downloadFile={() => onDownloadTemplate(selectedRow[0]?.url)}
          deleteFile={() => onDeleteReports(selectedRow[0]?.id)}
        />
      )}
    </>
  )
}
export default Permit
