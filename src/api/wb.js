import axios from 'axios'

export function getWBNewsList(params) {
  return axios.get('/api/v2/wbnews', {
    params
  })
}