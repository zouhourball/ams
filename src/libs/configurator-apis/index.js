import { getAccessToken } from 'libs/utils/helpers'

export const studioProtocol = `/service/`
export const geoServerProtocol = `/spatial/`

export async function getEntity({ entityName }) {
  const URL = `${studioProtocol}${entityName}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function saveEntity({ data, entityName }) {
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const URL = `${studioProtocol}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function testEntity({ data, entityName, link }) {
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const URL = `${studioProtocol}${link}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function updateEntity({ data, entityName }) {
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const URL = `${studioProtocol}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function deleteEntity({ entityName, id }) {
  const URL = `${studioProtocol}${entityName}/${id}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function activateSingleMap({ data, entityName, link }) {
  const resquestBody = {
    studio: {
      entityName: `${entityName}`,
      data,
    },
  }
  const URL = `${studioProtocol}${link}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

// Map Server
export async function getGeoServerLayer({ apiURL, getUrl }) {
  const URL = `${geoServerProtocol}${apiURL}${getUrl}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

// Find Spatial Reference System (SRS) or CRS
// valid type: `projected`, `geographic 2D` or `` for all
export async function findSRS({ apiURL, search, type }) {
  const resquestBody = {
    search,
    type,
  }
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestBody),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data ? data.slice(0, 10) : []
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function getCrsAPICall({ apiURL }) {
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function postCrsAPICall({ apiURL, resquestParams }) {
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestParams),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function putCrsAPICall({ apiURL, resquestParams }) {
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(resquestParams),
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

export async function deleteCrsAPICall({ apiURL }) {
  const URL = `${geoServerProtocol}${apiURL}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}

// Workflows
export async function uploadWorkflowFiles({ file, link }) {
  const formData = new FormData()
  formData.append('upload', file)
  formData.append('deployment-name', 'generic-insert-2')
  formData.append('tenant-id', 'trove')
  const URL = `${link}`
  const accessToken = getAccessToken()
  let res = await fetch(URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      return data
    })
    .catch((error) => {
      return error
    })
  return res
}
