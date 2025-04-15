import request from '~/utils/request';

export function createAccountLink(data) {
  return request({
    url: `/payment/connect-accounts/account-links`,
    method: 'post',
    data,
  });
}
