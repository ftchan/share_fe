import axios from 'axios'

export function getNewsContent(params) {
  return axios.post('/api/v1/detail', params)
}

export function getIndexNewsList(params) {
  return axios.get('/api/v1/home', {
    params
  })
}

export function getSearchNewsList(params) {
  return axios.get('/api/v1/search', {
    params,
  })
}