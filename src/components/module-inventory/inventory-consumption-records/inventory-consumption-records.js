import { useState } from 'react'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import { get } from 'lodash-es'
import moment from 'moment'

import Mht from '@target-energysolutions/mht'

import { getConsumptionsList } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'

import { mhtConfigRecords } from './helper'
import HeaderTemplate from 'components/header-template'

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
      submissionDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
      stockCountAfter: el?.stockAfter,
      consumedItems: el?.totalTansactionCount,
      stockCountBefore: el?.stockBefore,
      status: get(el, 'metaData.status', 'n/a'),
    }
  })

  return (
    <>
      <TopBarDetail
        onClickBack={() => navigate('/ams/inventory/asset-consumption')}
        detailData={{ title: 'Consumption Declaration Records' }}
        actions={[]}
      />
      <Mht
        configs={mhtConfigRecords()}
        tableData={tableDataListConsumptionRecords}
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
              actions={[
                {
                  primary: true,
                  flat: true,
                  swapTheming: true,
                  label: 'View Details',
                  onClick: () => {
                    navigate(
                      `/ams/inventory/${inventoryId}/consumption-detail/${selectedRow[0]?.id}`,
                    )
                  },
                },
              ]}
            />
          ) : (
            ''
          )
        }
      />
    </>
  )
}
export default InventoryConsumptionRecords
