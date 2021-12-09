import { combineReducers } from 'redux'
import { reducer as query } from '@target-energysolutions/react-hoc-query'
import { shell, reducers } from '@target-energysolutions/app-shell'
import mutation from 'modules/mutate/reducers'

import app from 'modules/app/reducers'
import commonAnalytics from 'modules/analytics/reducers'
import dashboard from 'modules/dashboard/reducers'

const reducer = combineReducers({
  query,
  app,
  shell,
  mutation,
  commonAnalytics,
  dashboard,
  ...reducers,
})

export default reducer
