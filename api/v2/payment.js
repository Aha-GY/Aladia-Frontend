import request from '~/utils/request';

export function paymentTransactions(data) {
  return request({
    url: '/payment/transactions/search',
    method: 'post',
    data,
  });
}

export function paymentTransactionDetail(id) {
  return request({
    url: `/payment/transactions/${id}`,
    method: 'get',
  });
}

export function paymentSubscriptions(data) {
  return request({
    url: '/payment/subscriptions/search',
    method: 'post',
    data,
  });
}

export function paymentSubscriptionsDetail(id) {
  return request({
    url: `/payment/subscriptions/${id}`,
    method: 'get',
  });
}

export function paymentPayouts(params) {
  return request({
    url: '/payment/payouts/search',
    method: 'get',
    params,
  });
}

export function paymentPayoutsDetail(id) {
  return request({
    url: `/payment/payouts/${id}`,
    method: 'get',
  });
}

export function paymentCreatePayout(data) {
  return request({
    url: `/payment/payouts`,
    method: 'post',
    data,
  });
}

export function paymentCustomers(data) {
  return request({
    url: '/payment/customers/connect/search',
    method: 'post',
    data,
  });
}

export function paymentTimeline(params) {
  return request({
    url: '/analytics/questions/payments/timeline',
    method: 'get',
    params,
  });
}

export function paymentLastIncome() {
  return request({
    url: '/analytics/questions/payments/last-income',
    method: 'get',
    params: {
      lastIncomePaymentsCount: 10,
    },
  });
}

// --- balance start (need isTeacher) ---
export function paymentBalance() {
  return request({
    url: '/payment/connect-accounts/balance',
    method: 'get',
  });
}

// --- balance end (need isTeacher) ---

export function paymentSpending(params) {
  return request({
    url: '/analytics/questions/payments/spending',
    method: 'get',
    params,
  });
}

export function paymentIncome(params) {
  return request({
    url: '/analytics/questions/payments/income',
    method: 'get',
    params,
  });
}

export function getCustomerSetupIntent() {
  return request({
    url: '/payment/customers/setup-intent',
    method: 'post',
  });
}

export function postToAddPaymentMethod(data) {
  return request({
    url: '/payment/customers/payment-methods',
    method: 'post',
    data,
  });
}

export function getStripePaymentMethods() {
  return request({
    url: '/payment/customers',
    method: 'get',
  });
}

export function deleteStripePaymentMethod(id) {
  return request({
    url: `/payment/customers/payment-methods/${id}`,
    method: 'delete',
  });
}

export function putSetDefaultPaymentMethod(data) {
  return request({
    url: `/payment/customers/payment-methods`,
    method: 'put',
    data,
  });
}

export function postStripeAccountSessions(data) {
  return request({
    url: '/payment/connect-accounts/account-sessions',
    method: 'post',
    data,
  });
}

export function getUpcomingBillings(params) {
  return request({
    url: '/payment/customers/upcoming-billings',
    method: 'get',
    params,
  });
}

export function getFuturePayments() {
  return request({
    url: '/payment/customers/future-payments',
    method: 'get',
  });
}

export function paymentGetBankList() {
  return request({
    url: '/payment/bank-accounts',
    method: 'get',
  });
}

export function paymentCreateBank(data) {
  return request({
    url: '/payment/bank-accounts',
    method: 'post',
    data,
  });
}

export function paymentUpdateBank(id, data) {
  return request({
    url: `payment/bank-accounts/${id}`,
    method: 'patch',
    data,
  });
}

export function paymentDeleteBank(id) {
  return request({
    url: `payment/bank-accounts/${id}`,
    method: 'delete',
  });
}

export function paymentSubscriptionsServices() {
  return request({
    url: '/payment/subscriptions/services',
    method: 'post',
  });
}

export function paymentCoursesSearch(params) {
  return request({
    url: '/payment/transactions/courses/search',
    method: 'get',
    params,
  });
}

export function paymentCustomersSearch(params) {
  return request({
    url: '/payment/transactions/customers/search',
    method: 'get',
    params,
  });
}

export function paymentSuppliersSearch(params) {
  return request({
    url: '/payment/transactions/suppliers/search',
    method: 'get',
    params,
  });
}

export function getProductById(id) {
  return request({
    url: `/payment/products/${id}`,
    method: 'get',
  });
}

export function postPaymentCheckoutSession(data) {
  return request({
    url: '/payment/checkout-sessions',
    method: 'post',
    data,
  });
}

export function getPaymentCheckoutSession(id) {
  return request({
    url: `/payment/checkout-sessions/${id}`,
    method: 'get',
  });
}
