import { useState, useMemo, useCallback, useEffect } from 'react'
import {
  Button,
  SelectField,
  TextField,
  SelectionControl,
  FontIcon,
} from 'react-md'
import Mht, { setSelectedRow } from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'

import useRole from 'libs/hooks/use-role'
import {
  uploadReport,
  commitSubModule,
  listOfReports,
  overrideReport,
  deleteRows,
  getTemplatesCostRecovery,
  addTemplateCostRecovery,
  addReportForSelectedTemplate,
  getReportsByTemplate,
  deleteReports,
} from 'libs/api/cost-recovery-api'

import { getListOfCompaniesBlocks } from 'libs/api/permit-api'
import { downloadTemp } from 'libs/api/supporting-document-api'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'

import {
  configsAnnualCostsDialogMht,
  configsContractsDialogMht,
  transactionConfig,
  affiliateConfig,
  configsLiftingCostsDialogMht,
} from './mht-helper-dialog'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import { addToast } from 'modules/app/actions'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'
import ConfirmDialog from 'components/confirm-dialog'

import UploadReportByTemplate from 'components/upload-report-by-template'

import { configs, actionsHeader } from './helpers'
import { reportsConfigs } from 'components/module-permitting/helpers'
import UploadDrillingFileDialog from 'components/upload-drilling-file-dialog'
import ToastMsg from 'components/toast-msg'

import placeholder from 'images/phase.png'

import 'components/module-permitting/style.scss'

