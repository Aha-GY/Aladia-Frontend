import request from '~/utils/request';

export function createProfile(data) {
  return request({
    url: `/profiles`,
    method: 'post',
    data,
  });
}

export function getProfileMe(params) {
  return request({
    url: `/profiles/me`,
    method: 'get',
    params,
  });
}

export function deleteProfile({ profileId }) {
  return request({
    url: `/profiles/${profileId}`,
    method: 'delete',
  });
}

export function patchProfile(data) {
  return request({
    url: `/profiles`,
    method: 'patch',
    data,
  });
}

export function searchProfile(params) {
  return request({
    url: `/profiles/search`,
    method: 'get',
    params,
  });
}

export function retrieveProfile({ profileId, ...params }) {
  return request({
    url: `/profiles/${profileId}`,
    method: 'get',
    params,
  });
}

export function retrieveOrganization({ orgId, ...params }) {
  return request({
    url: `/organizations/${orgId}`,
    method: 'get',
    params,
  });
}

export function getListProfile(params) {
  return request({
    url: `/profiles`,
    method: 'get',
    params,
  });
}

export function updateRating({ profileId, ...data }) {
  return request({
    url: `/profiles/${profileId}/rating`,
    method: 'put',
    data,
  });
}

export function becomeTeacher(data) {
  return request({
    url: `/profiles/teachers`,
    method: 'post',
    data,
  });
}

// brands includes orgs
export function getBrands(params) {
  return request({
    url: '/brands',
    method: 'get',
    params,
  });
}

// only brands
export function getPureBrands(params) {
  return request({
    url: '/brands/brand-fetch/search',
    method: 'get',
    params,
  });
}

export function getSocialLinks(profileId) {
  return request({
    url: `/profiles/${profileId}/social-links`,
    method: 'get',
  });
}

export function getProfileSearchHistory(params) {
  return request({
    url: `/profile-search-history`,
    method: 'get',
    params,
  });
}

export function deleteProfileSearchHistory() {
  return request({
    url: `/profile-search-history`,
    method: 'delete',
  });
}

export function createProfileSearchHistory({ id, ...data }) {
  return request({
    url: `/profile-search-history/${id}`,
    method: 'put',
    data,
  });
}

export function deleteProfileSearchHistoryId({ id, ...data }) {
  return request({
    url: `/profile-search-history/${id}`,
    method: 'delete',
    data,
  });
}

export function searchProfilesAndOrganizations(params) {
  return request({
    url: `/profiles/search-profiles-and-organizations`,
    method: 'get',
    params,
  });
}
