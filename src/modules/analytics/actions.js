import { createAction } from 'redux-actions'
export const setCompanyBlockFilter = createAction(
  'APP_SET_COMPANY_BLOCK_FILTER',
  (companyBlockFilter) => ({
    companyBlockFilter,
  }),
)

export const resetFilters = createAction('ANALYTICS_RESET_FILTERS', () => {})

export const updateFilter = createAction(
  'ANALYTICS_UPDATE_FILTER',
  (moduleName, name, data) => ({ moduleName, name, data }),
)

export const updateValidFilter = createAction(
  'ANALYTICS_UPDATE_VALID_FILTER',
  (moduleName, validKeys) => ({ moduleName, validKeys }),
)

export const updateFilters = createAction(
  'ANALYTICS_UPDATE_FILTERS',
  (moduleName, filters) => ({ moduleName, filters }),
)

export const setFilteredData = createAction(
  'ANALYTICS_SET_FILTERED_DATA',
  (moduleName, value) => ({ moduleName, value }),
)

export const initialModule = createAction('ANALYTICS_INIT')

export const updateFilterFactory = (moduleName) => (name, data) =>
  updateFilter(moduleName, name, data)
export const setFilteredDataFactory = (moduleName) => (value) =>
  setFilteredData(moduleName, value)

export const updateFiltersFactory = (moduleName) => (filters) =>
  updateFilters(moduleName, filters)

export const initilizeFilter = createAction('ANALYTICS_INIT_FILTERS')
export const initilizeFilterFactory = (moduleName) => (filters) =>
  initilizeFilter()

export const setCurrentModule = createAction('ANALYTICS_SET_CURRENT_MODULE')

export const updateReportTypeForCurrentModule = createAction(
  'ANALYTICS_UPDATE_REPORT_TYPE_FOR_CURR_MODULE',
)
// (startDate,endDate)=> Action
// sharedFilter => Action
export const updateSharedFilter = createAction('ANALTICS_UPDATE_SHARED_FILTER')

// ({startDate,endDate})=>Action
export const updateDateRange = createAction('ANALTICS_UPDATE_DateRange')
// ({[name]:{selectedBlocks:[]}})
export const updateCompany = createAction('ANALITICS_UPDATE_COMPANY')
