import request from '~/utils/request';

export function createCalendar(data) {
  return request({
    url: `/calendars`,
    method: 'post',
    data,
  });
}

export function getCalendarList(params) {
  return request({
    url: `/calendars`,
    method: 'get',
    params,
  });
}

export function searchCalendarList(params) {
  return request({
    url: `/calendars/search`,
    method: 'get',
    params,
  });
}

export function retriveCalendar({ id, ...params }) {
  return request({
    url: `/calendars/${id}`,
    method: 'get',
    params,
  });
}

export function updateCalendar({ id, ...data }) {
  return request({
    url: `/calendars/${id}`,
    method: 'put',
    data,
  });
}

export function deleteCalendar({ id }) {
  return request({
    url: `/calendars/${id}`,
    method: 'delete',
  });
}

export function retrivePrivateCalendar({ profileId, data, ...params }) {
  return request({
    url: `/calendars/private-events/${profileId}`,
    method: 'post',
    params,
    data,
  });
}

export function availableCalendar({ data, ...params }) {
  return request({
    url: `/calendars/availability`,
    method: 'post',
    params,
    data,
  });
}

export function selectedCalendar(data) {
  return request({
    url: `/calendars/selections`,
    method: 'post',
    data,
  });
}

export function getSelectedCalendar(params) {
  return request({
    url: `/calendars/selections`,
    method: 'get',
    params,
  });
}

export function deleteSelectedCalendar(data) {
  return request({
    url: `/calendars/selections`,
    method: 'delete',
    data,
  });
}

export function commonEvents(data) {
  return request({
    url: `/calendars/common-events`,
    method: 'post',
    data,
  });
}

export function addMember({ calendarId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/members`,
    method: 'post',
    data: rest,
  });
}

export function removeMember({ calendarId, profileId, ...data }) {
  return request({
    url: `/calendars/${calendarId}/members/${profileId}`,
    method: 'delete',
    data,
  });
}

export function updateMember({ calendarId, profileId, ...data }) {
  return request({
    url: `/calendars/${calendarId}/members/${profileId}`,
    method: 'put',
    data,
  });
}

export function getMembers({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members`,
    method: 'get',
    params,
  });
}

export function searchMembers({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members/search`,
    method: 'get',
    params,
  });
}

export function inviteMembers({ calendarId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/members/invite`,
    method: 'post',
    data: rest,
  });
}

export function acceptInvite({ calendarId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/members/accept-invitation`,
    method: 'post',
    data: rest,
  });
}

export function declineInvite({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members/decline-invitation`,
    method: 'post',
    data: params,
  });
}

export function leaveCalendar({ calendarId }) {
  return request({
    url: `/calendars/${calendarId}/members/leave`,
    method: 'delete',
  });
}

export function cancelInvite({ calendarId, email }) {
  return request({
    url: `/calendars/${calendarId}/members/invite/${email}`,
    method: 'delete',
  });
}

export function getInviteLink({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/members/invitation-link`,
    method: 'get',
    params,
  });
}

export function checkMemberExists({ calendarId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/members/exists`,
    method: 'get',
    params: rest,
  });
}
