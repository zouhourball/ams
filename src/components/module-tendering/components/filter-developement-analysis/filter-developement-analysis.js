import {
  DialogContainer,
  Button,
  SelectionControlGroup,
  FontIcon,
} from 'react-md'

import './styles.scss'

const FilterDevelopementAnalysis = ({
  className,
  visible,
  controls,
  defaultChecked,
  onHide,
  onApply,
}) => {
  let submitedData = defaultChecked.split(',')
  const actions = []
  actions.push(
    <Button flat primary className="outline" onClick={onHide}>
      Cancel
    </Button>,
  )
  actions.push(
    <Button
      flat
      primary
      onClick={() => {
        onApply(submitedData)
        onHide()
      }}
    >
      Apply
    </Button>,
  )

  return (
    <div className={`filter-developement-analysis ${className}`}>
      <DialogContainer
        className="filter-developement-analysis-container"
        visible={visible}
        actions={actions}
        onHide={() => null}
        title={'Filter Developement Analysis'}
      >
        <SelectionControlGroup
          className="filter-developement-analysis-checklist"
          controls={controls}
          type="checkbox"
          defaultValue={defaultChecked}
          checkedCheckboxIcon={<FontIcon>radio_button_checked</FontIcon>}
          uncheckedCheckboxIcon={<FontIcon>radio_button_unchecked</FontIcon>}
          onChange={(e) => {
            submitedData = e.split(',')[0] === '' ? [] : e.split(',')
          }}
        />
      </DialogContainer>
    </div>
  )
}
export default FilterDevelopementAnalysis

/*
  <div style={{ position: 'relative' }}>
    <button
      onClick={() => {
        setVisible(!visible);
      }}
    >
      toggle
    </button>
    <FilterDevelopementAnalysis
      visible={visible}
      controls={[
        { id: 1, label: 'Vendor Name', value: 'vendor_name' },
        { id: 2, label: 'JSRS Number', value: 'jsrs_number' },
        { id: 3, label: 'Type of Vendor', value: 'type_of_vendor' },
        { id: 4, label: 'Office base', value: 'office_base' },
      ]}
      defaultChecked={checkedValue}
      onHide={() => {
        setVisible(!visible);
      }}
      onApply={e => {
        setCheckedValue(e.join(','));
      }}
    />
  </div>
*/
