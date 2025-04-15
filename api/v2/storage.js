import request from '~/utils/request';

export function createUploadUrl({ data, params }) {
  return request({
    url: `/storage/files/signed-upload`,
    method: 'post',
    data,
    params,
  });
}
