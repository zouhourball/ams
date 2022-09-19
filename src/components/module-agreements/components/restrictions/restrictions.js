import { HeaderOption } from 'components/psa-panel'
import HtmlEditor from 'components/html-editor'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'

const Restrictions = props => {
  const { restrictionData, handleRestrictionData } = props

  return (
    <CustomExpansionPanel
      className=""
      header={
        <HeaderOption
          label={props.collapsePanelLabel}
          icon={props.leftIcon}
          iconColor={props.iconColor}
        />
      }
      body={
        <HtmlEditor
          value={restrictionData}
          onChange={() => handleRestrictionData(restrictionData)}
        />
      }
    />
  )
}

export default Restrictions
