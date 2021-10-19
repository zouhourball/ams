import Mht from '@target-energysolutions/mht'

import { hsseDetailsConfigs, hsseDetailsData } from './helpers'

const HsseDetails = () => {
  return <Mht
    id="hsse-mht-details"
    configs={hsseDetailsConfigs}
    tableData={hsseDetailsData}
    withSearch
    commonActions
    withSubColumns
    hideTotal={false}
    withFooter
  />
}

export default HsseDetails