import { HeaderOption } from 'components/psa-panel'
import HtmlEditor from 'components/html-editor'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'

const Entitlements = props => {
  const { entitlementData, handleEntitlementData } = props

  return (
    <CustomExpansionPanel
      className=""
      header={
        <HeaderOption
          icon={props.leftIcon}
          label={props.collapsePanelLabel}
          iconColor={props.iconColor}
        />
      }
      body={
        <HtmlEditor
          value={entitlementData}
          onChange={() => handleEntitlementData(entitlementData)}
        />
      }
    />
  )
}

export default Entitlements
