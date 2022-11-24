import { navigate } from '@reach/router'
import Mht from '@target-energysolutions/mht'
import { useState } from 'react'
import { Button } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import moment from 'moment'
import { addToast } from 'modules/app/actions'

import { hsseById, updateHSSE } from 'libs/api/hsse-api'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'
import { useDispatch } from 'react-redux'

import ToastMsg from 'components/toast-msg'
import TopBarDetail from 'components/top-bar-detail'
import { buildObjectFromArray } from 'components/module-planning/utils'
import SupportedDocument from 'components/supported-document'
import useRole from 'libs/hooks/use-role'
import documents from 'libs/hooks/documents'

import { hsseDetailsConfigs } from './helpers'

const HsseDetails = ({ hsseId }) => {
  const dispatch = useDispatch()
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const { data: hsseDetails, refetch: refetchHsse } = useQuery(
    ['hsseById', hsseId],
    hsseById,
  )
  const role = useRole('flaring')
  const { addSupportingDocuments } = documents()
  const { mutate: updateMutate } = useMutation(updateHSSE)
  const onUpdateReport = (objectId) => {
    updateMutate(
      {
        objectId: objectId,
        status: 'SUBMITTED',
      },
      {
        onSuccess: (res) => {
          if (!res.error) {
            refetchHsse()

            dispatch(
              addToast(
                <ToastMsg
                  text={res.message || 'Report updated successfully'}
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
  }
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
      {role === 'regulator' ? 'View Documents' : 'Upload supporting documents'}
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
          hsseDetails?.metaData?.originalFileId,
          hsseDetails?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'operator' && hsseDetails?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onUpdateReport(hsseId)
        }}
      >
        Commit
      </Button>
    ),
  ]

  const detailData = () => {
    return {
      title: 'Monthly Report',
      subTitle: hsseDetails?.metaData?.block,
      companyName: hsseDetails?.metaData?.company,
      submittedBy: hsseDetails?.metaData?.createdBy?.name,
      submittedDate: hsseDetails?.metaData?.createdAt
        ? moment(hsseDetails?.metaData?.createdAt).format('DD MMM, YYYY HH:mm')
        : '',
    }
  }

  const hsseDetailsData = () => {
    const res = hsseDetails?.data?.map((el) => ({
      item: el?.item,
      ...buildObjectFromArray(el.values, 'month'),
      yearEnd: el?.yearEndTarget /* [{ operator: '' }, { contractor: '' }] */,
    }))

    return res || []
  }

  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const handleSupportingDocs = (data) => {
    addSupportingDocuments(
      data,
      hsseDetails?.metaData?.processInstanceId ||
        showSupportedDocumentDialog?.processInstanceId,
      closeDialog,
    )
  }

  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate('/ams/hse/hsse')}
        actions={actions}
        detailData={detailData()}
      />
      <Mht
        id="hsse-mht-details"
        configs={hsseDetailsConfigs}
        tableData={hsseDetailsData()}
        withSearch
        commonActions
        withSubColumns
        hideTotal={false}
        withFooter
      />
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
          processInstanceId={hsseDetails?.metaData?.processInstanceId}
          onSaveUpload={(data) => {
            handleSupportingDocs(data)
          }}
        />
      )}
    </div>
  )
}

export default HsseDetails
