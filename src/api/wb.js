import axios from 'axios'

export function getWBNewsList(params) {
  return axios.get('/api/v1/wbnews', {
    params
  })
}