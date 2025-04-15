import request from '~/utils/request';

export function getCategories(params) {
  return request({
    url: `/categories`,
    method: 'get',
    params,
  });
}

export function createCategory(data) {
  return request({
    url: `/categories`,
    method: 'post',
    data,
  });
}

export function updateCategory({ id, ...data }) {
  return request({
    url: `/categories/${id}`,
    method: 'patch',
    data,
  });
}

export function getCategory({ id }) {
  return request({
    url: `/categories/${id}`,
    method: 'get',
  });
}

export function searchCategories(params) {
  return request({
    url: `/categories/search`,
    method: 'get',
    params,
  });
}

export function deleteCategory({ id }) {
  return request({
    url: `/categories/${id}`,
    method: 'delete',
  });
}

export function deleteCategories({ proposeduserId }) {
  return request({
    url: `/categories/all/${proposeduserId}`,
    method: 'delete',
  });
}
