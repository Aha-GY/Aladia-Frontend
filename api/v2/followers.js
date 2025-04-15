import request from '~/utils/request';

export function getFollowers({ followerId, ...params }) {
  return request({
    url: `/followers/${followerId}`,
    method: 'get',
    params,
    paramsSerializer: (params) =>
      Object.keys(params)
        .map((key) => {
          const value = params[key];
          if (Array.isArray(value)) {
            return value
              .map((val) => `${key}=${encodeURIComponent(val)}`)
              .join('&');
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&'),
  });
}

export function getFollowing({ followerId, ...params }) {
  return request({
    url: `/followers/${followerId}/following`,
    method: 'get',
    params,
    paramsSerializer: (params) =>
      Object.keys(params)
        .map((key) => {
          const value = params[key];
          if (Array.isArray(value)) {
            return value
              .map((val) => `${key}=${encodeURIComponent(val)}`)
              .join('&');
          }
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join('&'),
  });
}

export function follow({ followerId, ...data }) {
  return request({
    url: `/followers/${followerId}/follow`,
    method: 'post',
    data,
  });
}

export function deleteFollower(followerId) {
  return request({
    url: `/followers/${followerId}`,
    method: 'delete',
  });
}
