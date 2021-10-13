import { fetchJSON } from 'libs/fetch'

const appUrl =
  process.env.NODE_ENV === 'production'
    ? PRODUCT_APP_URL_API
    : PRODUCT_APP_URL_API

// Projects

export const getAllProjects = async ({ queryKey }) => {
  // queryKey[1] = orgId
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/projects`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getAllProjectsByProgramId = async ({ queryKey }) => {
  // orgId = 1, programId= 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/programs/${queryKey[2]}/projects`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createProject = async ({ body, orgId, programId }) => {
  // body={
  //   "description": "string",
  //   "end_date": "string",
  //   "manager": "string",
  //   "start_date": "string",
  //   "title": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}/projects`,
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

export const updateProject = async ({ body, orgId, programId, projectId }) => {
  // body={
  //   "description": "string",
  //   "end_date": "string",
  //   "manager": "string",
  //   "start_date": "string",
  //   "title": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}/projects/${projectId}`,
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

export const deleteJob = async ({ orgId, programId, projectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}/projects/${projectId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateProjectIndicatorLink = async ({
  body,
  orgId,
  programId,
  projectId,
}) => {
  // body={
  //   "ids": [
  //     0
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}/projects/${projectId}/pindicators`,
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

// goal

export const getGoalsByPriority = async ({ queryKey }) => {
  // orgId = 1, priorityId = 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/priorities/${queryKey[2]}/goals`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addMultipleGoals = async ({ body, orgId, priorityId }) => {
  // body={
  //   "goals": [
  //     {
  //       "statement": "string"
  //     }
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/goals`,
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

export const getGoalsById = async (orgId, priorityId, goalId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/goals/${goalId}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateGoal = async ({ body, orgId, priorityId, goalId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/goals/${goalId}`,
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

export const deleteGoal = async ({ orgId, priorityId, goalId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/goals/${goalId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const linkGoalToPIndicators = async ({
  body,
  orgId,
  priorityId,
  goalId,
}) => {
  // body={
  //   "ids": [
  //     0
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/goals/${goalId}/pindicators`,
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

// Performance Indicator

export const getPIndicatorByOrg = async ({ queryKey }) => {
  // orgId = 1
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/pindicators`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getPIndicatorByPriority = async ({ queryKey }) => {
  // orgId = 1, priorityId= 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/priorities/${queryKey[2]}/pindicators`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const addMultiplePIndicator = async ({ body, orgId, priorityId }) => {
  // body={
  //   "performance_indicators": [
  //     {
  //       "statement": "string"
  //     }
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators`,
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

export const getPIndicatorById = async (orgId, priorityId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updatePIndicator = async ({
  body,
  orgId,
  priorityId,
  pIndicatorId,
}) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators/${pIndicatorId}`,
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

export const deletePIndicator = async ({ orgId, priorityId, pIndicatorId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators/${pIndicatorId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const linkPIndicatorToGoals = async ({
  body,
  orgId,
  priorityId,
  pIndicatorId,
}) => {
  // body={
  //   "ids": [
  //     0
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators/${pIndicatorId}/goals`,
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

export const linkPIndicatorToProjects = async ({
  body,
  orgId,
  priorityId,
  pIndicatorId,
}) => {
  // body={
  //   "ids": [
  //     0
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/pindicators/${pIndicatorId}/projects`,
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

// Strategic Direction

export const createStrategicDirection = async ({ body, orgId, priorityId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/sdirections`,
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

export const getSDirectionById = async (orgId, priorityId, sDirectionId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/sdirections/${sDirectionId}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateSDirection = async ({
  body,
  orgId,
  priorityId,
  sDirectionId,
}) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/sdirections/${sDirectionId}`,
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

export const deleteSDirection = async ({ orgId, priorityId, sDirectionId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/priorities/${priorityId}/sdirections/${sDirectionId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Programs

export const getAllProgram = async ({ queryKey }) => {
  // orgId = 1
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/programs`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createProgram = async ({ body, orgId }) => {
  // body={
  //   "attachments": [
  //     {
  //       "created_at": "string",
  //       "created_by": "string",
  //       "file_id": "string",
  //       "file_name": "string",
  //       "file_size": 0,
  //       "file_type": "string",
  //       "file_url": "string",
  //       "id": 0
  //     }
  //   ],
  //   "description": "string",
  //   "end_date": "string",
  //   "manager": "string",
  //   "start_date": "string",
  //   "title": "string"
  // }
  let res
  try {
    res = await fetchJSON(`${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs`, {
      method: 'POST',
      body: JSON.stringify(body),
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getProgramById = async (orgId, programId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateProgram = async ({ body, orgId, programId }) => {
  // body={
  //   "attachments": [
  //     {
  //       "created_at": "string",
  //       "created_by": "string",
  //       "file_id": "string",
  //       "file_name": "string",
  //       "file_size": 0,
  //       "file_type": "string",
  //       "file_url": "string",
  //       "id": 0
  //     }
  //   ],
  //   "description": "string",
  //   "end_date": "string",
  //   "manager": "string",
  //   "start_date": "string",
  //   "title": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}`,
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

export const deleteProgram = async ({ orgId, programId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Mission

export const createMission = async ({ body, orgId, visionMissionId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/vms/${visionMissionId}/missions`,
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

export const getMissionById = async (orgId, visionMissionId, missionId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/missions/${missionId}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateMission = async ({
  body,
  orgId,
  visionMissionId,
  missionId,
}) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/missions/${missionId}`,
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

export const deleteMission = async ({ orgId, visionMissionId, missionId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/missions/${missionId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Priority

export const getPrioritiesByVisionMission = async ({ queryKey }) => {
  // orgId :1,  visionMissionId: 2
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/vms/${queryKey[2]}/priorities`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createMultiplePriorities = async ({
  body,
  orgId,
  visionMissionId,
}) => {
  // body={
  //   "priorities": [
  //     {
  //       "logo_url": "string",
  //       "statement": "string"
  //     }
  //   ]
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/vms/${visionMissionId}/priorities`,
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

export const getPriorityById = async ({ queryKey }) => {
  // orgId: 1, visionMissionId: 2 , priorityId: 3
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/vms/${queryKey[2]}/priorities/${queryKey[3]}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const getPriorities = async ({ queryKey }) => {
  // orgId: 1, visionMissionId: 2 , priorityId: 3
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/priorities`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
export const updatePriority = async ({
  body,
  orgId,
  visionMissionId,
  priorityId,
}) => {
  // body={
  //   "logo_url": "string",
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/priorities/${priorityId}`,
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

export const deletePriority = async ({
  orgId,
  visionMissionId,
  priorityId,
}) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/priorities/${priorityId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Vision

export const createVision = async ({ body, orgId, visionMissionId }) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/visions`,
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

export const getVision = async (orgId, visionMissionId, visionId) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/visions/${visionId}`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const updateVision = async ({
  body,
  orgId,
  visionMissionId,
  visionId,
}) => {
  // body={
  //   "statement": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/visions/${visionId}`,
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

export const deleteVision = async ({ orgId, visionMissionId, visionId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-mission/${visionMissionId}/visions/${visionId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

// Vision Mission

export const getVisionMission = async ({ queryKey }) => {
  // queryKey[1] => orgId
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/visions-missions`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createVisionMission = async ({ body, orgId }) => {
  // body={
  //   "mission": {
  //     "statement": "string"
  //   },
  //   "vision": {
  //     "statement": "string"
  //   }
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/visions-missions`,
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

// Phases

export const getProjectPhases = async ({ queryKey }) => {
  // queryKey[1]=orgId queryKey[2]=projectId
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/projects/${queryKey[2]}/phases`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const createPhase = async ({ body, orgId, projectId }) => {
  // body={
  //   "estimated_budget": 0,
  //   "spent_budget": 0,
  //   "title": "string",
  //   "uom": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/projects/${projectId}/phases`,
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

export const updatePhase = async ({ body, orgId, projectId, phaseId }) => {
  // body={
  //   "estimated_budget": 0,
  //   "spent_budget": 0,
  //   "title": "string",
  //   "uom": "string"
  // }
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/projects/${projectId}/phases/${phaseId}`,
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

export const deletePhase = async ({ orgId, projectId, phaseId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/projects/${projectId}/phases/${phaseId}`,
      {
        method: 'DELETE',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getUploadUrl = async ({ queryKey }) => {
  // queryKey[1] => orgId
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/tokens/upload`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const getDownloadUrl = async ({ queryKey }) => {
  // queryKey[1] => orgId
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/tokens/download`,
      {
        method: 'GET',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const linkProjectToWs = async ({ body, orgId, projectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/projects/${projectId}/ws`,
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

export const getWorkspacesByOrgId = async ({ queryKey }) => {
  // queryKey[1] = orgId
  let res
  try {
    res = await fetchJSON(`${appUrl}/prime-svc/api/v1/orgs/${queryKey[1]}/ws`, {
      method: 'GET',
    })
  } catch (e) {
    res = { error: e }
  }
  return res
}

export const linkProjectToProgram = async ({ orgId, programId, projectId }) => {
  let res
  try {
    res = await fetchJSON(
      `${appUrl}/prime-svc/api/v1/orgs/${orgId}/programs/${programId}/projects/${projectId}`,
      {
        method: 'PUT',
      },
    )
  } catch (e) {
    res = { error: e }
  }
  return res
}
