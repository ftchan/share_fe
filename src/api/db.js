import axios from 'axios'

export function getDBNewsList(params) {
  return axios.get('/api/v2/dbnews', {
    params
  })
}