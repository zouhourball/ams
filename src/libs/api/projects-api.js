import { fetchJSON, fetchGeneric } from 'libs/fetch'
import { get } from 'lodash-es'
import { downloadFromBlob } from 'libs/utils/download-blob'

const appUrl = process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_API : ''
// const wsUrl =
//   process.env.NODE_ENV === 'production' ? PRODUCT_APP_URL_WORKSPACE : ''

export const createProjects = async (orgId, params) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/organizations/${orgId}`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const updateProjects = async ({ id, body }) => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/projects-be/api/v1/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const addProjectDetails = async (params, projectId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectId}/details`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const addProjectPhases = async (params, projectId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectId}/phases`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getProjectsBySubject = async () => {
  let res
  try {
    res = await fetchJSON(`${appUrl}/projects-be/api/v1/projects/me`, {
      method: 'GET',
    })
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getProjectsById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${queryKey[2]}/organizations/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getProjectsStatisticsById = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${queryKey[2]}/statistics/organizations/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getProjectsByOrgId = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/status/organizations/${queryKey[1]}`,
      {
        method: 'POST',
        body: JSON.stringify({ projectStatuses: queryKey[2] }),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const deleteProject = async ({ projectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const archiveProject = async (projectID) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectID}/archive`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const restoreProject = async (projectID) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectID}/restore`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

const endDate = new Date(3000, 1, 1)

export const getListOfMeetingsByWsIds = async (wsIds, start, end = endDate) => {
  return fetchJSON(
    `${appUrl}/mp/api/v2/workspaces/meetings?workspaceIds=${wsIds.join(
      ',',
    )}&date=${start.toISOString()}&endDate=${end.toISOString()}`,
  )
}

export const tasksApiPromise = async (variables) => {
  const query = `query searchTasks($workspaceID: ID!, $streams: [ID!]) {
    searchTasks(workspaceID: $workspaceID, streams: $streams) {
      name
      tasks {
        tasks {
          id
          name
            estimateValue
          estimateType
          stream {
            name
            ws {
              id
              taskAcEnabled
              isWsAdmin
              isStreamAdmin
              isTaskAdmin
              organizationID
              name
            
            }
          }
          status
            priority
             taskAttachments {
            taskAttachments {
              id
              name
              uRL
              previewURL
            }
          }
           taskAssigneeMaps {
            taskAssigneeMaps {
              user {
                profile {
                  displayName
                  photo
                }
              }
            }
          }
          deadline
          createdDate
          startDate
          createdBy {
            profile {
              photo
            }
          }
        }
      }
    }
  }  
  `
  let res
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getTasks = async ({ queryKey }) => {
  const list = Object.keys(queryKey[1]).map((wId) => {
    return { workspaceID: wId, streams: queryKey[1][wId].map((v) => v.id) }
  })
  const tasksPromises = list.map((variables) => tasksApiPromise(variables))
  let returnValue = []
  await Promise.all(tasksPromises)
    .then((values) => {
      returnValue = values.flatMap((elem) => {
        return get(elem, 'data.searchTasks', []).flatMap((v) => v.tasks.tasks)
      })
    })
    .catch(() => {
      returnValue = []
    })
  return returnValue
}

export const deleteTaskFromSprint = async (sprintId, taskId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/sprints/${sprintId}/tasks/${taskId}`,
      {
        method: 'PUT',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getWorkspacesByOrgID = async (orgId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/phases/projects/graphql/organizations/${orgId}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getPhasesByProjectId = async (id, orgId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/phases/projects/${id}/organizations/${orgId}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getSprintsByPhaseId = async (id) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/phases/${id}/sprints`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const createSprint = async ({ phaseId, params }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/phases/${phaseId}/sprints`,
      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getTasksByWorkspace = async (variables) => {
  const query = `query searchTasks($workspaceID: ID!, $streams: [ID!]) {
    searchTasks(workspaceID: $workspaceID, streams: $streams) {
      tasks {
        tasks {
          name
          description
          createdDate
          startDate
          deadline
          estimateValue
          estimateType
          taskAttachments {
            taskAttachments {
              id
              name
              uRL
              previewURL
            }
          }
          id
          taskAssigneeMaps {
            taskAssigneeMaps {
              user {
                profile {
                  displayName
                  photo
                }
              }
            }
          }
          priority
          status
          stream {
            name
            ws{id}
          }
        }
      }
    }
  }
  `
  let res

  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getSprintsById = async (phaseId, sprintId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/phases/${phaseId}/sprints/${sprintId}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getPhaseById = async (phaseId, orgId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/phases/${phaseId}/organizations/${orgId}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const getMembersByWorkspace = async (wId) => {
  const query = `query workspaceMembers($wId: Int!) {
    workspaceMembers(wsID: $wId) {
      Members {
        users {
          id
          profile {
            fullName
            photo
            email
            phoneMobile
            title
            
          }
          wsUsers {
            wsUsers {
              ws {
                name
              }
            }
          }
        }
      }
    }
  }
  `
  let res

  const variables = { wId }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getWorkspaceById = async (id) => {
  const query = `query workspaceByID($id: ID!) {
    workspaceByID(id: $id) {
      id
      name
      tasks {
        tasks {
          name
          id
        }
      }
      streams {
        streams {
          name
          id
          tasks {
            tasks {
              name
              id
            }
          }
        }
      }
    }
  }
  `
  let res

  const variables = { id }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getMemberByIdGraphql = async (subject) => {
  const query = `query seeUserProfileBySubject($subject: String!) {
    seeUserProfileBySubject(subject: $subject) {
      user {
        subject
        userID
        fullName
        isSearchable
        title
        aboutMe
        nationality
        dateOfBirth
        gender
        residentCardNo
        phoneMobile
        phoneHome
        email
        createdDate
        deletedDate
        lastLoginDate
        isActive
        isLocked
        bkgImg #{
        #id
        #aPIID
        # aPIURL
        # aPISize
        # aPIBucket
        # aPIObject
        # aPIFilename
        #}
        photo {
          id
          aPIID
          aPIURL
          aPISize
          aPIBucket
          aPIObject
          aPIFilename
        }
      }
    }
  }
  `
  let res

  const variables = { subject }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_PROFILE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const assignTaskToSprint = async ({ sprintId, params }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/sprints/${sprintId}/tasks`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const getWorkspaces = async ({ queryKey }) => {
  const getWorkspacesPromises = queryKey[1].map((id) => getWorkspaceById(id))

  let returnValue = []
  await Promise.all(getWorkspacesPromises)
    .then((values) => {
      returnValue = values.map((v) => get(v, 'data.workspaceByID', {}))
    })
    .catch(() => {
      returnValue = []
    })
  return returnValue
}

export const getMemberByPhase = async (phaseId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/members/phases/${phaseId} `,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const createMember = async ({ phaseId, params }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/members/phases/${phaseId}`,

      {
        method: 'POST',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const getMemberById = async (memberId, phaseId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/members/${memberId}/phases/${phaseId} `,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const calculateCurrentSpend = async (
  memberId,
  orgId,
  phaseId,
  params,
) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/members/${memberId}/organizations/${orgId}/phases/${phaseId}`,
      {
        method: 'PUT',
        body: JSON.stringify(params),
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
export const getWorkspaceByOrgIDGraphql = async (organizationID) => {
  const query = `query workspacesByOrganizationID($organizationID: String!) {
    workspacesByOrganizationID(organizationID: $organizationID) {
      name
      id
    }
  }
  `
  let res

  const variables = { organizationID: organizationID + '' }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const exportExcelTasks = async ({ projectID }) => {
  const zoneId = Intl.DateTimeFormat().resolvedOptions().timeZone
  const url = `${PRODUCT_APP_URL_API}/projects-be/api/v1/projects/${projectID}/phase-report-xlsx?zoneId=${zoneId}`
  const apiResponseBlob = await await fetchGeneric(url).then((response) =>
    response.blob(),
  )
  downloadFromBlob(
    apiResponseBlob,
    'phase-report.xlsx' || URL.split('/').reverse()[0],
  )
}

export const updateTasks = async (input) => {
  const query = `mutation updateTaskEx($input: [UpdateTaskInput!]!) {
    updateTasks(input: $input) {
      id
    }
  }
  `
  let res
  const variables = { input }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const addTasks = async (input) => {
  const query = `mutation addTask($name: String!, $streamID: ID!) {
    createNewTask(input: {streamID: $streamID, name: $name }) {
      id
      name
      __typename
    }
  }
  `
  let res
  const variables = { ...input }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getStreamById = async (id) => {
  const query = `query streamByID($id: ID!) {
    streamByID(id: $id) {
      
      name
      id
    }
  }
  `
  let res

  const variables = { id }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const addStreamByWsId = async (wsID, name) => {
  const query = `mutation addStream($wsID: ID!, $name: String!) {
    createNewStream(input: {wsID: $wsID, name: $name}) {
      id
      name
    }
  }
  `
  let res

  const variables = { wsID, name }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getStreams = async ({ queryKey }) => {
  const getStreamsPromises = queryKey[1].map((id) => getStreamById(id))
  let returnValue = []
  await Promise.all(getStreamsPromises)
    .then((values) => {
      returnValue = values.map((v) => get(v, 'data.streamByID', {}))
    })
    .catch(() => {
      returnValue = []
    })
  return returnValue
}

export const getTasksByProject = async (projectID) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/projects/${projectID}/tasks`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}

export const updateTask = async (input) => {
  const query = `mutation updateTaskEx($input:UpdateTaskExInput!) {
    updateTaskEx(input: $input) {
      id
    }
  }
  `
  let res
  const variables = { input }
  try {
    res = await fetchJSON(`${PRODUCT_APP_URL_WORKSPACE}/graphql`, {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({ query, variables }),
    })
  } catch (error) {
    res = { error }
  }
  return res
}

export const getAllProjectMembers = async ({ queryKey }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/projects-be/api/v1/members/projects/${queryKey[1]}`,
      {
        method: 'GET',
      },
    )
  } catch (error) {
    res = {
      error,
    }
  }
  return res
}
