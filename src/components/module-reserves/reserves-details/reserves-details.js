import { navigate } from '@reach/router'
import { Button } from 'react-md'
import Mht from '@target-energysolutions/mht'
import { useQuery, useMutation } from 'react-query'
import { useMemo, useState } from 'react'
import moment from 'moment'
import { useDispatch } from 'react-redux'

import useRole from 'libs/hooks/use-role'
import { addToast } from 'modules/app/actions'

import {
  detailReserve,
  updateReserveReport,
  commitReport,
} from 'libs/api/api-reserves'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import documents from 'libs/hooks/documents'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import {
  annualReservesDetailsConfigs,
  annualData,
  fyfData,
  annualResource,
} from '../helpers'

import './style.scss'

const ReservesDetails = ({ reserveId, subkey }) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)

  const dispatch = useDispatch()
  const subModule = subkey
  let role = useRole('reserves')
  const { addSupportingDocuments } = documents()

  const { data: reserveDetail, refetch } = useQuery(
    ['detailReserve', reserveId, subModule],
    reserveId && detailReserve,
  )
  const updateReport = useMutation(updateReserveReport, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/reserves')
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
  const onCommit = (body, sub) => {
    onCommitReportMutate.mutate(
      {
        body: body,
        sub: sub,
      },
      {
        onSuccess: (res) => {
          return !res?.error && refetch()
        },
      },
    )
  }
  const reserveDetailsData = useMemo(() => {
    switch (subModule) {
      case 'annual':
        return annualData(reserveDetail)
      case 'fyf':
        return fyfData(reserveDetail) // array
      case 'annualResource':
        return annualResource(reserveDetail) || []
      default:
        break
    }
  }, [reserveDetail])
  const onAcknowledge = (subModule, objectId, status) => {
    updateReport.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }
  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      reserveDetail?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }
  const detailTitle = () => {
    switch (subModule) {
      case 'annual':
        return 'Annual Reserves Reporting'
      case 'fyf':
        return 'History and Forecast'
      case 'annualResource':
        return 'Annual Resource Detail'
      default:
        break
    }
  }
  const detailData = useMemo(() => {
    return {
      title: detailTitle(),
      subTitle: reserveDetail?.metaData?.block,
      companyName: reserveDetail?.metaData?.company,
      submittedDate: moment(reserveDetail?.metaData?.createdAt).format(
        'DD MMM, YYYY',
      ),
      submittedBy: reserveDetail?.metaData?.createdBy?.name,
    }
  }, [reserveDetail])
  const onCommitReportMutate = useMutation(commitReport)

  const actions = [
    <Button
      key="1"
      id="viewDoc"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      swapTheming
      onClick={() => {
        setShowSupportedDocumentDialog(true)
      }}
    >
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn"
      flat
      primary
      swapTheming
      onClick={() => {
        downloadOriginalFile(
          reserveDetail?.metaData?.originalFileId,
          reserveDetail?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'regulator' && reserveDetail?.metaData?.status === 'SUBMITTED' && (
      <>
        <Button
          key="4"
          id="accept"
          className="top-bar-buttons-list-item-btn"
          flat
          primary
          swapTheming
          onClick={() => {
            onAcknowledge(subModule, reserveId, 'ACKNOWLEDGED')
          }}
        >
          Acknowledge
        </Button>
      </>
    ),
    role === 'operator' && reserveDetail?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onCommit(reserveDetail, subModule)
        }}
      >
        Commit
      </Button>
    ),
  ]
  // console.log(reserveDetailsData, 'reserveDetailsData');
  return (
    <div className="reserves-details">
      <TopBarDetail
        // title={'Annual Reserves Reporting'}
        onClickBack={() => navigate(`/ams/reserves/${subModule}`)}
        actions={actions}
        detailData={detailData}
      />
      <div className="reserves-details-table">
        <Mht
          id="reserves-details"
          configs={annualReservesDetailsConfigs(
            subModule,
            reserveDetailsData[0]?.currentY,
          )}
          tableData={reserveDetailsData}
          withSearch
          commonActions
          withSubColumns
          hideTotal={false}
          withFooter
        />
      </div>
      {showSupportedDocumentDialog && (
        <SupportedDocument
          title={'upload supporting documents'}
          visible={showSupportedDocumentDialog}
          onDiscard={() => setShowSupportedDocumentDialog(false)}
          readOnly={role === 'regulator'}
          processInstanceId={
            reserveDetail?.metaData?.processInstanceId ||
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
export default ReservesDetails
