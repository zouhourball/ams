import { useState } from 'react'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import { get } from 'lodash-es'
import moment from 'moment'

import Mht from '@target-energysolutions/mht'

import { getConsumptionsList } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'

import { mhtConfigAssetRecords } from '../helpers'

const InventoryConsumptionRecords = () => {
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const inventoryId = pathItems[1]

  const [selectedRow, setSelectedRow] = useState([])

  const { data: listConsumptions } = useQuery(
    ['getListConsumptionDeclarationRecords', inventoryId, 0, 2000],
    getConsumptionsList,
    {
      refetchOnWindowFocus: false,
    },
  )

  const tableDataListConsumptionRecords = (
    get(listConsumptions, 'content', []) || []
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

  return (
    <>
      <TopBarDetail
        onClickBack={() => navigate('/ams/inventory')}
        detailData={{ title: 'Consumption Declaration Records' }}
      />
      <Mht
        configs={mhtConfigAssetRecords}
        tableData={tableDataListConsumptionRecords()}
        hideTotal={false}
        singleSelect={true}
        withFooter
        withSearch={selectedRow?.length === 0}
        commonActions={selectedRow?.length === 0 || selectedRow?.length > 1}
        onSelectRows={setSelectedRow}
        withChecked
        selectedRow={selectedRow}
      />
    </>
  )
}
export default InventoryConsumptionRecords
