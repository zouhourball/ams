import { createAction } from 'redux-actions'
export const updateMutation = createAction(
  'MUTATE_UPDATE',
  ({ moduleName, mutationName, key, value, notPending }) =>
    notPending
      ? {
        moduleName,
        mutationName,
        key,
        value,
        notPending: true,
      }
      : {
        moduleName,
        mutationName,
        key,
        value,
      },
)
export const clearMutation = createAction('MUTATE_CLEAR', () => ({}))
