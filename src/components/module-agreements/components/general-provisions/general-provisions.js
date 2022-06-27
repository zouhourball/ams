import { HeaderOption } from 'components/psa-panel'
import HtmlEditor from 'components/html-editor'
import CustomExpansionPanel from 'components/module-agreements/components/custom-expansion-panel'

const GeneralProvisions = props => {
  const { provisionData, handleProvisionData } = props

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
          value={provisionData}
          onChange={() => handleProvisionData(provisionData)}
        />
      }
    />
  )
}

export default GeneralProvisions
