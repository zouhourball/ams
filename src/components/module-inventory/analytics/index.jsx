import { createAnalytics } from '../../analytics'
import DashBoard from './dashboard-page'
import createFilter from 'components/analytics/filter'
import { getInventoryData } from 'libs/api/api-dashboard'
import {
  processBaseData,
  processConsumptionData,
  processSurplusData,
} from './processors'
import { inventoryFilters } from 'libs/consts'
// import i18n from 'i18n-js'
// import l from 'libs/langs/keys'

export default createAnalytics({
  moduleName: 'inventory',
  filter: createFilter('inventory', {
    config: inventoryFilters,
  }),
  // list: [
  //   {
  //     name: 'Sequence No',
  //     dataKey: 'Sequence No',
  //     width: 100,
  //   },
  //   {
  //     name:'Material Category',
  //     dataKey: 'Material Category',
  //     width: 120,
  //   },
  //   {
  //     name: 'Material Description',
  //     dataKey: 'Material Description',
  //     width: 300,
  //   },
  //   {
  //     name: 'Storage Location',
  //     dataKey: 'Storage Location',
  //     width: 150,
  //   },
  //   {
  //     name:'Used or New',
  //     dataKey: 'Used or New',
  //     width: 150,
  //   },
  //   {
  //     name: i18n.t(l.grade),
  //     dataKey: 'Grade',
  //     width: 70,
  //   },
  //   {
  //     name: i18n.t(l.averageLength),
  //     dataKey: 'Average Length',
  //     width: 100,
  //   },
  //   {
  //     name: i18n.t(l.purchaseDate),
  //     dataKey: 'Purchase date',
  //     width: 250,
  //   },
  //   {
  //     name: i18n.t(l.quantity),
  //     dataKey: 'quantity',
  //     width: 70,
  //   },
  //   {
  //     name: i18n.t(l.totalUSD),
  //     dataKey: 'totalPrice',
  //     width: 100,
  //   },
  //   {
  //     name: i18n.t(l.unitPrice),
  //     dataKey: 'unitPrice',
  //     width: 100,
  //   },
  //   {
  //     name: i18n.t(l.MTCertificate),
  //     dataKey: 'MT Certificate',
  //     width: 120,
  //   },
  //   {
  //     name: i18n.t(l.comments),
  //     dataKey: 'Comments',
  //     width: 100,
  //   },
  // ],
  dashboardPage: DashBoard,
  dataPuller: async (params = {}) => ({
    BASE: processBaseData({
      content: await getInventoryData('base', params.id),
    }),
    CONSUMPTION: processConsumptionData({
      content: await getInventoryData('consumptionReportProcess', params.id),
    }),
    SURPLUS: processSurplusData({
      content: await getInventoryData('surplusInventoryProcess', params.id),
    }),
    TRANSFER: processBaseData({
      content: await getInventoryData('assetTransferRequestProcess', params.id),
    }),
    DISPOSAL: processBaseData({
      content: await getInventoryData('assetDisposalRequestProcess', params.id),
    }),
  }),
})
