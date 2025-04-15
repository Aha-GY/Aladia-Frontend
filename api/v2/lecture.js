import request from '~/utils/request';

export function getLectures({ courseId, chapterId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures`,
    method: 'get',
    params,
  });
}

export function createLecture({ courseId, chapterId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures`,
    method: 'post',
    data,
  });
}

export function updateLecture({ courseId, chapterId, lectureId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
    method: 'patch',
    data,
  });
}

export function getLecture({ courseId, chapterId, lectureId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
    method: 'get',
    params,
  });
}

export function searchLecture({ courseId, chapterId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/search`,
    method: 'get',
    params,
  });
}

export function deleteLecture({ courseId, chapterId, lectureId }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}`,
    method: 'delete',
  });
}

export function deleteLectures({ courseId, chapterId, ...params }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/delete/all`,
    method: 'delete',
    params,
  });
}

export function reorderLecture({ courseId, chapterId, lectureId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/${lectureId}/position`,
    method: 'post',
    data,
  });
}

export function deleteLecturesMany({ courseId, chapterId, ...data }) {
  return request({
    url: `/courses/${courseId}/chapters/${chapterId}/lectures/many`,
    method: 'delete',
    data,
  });
}
