import * as tus from 'tus-js-client'

import { getAuthToken } from 'libs/utils/oauth-token'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

export const uploadFile = (
  file,
  fileName,
  onError,
  onProgress,
  onSuccess,
  workspaceId,
  path,
) => {
  const metadata = {
    path: `/${path || 'defaultPath'}/${fileName}`,
    size: file.size,
    namespace: workspaceId ? 'WORKSPACE' : 'INDIVIDUAL',
    workspace: workspaceId || 0,
  }
  const accessToken = getAuthToken()

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  }
  tus.defaultOptions.headers = headers

  const upload = new tus.Upload(file, {
    endpoint: `${appUrl}/meerafs/rest/files/`,
    // fingerprint: () => `${encodeMetadata(metadata)}`,
    retryDelays: [0, 3000, 5000, 10000],
    onError,
    onProgress,
    onSuccess: () => onSuccess(upload.blob, upload.url, fileName),
    removeFingerprintOnSuccess: true,
    headers: {
      ...headers,
      'Tus-Upload-Metadata': encodeMetadata(metadata),
    },
  })

  // Start the upload
  upload.start()
}

function encodeMetadata (metadata) {
  var encoded = []
  for (var key in metadata) {
    // eslint-disable-next-line
    encoded.push(key + ' ' + Base64.encode(metadata[key]))
  }
  return encoded.join(',')
}
