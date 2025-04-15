import request from '~/utils/request';

export function createExperience(data) {
  return request({
    url: `/profiles/me/experiences`,
    method: 'post',
    data,
  });
}

export function patchExperience({ experienceId, ...data }) {
  return request({
    url: `/profiles/me/experiences/${experienceId}`,
    method: 'patch',
    data,
  });
}

export function deleteExperience({ experienceId }) {
  return request({
    url: `/profiles/me/experiences/${experienceId}`,
    method: 'delete',
  });
}

export function searchExperience({ experienceId, ...params }) {
  return request({
    url: `/profiles/${experienceId}/experiences/search`,
    method: 'get',
    params,
  });
}

export function getListExperience({ experienceId, ...params }) {
  return request({
    url: `/profiles/${experienceId}/experiences`,
    method: 'get',
    params,
  });
}

export function retrieveExperience({ experienceId }) {
  return request({
    url: `/profiles/me/experiences/${experienceId}`,
    method: 'get',
  });
}
