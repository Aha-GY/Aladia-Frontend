import request from '~/utils/request';

export function getList(params) {
  return request({
    url: `/notifications`,
    method: 'get',
    params,
  });
}

export function search(params) {
  return request({
    url: `/notifications/search`,
    method: 'get',
    params,
  });
}

export function read(id) {
  return request({
    url: `/notifications/${id}/read`,
    method: 'patch',
  });
}

export function readAll() {
  return request({
    url: `/notifications/read-all`,
    method: 'patch',
  });
}

export function deleteNotification(id) {
  return request({
    url: `/notifications/${id}`,
    method: 'delete',
  });
}

export function getSettings() {
  // return request({
  //   url: `/profiles/settings/search`,
  //   method: 'get',
  //   params: {
  //     profileIds: ['notification'],
  //   },
  // });
  return request({
    url: `/notifications/settings`,
    method: 'get',
  });
}

export function updateSettings(data) {
  return request({
    url: `/notifications/settings`,
    method: 'patch',
    data,
  });
}

export function acceptInvite({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members/accept-invite`,
    method: 'post',
    data: params,
  });
}

export function declineInvite({ spaceId, ...params }) {
  return request({
    url: `/spaces/${spaceId}/members/decline-invite`,
    method: 'post',
    data: params,
  });
}

export function acceptCourseInvite({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members/accept-invite`,
    method: 'post',
    data: params,
  });
}

export function declineCourseInvite({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/members/decline-invite`,
    method: 'post',
    data: params,
  });
}

export function getProfileViewers(params) {
  return request({
    url: `/notifications/profile-viewers`,
    method: 'get',
    params,
  });
}

export function acceptEventInvite({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/accept-invitation`,
    method: 'post',
    data: params,
  });
}

export function declineEventInvite({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/decline-invitation`,
    method: 'post',
    data: params,
  });
}

export function acceptCalendarInvite({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members/accept-invitation`,
    method: 'post',
    data: params,
  });
}

export function declineCalendarInvite({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members/decline-invitation`,
    method: 'post',
    data: params,
  });
}
