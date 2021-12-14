import { useState } from 'react'
import { Button, DialogContainer } from 'react-md'
import { useQuery, useMutation } from 'react-query'

import Mht from '@target-energysolutions/mht'

import { useDispatch } from 'react-redux'
import moment from 'moment'
import { v4 as uuidv4 } from 'uuid'

import { get } from 'lodash-es'
import useRole from 'libs/hooks/use-role'
import {
  uploadAnnualBaseInventoryReport,
  uploadAssetDisposalInventoryReport,
  getInventories,
  getInventoriesAccepted,
  commitInventory,
  overrideInventoryReport,
  deleteInventory,
  uploadAssetTransferInventoryReport,
  getCompaniesInventory,
  commitRows,
} from 'libs/api/api-inventory'
import {
  downloadOriginalFile,
  downloadTemp,
} from 'libs/api/supporting-document-api'

import documents from 'libs/hooks/documents'
import getBlocks from 'libs/hooks/get-blocks'
import { addToast } from 'modules/app/actions'
import getOrganizationInfos from 'libs/hooks/get-organization-infos'

import ToastMsg from 'components/toast-msg'
import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import {
  mhtConfig,
  actionsHeader,
  annualBaseDetailsConfigs,
  assetDisposalDetailsConfigs,
  // assetConsumptionDetailsData,
} from './helpers'

/* import ConfirmDialog from 'components/confirm-dialog'
 */
