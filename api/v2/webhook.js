import request from '~/utils/request';

export function getWebhooks(params) {
  return request({
    url: `/webhooks`,
    method: 'get',
    params,
  });
}

// webhook events list
export function getWebhookEvents() {
  return request({
    url: `/webhooks/events`,
    method: 'get',
  });
}

// get webhook events by search
export function getWebHookEventsBySearchApi(category) {
  return request({
    url: `/webhooks/events/search?category=${category}`,
    method: 'get',
  });
}

// Function to test a new webhook
export function testNewWebhook(data) {
  return request({
    url: `/webhooks/test`,
    method: 'post',
    data: {
      url: data.url,
      event: data.event,
    },
  });
}

// Function to create a new webhook
export function createWebhook(data) {
  return request({
    url: `/webhooks`,
    method: 'post',
    data: {
      events: data.events,
      title: data.title,
      url: data.url,
    },
  });
}

// Function to update an existing webhook
export function updateWebhook(id, data) {
  return request({
    url: `/webhooks/${id}`,
    method: 'put',
    data: {
      ...(data.events && { events: data.events }),
      ...(data.url && { url: data.url }),
      ...(data.title && { title: data.title }),
      ...(data.status && { status: data.status }),
    },
  });
}

// Function to delete an existing webhook
export function deleteWebhook(id) {
  return request({
    url: `/webhooks/${id}`,
    method: 'delete',
  });
}

// WEBHOOK LOGS

// all Webhook Logs
export function allWebhookLogsBySearchApi(webhookId, params) {
  return request({
    url: `/webhooks/${webhookId}/logs/search`,
    method: 'get',
    params,
  });
}

// webhook Events Category list
export function eventsCategoryListApi() {
  return request({
    url: `/webhooks/events/categories`,
    method: 'get',
  });
}

// webhooks events groups
export function eventsGroupsListApi() {
  return request({
    url: `webhooks/events/groups`,
    method: 'get',
  });
}

// webhooks events groups by search
export function eventsGroupsListBySearchApi(search) {
  return request({
    url: `webhooks/events/groups/search?query=${search}`,
    method: 'get',
  });
}

// retrieve webhook by Id
export function retrieveWebhookApi(id) {
  return request({
    url: `/webhooks/${id}`,
    method: 'get',
  });
}

// retrieve webhook Event by Id
export function retrieveWebhookEventApi(id) {
  return request({
    url: `/webhooks/events/${id}`,
    method: 'get',
  });
}
