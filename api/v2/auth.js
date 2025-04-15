import request from '~/utils/request';

export function login(data) {
  return request({
    url: `/auth/login`,
    method: 'post',
    data,
  });
}

export function signUpUser(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data,
  });
}

export function getUser() {
  return request({
    url: `/profiles/me`,
    method: 'get',
    params: null,
  });
}

export function usersConfirm(data) {
  return request({
    url: `/auth/verify-user`,
    method: 'post',
    data,
  });
}

export function forgotPassword(data) {
  return request({
    url: `/auth/forgot-password`,
    method: 'post',
    data,
  });
}

export function resetPassword(data) {
  return request({
    url: `/auth/reset-password`,
    method: 'put',
    data,
  });
}

export function resendCode(data) {
  return request({
    url: `/auth/resend-verification`,
    method: 'post',
    data,
  });
}

export function checkEmail(data) {
  return request({
    url: `/auth/user-existence`,
    method: 'post',
    data,
  });
}

export function logout(data) {
  return request({
    url: `/auth/logout`,
    method: 'post',
    data,
  });
}

export function loginWithGoogle(data) {
  return request({
    url: `/auth/google`,
    method: 'post',
    data,
  });
}

export function switchContext({ id }) {
  return request({
    url: `/auth/switch-context/${id}`,
    method: 'get',
  });
}

export function switchContextToUser() {
  return request({
    url: `/auth/switch-context`,
    method: 'delete',
  });
}

export function updateUser({ id, ...rest }) {
  return request({
    url: `/auth/users/${id}`,
    method: 'patch',
    data: rest,
  });
}

export function deleteUser() {
  return request({
    url: `/auth/users`,
    method: 'delete',
  });
}

export function updateEmail(data) {
  return request({
    url: `/auth/users/update-email`,
    method: 'post',
    data,
  });
}

export function createAPIKey(data) {
  return request({
    url: `/auth/api-tokens`,
    method: 'post',
    data,
  });
}

export function retrieveAPIKey() {
  return request({
    url: `/auth/api-tokens/getbytoken`,
    method: 'get',
  });
}

export function deleteAPIKey(id) {
  return request({
    url: `/auth/api-tokens/${id}`,
    method: 'delete',
  });
}

export function listAllToken(params) {
  return request({
    url: `/auth/api-tokens`,
    method: 'get',
    params,
  });
}

export function updateAPIKey({ id, ...rest }) {
  return request({
    url: `/auth/api-tokens/${id}`,
    method: 'patch',
    data: rest,
  });
}

export function changeEmail(data) {
  return request({
    url: '/auth/users/change-email',
    method: 'post',
    data,
  });
}

export function confirmEmail(data) {
  return request({
    url: '/auth/users/confirm-email',
    method: 'post',
    data,
  });
}

export function changePassword(data) {
  return request({
    url: '/auth/users/change-password',
    method: 'post',
    data,
  });
}
export function connectedAccounts() {
  return request({
    url: '/auth/connected-accounts',
    method: 'get',
  });
}

export function authConnectGoogle(data) {
  return request({
    url: '/auth/connect/google',
    method: 'post',
    data,
  });
}
export function authGoogleUnLink(data) {
  return request({
    url: '/auth/google/unlink',
    method: 'post',
    data,
  });
}
export function loginWithApple(data) {
  return request({
    url: '/auth/apple',
    method: 'post',
    data,
  });
}
export function authConnectApple(data) {
  return request({
    url: '/auth/connect/apple',
    method: 'post',
    data,
  });
}
export function authAppleUnLink(data) {
  return request({
    url: '/auth/apple/unlink',
    method: 'post',
    data,
  });
}
export function confirmPassword(data) {
  return request({
    url: '/auth/users/confirm-password',
    method: 'post',
    data,
  });
}

export function secondaryEmail(data) {
  return request({
    url: '/auth/users/secondary-email',
    method: 'post',
    data,
  });
}
export function verifySecondaryEmail(data) {
  return request({
    url: '/auth/users/verify-secondary-email',
    method: 'post',
    data,
  });
}

export function deleteSecondaryEmail(data) {
  return request({
    url: `/auth/users/secondary-email`,
    method: 'delete',
    data,
  });
}

export function secondaryEmailList() {
  return request({
    url: `/auth/users/secondary-emails`,
    method: 'get',
  });
}

export function allLoggedDevices(params) {
  return request({
    url: `/auth/list-all-devices`,
    method: 'get',
    params,
  });
}
export function authCannySSO(params) {
  return request({
    url: `/auth/canny/sso`,
    method: 'get',
    params,
  });
}
