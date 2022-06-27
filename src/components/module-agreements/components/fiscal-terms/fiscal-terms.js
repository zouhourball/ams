import { HeaderOption } from 'components/psa-panel'
import DataTableAdditionGroup from 'components/data-table-addition-group'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'

const FiscalTerms = ({ collapsePanelLabel, leftIcon, iconColor }) => {
  return (
    <CustomExpansionPanel
      className=""
      header={
        <HeaderOption
          icon={leftIcon}
          label={collapsePanelLabel}
          iconColor={iconColor}
        />
      }
      body={<DataTableAdditionGroup />}
    />
  )
}

export default FiscalTerms
