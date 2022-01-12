import { useState } from 'react'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import Mht from '@target-energysolutions/mht'
import moment from 'moment'

import TopBar from 'components/top-bar'
import NavBar from 'components/nav-bar'
import UploadPermitDialog from './upload-permit-dialog'
import HeaderTemplate from 'components/header-template'
import SupportedDocument from 'components/supported-document'
import { userRole } from 'components/shared-hook/get-roles'

import useRole from 'libs/hooks/use-role'
import { listPermitsByLoggedUser } from 'libs/api/permit-api'
import getBlocks from 'libs/hooks/get-blocks'
import documents from 'libs/hooks/documents'

import {
  permitDrillConfigs,
  permitSuspendConfigs,
  permitAbandonConfigs,
  // permitDrillData,
  // permitSuspendData,
  // permitAbandonData,
  actionsHeader,
} from './helpers'

const Permit = ({ subModule }) => {
  const [currentTab, setCurrentTab] = useState(
    subModule === 'dr' ? 0 : subModule === 'sr' ? 1 : 2,
  )
  const [showPermitDialog, setShowPermitDialog] = useState(false)
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const [selectedRow, setSelectedRow] = useState([])
  const [information, setInformation] = useState({ date: new Date() })
  const blockList = getBlocks()
  const { addSupportingDocuments } = documents()

  const { data: permitListData } = useQuery(
    [
      'listPermitsByLoggedUser',
      // {
      //   permitType:
      currentTab === 0
        ? 'Drill'
        : currentTab === 1
          ? 'Suspend'
          : currentTab === 2
            ? 'Abandon'
            : '',
      // },
    ],
    listPermitsByLoggedUser,
  )

  const role = useRole('permitting')

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

  const tabsList = ['Permit to Drill', 'Permit to Suspend', 'Permit to Abandon']
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
  return (
    <>
      <TopBar
        title="Permitting"
        actions={role === 'operator' ? actions : null}
      />
      <div className="subModule">
        <NavBar
          tabsList={tabsList}
          activeTab={currentTab}
          setActiveTab={setCurrentTab}
          onSelectRows={setSelectedRow}
        />
        <div className="subModule--table-wrapper">
          <Mht
            hideTotal={false}
            withFooter
            configs={renderCurrentTabConfigs()}
            tableData={permitData || []}
            withSearch={selectedRow?.length === 0}
            commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
            onSelectRows={setSelectedRow}
            withChecked
            singleSelect={true}
            selectedRow={selectedRow}
            headerTemplate={
              selectedRow?.length === 1 && (
                <HeaderTemplate
                  title={`${selectedRow.length} Row Selected`}
                  actions={actionsHeader(
                    renderKey(),
                    selectedRow[0]?.id,
                    userRole(),
                    setShowSupportedDocumentDialog,
                  )}
                />
              )
            }
          />
        </div>
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
