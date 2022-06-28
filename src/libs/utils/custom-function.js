import { getAccessToken } from 'utils/manageTokens'

export function getPublicUrl (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  } else if (fileID.indexOf('/download') === 0) {
    return `${PRODUCT_APP_URL_API}/fm${fileID}`
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${fileID}`
}

export function getPublicUrlWithToken (fileID) {
  if (!fileID) {
    // This test is useful to enable shortcuts such as "src={getPublicUrl(cardData.pictureURL) || defaultCompanyLogo}"
    return null
  }
  return `${PRODUCT_APP_URL_API}/fm/download/${fileID}?access_token=${getAccessToken()}`
}

export function getDomain (url, subdomain = false) {
  if (!url) {
    return
  }

  url = url.replace(/(https?:\/\/)?(www.)?/i, '')

  if (!subdomain) {
    url = url.split('.')

    url = url.slice(url.length - 2).join('.')
  }

  if (url.indexOf('/') !== -1) {
    return url.split('/')[0]
  }

  return url
}
export function isCreator (subject1, subject2) {
  return subject1 === subject2
}
export function endDateReached (endDate) {
  let today = new Date()
  today = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  )
  return today.getTime() > new Date(endDate).getTime()
}
export function isProd () {
  if (process.env.NODE_ENV === 'production') return true
  else return false
}

export function transformUsers (users) {
  return users.map((el) => ({
    ...el,
    name: el.username,
    key: el.subject,
    subject: el.subject,
    avatar: getPublicUrl(el.pictureURL),
    secondary: el.email || 'n/a',
    userID: el.subject,
    endorsed: true,
  }))
}

export function matchSkills (arr1, arr2) {
  if (!arr1 || !arr2 || arr1.length === 0 || arr2.length === 0) {
    return false
  }
  const uncommon = arr2.filter((m) =>
    arr1.find((k) => k.skillName !== m.skillName),
  )
  return uncommon.length === 0
}

export function validURL (str) {
  var regex =
    /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i
  if (!regex.test(str)) {
    return false
  } else {
    return true
  }
}

export const flatten = (arr) => {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(
      Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten,
    )
  }, [])
}

export const formDataBody = (body) => {
  let newBody = new FormData()
  for (const [key, value] of Object.entries(body)) {
    newBody.append(key, value)
  }
  return newBody
}
export const numberToPrettifiedString = (value, precision = 3) => {
  return (+(value + '').replace(/,/gm, '') || 0)
    .toFixed(precision)
    .replace(
      new RegExp(
        `(?!^)(?=(?:\\d{3})+(?:${precision > 0 ? '\\.' : '$'}))`,
        'gm',
      ),
      ',',
    )
}

export const prettifiedStringToNumber = (
  value,
  precision = 3,
  maxNumberLength = 12,
) => {
  let pattern = new RegExp(
    `^\\d*${precision > 0 ? `(.?\\d{0,${precision}})?` : ''}$`,
  )
  const v = value.replace(/,/gm, '')
  if (
    !isNaN(+v) &&
    v.length <= maxNumberLength + (v.includes('.') ? precision + 1 : 0) &&
    pattern.test(v)
  ) {
    return v
  } else {
    return null
  }
}
