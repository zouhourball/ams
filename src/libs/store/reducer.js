import { combineReducers } from 'redux'
import { reducer as query } from '@target-energysolutions/react-hoc-query'
import { shell, reducers } from '@target-energysolutions/app-shell'
import mutation from 'modules/mutate/reducers'
import { optimisticAPI } from '@target-energysolutions/utils'

import app from 'modules/app/reducers'
import commonAnalytics from 'modules/analytics/reducers'
import dashboard from 'modules/dashboard/reducers'
import { selectRowsReducers } from '@target-energysolutions/mht'

const reducer = combineReducers({
  query,
  app,
  shell,
  mutation,
  commonAnalytics,
  dashboard,
  selectRowsReducers,
  ...reducers,
  ...optimisticAPI.reducer,
})

export default reducer
