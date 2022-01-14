import { fetchJSON } from 'libs/fetch'
import { formDataBody } from 'libs/utils/custom-function'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''

// lpg

export const listLpgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/lpg?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadDownstreamLpg = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg/commit`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const findAllDownstreamLpgByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/lpg/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const overrideDownstreamLpg = async ({ body, overrideId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/lpg/override/${overrideId}`,
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
export const updateDownstreamLpg = async ({ subModule, objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/${subModule}/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadLpg = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailLpgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/${queryKey[1]}/${queryKey[2]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteLpg = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/lpg/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const saveLpg = async ({ body, sub }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// ng
export const listNgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadDownstreamNg = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng/commit`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const findAllDownstreamNgByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const overrideDownstreamNg = async ({ body, overrideId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng/override/${overrideId}`,
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
export const updateDownstreamNg = async ({ objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadNg = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailNgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteNg = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/ng/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const saveNg = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
// Petroleum Products
export const listRsDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs?sort=metaData.createdAt,desc&page=${queryKey[1]?.page}&size=${queryKey[1]?.size}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const commitLoadDownstreamRs = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs/commit`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const findAllDownstreamRsByUserCompanyAccess = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs/list/analytics?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const overrideDownstreamRs = async ({ body, overrideId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs/override/${overrideId}`,
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
export const updateDownstreamRs = async ({ objectId, status }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs/update?objectId=${objectId}&status=${status}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadRs = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs/upload`, {
      method: 'POST',
      isFormData: true,
      body: formDataBody(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const detailRsDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs/${queryKey[1]}?sort=metaData.createdAt,desc`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteRs = async ({ objectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/rs/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const saveRs = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs/save`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

// --------

export const deleteDownstream = async (subModule, objectId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/pulse-be/api/v2/downstream/${subModule}/${objectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const deleteAllDownstream = async (subModule, selectedRow) => {
  const list = selectedRow?.map((row) => {
    return { permitId: row?.id }
  })
  const deleteAllPromises = list.map((p) =>
    deleteDownstream(subModule, p?.permitId),
  )
  let returnValue = []

  await Promise.all(deleteAllPromises)
    .then((values) => {
      returnValue = values
    })
    .catch(() => {
      returnValue = []
    })
  return returnValue
}
