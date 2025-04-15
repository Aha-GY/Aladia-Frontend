import request from '~/utils/request';

export function createSubject({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/subjects`,
    method: 'post',
    data,
  });
}

export function updateSubject({ courseId, subjectId, ...data }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}`,
    method: 'patch',
    data,
  });
}

export function getSubject({ courseId, subjectId, ...params }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}`,
    method: 'get',
    params,
  });
}

export function getSubjects({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/subjects`,
    method: 'get',
    params,
  });
}

export function deleteSubject({ courseId, subjectId }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}`,
    method: 'delete',
  });
}

export function unassignSubject({ courseId, subjectId }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}/unassign`,
    method: 'post',
  });
}

export function assignSubjects({ courseId, subjectId, ...data }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}/assign/many`,
    method: 'post',
    data,
  });
}

export function unassignSubjects({ courseId, subjectId, ...data }) {
  return request({
    url: `/courses/${courseId}/subjects/${subjectId}/unassign/many`,
    method: 'post',
    data,
  });
}
