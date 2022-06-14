import axios from 'axios'
import { get, merge } from 'lodash-es'
import { getAuthToken } from 'libs/utils/oauth-token'

export const meetingAxios = axios.create({
  baseURL: `${PRODUCT_APP_URL_FLUXBLE_MEETING}/api/internal`,
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
  },
})

meetingAxios.interceptors.request.use((config) => {
  const newConfig = merge({}, config)
  const token = getAuthToken()
  newConfig.headers.Authorization = `Bearer ${token}`

  return newConfig
})

export const createScheduleMeeting = async (data) => {
  const { data: rs } = await meetingAxios.post('/meeting/schedule', data)
  return rs?.data ?? {}
}
export const updateMeeting = (id, params) => {
  return meetingAxios.put(`/meeting/${id}/update`, params)
}

export const checkUserAvailable = async (params) => {
  const { data } = await meetingAxios.post('/user/occupied_time', params)
  return data?.data ?? {}
}

export const getRecommendedTime = async (params) => {
  const { data } = await meetingAxios.post('/user/recommend_time', params)

  return get(data, 'data.0.timesOfDay.times') || []
}

export const searchMember = async (_key, params) => {
  const { data } = await meetingAxios.get(`/meeting-participant/search`, {
    params,
  })
  return data
}

export const deleteMeeting = (id) => {
  return meetingAxios.delete(`/meeting/${id}`)
}
