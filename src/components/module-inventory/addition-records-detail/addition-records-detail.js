import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import { get } from 'lodash-es'

import Mht from '@target-energysolutions/mht'

import { getTransactionById } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'

import { additionRecordDetailsConfigs } from './helpers'

const AdditionRecordsDetail = () => {
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const transactionId = pathItems[0]
  const inventoryId = pathItems[2]
  const { data: listAdditions } = useQuery(
    ['getTransactionById', transactionId, 0, 2000],
    getTransactionById,
    {
      refetchOnWindowFocus: false,
    },
  )

  const mhtDisposalDetailData = (get(listAdditions, 'data', []) || []).map(
    (el) => {
      return {
        materialName: el?.data['Material Name'],
        materialCategory: el?.data['Material Category'],
        materialDescription: el?.data['Material Description '],
        measurementUnit: el?.data['Measurement Unit'],
        quantity: el?.data['Quantity'],
        unitPrice: el?.data['Unit Price (USD)'],
        classification: el?.data['Classification'],
        bookValue: el?.data['Book Value(USD)'],
        estimatedCurrentValue: el?.data['Estimated Current Value(USD)'],
        dateOfPurchase: el?.data['Date of Purchase'],
        averageLength: el?.data['Average Length'],
        grade: el?.data['Grade'],
        inspectionDate: el?.data['Inspection Date'],
        itemWeight: el?.data['Item Weight'],
        mTCertificate: el?.data['MT Certificate'],
        materialCondition: el?.data['Material Condition'],
        materialLocation: el?.data['Material Location'],
        reasonsForSale: el?.data['Reasons for Sale / Write - off'],
        remarks: el?.data['Remarks'],
        storageLocation: el?.data['Storage Location'],
        totalWeight: el?.data['Total Weight'],
        weight: el?.data['Weight'],
      }
    },
  )
  return (
    <>
      <TopBarDetail
        onClickBack={() =>
          navigate(`/ams/inventory/addition-records/${inventoryId}`)
        }
        detailData={{ title: 'Addition Records Detail' }}
        actions={[]}
      />
      <Mht
        configs={additionRecordDetailsConfigs()}
        tableData={mhtDisposalDetailData}
        withSearch
        hideTotal={false}
        withFooter
      />
    </>
  )
}

export default AdditionRecordsDetail
