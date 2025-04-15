export default {
  error: {
    payment: {
      add: 'Add Payment method',
      manage: 'Manage Payment Method',
      view: 'View Failed Transaction',
    },
    code: {
      permission: 'Insufficient permissions',
    },
    STORAGE_FREE_TIER_FINISHED: {
      label: 'Your free storage limit has been reached',
      title: 'Consumed {slotO} {amount}{slotC} of {amount} free Gb',
      description:
        'To continue using storage services, please add a default payment method',
    },
    STREAMING_FREE_TIER_FINISHED: {
      label: 'Your free streaming limit has been reached',
      title: 'Consumed  {slotO} {amount}{slotC} of {amount} free Min',
      description:
        'To continue using streaming services, please add default payment method',
    },
    AI_FREE_TIER_FINISHED: {
      label: 'Your free AI usage limit has been reached',
      title: 'Consumed  {slotO} {amount}{slotC} of {total} free Token',
      description:
        'To continue using AI services, please add a default payment method',
    },
    USER_HAS_FAILED_PAYMENTS: {
      label: 'Account Blocked',
      title: 'Your account had been blocked due to failed payments',
      description:
        'Please add a valid card or ensure sufficient funds on your current card to continue using our services',
    },
  },
};
