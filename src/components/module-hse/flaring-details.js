import { useMemo, useState } from 'react'
import { Button } from 'react-md'
import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { useMutation, useQuery } from 'react-query'
import { useDispatch } from 'react-redux'
import moment from 'moment'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import { updateFlaring, getDetailFlaringById } from 'libs/api/api-flaring'
import useRole from 'libs/hooks/use-role'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import documents from 'libs/hooks/documents'

import { addToast } from 'modules/app/actions'

import {
  flaringDetailsAnnualConfigs,
  flaringDetailsDailyConfigs,
  flaringDetailsMonthlyConfigs,
} from './helpers'

import annualPlanTemplate from './files/Annual-Gas-Conservation-Plan.doc'

const FlaringDetails = ({ flaringId, subModule }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const dispatch = useDispatch()

  const role = useRole('flaring')
  const { addSupportingDocuments } = documents()

  // const subModule = get(location, 'pathname', '/').split('/').reverse()[0]
  const objectId = flaringId // get(location, 'pathname', '/').split('/').reverse()[1]

  const { data: flaringData, refetch: refetchList } = useQuery(
    ['getDetailFlaringById', subModule, objectId],
    objectId && getDetailFlaringById,
    {
      refetchOnWindowFocus: false,
    },
  )
  const updateFlaringMutation = useMutation(updateFlaring, {
    onSuccess: (res) => {
      if (res === true) {
        refetchList()
        navigate(`/ams/hse/flaring/${subModule}`)
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
  })

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      flaringData?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }

  const onAcknowledge = (subModule, objectId, status) => {
    updateFlaringMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }

  const renderDetailsDataBySubModule = () => {
    switch (subModule) {
      case 'annual-forecast':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            gaz_type: el?.name,
            unit: el?.unit,
            [`year${el?.values[0]?.year}`]: el?.values[0]?.value,
            [`year${el?.values[1]?.year}`]: el?.values[1]?.value,
            [`year${el?.values[2]?.year}`]: el?.values[2]?.value,
            [`year${el?.values[3]?.year}`]: el?.values[3]?.value,
            [`year${el?.values[4]?.year}`]: el?.values[4]?.value,
            [`year${el?.values[5]?.year}`]: el?.values[5]?.value,
            [`year${el?.values[6]?.year}`]: el?.values[6]?.value,
            [`year${el?.values[7]?.year}`]: el?.values[7]?.value,
            [`year${el?.values[8]?.year}`]: el?.values[8]?.value,
            [`year${el?.values[9]?.year}`]: el?.values[9]?.value,
          }
        })
      case 'monthly-station':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing?.value,
            longitudeEasting: el?.longitudeEasting?.value,
            totalFlaringActuals: el?.totalFlaringActuals?.value,
            routineFlaringActuals: el?.routineFlaringActuals?.value,
            nonRoutineFlaringActuals: el?.nonRoutineFlaringActuals?.value,
            rotuineFlaringPlanned: el?.rotuineFlaringPlanned?.value,
            nonRotuineFlaringPlanned: el?.nonRotuineFlaringPlanned?.value,
            comment: el?.comment,
          }
        })
      case 'daily':
        return (get(flaringData, 'data', []) || []).map((el) => {
          return {
            flareStation: el?.flareStation,
            latitudeNorthing: el?.latitudeNorthing,
            longitudeEasting: el?.longitudeEasting,
            flareAmountTotal: el?.flareAmountTotal?.value,
            routineFlaringAmount: el?.routineFlaringAmount?.value,
            nonroutineFlaringAmount: el?.nonroutineFlaringAmount?.value,
            comment: el?.comment,
          }
        })
      default:
        return null
    }
  }

  const detailsData = useMemo(() => {
    switch (subModule) {
      case 'annual-forecast':
        return {
          title: 'Annual Report',
          subTitle: 'Block ' + get(flaringData, 'metaData.block', ''),
          companyName: get(flaringData, 'metaData.company', ''),
          submittedDate: moment(flaringData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(flaringData, 'metaData.createdBy.name', ''),
        }
      case 'monthly-station':
        return {
          title: 'Monthly Report',
          subTitle: 'Block ' + get(flaringData, 'metaData.block', ''),
          companyName: get(flaringData, 'metaData.company', ''),
          submittedDate: moment(flaringData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(flaringData, 'metaData.createdBy.name', ''),
        }
      case 'daily':
        return {
          title: 'Daily Report',
          subTitle: 'Block ' + get(flaringData, 'metaData.block', ''),
          companyName: get(flaringData, 'metaData.company', ''),
          submittedDate: moment(flaringData?.metaData?.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: get(flaringData, 'metaData.createdBy.name', ''),
        }
      default:
        return null
    }
  })
  const startYear = flaringData?.data[0]?.values[0]?.year
  const renderDetailsConfigsBySubModule = () => {
    switch (subModule) {
      case 'annual-forecast':
        return flaringDetailsAnnualConfigs(startYear)
      case 'monthly-station':
        return flaringDetailsMonthlyConfigs
      case 'daily':
        return flaringDetailsDailyConfigs
      default:
        return null
    }
  }

  const actions = [
    subModule === 'annual-forecast' && (
      <Button
        key="1"
        id="save"
        className="top-bar-detail-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          annualPlanTemplate && annualPlanTemplate.downloadFile()
        }}
      >
        Download Annual Plan
      </Button>
    ),
    <Button
      key="2"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      View Documents
    </Button>,
    <Button
      key="3"
      id="save"
      className="top-bar-detail-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        downloadOriginalFile(
          flaringData?.metaData?.originalFileId,
          flaringData?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'operator' && flaringData?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, objectId, 'SUBMITTED')
        }}
      >
        Commit
      </Button>
    ),
    role === 'regulator' &&
      get(flaringData, 'metaData.status', '') === 'SUBMITTED' && (
        <>
          <Button
            key="4"
            id="accept"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onAcknowledge(subModule, objectId, 'ACCEPTED')
            }}
          >
            Accept
          </Button>
          <Button
            key="4"
            id="reject"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onAcknowledge(subModule, objectId, 'REJECTED')
            }}
          >
            Reject
          </Button>
        </>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/hse/flaring/${subModule}`)}
        actions={actions}
        detailData={detailsData}
      />
      <Mht
        configs={renderDetailsConfigsBySubModule()}
        tableData={renderDetailsDataBySubModule()}
        withSearch
        commonActions
        hideTotal={false}
        withFooter
      />
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly={role === 'regulator'}
          processInstanceId={
            flaringData?.metaData?.processInstanceId ||
            showSupportedDocumentDialog?.processInstanceId
          }
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
    </div>
  )
}

export default FlaringDetails
