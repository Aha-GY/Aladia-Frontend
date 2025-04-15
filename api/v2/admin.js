import request from '~/utils/request';

export function coursesSearchVerifying(params) {
  return request({
    url: `/courses/search/verifying`,
    method: 'get',
    params,
  });
}

export function reviewCourse({ id, status }) {
  return request({
    url: `/courses/${id}/review`,
    method: 'patch',
    data: { status },
  });
}

export function searchBlockedUsers(params) {
  return request({
    url: `/auth/users/search/blocked`,
    method: 'get',
    params,
  });
}

export function unblockUser({ id }) {
  return request({
    url: `/auth/users/${id}/unblock`,
    method: 'patch',
  });
}

export function getListAllModerationsContentGivenUser({ profileId }) {
  return request({
    url: `/moderations/${profileId}`,
    method: 'get',
  });
}
