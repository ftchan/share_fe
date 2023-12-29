import axios from 'axios'

export function getNewsContent(params) {
  return axios.get('/api/v2/content', {
    params
  })
}