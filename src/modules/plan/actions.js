import { createAction } from 'redux-actions'
export const setAnnualPlan = createAction('SET_ANNUAL_PLAN', (annualPlans) => ({
  annualPlans,
}))
