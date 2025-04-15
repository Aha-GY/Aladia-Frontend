import request from '~/utils/request';

export function getSpaces(params) {
  return request({
    url: `/spaces`,
    method: 'get',
    params,
  });
}

export function getSpace({ spaceId }) {
  return request({
    url: `/spaces/${spaceId}`,
    method: 'get',
  });
}

export function createSpace(data) {
  return request({
    url: `/spaces`,
    method: 'post',
    data,
  });
}

export function updateSpace({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}`,
    method: 'patch',
    data: rest,
  });
}

export function deleteSpace({ spaceId }) {
  return request({
    url: `/spaces/${spaceId}`,
    method: 'delete',
  });
}

export function searchSpaces(params) {
  return request({
    url: `/spaces/search`,
    method: 'get',
    params,
  });
}

export function reorderSpace({ spaceId, profileId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/profile/${profileId}/position`,
    method: 'post',
    data: rest,
  });
}

export function previewSpace(params) {
  return request({
    url: `/spaces/preview`,
    method: 'get',
    params,
  });
}

export function getFolders({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/`,
    method: 'get',
    params: rest,
  });
}

export function getFolder({ spaceId, folderId }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}`,
    method: 'get',
  });
}

export function createFolder({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders`,
    method: 'post',
    data: rest,
  });
}

export function deleteFolder({ spaceId, folderId }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}`,
    method: 'delete',
  });
}

export function updateFolder({ spaceId, folderId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}`,
    method: 'patch',
    data: rest,
  });
}

export function searchFolders({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/search`,
    method: 'get',
    params: rest,
  });
}

export function reorderFolder({ spaceId, folderId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/position`,
    method: 'post',
    data: rest,
  });
}

export function getCourses({ spaceId, folderId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses`,
    method: 'get',
    params: rest,
  });
}

export function searchCourses({ spaceId, folderId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses/search`,
    method: 'get',
    params: rest,
  });
}

export function moveCourse({ spaceId, folderId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses`,
    method: 'patch',
    data: rest,
  });
}

export function deleteCourseFromSpace({ courseId }) {
  return request({
    url: `/courses/${courseId}`,
    method: 'delete',
  });
}

export function removeCourseFromSpace({ spaceId, folderId, courseId }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses/${courseId}`,
    method: 'delete',
  });
}

export function duplicateCourseInSpace({ courseId, startDate }) {
  return request({
    url: `/courses/${courseId}/clone`,
    method: 'post',
    data: {
      startDate,
    },
  });
}

export function reorderCourse({ spaceId, folderId, courseId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses/${courseId}/position`,
    method: 'post',
    data: rest,
  });
}

export function addMember({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/members`,
    method: 'post',
    data: rest,
  });
}

export function removeMember({ spaceId, profileId }) {
  return request({
    url: `/spaces/${spaceId}/members/${profileId}`,
    method: 'delete',
  });
}

export function updateMember({ spaceId, profileId, ...data }) {
  return request({
    url: `/spaces/${spaceId}/members/${profileId}`,
    method: 'patch',
    data,
  });
}

export function getMembers({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members`,
    method: 'get',
    params,
  });
}

export function searchMembers({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members/search`,
    method: 'get',
    params,
  });
}

export function searchPotentialMembers({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members/potential`,
    method: 'get',
    params,
  });
}

export function inviteMembers({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/members/invite`,
    method: 'post',
    data: rest,
  });
}

export function getInviteLink({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members/invite-link`,
    method: 'get',
    params,
  });
}

export function handleInvite({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/members/handle-invite`,
    method: 'post',
    data: rest,
  });
}

export function acceptInvite({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/members/accept-invite`,
    method: 'post',
    data: rest,
  });
}

export function leaveSpace({ spaceId }) {
  return request({
    url: `/spaces/${spaceId}/members/leave`,
    method: 'delete',
  });
}

export function cancelInvite({ spaceId, email }) {
  return request({
    url: `/spaces/${spaceId}/members/invite/${email}`,
    method: 'delete',
  });
}

export function checkMemberExists({ spaceId, ...rest }) {
  return request({
    url: `/spaces/${spaceId}/members/exists`,
    method: 'get',
    params: rest,
  });
}
export function moveCoursesLicense({ spaceId, folderId, ...data }) {
  return request({
    url: `/spaces/${spaceId}/folders/${folderId}/courses/license`,
    method: 'patch',
    data,
  });
}

export function assignLicense({ spaceId, profileId, ...data }) {
  return request({
    url: `/spaces/${spaceId}/members/${profileId}/assign-license`,
    method: 'patch',
    data,
  });
}

export function assignLicenseToMembers({ spaceId, ...data }) {
  return request({
    url: `/spaces/${spaceId}/members/assign-license`,
    method: 'patch',
    data,
  });
}

export function removeLicense({ spaceId, ...data }) {
  return request({
    url: `/spaces/${spaceId}/members/remove-license`,
    method: 'patch',
    data,
  });
}

export function getSpaceOverview(params) {
  return request({
    url: `/analytics/questions/spaces/overview`,
    method: 'get',
    params,
  });
}
