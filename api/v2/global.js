import request from '~/utils/request';

export function getIndustries(params) {
  return request({
    url: `/global/industries`,
    method: 'get',
    params,
  });
}
export function getIndustriesSearch(params) {
  return request({
    url: `/global/industries/search`,
    method: 'get',
    params,
  });
}

export function getCountries(params) {
  return request({
    url: `/global/countries`,
    method: 'get',
    params,
  });
}

export function searchCountries(params) {
  return request({
    url: `/global/countries/search`,
    method: 'get',
    params,
  });
}

export function getLanguages(params) {
  return request({
    url: `/global/languages`,
    method: 'get',
    params,
  });
}

export function searchSkills(params) {
  return request({
    url: `/global/skills/search`,
    method: 'get',
    params,
  });
}

export function searchDegrees(params) {
  return request({
    url: `/global/degrees/search`,
    method: 'get',
    params,
  });
}
export function searchJobRole(params) {
  return request({
    url: `/global/job-roles/search`,
    method: 'get',
    params,
  });
}
export function searchStates(params) {
  return request({
    url: `/global/states/search`,
    method: 'get',
    params,
  });
}
export function searchCities(params) {
  return request({
    url: `/global/cities/search`,
    method: 'get',
    params,
  });
}
