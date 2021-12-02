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
  downloadTemp,
  uploadAnnualBaseInventoryReport,
  uploadAssetDisposalInventoryReport,
  getInventories,
  getInventoriesAccepted,
  commitInventory,
  overrideInventoryReport,
  deleteInventory,
  uploadAssetTransferInventoryReport,
  getCompaniesInventory,
} from 'libs/api/api-inventory'
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
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [overrideDialog, setOverrideDialog] = useState(false)
  const [overrideId, setOverrideId] = useState()

  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [selectFieldValue, setSelectFieldValue] = useState('Asset Consumption')
  /* const [showDeleteDialog, setShowDeleteDialog] = useState(false) */

  const [currentUpload, setCurrentUpload] = useState()
  const dispatch = useDispatch()
  const company = getOrganizationInfos()
  const role = useRole('inventory')
  const { addSupportingDocuments } = documents()
  const blocks = getBlocks()

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
  // const { mutate: onDeleteInventory } = useMutation(deleteInventory)

  const refetchAfterCommitByCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return refetchInventory()
      case 3:
        return refetchListAssetTransferInventory()
      case 4:
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
      case 0:
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
      case 3:
        uploadAssetTransferReportMutate.mutate({
          body: {
            block: body?.block,
            company: company?.name,
            category: 'base',
            file: body?.file,
            companyToTransfer: body?.company,
            processInstanceId: uuidv4(),
            // month: moment(body?.referenceDate).format('MMMM'),
            year: moment(body?.referenceDate).format('YYYY'),
          },
        })
        addSupportingDocuments(body?.optionalFiles, uuid)
        break

      case 4:
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
      default:
        return () => {}
    }
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
      currentSt: 5,
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
      currentSt: 5,
      quantity: el?.data['Quantity'],
      unitPrice: el?.data['Unit Price (USD)'],
    }
  })

  // subModule, overrideId, body

  const onCommitInventory = (subModule) => {
    commitInventoryMutate.mutate({
      subModule: subModule,
      body: currentUpload?.data,
    })
  }
  // subModule, overrideId, body

  const onOverrideInventory = (subModule, overrideId) => {
    overrideInventoryMutate.mutate({
      subModule: subModule,
      overrideId: overrideId,
      body: currentUpload?.data,
    })
  }

  const subModuleByCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return 'base'
      case 1:
        return ''
      case 2:
        return ''
      case 3:
        return 'transfer'
      case 4:
        return 'disposal'
      case 5:
        return ''
      default:
        return ''
    }
  }

  const createCategoryAndTransactionByTab = () => {
    switch (currentTab) {
      case 0:
        return 'base'
      case 1:
        return selectFieldValue === 'Consumption Declaration Records'
          ? 'consumptionReportProcess'
          : 'base-consumption'
      case 2:
        return selectFieldValue === 'Surplus Declaration Records'
          ? 'surplusInventoryProcess'
          : 'base-surplus'
      case 3:
        return 'assetTransferRequestProcess'
      case 4:
        return 'assetDisposalRequestProcess'
      case 5:
        return 'addition'
      default:
        return 'base'
    }
  }
  const renderCurrentTabDetailsConfigs = () => {
    switch (currentTab) {
      case 0:
        return annualBaseDetailsConfigs()
      case 4:
        return assetDisposalDetailsConfigs()
      default:
        return annualBaseDetailsConfigs()
    }
  }
  const renderCurrentTabDetailsData = () => {
    switch (currentTab) {
      case 0:
        return mhtUploadedAnnualAssetData
      case 4:
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
      onClick: () => downloadTemp('production', 'monthly'),
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
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
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
      case 0:
        return createActionsByCurrentTab(annualBaseActionsHelper)
      case 1:
        return createActionsByCurrentTab(assetConsumptionActionsHelper)
      case 2:
        return createActionsByCurrentTab(surplusDeclarationActionsHelper)
      case 3:
        return createActionsByCurrentTab(assetTransferActionsHelper)
      case 4:
        return createActionsByCurrentTab(assetDisposalActionsHelper)
      default:
        return createActionsByCurrentTab(newAssetAdditionActionsHelper)
    }
  }

  const tabsList = [
    'Annual Base',
    'Asset Consumption',
    'Surplus Declaration',
    'Asset Transfer',
    'Asset Disposal',
    'New Asset Addition',
  ]
  const tableDataListAnnualBase = (
    get(listAnnualBase, 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
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
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate:
        get(el, 'metaData.month', 'n/a') +
        ' , ' +
        get(el, 'metaData.year', 'n/a'),
      status: get(el, 'metaData.status', 'n/a'),
      processInstanceId: get(el, 'metaData.processInstanceId', 'n/a'),
    }
  })

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 1:
        return tableDataListInventoriesAccepted
      case 2:
        return tableDataListInventoriesAccepted
      case 3:
        return tableDataListAssetTransfer
      case 4:
        return tableDataLisDisposal
      case 5:
        return tableDataListInventoriesAccepted
      case 0:
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
      case 0:
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 1:
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 2:
        return mhtConfig(UploadSupportedDocumentFromTable)
      case 3:
        return mhtConfig(UploadSupportedDocumentFromTable)
      default:
        return mhtConfig(UploadSupportedDocumentFromTable)
    }
  }
  const renderDialogData = () => {
    switch (currentTab) {
      case 0:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 1:
        return {
          title: 'Upload Consumption File',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 2:
        return {
          title: 'Upload Surplus File',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 3:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 4:
        return {
          title: 'Attach Spreadsheet',
          optional: 'Attach Supporting Document (Optional)',
          onClick: () => {},
        }
      case 5:
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
        tabsList={tabsList}
        activeTab={currentTab}
        setActiveTab={(tab) => {
          setCurrentTab(tab)
          setSelectFieldValue(
            tab === 1
              ? 'Consumption Declaration'
              : tab === 2
                ? 'Surplus Declaration'
                : 'Grid 1',
          )
        }}
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
              )}
            />
          ) : (
            ''
          )
        }
      />
      {showUploadMHTDialog && (
        <MHTDialog
          visible={showUploadMHTDialog}
          onHide={() => {
            setShowUploadMHTDialog(false)
            setShowUploadRapportDialog(true)
          }}
          propsConfigs={renderCurrentTabDetailsConfigs()}
          propsDataTable={renderCurrentTabDetailsData()}
          onSave={() => {
            onCommitInventory(subModuleByCurrentTab())
            setFileList([...filesList, dataDisplayedMHT])
          }}
          headerTemplate={<div />}
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
            currentTab === 3
              ? companies?.content?.map((el) => ({
                label: el?.company,
                value: el?.company,
              }))
              : null
          }
          hideDate={currentTab === 3}
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
