import axios from 'axios';

import request from '~/utils/request';

const CancelToken = axios.CancelToken;

export function getPosts(params) {
  return request({
    url: `/posts`,
    method: 'get',
    params,
  });
}

export function searchPosts(params) {
  return request({
    url: `/posts/search`,
    method: 'get',
    params,
  });
}

export function retreivePost(postId) {
  return request({
    url: `/posts/${postId}`,
    method: 'get',
  });
}

export function createPosts(data) {
  return request({
    url: `/posts`,
    method: 'post',
    data,
  });
}

export function deletePost({ postId, ...data }) {
  return request({
    url: `/posts/${postId}`,
    method: 'delete',
    data,
  });
}

export function updatePost({ postId, ...data }) {
  return request({
    url: `/posts/${postId}`,
    method: 'patch',
    data,
  });
}

export function updatePostNotification({ postId, ...data }) {
  return request({
    url: `/posts/${postId}/notifications`,
    method: 'patch',
    data,
  });
}

export function savePosts(data) {
  return request({
    url: `/saved-posts`,
    method: 'post',
    data,
  });
}

export function hidePosts(data) {
  return request({
    url: `/posts/hide`,
    method: 'post',
    data,
  });
}

export function getCommentsList(params) {
  return request({
    url: `/comments`,
    method: 'get',
    params,
  });
}

export function retreiveComment(commentId) {
  return request({
    url: `/comments/${commentId}`,
    method: 'get',
  });
}

export function searchComments(params) {
  return request({
    url: `/comments/search`,
    method: 'get',
    params,
  });
}

export function createComments(data) {
  return request({
    url: `/comments`,
    method: 'post',
    data,
  });
}

export function getComments(commentId) {
  return request({
    url: `/comments/${commentId}`,
    method: 'get',
  });
}

export function deleteComment({ commentId, ...data }) {
  return request({
    url: `/comments/${commentId}`,
    method: 'delete',
    data,
  });
}

export function updateComment({ commentId, ...rest }) {
  return request({
    url: `/comments/${commentId}`,
    method: 'patch',
    data: rest,
  });
}

export function solveAnswer({ id, ...data }) {
  return request({
    url: `/posts/${id}/best-answer`,
    method: 'put',
    data,
  });
}

export function getReaction(params) {
  return request({
    url: `/reactions/search`,
    method: 'get',
    params,
  });
}

let cancelAllReactionsLoading;
let loadingAllReactions = false;
export function getAllReactions(params) {
  if (loadingAllReactions) {
    cancelAllReactionsLoading();
  }
  loadingAllReactions = true;
  return request
    .get(
      `/reactions`,
      { params },
      {
        cancelToken: new CancelToken((c) => {
          cancelAllReactionsLoading = c;
        }),
      },
    )
    .then((res) => res)
    .finally(() => {
      loadingAllReactions = false;
    });
}

export function retreiveReaction(entityId) {
  return request({
    url: `/reactions/${entityId}`,
    method: 'get',
  });
}

export function updateReaction({ id, ...rest }) {
  return request({
    url: `/reactions/${id}`,
    method: 'patch',
    data: rest,
  });
}
export function deleteRepost({ postId }) {
  return request({
    url: `/posts/repost/${postId}`,
    method: 'delete',
  });
}
