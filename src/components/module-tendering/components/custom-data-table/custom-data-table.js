import Mht from '@target-energysolutions/mht'

import './custom-data-table.scss'

const CustomDataTable = ({
  className,
  title,
  data,
  config,
  actions,
  showTabs,
  showFilter,
  activeTab,
  onClickFilter,
  onChangeTab,
  filterData,
  onRowSelectionChange,
  selectedRows,
  CustomFilterComponent,
}) => {
  return (
    <Mht
      // tableClassName={className}

      tableData={data}
      configs={config}
      // multiple
      // selectedRows={selectedRows}
      // onRowSelectionChange={onRowSelectionChange}
      // actionsForMultiSelect={selected => actions}
      onSelectRows={() => {}}
      actions={actions}
    />
  )
}
export default CustomDataTable
