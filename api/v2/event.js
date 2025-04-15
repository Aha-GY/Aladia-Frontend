import request from '~/utils/request';

export function createEvent({ calendarId, ...data }) {
  return request({
    url: `/calendars/${calendarId}/events`,
    method: 'post',
    data,
  });
}

export function getEvents({ calendarId, params }) {
  return request({
    url: `/calendars/${calendarId}/events`,
    method: 'get',
    params,
  });
}

export function retriveEvent({ calendarId, id, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${id}`,
    method: 'get',
    params,
  });
}

export function updateEvent({ calendarId, id, ...data }) {
  return request({
    url: `/calendars/${calendarId}/events/${id}`,
    method: 'put',
    data,
  });
}

export function deleteEvent({ calendarId, id, ...data }) {
  return request({
    url: `/calendars/${calendarId}/events/${id}`,
    method: 'delete',
    data,
  });
}

export function searchEvents({ calendarId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/search`,
    method: 'get',
    params,
  });
}

export function getMeetUrl({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/rooms`,
    method: 'get',
    params,
  });
}

export function createMeet({ calendarId, ...data }) {
  return request({
    url: `/calendars/${calendarId}/events/rooms`,
    method: 'post',
    data,
  });
}

export function getEventAuthToken({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/auth`,
    method: 'get',
    params,
  });
}

export function getEventMembers({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members`,
    method: 'get',
    params,
  });
}

export function searchMembers({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/search`,
    method: 'get',
    params,
  });
}

export function eventInvite({ calendarId, eventId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/invite`,
    method: 'post',
    data: rest,
  });
}

export function acceptEventInvite({ calendarId, eventId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/accept-invitation`,
    method: 'post',
    data: rest,
  });
}

export function declineEventInvite({ calendarId, eventId, ...params }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/decline-invitation`,
    method: 'post',
    data: params,
  });
}

export function checkMemberExists({ calendarId, eventId, ...rest }) {
  return request({
    url: `/calendars/${calendarId}/events/${eventId}/members/exists`,
    method: 'get',
    params: rest,
  });
}
