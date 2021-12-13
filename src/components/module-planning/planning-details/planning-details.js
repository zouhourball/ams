import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery } from 'react-query'
import { useMemo, useState } from 'react'
import { getDetailPlanningById } from 'libs/api/api-planning'
import moment from 'moment'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import useRole from 'libs/hooks/use-role'
import { configsWpbDialogMht, configsFypDialogMht } from '../mht-helper-dialog'
import { wpbData, fypData } from '../helpers'

import './style.scss'

const PlanningDetails = ({ objectId, subModule }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const { data: dataDetails } = useQuery(
    ['getDetailPlanningById', objectId, subModule],
    objectId && getDetailPlanningById,
  )

  const planningDataDetails = useMemo(() => {
    switch (subModule) {
      case 'wpb':
        return wpbData(dataDetails) || []
      case 'fyp':
        return fypData(dataDetails) || []
      default:
        break
    }
  }, [dataDetails])
  const currentYear =
    dataDetails?.categories[0]?.subCategories[0]?.kpis[0]?.values[0]?.year
  const headerData = () => {
    return {
      title: `Block ${dataDetails?.metaData?.block}`,
      companyName: dataDetails?.metaData?.company,
      submittedBy: dataDetails?.metaData?.createdBy?.name,
      submittedDate: moment(dataDetails?.metaData?.createdAt).format(
        'DD MMM, YYYY',
      ),
    }
  }
  const configsMht = () => {
    switch (subModule) {
      case 'wpb':
        return configsWpbDialogMht()
      case 'fyp':
        return configsFypDialogMht(currentYear)
      default:
        break
    }
  }
  const actions = [
    useRole('planning') === 'operator' && (
      <>
        <Button
          key="1"
          id="edit"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            downloadOriginalFile(
              dataDetails?.metaData?.originalFileId,
              dataDetails?.metaData?.originalFileName,
            )
          }}
        >
          Download Original File
        </Button>
        ,
        <Button
          key="2"
          id="viewDoc"
          className="top-bar-buttons-list-item-btn view-doc"
          flat
          swapTheming
          onClick={() => {
            setShowSupportedDocumentDialog(true)
          }}
        >
          Supporting documents
        </Button>
        ,
      </>
    ),
    useRole('planning') === 'JMC Chairman' && (
      <>
        <Button
          key="3"
          id="joinMeeting"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {}}
        >
          Join Meeting
        </Button>
        ,
        <Button
          key="4"
          id="reject"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {}}
        >
          Reject
        </Button>
        ,
        <Button
          key="5"
          id="approve"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {}}
        >
          Approve
        </Button>
        ,
      </>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        detailData={headerData()}
        onClickBack={() => navigate(`/ams/planning/${subModule}`)}
        actions={actions}
      />
      <Mht
        configs={configsMht()}
        tableData={planningDataDetails}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly
          processInstanceId={
            dataDetails?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          // onSaveUpload={(data) => {
          //   handleSupportingDocs(data)
          // }
          // }
        />
      )}
    </div>
  )
}
export default PlanningDetails
