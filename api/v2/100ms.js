import request from '~/utils/request';

export function createRoom(data) {
  return request({
    url: `/events/rooms`,
    method: 'post',
    data,
  });
}

export function getAuthToken({ roomId, ...params }) {
  return request({
    url: `/events/rooms/${roomId}/auth`,
    method: 'get',
    params,
  });
}
