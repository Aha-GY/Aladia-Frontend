import request from '~/utils/request';

export function createRoom(params) {
  return request({
    url: `/rooms`,
    method: 'post',
    data: params,
  });
}

export function retrieveRoom({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}`,
    method: 'get',
    params,
  });
}

export function listCommonRooms({ userId, ...params }) {
  return request({
    url: `/rooms/common/${userId}`,
    method: 'get',
    params,
  });
}

export function listRooms(params) {
  return request({
    url: `/rooms`,
    method: 'get',
    params,
  });
}

export function deleteRoom({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}`,
    method: 'delete',
    params,
  });
}

export function updateRoom({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}`,
    method: 'put',
    data: params,
  });
}

export function muteRoom(params) {
  return request({
    url: `/rooms/${params.roomId}/mute`,
    method: 'patch',
    data: params,
  });
}

export function unreadRoom({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/unread`,
    method: 'patch',
    data: params,
  });
}

export function readRoom({ roomId }) {
  return request({
    url: `/rooms/${roomId}/read`,
    method: 'patch',
  });
}

export function searchRooms(params) {
  return request({
    url: `/rooms/search`,
    method: 'get',
    params,
  });
}

export function forwardMessages({ roomId, targetRoomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/forward/${targetRoomId}`,
    method: 'post',
    data: params,
  });
}

export function getRoomMembers({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members`,
    method: 'get',
    params,
  });
}

export function searchRoomMembers({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members/search`,
    method: 'get',
    params,
  });
}

export function addRoomMembers({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members`,
    method: 'put',
    data: params,
  });
}

export function deleteRoomMembers({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members`,
    method: 'delete',
    data: params,
  });
}

export function changeRoomMembersRole({ roomId, userId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members/${userId}/role`,
    method: 'patch',
    data: params,
  });
}

export function getRoomFiles({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/files`,
    method: 'get',
    params,
  });
}

export function searchRoomFiles({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/files/search`,
    method: 'get',
    params,
  });
}

export function getRoomMedia({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/media`,
    method: 'get',
    params,
  });
}

export function searchRoomMedia({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/media/search`,
    method: 'get',
    params,
  });
}

export function getRoomLinks({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/links`,
    method: 'get',
    params,
  });
}

export function searchRoomLinks({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/links/search`,
    method: 'get',
    params,
  });
}

export function deleteRoomAttachment(roomId, { deleteForAll, ...params }) {
  return request({
    url: `/rooms/${roomId}/attachments`,
    method: 'delete',
    params: { deleteForAll },
    data: params,
  });
}

export function getSavedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/saved-messages`,
    method: 'get',
    params,
  });
}

export function searchSavedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/saved-messages/search`,
    method: 'get',
    params,
  });
}

export function addSavedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/saved-messages`,
    method: 'post',
    data: params,
  });
}

export function deleteSavedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/saved-messages`,
    method: 'delete',
    data: params,
  });
}

export function createRoomMessage({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages`,
    method: 'post',
    data: params,
  });
}

export function getRoomMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages`,
    method: 'get',
    params,
  });
}

export function getRoomMessagesV2({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/history`,
    method: 'get',
    params,
  });
}

export function searchRoomMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/search`,
    method: 'get',
    params,
  });
}

export function jumpRoomMessage({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}`,
    method: 'get',
    params,
  });
}

export function updateRoomMessage({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}`,
    method: 'put',
    data: params,
  });
}

export function deleteRoomMessages({ roomId, messageIds, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages`,
    method: 'delete',
    params,
    data: { messageIds },
  });
}

export function addReationInMessage({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}/reactions`,
    method: 'put',
    data: params,
  });
}

export function getReationsInMessage({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}/reactions`,
    method: 'get',
    params,
  });
}

export function deleteReationInMessage({ roomId, messageId }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}/reactions`,
    method: 'delete',
  });
}

export function getLinkData(params) {
  return request({
    url: `/chat-utils/url-metadata`,
    method: 'post',
    data: params,
  });
}

export function getRoomPinnedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/pinned-messages`,
    method: 'get',
    params,
  });
}

export function addRoomPinnedMessages({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/pinned-messages`,
    method: 'post',
    data: params,
  });
}

export function deleteRoomPinnedMessage({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/pinned-messages`,
    method: 'delete',
    data: params,
  });
}

export function pinRoom({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/pin`,
    method: 'patch',
    params,
  });
}

export function getMessageInfo({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}/views`,
    method: 'get',
    params,
  });
}

export function viewMessage({ roomId, messageId, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/${messageId}/views`,
    method: 'post',
    data: params,
  });
}

export function getUnreadMessages() {
  return request({
    url: `/profiles/unread-count`,
    method: 'get',
  });
}

export function clearRoomHistory({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/history`,
    method: 'delete',
    params,
  });
}

export function getFromDateMessages({ roomId, date, ...params }) {
  return request({
    url: `/rooms/${roomId}/messages/from/${date}`,
    method: 'get',
    params,
  });
}

export function getSearchHistory(params) {
  return request({
    url: `/chat-search-history`,
    method: 'get',
    params,
  });
}

export function createSearchHistory(id) {
  return request({
    url: `/chat-search-history/${id}`,
    method: 'put',
  });
}

export function deleteSearchHistory(id) {
  return request({
    url: `/chat-search-history/${id}`,
    method: 'delete',
  });
}

export function clearSearchHistory() {
  return request({
    url: `/chat-search-history`,
    method: 'delete',
  });
}

export function getRecentRooms(params) {
  return request({
    url: `/rooms/most-recent`,
    method: 'get',
    params,
  });
}

export function search(params) {
  return request({
    url: `/chat/global-search`,
    method: 'get',
    params,
  });
}

export function updatePreferences(params) {
  return request({
    url: `/profiles/preferences`,
    method: 'patch',
    data: params,
  });
}

export function getInviteLink({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members/invitation-link`,
    method: 'get',
    params,
  });
}

export function acceptInvite({ roomId, ...params }) {
  return request({
    url: `/rooms/${roomId}/members/accept-invitation`,
    method: 'patch',
    data: params,
  });
}