const Inventory = () => {
  const subModule = get(location, 'pathname', '/').split('/').reverse()[0]

  const [currentTab, setCurrentTab] = useState(subModule)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  /*   const [selectedRowBase, setSelectedRowBase] = useState([])
  const [selectedRowConsumption, setSelectedRowConsumption] = useState([])
  */ const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()

  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])

  /* const [showDeleteDialog, setShowDeleteDialog] = useState(false) */

  const [currentUpload, setCurrentUpload] = useState()
  const dispatch = useDispatch()
  const company = getOrganizationInfos()
  const role = useRole('inventory')
  const { addSupportingDocuments } = documents()
  const blocks = getBlocks()
  const [currentInventoryId, setCurrentInventoryId] = useState('')
  // console.log('role', role)
  const { data: listAnnualBase, refetch: refetchInventory } = useQuery(
    ['getListAnnualBase', 'base', 0, 2000],
    getInventories,
    {
      refetchOnWindowFocus: false,
    },
  )
  const {
    data: listAssetTransfer,
    refetch: refetchListAssetTransferInventory,
  } = useQuery(
    ['getListAnnualBase', 'assetTransferRequestProcess', 0, 2000],
    getInventories,
    {
      refetchOnWindowFocus: false,
    },
  )
  const { data: listDisposal, refetch: refetchListDisposalInventory } =
    useQuery(
      ['getListAnnualBase', 'assetDisposalRequestProcess', 0, 2000],
      getInventories,
      {
        refetchOnWindowFocus: false,
      },
    )
  const { data: listInventoriesAccepted } = useQuery(
    ['getListInventoriesAccepted', 0, 2000],
    getInventoriesAccepted,
    {
      refetchOnWindowFocus: false,
    },
  )

  const { data: companies } = useQuery(
    ['getCompaniesInventory'],
    getCompaniesInventory,
    {
      refetchOnWindowFocus: false,
    },
  )

  const refetchAfterCommitByCurrentTab = () => {
    switch (currentTab) {
      case 'annual-base':
        return refetchInventory()
      case 'asset-transfer':
        return refetchListAssetTransferInventory()
      case 'asset-disposal':
        return refetchListDisposalInventory()
      default:
        return refetchInventory()
    }
  }
  const uploadAnnualBaseReportMutate = useMutation(
    uploadAnnualBaseInventoryReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'Annual Base report uploaded successfully'}
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'something_went_wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const uploadAssetDisposalReportMutate = useMutation(
    uploadAssetDisposalInventoryReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={
                  res.message || 'Asset Disposal report uploaded successfully'
                }
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'something_went_wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const uploadAssetTransferReportMutate = useMutation(
    uploadAssetTransferInventoryReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          setCurrentUpload(res)
          onDisplayMHT(...res.values)
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'Asset Transfer uploaded successfully'}
                type="success"
              />,
              'hide',
            ),
          )
        } else {
          dispatch(
            addToast(
              <ToastMsg
                text={res.error?.body?.message || 'something_went_wrong'}
                type="error"
              />,
              'hide',
            ),
          )
        }
      },
    },
  )

  const commitInventoryMutate = useMutation(
    commitInventory,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res?.msg === 'exist') {
            setOverrideDialog(true)
            setShowUploadRapportDialog(false)
            setShowUploadMHTDialog(false)
            setOverrideId(res?.overrideId)
          } else {
            setShowUploadRapportDialog(false)
            setShowUploadMHTDialog(false)
            refetchInventory()
            refetchListAssetTransferInventory()
            refetchAfterCommitByCurrentTab()
            dispatch(
              addToast(
                <ToastMsg
                  text={res.message || 'committed successfully'}
                  type="success"
                />,
                'hide',
              ),
            )
          }
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
    },
  )
  const overrideInventoryMutate = useMutation(
    overrideInventoryReport,

    {
      onSuccess: (res) => {
        if (!res.error) {
          if (res?.msg === 'commited') {
            refetchInventory()
            setOverrideDialog(false)
            dispatch(
              addToast(
                <ToastMsg
                  text={res.message || 'overridden successfully'}
                  type="success"
                />,
                'hide',
              ),
            )
          }
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
    },
  )
  const commitRowsInventoryMutate = useMutation(
    commitRows,

    {
      onSuccess: (res) => {
        if (!res.error) {
          refetchInventory()
          setShowUploadRapportDialog(false)
          setShowUploadMHTDialog(false)
          dispatch(
            addToast(
              <ToastMsg
                text={res.message || 'commit successfully'}
                type="success"
              />,
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
    },
  )
  const deleteInventoryMutate = useMutation(deleteInventory, {
    onSuccess: (res) => {
      if (!res.error) {
        dispatch(
          addToast(
            <ToastMsg
              text={res.message || 'Deleted successfully'}
              type="success"
            />,
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
      refetchInventory()
    },
  })

  const onAddReportByCurrentTab = (body) => {
    let uuid = uuidv4()
    switch (currentTab) {
      case 'annual-base':
        uploadAnnualBaseReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name,
            category: 'base',
            file: body?.file,
            processInstanceId: uuidv4(),
            // month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'asset-transfer':
        uploadAssetTransferReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name,
            category: 'assetTransferRequestProcess',
            file: body?.file,
            companyToTransfer: body?.company,
            processInstanceId: uuidv4(),
            // month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break

      case 'asset-disposal':
        uploadAssetDisposalReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name,
            category: 'assetDisposalRequestProcess',
            file: body?.file,
            processInstanceId: uuidv4(),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      case 'new-asset-addition':
        uploadAnnualBaseReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name,
            category: 'addition',
            file: body?.file,
            processInstanceId: uuidv4(),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break
      default:
        return () => {}
    }
  }
  const onCommitRows = (transactionType) => {
    commitRowsInventoryMutate.mutate({
      body: {
        data: currentUpload?.data?.rows,
        inventoryId: currentInventoryId,
        processInstanceId: currentUpload?.data?.metaData?.processInstanceId,
        transactionType: transactionType,
      },
    })
  }
  const handleDeleteInventory = (inventoryId) => {
    deleteInventoryMutate.mutate({
      inventoryId,
    })
  }
  const mhtUploadedAnnualAssetData = (
    get(currentUpload, 'data.rows', []) || []
  ).map((el) => {
    return {
      id: el?.rowId,
      materialName: el?.data['Material Name'],
      materialCategory: el?.data['Material Category'],
      materialDescription: el?.data['Material Description '],
      measurementUnit: el?.data['Measurement Unit'],
      currentSt: el?.data['Quantity'],
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })
  const mhtUploadedAssetDisposalData = (
    get(currentUpload, 'data.rows', []) || []
  ).map((el) => {
    return {
      id: el?.rowId,
      materialName: el?.data['Material Name'],
      materialCategory: el?.data['Material Category'],
      materialDescription: el?.data['Material Description '],
      measurementUnit: el?.data['Measurement Unit'],
      currentSt: el?.data['Quantity'],
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })

  const onCommitInventory = (subModule) => {
    commitInventoryMutate.mutate({
      subModule: subModule,
      body: currentUpload?.data,
    })
  }

  const onOverrideInventory = (subModule, overrideId) => {
    overrideInventoryMutate.mutate({
      subModule: subModule,
      overrideId: overrideId,
      body: currentUpload?.data,
    })
  }

  const subModuleByCurrentTab = () => {
    switch (currentTab) {
      case 'annual-base':
        return 'base'
      case 'asset-consumption':
        return ''
      case 'surplus-declaration':
        return ''
      case 'asset-transfer':
        return 'transfer'
      case 'asset-disposal':
        return 'disposal'
      case 'new-asset-addition':
        return 'addition'
      default:
        return ''
    }
  }

  const commitUploadByTab = () => {
    switch (currentTab) {
      case 'annual-base':
        return onCommitInventory('base')

      case 'asset-consumption':
        return ''
      case 'surplus-declaration':
        return ''
      case 'asset-transfer':
        return onCommitInventory('transfer')
      case 'asset-disposal':
        return onCommitInventory('disposal')
      case 'new-asset-addition':
        return onCommitRows('addition')
      default:
        return ''
    }
  }
  const createCategoryAndTransactionByTab = () => {
    switch (currentTab) {
      case 'annual-base':
        return 'base'
      case 'asset-consumption':
        return 'base-consumption'
      case 'surplus-declaration':
        return 'base-surplus'
      case 'asset-transfer':
        return 'assetTransferRequestProcess'
      case 'asset-disposal':
        return 'assetDisposalRequestProcess'
      case 'new-asset-addition':
        return 'addition'
      default:
        return 'base'
    }
  }
  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 'annual-base':
        return annualBaseDetailsConfigs()
      case 'asset-disposal':
        return assetDisposalDetailsConfigs()
      default:
        return annualBaseDetailsConfigs()
    }
  }
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 'annual-base':
        return mhtUploadedAnnualAssetData
      case 'asset-disposal':
        return mhtUploadedAssetDisposalData
      default:
        return mhtUploadedAnnualAssetData
    }
  }

  const annualBaseActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () =>
        downloadTemp('inventoryManagment', 'AnnualInventoryProcess'),
    },
  ]
  const assetConsumptionActionsHelper = [
    {
      title: 'Upload Consumption File',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () =>
        downloadTemp('inventoryManagment', 'AnnualInventoryProcess'),
    },
  ]

  const surplusDeclarationActionsHelper = [
    {
      title: 'Upload Surplus File',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () =>
        downloadTemp('inventoryManagment', 'assetTransferRequestProcess'),
    },
  ]
  const assetTransferActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () =>
        downloadTemp('inventoryManagment', 'assetTransferRequestProcess'),
    },
  ]

  const assetDisposalActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () =>
        downloadTemp('inventoryManagment', 'assetDisposalRequestProcess'),
    },
  ]
  const newAssetAdditionActionsHelper = [
    /*   {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('inventoryManagment', 'AnnualInventoryProcess'),
    }, */
  ]

  const createActionsByCurrentTab = (actionsList = []) => {
    return actionsList.map((btn, index) => (
      <Button
        key={`production-btn-${index}`}
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
    switch (currentTab) {
      case 'annual-base':
        return createActionsByCurrentTab(annualBaseActionsHelper)
      case 'asset-consumption':
        return createActionsByCurrentTab(assetConsumptionActionsHelper)
      case 'surplus-declaration':
        return createActionsByCurrentTab(surplusDeclarationActionsHelper)
      case 'asset-transfer':
        return createActionsByCurrentTab(assetTransferActionsHelper)
      case 'asset-disposal':
        return createActionsByCurrentTab(assetDisposalActionsHelper)
      default:
        return createActionsByCurrentTab(newAssetAdditionActionsHelper)
    }
  }

  const tabsList2 = [
    {
      linkToNewTab: `/ams/inventory/annual-base`,
      label: 'Annual Base',
      key: 'annual-base',
    },
    {
      linkToNewTab: `/ams/inventory/asset-consumption`,
      label: 'Asset Consumption',
      key: 'asset-consumption',
    },
    {
      linkToNewTab: `/ams/inventory/surplus-declaration`,
      label: 'Surplus Declaration',
      key: 'surplus-declaration',
    },
    {
      linkToNewTab: `/ams/inventory/asset-transfer`,
      label: 'Asset Transfer',
      key: 'asset-transfer',
    },
    {
      linkToNewTab: `/ams/inventory/asset-disposal`,
      label: 'Asset Disposal',
      key: 'asset-disposal',
    },
    {
      linkToNewTab: `/ams/inventory/new-asset-addition`,
      label: 'New Asset Addition',
      key: 'new-asset-addition',
    },
  ]
  const tableDataListAnnualBase = (
    get(listAnnualBase, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      originalFileName: get(el, 'metaData.originalFileName', ''),

      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
      processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
    }
  })

  const tableDataListAssetTransfer = (
    get(listAssetTransfer, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      originalFileName: get(el, 'metaData.originalFileName', ''),

      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
      processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
    }
  })

  const tableDataLisDisposal = (get(listDisposal, 'content', []) || []).map(
    (el) => {
      return {
        id: el?.id,
        company: get(el, 'metaData.company', 'n/a'),
        block: get(el, 'metaData.block', 'n/a'),
        originalFileId: get(el, 'metaData.originalFileId', ''),
        originalFileName: get(el, 'metaData.originalFileName', ''),

        submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
        referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
        status: get(el, 'metaData.status', 'n/a'),
        processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
      }
    },
  )
  const tableDataListInventoriesAccepted = (
    get(listInventoriesAccepted, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      originalFileId: get(el, 'metaData.originalFileId', ''),
      originalFileName: get(el, 'metaData.originalFileName', ''),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: get(el, 'metaData.year', 'n/a'),
      status: get(el, 'metaData.status', 'n/a'),
      processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
    }
  })

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 'asset-consumption':
        return tableDataListInventoriesAccepted
      case 'surplus-declaration':
        return tableDataListInventoriesAccepted
      case 'asset-transfer':
        return tableDataListAssetTransfer
      case 'asset-disposal':
        return tableDataLisDisposal
      case 'new-asset-addition':
        return tableDataListInventoriesAccepted
      case 'annual-base':
      default:
        return tableDataListAnnualBase
    }
  }
  const UploadSupportedDocumentFromTable = (row) => {
    setShowSupportedDocumentDialog(row)
  }
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const inventorySuppDocs = (data) => {
    addSupportingDocuments(
      data,
      selectedRow[0]?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 'annual-base':
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 'asset-consumption':
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 'surplus-declaration':
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 'asset-transfer':
        return mhtConfig(UploadSupportedDocumentFromTable)
      default:
        return mhtConfig(UploadSupportedDocumentFromTable)
    }
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 'annual-base':
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'asset-consumption':
        return {
          title: 'Upload Consumption File',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'surplus-declaration':
        return {
          title: 'Upload Surplus File',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'asset-transfer':
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'asset-disposal':
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 'new-asset-addition':
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      default:
        break
    }
  }

  const onDisplayMHT = (file) => {
    setShowUploadMHTDialog(true)
    setShowUploadRapportDialog(false)
    setDataDisplayedMHT(file)
  }
  return (
    <>
      <TopBar
        title="Inventory"
        actions={role === 'operator' ? renderActionsByCurrentTab() : null}
      />
      <NavBar
        tabsList={tabsList2}
        activeTab={currentTab}
        setActiveTab={setCurrentTab}
        onSelectRows={setSelectedRow}
        selectedRow={selectedRow}
      />
      <Mht
        configs={renderCurrentTabConfigs()}
        tableData={renderCurrentTabData()}
        hideTotal={false}
        singleSelect={true}
        withFooter
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
        onSelectRows={setSelectedRow}
        withChecked
        selectedRow={selectedRow}
        headerTemplate={
          selectedRow?.length === 1 ? (
            <HeaderTemplate
              title={
                selectedRow?.length === 1
                  ? `1 Row Selected`
                  : `${selectedRow?.length} Rows selected`
              }
              actions={actionsHeader(
                'inventory-details',
                selectedRow[0]?.id,
                role,
                setShowSupportedDocumentDialog,
                createCategoryAndTransactionByTab(),
                handleDeleteInventory,
                setShowUploadRapportDialog,
                setCurrentInventoryId,
                selectedRow[0].originalFileId,
                selectedRow[0].originalFileName,
                downloadOriginalFile,
              )}
            />
          ) : (
            ''
          )
        }
      />
      {showUploadMHTDialog && (
        <MHTDialog
          headerTemplate={<div></div>}
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          propsConfigs={renderCurrentTabDetailsConfigs()}
          propsDataTable={renderCurrentTabDetailsData()}
          onCommit={() => {
            commitUploadByTab()
            setFileList([...filesList, dataDisplayedMHT])
          }}
        />
      )}
      {showUploadRapportDialog && (
        <UploadReportDialog
          setFileList={setFileList}
          filesList={filesList}
          onDisplayMHT={onDisplayMHT}
          title={renderDialogData().title}
          optional={renderDialogData().optional}
          visible={showUploadRapportDialog}
          blockList={blocks?.map((el) => ({
            label: el?.block,
            value: el?.block,
          }))}
          companyList={
            currentTab === 'asset-transfer'
              ? companies?.content?.map((el) => ({
                label: el?.company,
                value: el?.company,
              }))
              : null
          }
          hideDate={currentTab === 'asset-transfer'}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            // renderDialogData().onClick()
            onAddReportByCurrentTab(data)
          }}
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          processInstanceId={
            selectedRow[0]?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            inventorySuppDocs(data)
          }}
        />
      )}
      {overrideDialog && (
        <DialogContainer
          id="override"
          visible={confirm}
          title="Override"
          modal
          actions={[
            {
              children: 'Yes, Override It',
              primary: false,
              flat: true,
              swapTheming: true,
              onClick: () => {
                onOverrideInventory(subModuleByCurrentTab(), overrideId)
              },
            },
            {
              children: 'No Thanks',
              primary: true,
              flat: true,
              swapTheming: true,
              onClick: () => setOverrideDialog(false),
            },
          ]}
        >
          <p id="override-description" className="md-color--secondary-text">
            This file already exists. Would you like to override it ?
          </p>
        </DialogContainer>
      )}
      {/* {showDeleteDialog && (
        <ConfirmDialog
          onDiscard={() => setShowDeleteDialog(false)}
          visible={showDeleteDialog}
          handleOverride={handleDeleteInventory}
          message={'Do you confirm Delete ?'}
          confirmLabel={'Confirm'}
        />
      )} */}
    </>
  )
}
export default Inventory