const CostRecovery = ({ subkey }) => {
  const tab = [
    'costs',
    'contracts',
    'prodLifting',
    'transaction',
    'affiliate',
    'facilities',
  ]

  const [currentTab, setCurrentTab] = useState(tab?.indexOf(subkey))
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  // const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [subSubModule, setSubSubModule] = useState('dataActualLifting')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(20)

  const [selectedBlocks, setSelectedBlocks] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [reportCurrentTab, setReportCurrentTab] = useState(null)
  const [showUploadDrillingFileDialog, setShowUploadDrillingFileDialog] =
    useState(false)

  const [
    showUploadRapportByTemplateDialog,
    setShowUploadRapportByTemplateDialog,
  ] = useState(false)

  const [view, setView] = useState('default')

  const blockList = getBlocks()

  const company = getOrganizationInfos()

  const [, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])

  const role = useRole('costrecovery')
  const selectedRow = useSelector(
    (state) => state?.selectRowsReducers?.selectedRows,
  )

  const dispatch = useDispatch()
  const { mutate: uploadReportMutation, data: uploadData } =
    useMutation(uploadReport)

  const { mutate: overrideReportMutate } = useMutation(overrideReport)

  const { mutate: commitSub } = useMutation(commitSubModule)

  useEffect(() => {
    dispatch(setSelectedRow([]))
  }, [])

  const {
    data: globalMhtData,
    refetch: refetchCurrentData,
    // isLoading: loading,
  } = useQuery(
    [
      tab[currentTab],
      {
        size: size,
        page: page,
      },
    ],
    listOfReports,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: costRecoveryTemplates, refetch: refetchTemplates } = useQuery(
    ['getTemplates'],
    getTemplatesCostRecovery,
  )

  const { data: listCompaniesBlocks, refetch: refetchListOfCompaniesBlocks } =
    useQuery(
      ['getListOfCompaniesBlocks', reportCurrentTab],
      reportCurrentTab && getListOfCompaniesBlocks,
    )

  const addTemplateMutation = useMutation(addTemplateCostRecovery, {
    onSuccess: (res) => {
      refetchTemplates()
      setShowUploadDrillingFileDialog(false)
    },
  })

  const addReportsByTemplate = useMutation(addReportForSelectedTemplate, {
    onSuccess: (res) => {
      refetchReports()
      setShowUploadRapportByTemplateDialog(false)
      refetchListOfCompaniesBlocks()
      setFileList([])
    },
  })

  const onAddTemplate = (data) => {
    const body = [
      {
        url: data?.file?.url,
        fileId: data?.file?.id,
        filename: data?.file?.filename,
        category: 'C : Reporting Templates',
        subject: 'MOG-S08-BUDGETARY & FINANCIAL',
        size: data?.file?.size.toString(),
        description: data?.title,
        contentType: data?.file?.contentType,
      },
    ]
    addTemplateMutation.mutate(body)
  }
  const onUpload = (data) => {
    addReportsByTemplate.mutate({
      body: [
        {
          url: data?.file?.url,
          fileId: data?.file?.id,
          category: 'C : Reporting Templates',
          subject: 'MOG-S08-BUDGETARY & FINANCIAL',
          description: '',
          company: company?.name,
          block: data?.block,
          referenceDate: `${data?.referenceDate?.year}-${data?.referenceDate?.month}-${data?.referenceDate?.day}`,
        },
      ],
      templateId: reportCurrentTab,
    })
  }

  const {
    data: reportsByTemplateList,
    refetch: refetchReports,
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

  const { addSupportingDocuments } = documents()
  const extraData = [
    { title: 'Upload Annual Cost & Expenditure Report', downloadKey: 'costs' },
    { title: 'Upload Contract Report', downloadKey: 'contracts' },
    {
      title: 'Upload Production Lifting Report',
      downloadKey: 'prodLiftingCost',
    },
    { title: 'Upload Transaction  Report', downloadKey: 'transactionCost' },
    { title: 'Upload Affiliate Report', downloadKey: 'affiliateCost' },
    { title: 'Upload facilities Report', downloadKey: 'faclitiesCost' },
  ]
  const navActionsHelper = [
    {
      title: extraData[currentTab]?.title,
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => {
        downloadTemp('costRecovery', extraData[currentTab]?.downloadKey)
      },
    },
  ]

  useEffect(() => {
    setPage(0)
  }, [currentTab])
  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`top-bar-btn-${index}`}
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          btn.onClick()
        }}
      >
        {btn?.title}
      </Button>
    ))
  }

  const renderActionsByCurrentTab = () => {
    return createActionsByCurrentTab(navActionsHelper)
  }

  const tabsList = [
    'Annual Cost and Expenditure',
    'Contract Reports',
    'Production Lifting',
    'Transaction Report',
    'Affiliate',
    'Facilities',
  ]
  const renderCurrentTabData = () => {
    return (
      globalMhtData?.content?.map((el) => ({
        company: el?.metaData?.company,
        block: el?.metaData?.block,
        status: el?.metaData?.status,
        submittedBy: el?.metaData?.createdBy?.name,
        submittedDate: el?.metaData?.createdAt
          ? moment(el?.metaData?.createdAt).format('DD MMM, YYYY')
          : '',
        referenceDate:
          currentTab === 0
            ? el?.metaData?.year
            : `${moment(el?.metaData?.month).format('MMM')} ${
                el?.metaData?.year
            }`,
        statusDate: el?.metaData?.updatedAt
          ? moment(el?.metaData?.updatedAt).format('DD MMM, YYYY')
          : moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        id: el?.id,
        processInstanceId: el?.metaData?.processInstanceId,
        originalFileId: el?.metaData?.originalFileId,
        originalFileName: el?.metaData?.originalFileName,
      })) || []
    )
  }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }

  const renderDialogData = (data) => {
    return {
      title: extraData[currentTab]?.title,
      optional: 'Attach Supporting Document (Optional)',
      onUpload: () => {
        const uuid = uuidv4()
        handleUpload(data, uuid)
        data?.optionalFiles?.length > 0 &&
          addSupportingDocuments(data?.optionalFiles, uuid)
      },
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  const handleUpload = (data, uuid) => {
    const month = !(currentTab === 0 || currentTab === 5)
      ? { month: +data?.referenceDate?.month }
      : {}
    uploadReportMutation(
      {
        data: {
          block: data?.block,
          file: data?.file[0],
          company: company?.name || 'ams-org',
          processInstanceId: uuid,
          year: +data?.referenceDate?.year,
          ...month,
        },
        key: tab[currentTab],
      },
      {
        onSuccess: (res) => {
          if (res?.responseStatus?.success) {
            setShowUploadMHTDialog(`upload-${currentTab}`)
            setShowUploadRapportDialog(false)
          }
        },
      },
    )
  }

  const configsMht = useCallback(() => {
    switch (showUploadMHTDialog) {
      case 'upload-0':
        return configsAnnualCostsDialogMht().map((el) =>
          el.key !== 'year'
            ? el
            : {
              ...el,
              label: uploadData?.metaData?.year,
            },
        )
      case 'upload-1':
        return configsContractsDialogMht()
      case 'upload-2':
        return configsLiftingCostsDialogMht()
      case 'upload-3':
        return transactionConfig()
      case 'upload-4':
        return affiliateConfig()
      case 'upload-5':
        return (
          (Object.entries(uploadData?.data?.data[0] || {}) || []).map((el) => ({
            label: el[0],
            key: el[0],
            width: '200',
            icon: 'mdi mdi-spellcheck',
          })) || []
        )

      default:
        return configsAnnualCostsDialogMht()
    }
  }, [showUploadMHTDialog])

  const resAnnualCostData = () => {
    return (
      uploadData?.data?.items?.map((el) => ({
        category: el?.category,
        subCategory: el?.subCategory,
        group: el?.group,
        uom: el?.uom,
        item: el?.name,
        description: el?.explanation,
        year: [
          {
            approved: el?.qvalues?.map((el) => ({ plan: el?.plan || '' })),
          },
          {
            outlook: el?.qvalues?.map((el) => ({
              outlook: el?.quarter || '',
            })),
          },
          { ytd: el?.qvalues?.map((el) => ({ actual: el?.actual || '' })) },
        ],
      })) || []
    )
  }
  const resContractsCostData = () => {
    return uploadData?.data?.data || []
  }
  const resProdLiftingData = () => {
    return (
      (uploadData?.data &&
        uploadData?.data[subSubModule]?.map((el) => ({
          month: el?.month,
          price: el?.mogPriceUsd,
          totalProduction: [
            {
              barrels: el['totalProduction']['barrels'],
            },
            {
              usd: el['totalProduction']['usd'],
            },
          ],
          contractorEntitlement: [
            {
              costRecovery: [
                {
                  barrels:
                    el['contractorEntitlement']['costRecovery']['barrels'],
                },
                { usd: el['contractorEntitlement']['costRecovery']['usd'] },
              ],
            },
            {
              profit: [
                {
                  barrels: el['contractorEntitlement']['profit']['barrels'],
                },
                { usd: el['contractorEntitlement']['profit']['usd'] },
              ],
            },
            {
              total: [
                {
                  barrels: el['contractorEntitlement']['total']['barrels'],
                },
                {
                  usd: el['contractorEntitlement']['total']['usd'],
                },
              ],
            },
          ],
          governmentEntitlement: [
            {
              profit: [
                {
                  barrels: el['governmentEntitlement']['profit']['barrels'],
                },
                { usd: el['governmentEntitlement']['profit']['usd'] },
              ],
            },
          ],
        }))) ||
      []
    )
  }

  const resTransactionData = () => {
    return (
      uploadData?.data?.data?.map((el) => ({
        block: el?.block,
        transactionDate: el?.transactionDate,
        transactionReference: el?.transactionReference,
        transactionDescription: el?.transactionDescription,
        transactionExpElement: el?.transactionExpenditure,
        transactionExpDescription: el?.transactionExpenditureDesc,
        project: el?.project,
      })) || []
    )
  }

  const resAffiliateData = () => {
    return (
      uploadData?.data?.data?.map((el) => ({
        nameOfService: el?.nameService,
        budget: el?.budget,
        hourlyRate: el?.hourlyRate,
        granTotal: el?.granTotalUSD,
        manHoursEstimate: el?.manHoursEstimate,
        total: el?.totalUSD,
        specialistsName: el?.specialistsName,
        durationTiming: el?.durationTiming,
        yearsOfExperience: el?.yearsOfExperience,
      })) || []
    )
  }

  const dataMht = useMemo(() => {
    switch (showUploadMHTDialog) {
      case 'upload-0':
        return resAnnualCostData()
      case 'upload-1':
        return resContractsCostData()
      case 'upload-2':
        return resProdLiftingData()
      case 'upload-3':
        return resTransactionData()
      case 'upload-4':
        return resAffiliateData()
      case 'upload-5':
        return uploadData?.data?.data || []

      default:
        return resAnnualCostData()
    }
  }, [subSubModule, uploadData])

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      renderCurrentTabData()[selectedRow[0]]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    return costsSuppDocs(data)
  }

  const handleOverride = () => {
    const data = currentTab === 2 ? uploadData?.data : uploadData?.data?.data
    overrideReportMutate(
      {
        body: {
          data,
          // metaData: uploadData?.data?.metaData,
        },
        overrideId: showConfirmDialog,
        key: tab[currentTab],
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            setShowUploadMHTDialog(null)
            setShowConfirmDialog(null)
            refetchCurrentData()
          }
        },
      },
    )
  }

  const renderSelectedItems = () => {
    return (
      selectedRow?.map((el) => ({
        id: renderCurrentTabData()[el]?.id,
      })) || []
    )
  }

  const handleDelete = () => {
    const ids = renderSelectedItems()?.map((el) => el?.id)

    selectedRow?.length > 0 &&
      deleteRows(tab[currentTab], ids).then((res) => {
        if (res) {
          refetchCurrentData()
          dispatch(setSelectedRow([]))
          setShowDeleteDialog(false)
        } else {
          setShowDeleteDialog(false)
        }
      })
  }

  const handleCommit = () => {
    // console.log(uploadData, 'uploadData')

    commitSub(
      {
        body: uploadData?.data,
        key: tab[currentTab],
      },
      {
        onSuccess: (res) => {
          if (res?.success) {
            setShowUploadMHTDialog(null)
            refetchCurrentData()
          } else if (res.overrideId && !res.success) {
            setShowConfirmDialog(res.overrideId)
          }
        },
      },
    )
  }

  const roleRegulation = useRole('regulation')

  const reportActions = () => {
    switch (roleRegulation) {
      case 'regulator':
        return [
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
              setShowUploadRapportByTemplateDialog(true)
            },
          },
        ]
      default:
        return []
    }
  }
  const reportsData = (reportsByTemplateList?.data || []).map((el) => ({
    id: el?.id,
    fileName: el?.filename,
    company: el?.companies[0],
    block: el?.block,
    submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
    submittedBy: el?.metaData?.createdBy?.name,
    referenceDate: moment(el?.metaData?.referenceDate).format('DD MMM, YYYY'),
  }))

  const deleteReportsMutate = useMutation(deleteReports, {
    onSuccess: (res) => {
      if (res[0]?.statusCode === 'OK') {
        refetchReports()
        refetchListOfCompaniesBlocks()
        dispatch(setSelectedRow([]))
        dispatch(
          addToast(
            <ToastMsg text={'Deleted successfully'} type="success" />,
            'hide',
          ),
        )
      } else {
        dispatch(
          addToast(
            <ToastMsg text={'Something went wrong'} type="error" />,
            'hide',
          ),
        )
      }
    },
  })
  const renderSelectedRows = () => {
    return selectedRow?.map((el) => reportsData[el]?.id) || []
  }
  const handleDeleteReports = (objectIds) => {
    deleteReportsMutate.mutate(objectIds)
  }
  const cards = listCompaniesBlocks?.map((el, index) => ({
    id: index,
    name: el?.company,
    icon: placeholder,
    blocks: el?.blocks,
  }))
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

  const tabsListReports =
    costRecoveryTemplates && costRecoveryTemplates.length !== 0
      ? costRecoveryTemplates?.map((el) => ({
        linkToNewTab: `/ams/costrecovery/costs`,
        label: el?.filename,
        key: el?.id,
      }))
      : []

  useEffect(() => {
    costRecoveryTemplates && costRecoveryTemplates?.length !== 0
      ? setReportCurrentTab(costRecoveryTemplates[0]?.id)
      : setReportCurrentTab(tabsListReports[0]?.key)
  }, [costRecoveryTemplates])

  return (
    <>
      <TopBar
        title="Cost Recovery Reporting"
        actions={
          role === 'operator' && view === 'default'
            ? renderActionsByCurrentTab()
            : null
        }
        changeView={setView}
        menuItems={() => {
          return [
            {
              key: 1,
              primaryText: 'Delete',
              onClick: () => handleDelete(),
            },
          ]
        }}
        role={role}
      />
      {view === 'default' && (
        <div className="subModule">
          <NavBar
            tabsList={tabsList}
            activeTab={currentTab}
            setActiveTab={(tab) => {
              setCurrentTab(tab)
              dispatch(setSelectedRow([]))
            }}
          />
          <div className="subModule--table-wrapper">
            <Mht
              configs={configs(UploadSupportedDocumentFromTable)}
              tableData={renderCurrentTabData()}
              withSearch={selectedRow?.length === 0}
              commonActions={selectedRow?.length === 0}
              onSelectRows={dispatch(setSelectedRow)}
              withChecked
              singleSelect
              hideTotal={false}
              withFooter
              withDownloadCsv
              defaultCsvFileTitle={tab[currentTab]}
              headerTemplate={
                selectedRow?.length !== 0 && (
                  <HeaderTemplate
                    title={`${selectedRow?.length} Row Selected`}
                    actions={actionsHeader(
                      'cost-recovery-details',
                      renderCurrentTabData()[selectedRow[0]]?.id,
                      tab[currentTab],
                      role,
                      setShowSupportedDocumentDialog,
                      () => setShowDeleteDialog(true),
                      renderCurrentTabData()[selectedRow[0]],
                    )}
                  />
                )
              }
              footerTemplate={
                globalMhtData?.totalPages > 1 && (
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
                        v >= globalMhtData?.totalPages
                          ? setPage(globalMhtData?.totalPages - 1)
                          : setPage(parseInt(v) - 1)
                      }
                      // disabled={status === 'closed'}
                    />
                    of {globalMhtData?.totalPages}
                    &nbsp;|&nbsp;Show
                    <TextField
                      id="el_num"
                      lineDirection="center"
                      block
                      className="show"
                      value={size}
                      onChange={(v) =>
                        v > globalMhtData?.totalElements
                          ? setSize(globalMhtData?.totalElements)
                          : setSize(v)
                      }
                    />
                  </>
                )
              }
            />
          </div>
        </div>
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
              withChecked={roleRegulation === 'operator'}
              withSearch={selectedRow?.length === 0}
              onSelectRows={dispatch(setSelectedRow)}
              // commonActions={
              //   selectedRow?.length === 0 || selectedRow?.length > 1
              // }
              headerTemplate={
                selectedRow?.length !== 0 && (
                  <HeaderTemplate
                    title={`${selectedRow?.length} Row Selected`}
                    actions={[
                      {
                        id: 1,
                        label: 'Delete',
                        onClick: () => {
                          handleDeleteReports(renderSelectedRows())
                        },
                      },
                    ]}
                  />
                )
              }
            />
          </div>
        </>
      )}

      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={
            showUploadMHTDialog === 'prodLifting' && (
              <SelectField
                id="prod-lifting"
                menuItems={[
                  { label: 'Base Production', value: 'dataBasedProduction' },
                  { label: 'Actual Lifting', value: 'dataActualLifting' },
                ]}
                block
                position={SelectField.Positions.BELOW}
                value={subSubModule}
                onChange={setSubSubModule}
                simplifiedMenu={false}
              />
            )
          }
          visible={showUploadMHTDialog}
          propsDataTable={dataMht}
          propsConfigs={configsMht()}
          onHide={() => {
            setShowUploadMHTDialog(false)
          }}
          onCommit={handleCommit}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          blockList={
            Array.isArray(blockList) && blockList?.length > 0
              ? blockList?.map((el) => ({ label: el?.block, value: el?.block }))
              : []
          }
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            renderDialogData(data).onUpload()
          }}
          formatDate={
            currentTab === 0 ? 'year' /*: currentTab === 1 ? 'day' */ : 'month'
          }
        />
      )}
      {showUploadRapportByTemplateDialog && (
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
          visible={showUploadRapportByTemplateDialog}
          uploadLabel={'Attach Spreadsheet'}
          onHide={() => {
            setShowUploadRapportByTemplateDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            onUpload(data)
          }}
          onUploadTemp={(data) => onUpload(data)}
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

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={
            role === 'regulator'
              ? 'Supporting Documents'
              : 'Upload supporting documents'
          }
          readOnly={role === 'regulator'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            typeof showSupportedDocumentDialog === 'object'
              ? showSupportedDocumentDialog?.processInstanceId
              : renderCurrentTabData()[selectedRow[0]]?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}

      {(showConfirmDialog || showDeleteDialog) && (
        <ConfirmDialog
          onDiscard={() => setShowConfirmDialog(false)}
          visible={showConfirmDialog || showDeleteDialog}
          handleOverride={handleOverride}
          message={'Do you confirm override ?'}
          confirmLabel={'Override'}
        />
      )}

      {showDeleteDialog && (
        <ConfirmDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          handleOverride={() => handleDelete()}
          message={'Do you confirm Delete ?'}
          confirmLabel={'Confirm'}
        />
      )}
    </>
  )
}
export default CostRecovery
