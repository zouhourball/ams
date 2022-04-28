import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

// const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''
const appUrl = PRODUCT_APP_URL_API
const meetingUrl = PRODUCT_APP_URL_WS_MEETING
export const getMeeting = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${meetingUrl}/api/v2/workflows/meetings?processInstanceId=${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getListPlanning = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${queryKey[1]}?sort=metaData.createdAt,desc&page=${queryKey[2]?.page}&size=${queryKey[2]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadReport = async ({ body, key }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/${key}/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// export const uploadFypReport = async ({ body }) => {
//   let res
//   try {
//     res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/fyp/upload`, {
//       method: 'POST',
//       isFormData: true,
//       body: formDataBody(body),
//     })
//   } catch (e) {
//     res = { error: e }
//   }
//   return res
// }

// export const uploadBudgetReport = async ({ body }) => {
//   let res
//   try {
//     res = await fetchJSON(`${appUrl}/pulse-be/api/v2/planning/budgetary-report/upload`, {
//       method: 'POST',
//       isFormData: true,
//       body: formDataBody(body),
//     })
//   } catch (e) {
//     res = { error: e }
//   }
//   return res
// }

export const commitPlanning = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/commit`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const overridePlanningReport = async ({
  subModule,
  overrideId,
  body,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/override/${overrideId}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getDetailPlanningById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${queryKey[2]}/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getDetailPlanningByVersion = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${queryKey[2]}/${queryKey[1]}/versions?version=${queryKey[3]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updatePlanning = async ({ subModule, objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updateWpb = async ({ objectId, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/wpb/${objectId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )
  } catch (error) {
    res = { e: error }
  }
  return res
}
export const updateWpbStatus = async ({ objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/wpb/update?objectId=${objectId}&action=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = { e: error }
  }
  return res
}

export const submitFromDraft = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/wpb/${objectId}/submit`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = { e: error }
  }
  return res
}
export const deletePlanning = async ({ subModule, objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const viewVersions = ({ queryKey }) => {
  let res
  try {
    res = fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${queryKey[3]}/${queryKey[1]}/versions?version=${queryKey[2]}&sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const listAnalytics = (subModule) => {
  let res
  try {
    res = fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateReport = async ({ subModule, objectId, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/${objectId}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const saveReport = async ({ subModule, body }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/${subModule}/save`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getActionsList = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/wpb/${queryKey[1]}/actions`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getWbqProcessHistorian = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/wpb/${queryKey[1]}/process-historian`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const respondToMeeting = async ({ id, status }) => {
  let res
  try {
    res = await fetchJSON(`${meetingUrl}/api/v2/meetings/${id}/${status}`, {
      method: 'PUT',
    })
  } catch (error) {
    res = { e: error }
  }
  return res
}
export const searchOpAndChairman = async () => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/planning/meeting/users?orgID=0`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = { e: error }
  }
  return res
}
