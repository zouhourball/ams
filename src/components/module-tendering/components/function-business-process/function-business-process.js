import { useEffect, useMemo } from 'react'
import Mht from '@target-energysolutions/mht'
import { get } from 'lodash-es'
import { connect } from 'react-redux'
import { navigate } from '@reach/router'

import mutate from 'libs/hocs/mutate'
import { getCompaniesKpi } from 'libs/api/api-tendering'

import HeaderTemplate from 'components/header-template'

import { config } from './helper'
import './style.scss'

const FunctionBusinessProcess = ({
  mutations: { getCompaniesKpi },
  getCompaniesKpiStatus,
  role,
  organizationID,
  selectedRows,
  setSelectedRows,
}) => {
  useEffect(() => {
    if (role !== 'operator' && organizationID) {
      getCompaniesKpi(organizationID)
    }
  }, [organizationID])

  const tableData = useMemo(
    () =>
      get(getCompaniesKpiStatus, 'data.data', []).map((elem) => ({
        ...elem,
      })),
    [getCompaniesKpiStatus],
  )

  const selectRows = (rows) => {
    setSelectedRows(rows)
  }

  return (
    <>
      <Mht
        id="tendering-function-business-process"
        configs={config}
        tableData={tableData}
        withChecked
        withSearch={selectedRows?.length === 0}
        commonActions={selectedRows?.length === 0 || selectedRows?.length > 1}
        onSelectRows={selectRows}
        className="functionBusinessProcess-dataTable"
        defaultCsvFileTitle="FBP Companies Summary"
        headerTemplate={
          selectedRows?.length === 1 && (
            <HeaderTemplate
              title={
                selectedRows?.length === 1
                  ? `1 Row Selected`
                  : `${selectedRows?.length} Rows selected`
              }
              actions={[
                {
                  id: 1,
                  label: 'View Details',
                  onClick: () =>
                    navigate(`/tendering/fbp/${selectedRows[0]?.companyId}`),
                },
              ]}
            />
          )
        }
      />
    </>
  )
}
export default mutate({
  moduleName: 'proposals',
  mutations: {
    getCompaniesKpi,
  },
})(
  connect(
    ({ shell }) => ({
      organizationID: shell.organizationId,
    }),
    null,
  )(FunctionBusinessProcess),
)

// import { useMemo } from 'react'
// import Mht from '@target-energysolutions/mht'
// import { get } from 'lodash-es'
// import { useSelector } from 'react-redux'
// import { useQuery } from 'react-query'

// import { getCompaniesKpi } from 'libs/api/api-tendering'

// import { config } from './helper'
// import './style.scss'

// const FunctionBusinessProcess = ({
//   role,
// }) => {
//   const organizationID = useSelector(({ shell }) => shell?.organizationId)
//   const { data: getCompaniesKpiData } = useQuery(
//     ['getDelegation', organizationID],
//     (role !== 'operator' && organizationID) && getCompaniesKpi,
//     { refetchOnWindowFocus: false },
//   )

//   const tableData = useMemo(
//     () =>
//       get(getCompaniesKpiData, 'data', []).map(elem => ({
//         ...elem,
//       })),
//     [getCompaniesKpiData],
//   )

//   return (
//     <>
//       <Mht
//         id="tendering-function-business-process"
//         configs={config}
//         tableData= {tableData}
//         withChecked
//         withSearch
//         commonActions
//         className="functionBusinessProcess-dataTable"
//         defaultCsvFileTitle="FBP Companies Summary"
//       />
//     </>
//   )
// }
// export default FunctionBusinessProcess
