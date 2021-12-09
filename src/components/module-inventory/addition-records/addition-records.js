import { useState } from 'react'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'
import { get } from 'lodash-es'
import moment from 'moment'

import Mht from '@target-energysolutions/mht'

import { getAdditionsList } from 'libs/api/api-inventory'

import TopBarDetail from 'components/top-bar-detail'
import HeaderTemplate from 'components/header-template'

import { additionRecordsConfigs } from '../helpers'

const AdditionRecords = () => {
  const pathItems = get(location, 'pathname', '/').split('/').reverse()
  const inventoryId = pathItems[0]

  const [selectedRow, setSelectedRow] = useState([])
  const { data: listAdditions } = useQuery(
    ['getAdditionsList', inventoryId, 0, 2000],
    getAdditionsList,
    {
      refetchOnWindowFocus: false,
    },
  )

  const mhtDisposalDetailData = (get(listAdditions, 'content', []) || []).map(
    (el) => {
      return {
        id: el?.id,
        company: get(el, 'metaData.company', 'n/a'),
        block: get(el, 'metaData.block', 'n/a'),
        submissionDate: moment(el?.metaData?.createdAt).format('DD MMM, YYYY'),
        submissionBy: get(el, 'metaData.createdBy.name', 'n/a'),
        referenceDate: moment(el?.metaData?.updatedAt).format('DD MMM, YYYY'),
        status: get(el, 'metaData.status', 'n/a'),
        statusDate: '_',
      }
    },
  )
  return (
    <>
      <TopBarDetail
        onClickBack={() => navigate('/ams/inventory/new-asset-addition')}
        detailData={{ title: 'Addition Records ' }}
        actions={[]}
      />
      <Mht
        configs={additionRecordsConfigs()}
        tableData={mhtDisposalDetailData}
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
                      `/ams/inventory/${inventoryId}/transaction-detail/${selectedRow[0]?.id}`,
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

export default AdditionRecords
