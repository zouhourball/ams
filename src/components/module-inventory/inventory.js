import { useState } from 'react'
import { Button, SelectField, DialogContainer } from 'react-md'
import Mht from '@target-energysolutions/mht'

import moment from 'moment'

import { get } from 'lodash-es'

import useRole from 'libs/hooks/use-role'

import { downloadTemp } from 'libs/api/api-production'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadReportDialog from 'components/upload-report-dialog'
import HeaderTemplate from 'components/header-template'
import MHTDialog from 'components/mht-dialog'
import SupportedDocument from 'components/supported-document'

import {
  mhtConfig,
  mhtFakeData,
  actionsHeader,
  detailsConfigs,
} from './helpers'

const Inventory = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [showUploadRapportDialog, setShowUploadRapportDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [showUploadMHTDialog, setShowUploadMHTDialog] = useState(false)
  const [overrideDialog, setOverrideDialog] = useState(false)

  const [dataDisplayedMHT, setDataDisplayedMHT] = useState({})
  const [filesList, setFileList] = useState([])
  const [selectFieldValue, setSelectFieldValue] = useState('Asset Consumption')

  const role = useRole('production')

  const mhtDialogData = ([] || []).map((el) => {
    return {
      production: [{ item: el?.name }, { uom: el?.unit }],
      dailyField: [
        { actualF: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][0]?.Actual },
        { target: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][1]?.Target },
        { le: el?.data[0]['DAILY FIELD PRODUCTION VOLS'][2]?.LE },
      ],
      scheduled: [
        { actual: el?.data[1]['SCHEDULED DEFERMENT VOLS'][0]?.Actual },
        { actualS: el?.data[1]['SCHEDULED DEFERMENT VOLS'][1]['Actual (%)'] },
      ],
    }
  })

  const annualBaseActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    {
      title: 'Download Template',
      onClick: () => downloadTemp('production', 'daily'),
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
      onClick: () => downloadTemp('production', 'production-tracking'),
    },
  ]
  const assetTransferActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
  ]

  const assetDisposalActionsHelper = [
    {
      title: 'Attach Spreadsheet',
      onClick: () => setShowUploadRapportDialog(true),
    },
    { title: 'Download Template', onClick: () => {} },
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
    get(/* listDailyProduction */ [], 'content', []) || []
  ).map((el) => {
    return {
      id: el?.id,
      company: get(el, 'metaData.company', 'n/a'),
      block: get(el, 'metaData.block', 'n/a'),
      submittedDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      submittedBy: get(el, 'metaData.createdBy.name', 'n/a'),
      referenceDate: moment(el?.metaData?.reportDate).format('DD MMM, YYYY'),
      status: get(el, 'metaData.status', 'n/a'),
    }
  })
  const tableDataListAssetConsumption = (
    get(/* listMonthlyProduction */ [], 'content', []) || []
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
    }
  })

  const tableDataListMonthlySurplusDeclaration = (
    get(/* listMonthlyTrackingProduction */ [], 'content', []) || []
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
    }
  })

  const renderCurrentTabData = () => {
    switch (currentTab) {
      case 0:
        return mhtFakeData || tableDataListAnnualBase
      case 1:
        return mhtFakeData || tableDataListAssetConsumption
      case 2:
        return mhtFakeData || tableDataListMonthlySurplusDeclaration
      case 3:
        return mhtFakeData
      case 4:
        return mhtFakeData
      default:
        return mhtFakeData
    }
  }
  const renderCurrentTabConfigs = () => {
    switch (currentTab) {
      case 0:
        return mhtConfig()
      case 1:
        return mhtConfig()
      case 2:
        return mhtConfig()
      case 3:
        return mhtConfig()
      default:
        return mhtConfig()
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
                currentTab,
              )}
            />
          ) : currentTab === (1 || 2) ? (
            <SelectField
              id="consumption-inventory"
              menuItems={
                currentTab === 1
                  ? [
                    'Consumption Declaration',
                    'Consumption Declaration Records',
                  ]
                  : currentTab === 2
                    ? ['Surplus Declaration', 'Surplus Declaration Records']
                    : []
              }
              block
              position={SelectField.Positions.BELOW}
              value={selectFieldValue}
              onChange={setSelectFieldValue}
              simplifiedMenu={false}
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
          propsConfigs={detailsConfigs()}
          propsDataTable={mhtDialogData}
          onSave={() => {
            //         onCommitProduction(subModuleByCurrentTab())

            // setShowUploadMHTDialog(false)
            // setShowUploadRapportDialog(true)
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
          blockList={[
            {
              label: 'block1',
              value: '1',
            },
            {
              label: 'block2',
              value: '2',
            },
          ]}
          onHide={() => {
            setShowUploadRapportDialog(false)
            setFileList([])
          }}
          onSave={(data) => {
            // renderDialogData().onClick()
            //  onAddReportByCurrentTab(data)
          }}
        />
      )}

      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          onSaveUpload={() => {}}
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
                /* onOverrideProduction(subModuleByCurrentTab(), overrideId)  */
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
    </>
  )
}
export default Inventory
