import request from '~/utils/request';

export function getCourses(params) {
  return request({
    url: `/courses`,
    method: 'get',
    params,
  });
}

export function getCourse({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}`,
    method: 'get',
    params,
  });
}

export function deleteCourse({ id }) {
  return request({
    url: `/courses/${id}`,
    method: 'delete',
  });
}

export function createCourse(data) {
  return request({
    url: `/courses`,
    method: 'post',
    data,
  });
}

export function updateCourse({ id, ...data }) {
  return request({
    url: `/courses/${id}`,
    method: 'patch',
    data,
  });
}

export function searchCourses(params) {
  return request({
    url: `/courses/search`,
    method: 'get',
    params,
  });
}

export function deleteCourses(params) {
  return request({
    url: `/courses/delete/all`,
    method: 'delete',
    params,
  });
}

export function publishCourse({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/publish`,
    method: 'patch',
    params,
  });
}

export function reviewCourse({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/review`,
    method: 'patch',
    data,
  });
}

export function getMembers({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members`,
    method: 'get',
    params,
  });
}

export function searchMembers({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members/search`,
    method: 'get',
    params,
  });
}

export function addMember({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/members`,
    method: 'post',
    data,
  });
}

export function removeMember({ courseId, profileId }) {
  return request({
    url: `/courses/${courseId}/members/${profileId}`,
    method: 'delete',
  });
}

export function updateMember({ courseId, profileId, ...data }) {
  return request({
    url: `/courses/${courseId}/members/${profileId}`,
    method: 'patch',
    data,
  });
}

export function searchPoetntialMembers({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members/potential`,
    method: 'get',
    params,
  });
}

export function retrieveBillingInfo(data) {
  return request({
    url: `/payment/connect-accounts/billing-info`,
    method: 'post',
    data,
  });
}

export function getCompletions(params) {
  return request({
    url: `/completions`,
    method: 'get',
    params,
  });
}

export function getCompletion({ courseId }) {
  return request({
    url: `/courses/${courseId}/completions`,
    method: 'get',
  });
}

export function updateCompletion({ courseId, chapterId, lectureId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapter/${chapterId}/lecture/${lectureId}/completions`,
    method: 'patch',
    data,
  });
}

export function inviteCourseMembers({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/members/invite`,
    method: 'post',
    data,
  });
}

export function getInviteLink({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members/invite-link`,
    method: 'get',
    params,
  });
}

export function acceptInvite({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/members/accept-invite`,
    method: 'post',
    data,
  });
}

export function startCourse({ courseId }) {
  return request({
    url: `/courses/${courseId}/start`,
    method: 'post',
  });
}

export function leaveCourse({ courseId }) {
  return request({
    url: `/courses/${courseId}/members/leave`,
    method: 'delete',
  });
}

export function createCycles({ courseId, cycles }) {
  return request({
    url: `/courses/${courseId}/cycles`,
    method: 'post',
    data: cycles,
  });
}

export function updateCycles({ courseId, cycles }) {
  return request({
    url: `/courses/${courseId}/cycles`,
    method: 'patch',
    data: cycles,
  });
}

export function deleteCycle({ courseId, cycleId, ...data }) {
  return request({
    url: `/courses/${courseId}/cycles/${cycleId}`,
    method: 'patch',
    data,
  });
}

export function getCoursesSkills(params) {
  return request({
    url: `/courses/skills`,
    method: 'get',
    params,
  });
}

export function getCoursesLanguages(params) {
  return request({
    url: `/courses/languages`,
    method: 'get',
    params,
  });
}
