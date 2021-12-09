import { handleActions } from 'redux-actions'
import { selectCategory, setDashboardCategories } from './actions'
export default handleActions(
  {
    [selectCategory] (state, { payload }) {
      return {
        ...state,
        selectedCategory: payload,
      }
    },
    // payload: string[]
    [setDashboardCategories] (state, { payload }) {
      return {
        ...state,
        categories: payload,
        selectedCategory: payload.length ? payload[0] : null,
      }
    },
  },
  {
    categories: [],
  },
)
