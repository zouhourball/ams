import { fetchJSON } from 'libs/fetch'

const addGroup = async ({ channelName = 'group test', members }) => {
  const membersObj = members?.map(({ subject, name, email }) => ({
    sub: subject,
    name,
    email,
  }))
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_API}/chat/api/v2/channels`, {
      method: 'POST',
      body: JSON.stringify({
        members: membersObj,
        workspaceId: 0,
        workspaceID: 0,
        workspaceName: '',
        channelName: channelName,
        description: '',
      }),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export default addGroup
/* async function addGroup(params: IAddGroupParams) {
  const members = params.members.map(({ subject, name, email }) => ({
    sub: subject,
    name,
    email,
  }))
  return axios({
    url: `${PRODUCT_APP_URL_API}/chat/api/v2/channels`,
    method: 'POST',
    data: JSON.stringify({
      ...params,
      members,
      workspaceId: 0,
      workspaceID: 0,
      workspaceName: '',
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAuthToken()}`,
    },
  })
}
*/
