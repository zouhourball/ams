import { useState } from 'react'
import { FontIcon } from 'react-md'
import CustomDataTable from '../../components/custom-data-table'
import FilterDevelopementAnalysis from '../filter-developement-analysis'

import './style.scss'

const GenericDataTable = ({
  role,
  filterControls,
  filterControlsCheckedDefault,
  onRowSelectionChange,
  selectedRows,
  withFilter,
  config,
  data,
  actions,
  withTabs = false,
  titleTab,
  statusList,
}) => {
  const [status, setStatus] = useState('All')
  const [displayFilter, setDisplayFilter] = useState(false)

  const proposalDataTable = data

  const filterDataTable = () => {
    if (status !== 'All') {
      return proposalDataTable.filter((row) => row.status === status)
    }
    return proposalDataTable
  }
  const groupBy = (items, key) =>
    items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [...(result[item[key]] || []), item],
      }),
      {},
    )
  const renderDataByStatus = () => {
    const groupByStatus = groupBy(proposalDataTable, 'status')
    const dataWithStatus = statusList.map((el) => {
      return {
        status: el.status,
        length:
          (groupByStatus[el.status] && groupByStatus[el.status].length) || 0,
      }
    })
    const dataStatusWithoutPending = dataWithStatus.filter(
      (row) => row.status !== 'Pending',
    )
    return [
      { status: 'All', length: proposalDataTable.length },
      ...dataStatusWithoutPending,
    ]
  }
  return (
    <div className="proposal">
      {proposalDataTable && proposalDataTable.length > 0 ? (
        <CustomDataTable
          className="statued-table"
          title={titleTab || 'test'}
          showTabs={withTabs}
          showFilter={withFilter}
          activeTab={status}
          filterData={renderDataByStatus()}
          onClickFilter={() => setDisplayFilter(true)}
          onChangeTab={(status) => setStatus(status)}
          onRowSelectionChange={onRowSelectionChange}
          selectedRows={selectedRows}
          data={filterDataTable()}
          CustomFilterComponent={
            <FilterDevelopementAnalysis
              visible={displayFilter}
              controls={filterControls || []}
              defaultChecked={filterControlsCheckedDefault || ''}
              onApply={(e) => {}}
              onHide={() => setDisplayFilter(false)}
            />
          }
          config={config}
          actions={actions}
        />
      ) : (
        <div className="empty-content">
          <FontIcon
            icon
            iconClassName="mdi mdi-file-document"
            className="empty-content-icon"
          />
          <div className="empty-content-text">
            No Proposal Created yet.. Click Create New Proposal Button to Create
            Proposal.
          </div>
        </div>
      )}
    </div>
  )
}
export default GenericDataTable
