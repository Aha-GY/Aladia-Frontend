import request from '~/utils/request';

export function createChapter({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'post',
    data,
  });
}

export function updateChapter({ courseId, chapterId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}`,
    method: 'patch',
    data,
  });
}

export function getChapter({ courseId, chapterId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}`,
    method: 'get',
    params,
  });
}

export function getChapters({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'get',
    params,
  });
}

export function searchChapter({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/search`,
    method: 'get',
    params,
  });
}

export function deleteChapter({ courseId, chapterId }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}`,
    method: 'delete',
  });
}

export function deleteChapters({ courseId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/delete/all`,
    method: 'delete',
    params,
  });
}

export function reorderChapter({ courseId, chapterId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/position`,
    method: 'post',
    data,
  });
}

export function deleteChaptersMany({ courseId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/many`,
    method: 'delete',
    data,
  });
}
