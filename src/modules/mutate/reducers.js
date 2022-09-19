import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { updateMutation, clearMutation } from './actions'
const initial = {
  agreement: {},
  /**
   * [moduleName]:{
   *   [mutationName]:{
   *   pending: boolean
   *   error: object
   *   data: object
   * }
   *
   * }
   */
}
export default handleActions(
  {
    [updateMutation] (state, { payload }) {
      const { moduleName, mutationName, key, value, notPending } = payload
      if (!(moduleName in state)) {
        state[moduleName] = {
          [mutationName]: {},
        }
      }
      if (!(mutationName in state[moduleName])) {
        state[moduleName][mutationName] = {}
      }
      return update(state, {
        [moduleName]: {
          [mutationName]: notPending
            ? {
              [key]: {
                $set: value,
              },
              pending: {
                $set: false,
              },
            }
            : {
              [key]: {
                $set: value,
              },
            },
        },
      })
    },
    [clearMutation] (state = initial) {
      return update(state, {
        agreement: {
          $set: state.agreement['getAgreementsStatus']
            ? {
              getAgreementsStatus: state.agreement['getAgreementsStatus'],
            }
            : {},
        },
      })
    },
  },
  initial,
)
