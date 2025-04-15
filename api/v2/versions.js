import request from '~/utils/request';

export function createVersion({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/versions`,
    method: 'post',
    data,
  });
}

export function getVersion({ versionId, ...params }) {
  return request({
    url: `/versions/${versionId}`,
    method: 'get',
    params,
  });
}

export function getVersions(params) {
  return request({
    url: `/versions`,
    method: 'get',
    params,
  });
}

export function searchVersions({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/versions/search`,
    method: 'get',
    params,
  });
}

export function restoreVersion({ courseId, versionId }) {
  return request({
    url: `/courses/${courseId}/versions/${versionId}/restore`,
    method: 'post',
  });
}

export function updateVersion({ versionId, courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/versions/${versionId}`,
    method: 'patch',
    data,
  });
}
