import axios from 'axios'

export function getNewsContent(params) {
  return axios.post('/api/v2/content', params)
}