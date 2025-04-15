import request from '~/utils/request';

export function createAiContentsCourse(data, assignCategories) {
  return request({
    url: `/ai/contents/courses?assignCategories=${assignCategories}`,
    method: 'post',
    data,
  });
}

export function suggestSubCategories({ courseId, ...params }) {
  return request({
    url: `/ai/contents/courses/${courseId}/categories`,
    method: 'get',
    params,
  });
}
