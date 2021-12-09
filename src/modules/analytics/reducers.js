import { handleActions } from 'redux-actions'
import update from 'immutability-helper'
import { subDays } from 'date-fns'
import product from 'immer'
import { get, set } from 'lodash-es'
import {
  setFilteredData,
  updateFilter,
  updateFilters,
  initialModule,
  resetFilters,
  updateSharedFilter,
  setCurrentModule,
  updateReportTypeForCurrentModule,
  initilizeFilter,
  updateDateRange,
  updateCompany,
  updateValidFilter,
} from './actions'
const initialState = {
  companyBlockFilter: [],
  production: {
    filters: {
      reportType: 'daily',
    },
  },
  planning: {
    filters: {
      reportType: 'wpb',
    },
  },
  inventory: {
    filters: {
      reportType: 'BASE',
    },
  },
  downstream: {
    filters: {
      reportType: 'LPG',
    },
  },
  costrecovery: {
    filters: {
      reportType: 'PRODUCTION',
    },
  },
  flaring: {
    filters: {
      reportType: 'MONTHLY STATION',
    },
  },
  reserves: {
    filters: {
      reportType: 'annual-resource',
    },
  },
  permit: {
    filters: {},
  },
  currentModuleName: '',
  sharedFilters: {
    companies: {},
    dateRange: {
      startDate: subDays(new Date(), 30).getTime(),
      endDate: new Date().getTime(),
    },
  },
}

export default handleActions(
  {
    [initialModule] (state = initialState, { payload }) {
      const moduleName = payload
      if (moduleName in state) {
        return state
      }
      return update(state, {
        [moduleName]: {
          $set: {
            filters: {},
            filteredData: [],
          },
        },
      })
    },
    [initilizeFilter] (state, { payload }) {},
    [updateReportTypeForCurrentModule] (state, { payload }) {
      if (!get(state, [state.currentModuleName, 'filters', 'reportType'])) {
        // eslint-disable-next-line
        console.warn(
          'unexpector call for updateReportTypeForCurrentModule ',
          state.currentModuleName,
        )
      }
      return product(state, (draft) => {
        set(draft, [state.currentModuleName, 'filters', 'reportType'], payload)
      })
    },
    [setCurrentModule] (state, { payload }) {
      return {
        ...state,
        currentModuleName: payload,
      }
    },
    [updateFilters] (state, { payload }) {
      const { moduleName, filters } = payload
      return product(state, (draft) => {
        draft[moduleName].filters = {
          ...state[moduleName].filters,
          ...filters,
        }
      })
    },
    [updateValidFilter] (state, { payload }) {
      const { moduleName, validKeys } = payload
      return product(state, (draft) => {
        Object.keys(draft[moduleName].filters).forEach((key) => {
          if (![...validKeys, 'reportType'].includes(key)) {
            delete draft[moduleName].filters[key]
          }
        })
      })
    },
    [updateFilter] (state, { payload }) {
      const { moduleName, name, data } = payload
      // on report type change will reset all filters
      if (name === 'reportType') {
        return update(state, {
          [moduleName]: {
            $set: {
              filters: {
                reportType: data,
              },
            },
          },
        })
      } else {
        return update(state, {
          [moduleName]: {
            filters: {
              [name]: {
                $set: data,
              },
            },
          },
        })
      }
    },
    [setFilteredData] (state, { payload }) {
      const { moduleName, value } = payload
      return update(state, {
        [moduleName]: {
          filteredData: { $set: value },
        },
      })
    },
    [updateSharedFilter] (state, { payload }) {
      return {
        ...state,
        sharedFilters: {
          ...state.sharedFilters,
          ...payload,
        },
      }
    },
    [updateDateRange] (state, { payload }) {
      return product(state, (draft) => {
        draft.sharedFilters.dateRange = payload
      })
    },
    [updateCompany] (state, { payload }) {
      return product(state, (draft) => {
        draft.sharedFilters.companies = {
          ...draft.sharedFilters.companies,
          ...payload,
        }
      })
    },
    [resetFilters] (state) {
      return {
        ...initialState,
        sharedFilters: state.sharedFilters,
      }
    },
  },
  initialState,
)
