import { useMemo, useState } from 'react'
import { navigate } from '@reach/router'
import { Button } from 'react-md'
import { useQuery, useMutation } from 'react-query'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import { get } from 'lodash-es'

import {
  detailLpgDownstreamByLoggedUser,
  updateDownstreamLpg,
} from 'libs/api/downstream-api'
import documents from 'libs/hooks/documents'

import { addToast } from 'modules/app/actions'

import Mht from '@target-energysolutions/mht'
import {
  configsLpgDialogMht,
  configsRsDialogMht,
  configsNgDialogMht,
} from '../mht-helper-dialog'

import TopBarDetail from 'components/top-bar-detail'
import SupportedDocument from 'components/supported-document'
import ToastMsg from 'components/toast-msg'

import useRole from 'libs/hooks/use-role'
import { downloadOriginalFile } from 'libs/api/supporting-document-api'

// import {
//   liquefiedPetroleumGasConfigs,
//   liquefiedPetroleumGasData,
// } from '../helpers'

import './style.scss'

const DownstreamDetails = ({
  location: { pathname },
  downstreamId,
  subkey,
}) => {
  const [showSupportedDocumentDialog, setShowSupportedDocumentDialog] =
    useState(false)
  const dispatch = useDispatch()

  const role = useRole('downstream')
  const subModule = pathname?.split('/')[4]
  const { addSupportingDocuments } = documents()

  const { data: downstreamDetail } = useQuery(
    ['detailLpgDownstreamByLoggedUser', subModule, downstreamId],
    subModule && detailLpgDownstreamByLoggedUser,
  )
  const closeDialog = (resp) => {
    resp &&
      resp[0]?.statusCode === 'OK' &&
      setShowSupportedDocumentDialog(false)
  }

  const costsSuppDocs = (data) => {
    addSupportingDocuments(
      data,
      downstreamDetail?.metaData?.processInstanceId,
      closeDialog,
    )
  }

  const handleSupportingDocs = (data) => {
    costsSuppDocs(data)
  }
  const DownstreamDetailsData = useMemo(() => {
    switch (subModule) {
      case 'lpg':
        return (
          downstreamDetail?.data?.map((el) => ({
            company: el?.company,
            quota: el?.quota,
            lifting: [
              { source1: el?.actualLifted[0]?.value },
              { source2: el?.actualLifted[1]?.value },
            ],
            total: el?.totalLifted,
            remarks: el?.remarks,
            variance: el?.variance,
          })) || []
        )
      case 'ng':
        return (
          downstreamDetail?.data?.map((el) => ({
            terminalType: el?.terminalTypes,
            consumerSupplier: el?.nameTerminal,
            January: [
              { jGD: el?.listOnSpecGas[0]?.value },
              { jCG: el?.listOnSpecGas[1]?.value },
              { jSG: el?.listOnSpecGas[2]?.value },
            ],
            February: [
              { fGD: el?.listOnSpecGas[3]?.value },
              { fCG: el?.listOnSpecGas[4]?.value },
              { fSG: el?.listOnSpecGas[5]?.value },
            ],
            March: [
              { mGD: el?.listOnSpecGas[6]?.value },
              { mCG: el?.listOnSpecGas[7]?.value },
              { mSG: el?.listOnSpecGas[8]?.value },
            ],
            April: [
              { aGD: el?.listOnSpecGas[9]?.value },
              { aCG: el?.listOnSpecGas[10]?.value },
              { aSG: el?.listOnSpecGas[11]?.value },
            ],
            May: [
              { myGD: el?.listOnSpecGas[12]?.value },
              { myCG: el?.listOnSpecGas[13]?.value },
              { mySG: el?.listOnSpecGas[14]?.value },
            ],
            June: [
              { jGD: el?.listOnSpecGas[15]?.value },
              { jCG: el?.listOnSpecGas[16]?.value },
              { jSG: el?.listOnSpecGas[17]?.value },
            ],
            July: [
              { juGD: el?.listOnSpecGas[18]?.value },
              { juCG: el?.listOnSpecGas[19]?.value },
              { juSG: el?.listOnSpecGas[20]?.value },
            ],
            August: [
              { auGD: el?.listOnSpecGas[21]?.value },
              { auCG: el?.listOnSpecGas[22]?.value },
              { auSG: el?.listOnSpecGas[23]?.value },
            ],
            September: [
              { sGD: el?.listOnSpecGas[24]?.value },
              { sCG: el?.listOnSpecGas[25]?.value },
              { sSG: el?.listOnSpecGas[26]?.value },
            ],
            October: [
              { oGD: el?.listOnSpecGas[27]?.value },
              { oCG: el?.listOnSpecGas[28]?.value },
              { oSG: el?.listOnSpecGas[29]?.value },
            ],
            November: [
              { nGD: el?.listOnSpecGas[30]?.value },
              { nCG: el?.listOnSpecGas[31]?.value },
              { nSG: el?.listOnSpecGas[32]?.value },
            ],
            December: [
              { dGD: el?.listOnSpecGas[33]?.value },
              { dCG: el?.listOnSpecGas[34]?.value },
              { dSG: el?.listOnSpecGas[35]?.value },
            ],
          })) || []
        )
      case 'rs':
        return (
          downstreamDetail?.data[0]?.dataGov.map((el) => ({
            gov: el?.wiliyat,
            sn: el?.stationNumber,
            product: [
              { m95: el?.saleQuantityM95 },
              { m91: el?.saleQuantityM91 },
              { kerosen: el?.saleQuantityKerosen },
              { jet: el?.saleQuantityJet },
              { gas: el?.saleQuantityGasOil },
              { m98: el?.saleQuantityM98 },

              { totalProduct: el?.saleQuantityTotal },
            ],
          })) || []
        )
      default:
        return {}
    }
  }, [downstreamDetail, subModule])
  const detailData = useMemo(() => {
    switch (subModule) {
      case 'lpg':
        return {
          title: downstreamDetail?.metaData?.company,
          submittedDate: moment(downstreamDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: downstreamDetail?.metaData?.createdBy?.name,
        }
      case 'rs':
        return {
          title: downstreamDetail?.metaData?.company,
          submittedDate: moment(downstreamDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: downstreamDetail?.metaData?.createdBy?.name,
        }
      default:
        return {
          title: downstreamDetail?.metaData?.company,
          submittedDate: moment(downstreamDetail?.metaData.createdAt).format(
            'DD MMM, YYYY',
          ),
          submittedBy: downstreamDetail?.metaData?.createdBy?.name,
        }
    }
  }, [downstreamDetail, subModule])

  const updateDownstreamMutation = useMutation(updateDownstreamLpg, {
    onSuccess: (res) => {
      if (!res.error) {
        navigate('/ams/downstream')
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
  const onAcknowledge = (subModule, objectId, status) => {
    updateDownstreamMutation.mutate({
      subModule: subModule,
      objectId: objectId,
      status: status,
    })
  }
  const configTable = () => {
    switch (subModule) {
      case 'lpg':
        return configsLpgDialogMht()
      case 'ng':
        return configsNgDialogMht()
      case 'rs':
        return configsRsDialogMht()
      default:
        return {}
    }
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
      View documents
    </Button>,
    <Button
      key="2"
      id="edit"
      className="top-bar-buttons-list-item-btn view-doc"
      flat
      primary
      onClick={() => {
        downloadOriginalFile(
          downstreamDetail?.metaData?.originalFileId,
          downstreamDetail?.metaData?.originalFileName,
        )
      }}
    >
      Download Original File
    </Button>,
    role === 'operator' && downstreamDetail?.metaData?.status === 'DRAFT' && (
      <Button
        key="4"
        id="acknowledge"
        className="top-bar-buttons-list-item-btn"
        flat
        primary
        swapTheming
        onClick={() => {
          onAcknowledge(subModule, downstreamId, 'SUBMITTED')
        }}
      >
        Commit
      </Button>
    ),
    role === 'regulator' &&
      get(downstreamDetail, 'metaData.status', '') === 'SUBMITTED' && (
        <>
          <Button
            key="4"
            id="accept"
            className="top-bar-buttons-list-item-btn"
            flat
            primary
            swapTheming
            onClick={() => {
              onAcknowledge(subModule, downstreamId, 'ACKNOWLEDGED')
            }}
          >
            Acknowledge
          </Button>
        </>
    ),
  ]
  return (
    <div className="details-container">
      <TopBarDetail
        onClickBack={() => navigate(`/ams/downstream/${subkey}`)}
        actions={actions}
        detailData={detailData}
      />
      <Mht
        configs={configTable()}
        tableData={DownstreamDetailsData}
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
          readOnly={role === 'regulator'}
          processInstanceId={
            downstreamDetail?.metaData?.processInstanceId ||
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
export default DownstreamDetails
