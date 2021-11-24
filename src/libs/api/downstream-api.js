import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API
// lpg

export const listLpgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg`, {
      method: 'GET',
    })
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
      `${appUrl}/pulse-be/api/v2/downstream/lpg/list/analytics`,
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
export const updateDownstreamLpg = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg/update`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadLpg = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/lpg/upload`, {
      method: 'POST',
      body: JSON.stringify(body),
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
      `${appUrl}/pulse-be/api/v2/downstream/lpg/${queryKey[1]}`,
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
// ng
export const listNgDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng`, {
      method: 'GET',
    })
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
      `${appUrl}/pulse-be/api/v2/downstream/ng/list/analytics`,
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
export const updateDownstreamNg = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng/update`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadNg = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/ng/upload`, {
      method: 'POST',
      body: JSON.stringify(body),
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
      `${appUrl}/pulse-be/api/v2/downstream/ng/${queryKey[1]}`,
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
// Petroleum Products
export const listRsDownstreamByLoggedUser = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs`, {
      method: 'GET',
    })
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
      `${appUrl}/pulse-be/api/v2/downstream/rs/list/analytics`,
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
export const updateDownstreamRs = async ({ body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs/update`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const uploadRs = async ({ body }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/pulse-be/api/v2/downstream/rs/upload`, {
      method: 'POST',
      body: JSON.stringify(body),
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
      `${appUrl}/pulse-be/api/v2/downstream/rs/${queryKey[1]}`,
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
