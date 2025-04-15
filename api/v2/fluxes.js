import request from '~/utils/request';

export function getLastestStories(params) {
  return request({
    url: `/stories/latest`,
    method: 'get',
    params,
  });
}

export function getStories(params) {
  return request({
    url: `/stories`,
    method: 'get',
    params,
  });
}

export function updateStories({ storyId, ...res }) {
  return request({
    url: `/stories/${storyId}`,
    method: 'patch',
    data: res,
  });
}

export function retrieveStories({ storyId, ...params }) {
  return request({
    url: `/stories/${storyId}`,
    method: 'get',
    params,
  });
}

export function createStories(data) {
  return request({
    url: `/stories`,
    method: 'post',
    data,
  });
}

export function deleteStories(id) {
  return request({
    url: `/stories/${id}`,
    method: 'delete',
  });
}

export function deleteAllStories(data) {
  return request({
    url: `/stories/`,
    method: 'delete',
    data,
  });
}

export function getStoryById(id) {
  return request({
    url: `/stories/${id}`,
    method: 'get',
  });
}

export function searchStories(params) {
  return request({
    url: `/stories/search`,
    method: 'get',
    params,
  });
}

export function hideStories(data) {
  return request({
    url: `/stories/hide`,
    method: 'post',
    data,
  });
}

export function createStoryGroup(data) {
  return request({
    url: `/story-groups`,
    method: 'post',
    data,
  });
}

export function getStoriesGroup(params) {
  return request({
    url: `/story-groups`,
    method: 'get',
    params,
  });
}

export function searchStoriesGroup(params) {
  return request({
    url: `/story-groups/search`,
    method: 'get',
    params,
  });
}

export function updateStoriesGroup({ highlightId, ...data }) {
  return request({
    url: `/story-groups/${highlightId}`,
    method: 'patch',
    data,
  });
}

export function deleteStoryGroup({ id }) {
  return request({
    url: `/story-groups/${id}`,
    method: 'delete',
  });
}

export function toggleStoryNotification({ storyId }) {
  return request({
    url: `/stories/${storyId}/notifications`,
    method: 'patch',
  });
}

export function getStoriesGroupById(id) {
  return request({
    url: `/story-groups/${id}`,
    method: 'get',
  });
}

export function getSocialReactionList({ id, ...params }) {
  return request({
    url: `/social-views/${id}`,
    method: 'get',
    params,
  });
}

export function setSocialReaction({ ...data }) {
  return request({
    url: `/social-views`,
    method: 'put',
    data,
  });
}

export function deleteFeedReaction(id) {
  return request({
    url: `/social-views/${id}`,
    method: 'delete',
  });
}

export function deleteStoryReelReaction(id) {
  return request({
    url: `/social-views/reactions/${id}`,
    method: 'delete',
  });
}
