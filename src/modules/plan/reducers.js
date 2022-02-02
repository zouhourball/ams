import { handleActions } from 'redux-actions'
import update from 'immutability-helper'

import { setAnnualPlan } from './actions'

const initialState = {
  annualPlans: [],
}

export default handleActions(
  {
    [setAnnualPlan] (state = initialState, { payload: { annualPlans } }) {
      return update(state, {
        annualPlans: { $set: annualPlans },
      })
    },
  },
  initialState,
)
