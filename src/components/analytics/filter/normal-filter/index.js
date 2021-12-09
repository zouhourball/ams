import PT from 'prop-types'
import {
  FilterCheckbox,
  FilterRadio,
  FilterInput,
  FilterSelect,
  FilterContainer,
  FilterDateRange,
} from '@target-energysolutions/filter-item'
function componentFactory (type) {
  switch (type) {
    case 'radio':
      return FilterRadio

    case 'check':
      return FilterCheckbox

    case 'input':
      return FilterInput

    case 'select':
      return FilterSelect

    case 'dateRange':
      return FilterDateRange

    default:
      return () => <div>Invalid filter type: {type}</div>
  }
}
const NormalFilter = ({ sections, onChange }) => (
  <div>
    {sections.map((section) => {
      let FilterComp = componentFactory(section.type)
      return (
        <FilterContainer key={section.label} title={section.label}>
          <FilterComp
            data={
              Array.isArray(section.data)
                ? section.data.filter((i) => !(i == null))
                : section.data
            }
            value={section.value}
            onChange={(value) => onChange(section, value)}
          />
        </FilterContainer>
      )
    })}
  </div>
)

NormalFilter.propTypes = {
  sections: PT.arrayOf(
    PT.shape({
      type: PT.oneOf(['radio', 'input', 'select', 'check']),
      label: PT.string,
      data: PT.any,
      value: PT.any,
    }),
  ),
  // (section,value)=>
  onChange: PT.func,
}

export default NormalFilter
