import { createDualAxisChartCreator } from 'components/analytics/utils'
// import i18n from "i18n-js"
// import l from "libs/langs/keys"

export const createTPvsQuantCreator = createDualAxisChartCreator({
  sliceBy: 'Material Category',
  confL: {
    name: 'Total price',
    dataKey: 'totalPrice',
    unit: 'USD',
  },
  confR: {
    name: 'quantity',
    dataKey: 'quantity',
    unit: 'No of Items',
  },
})
