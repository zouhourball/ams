import { fetchJSON } from 'libs/fetch'
import { stringify } from 'querystring'

import { dispatch } from 'libs/store'

import {
  displayAPIWorkingOverlay,
  hideAPIWorkingOverlay,
} from 'modules/ui/actions'

export async function refresh (token) {
  const body = stringify({
    grant_type: 'refresh_token',
    refresh_token: token,
  })

  const res = await fetchJSON(
    '/uaa/oauth/token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    },
    false,
  )
  return res
}

export async function me () {
  const res = await fetchJSON('/uaa/me')
  return res
}

/**
 *  Add an user to discussion channel
 *
 * @param {String} fullName - User full name
 * @param {String} userName - User name
 * @param {String} channelId - Discussion channel Number
 */
export async function addMemberToChannelDiscussion (
  fullName,
  userName,
  channelId,
) {
  const res = await fetchJSON(`/mp/api/addMemberToChannelDiscussion`, {
    method: 'POST',
    body: JSON.stringify({
      fullName,
      userName,
      channelId,
    }),
  })
  return res
}

export async function getInfosUser () {
  const res = await fetchJSON(`/wf/api/v1/info`)
  return res
}

const appendFileToForm = (form, file) => {
  form.append('file', file)
  return form
}

export function fileManagerUpload (files, bucket = 'upload') {
  const uploadURL = `${PRODUCT_APP_URL_API}/fm/upload?bucket=${bucket}&share_with=${'sys:anonymous'},sys:authenticated&permission=${'view'}`
  const opts = {
    method: 'POST',
    isFormData: true,
    body: Array.isArray(files)
      ? files.reduce(appendFileToForm, new FormData())
      : appendFileToForm(new FormData(), files),
  }

  return fetchJSON(uploadURL, opts)
}

// export async function addApps (params) {
//   let res = await fetchJSON(`${PRODUCT_WORKSPACE_URL}/rest/card`, {
//     method: 'POST',
//     body: JSON.stringify(params),
//   })
//   return res
// }

export async function updateMyPassword (params) {
  let res
  try {
    res = await fetchJSON(`${OAUTH_HOST}/update-password`, {
      method: 'PUT',
      body: JSON.stringify(params),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export async function getFSToken (params) {
  let res
  try {
    res = await fetchJSON(
      `https://api.dev.meeraspace.com/asset-management/file-token`,
      {
        method: 'POST',
        body: JSON.stringify({
          action: 'UPLOAD',
        }),
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export function overlayControl (func) {
  return async (...params) => {
    dispatch(displayAPIWorkingOverlay())
    const result = await func(...params)
    dispatch(hideAPIWorkingOverlay())

    return result
  }
}
