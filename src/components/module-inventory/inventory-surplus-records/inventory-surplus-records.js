import { useState } from 'react'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import { get } from 'lodash-es'
import moment from 'moment'

import Mht from '@target-energysolutions/mht'

import { getSurplusList } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'

import { mhtConfigAssetRecords } from '../helpers'

const InventorySurplusRecords = () => {
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const inventoryId = pathItems[1]

  const [selectedRow, setSelectedRow] = useState([])
  const { data: listSurplus } = useQuery(
    ['getListConsumptionDeclarationRecords', inventoryId, 0, 2000],
    getSurplusList,
    {
      refetchOnWindowFocus: false,
    },
  )

  const tableDataListSurplus = (get(listSurplus, 'content', []) || []).map(
    (el) => {
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
    },
  )
  return (
    <>
      <TopBarDetail
        onClickBack={() => navigate('/ams/inventory')}
        detailData={{ title: 'Consumption Declaration Records' }}
      />
      <Mht
        configs={mhtConfigAssetRecords}
        tableData={tableDataListSurplus()}
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

export default InventorySurplusRecords
