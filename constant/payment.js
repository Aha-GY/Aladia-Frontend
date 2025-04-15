export const PAYMENT_STATUS = {
  // transaction status
  SUCCESS: {
    text: 'successful',
    title: 'filter.status.successful',
    colorClass: 'payment-status-success',
    bgColorClass: 'payment-status-success-bg',
    iconClass: 'fa-solid fa-check',
  },
  COMPLETED: {
    text: 'completed',
    title: 'filter.status.completed',
    colorClass: 'payment-status-success',
    bgColorClass: 'payment-status-success-bg',
    iconClass: 'fa-solid fa-check',
  },
  REFUNDED: {
    text: 'refunded',
    title: 'filter.status.refunded',
    colorClass: 'payment-status-refunded',
    bgColorClass: 'payment-status-refunded-bg',
    iconClass: 'fa-light fa-reply-clock',
  },
  PENDING: {
    text: 'pending',
    title: 'filter.status.pending',
    colorClass: 'payment-status-pending',
    bgColorClass: 'payment-status-pending-bg',
    iconClass: 'fa-regular fa-clock',
  },
  FAILED: {
    text: 'failed',
    title: 'filter.status.failed',
    colorClass: 'payment-status-failed',
    bgColorClass: 'payment-status-failed-bg',
    iconClass: 'fa-solid fa-xmark',
  },
  // subscription status
  CANCELED: {
    text: 'canceled',
    title: 'filter.status.canceled',
    colorClass: 'payment-status-canceled',
    bgColorClass: 'payment-status-canceled-bg',
    iconClass: 'fa-solid fa-xmark',
  },
  PAST_DUE: {
    text: 'past_due',
    title: 'filter.status.pastDue',
    colorClass: 'payment-status-failed',
    bgColorClass: 'payment-status-failed-bg',
    iconClass: 'fa-light fa-calendar-circle-exclamation',
  },
  ACTIVE: {
    text: 'active',
    title: 'filter.status.active',
    colorClass: 'payment-status-active',
    bgColorClass: 'payment-status-active-bg',
    iconClass: 'fa-regular fa-play',
  },
  UNPAID: {
    text: 'unpaid',
    title: 'filter.status.unpaid',
    colorClass: 'payment-status-unpaid',
    bgColorClass: 'payment-status-unpaid-bg',
    iconClass: 'fa-regular fa-triangle-exclamation',
  },
  // others
  RETRY: {
    text: 'retry',
    title: 'filter.status.retry',
    colorClass: 'payment-status-failed',
    bgColorClass: 'payment-status-failed-bg',
    iconClass: 'fa-regular fa-rotate',
  },
  PAID: {
    text: 'paid',
    title: 'filter.status.paid',
    colorClass: 'payment-status-success',
    bgColorClass: 'payment-status-success-bg',
    iconClass: 'fa-solid fa-check',
  },
  IN_TRANSIT: {
    text: 'in_transit',
    title: 'filter.status.inTransit',
    colorClass: 'payment-status-in-transit',
    bgColorClass: 'payment-status-in-transit-bg',
    iconClass: 'fa-light fa-hourglass-half',
  },
};

// public query filter keys
export const QUERY_PARAMS = {
  FILTER_QUERY: {
    SPENDING: {
      key: 'spending',
      text: 'filter.query.spending',
    },
    INCOMING: {
      key: 'incoming',
      text: 'filter.query.incoming',
    },
    // Need to replace when do the request
    PAYOUTS: {
      key: 'payout',
      text: 'filter.query.payout',
    },
    CUSTOMERS: {
      key: 'customers',
      text: 'filter.query.customers',
    },
  },
  PURPOSE: {
    ONE_TIME_PAYMENT: 'one-time-payment',
    SUBSCRIPTION_FEE: 'subscription-fee',
    RECURRING_PAYMENT: 'recurring-payment',
  },
  // For different endpoints
  ENDPOINTS: {
    TRANSCATIONS: {
      key: 'transactions',
      text: 'filter.query.transactions',
    },
    SUBSCRIPTIONS: {
      key: 'subscriptions',
      text: 'filter.query.subscriptions',
    },
  },
};

// filter params in the filter button popup
export const FILTER_KEYS = {
  // transactions and public ones
  COURSE: 'courseIds',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  STATUS: 'statuses',
  TYPE: 'purpose',
  ID: 'transactionId',
  CUSTOMERS: 'customerIds',
  SELLERS: 'supplierIds',
  AMOUNT_EQUAL: 'amount',
  AMOUNT_MIN: 'minimumAmount',
  AMOUNT_MAX: 'maximumAmount',
  NET_AMOUNT_EQUAL: 'netAmount',
  NET_AMOUNT_MIN: 'minimumNetAmount',
  NET_AMOUNT_MAX: 'maximumNetAmount',
  QUANTITY_EQUAL: 'quantity',
  QUANTITY_MIN: 'minimumQuantity',
  QUANTITY_MAX: 'maximumQuantity',
  // subscriptions
  PAID_INSTALLMENT_EQUAL: 'paidInstallment',
  PAID_INSTALLMENT_MIN: 'minPaidInstallment',
  PAID_INSTALLMENT_MAX: 'maxPaidInstallment',
  PLANNED_INSTALLMENT_EQUAL: 'plannedInstallment',
  PLANNED_INSTALLMENT_MIN: 'minPlannedInstallment',
  PLANNED_INSTALLMENT_MAX: 'maxPlannedInstallment',
  PAID_AMOUNT_EQUAL: 'paidAmount',
  PAID_AMOUNT_MIN: 'minPaidAmount',
  PAID_AMOUNT_MAX: 'maxPaidAmount',
  TOTAL_AMOUNT_EQUAL: 'totalAmount',
  TOTAL_AMOUNT_MIN: 'minTotalAmount',
  TOTAL_AMOUNT_MAX: 'maxTotalAmount',
  NET_RECEIVED_EQUAL: 'netReceivedAmount',
  NET_RECEIVED_MIN: 'minNetReceivedAmount',
  NET_RECEIVED_MAX: 'maxNetReceivedAmount',
  FREQUENCIES: 'frequencies',
  NEXT_INSTALLMENT_START: 'nextInstallmentDateFrom',
  NEXT_INSTALLMENT_END: 'nextInstallmentDateTo',
  SUB_ID: 'subscriptionId',
  // payouts
  PAYOUT_ID: 'payoutId',
  BANK_ACCOUNT: 'bankAccountId',
  ARRIVAL_START_DATE: 'minimumArrivalDate',
  ARRIVAL_END_DATE: 'maximumArrivalDate',
  // customers
  CUSTOMER_SINCE_START: 'cureatedAtFrom',
  CUSTOMER_SINCE_END: 'cureatedAtTo',
  EMAIL: 'email',
  TOTAL_SPENDING_EQUAL: 'totalSpent',
  TOTAL_SPENDING_MIN: 'minTotalSpent',
  TOTAL_SPENDING_MAX: 'maxTotalSpent',
  TOTAL_TRANSACTIONS_EQUAL: 'totalTransactions',
  TOTAL_TRANSACTIONS_MIN: 'minTotalTransactions',
  TOTAL_TRANSACTIONS_MAX: 'maxTotalTransactions',
  TOTAL_SUBSCRIPTIONS_EQUAL: 'totalSubscriptions',
  TOTAL_SUBSCRIPTIONS_MIN: 'minTotalSubscriptions',
  TOTAL_SUBSCRIPTIONS_MAX: 'maxTotalSubscriptions',
  ACTIVE_SUBSCRIPTIONS_EQUAL: 'activeSubscriptions',
  ACTIVE_SUBSCRIPTIONS_MIN: 'minActiveSubscriptions',
  ACTIVE_SUBSCRIPTIONS_MAX: 'maxActiveSubscriptions',
};
// we have 6 different popups, filters and columns, this is the types
export const DATA_TYPES = {
  TRANS_INCOME: 'trans_income',
  TRANS_SPENDING: 'trans_spending',
  SUB_INCOME: 'sub_income',
  SUB_SPENDING: 'sub_spending',
  PAYOUT: 'payout',
  CUSTOMER: 'customer',
};
// Define sorted options for each data type
export const SORT_MAPPING = {
  OCCURED_ON: {
    i18nKey: 'payment.sort.occuredOn',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'createdAt',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
  },
  STARTED_ON: {
    i18nKey: 'payment.sort.startedOn',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'dates.startDate',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'dates.startDate',
      sortDirection: 'desc',
    },
  },
  ENDS_ON: {
    i18nKey: 'payment.sort.endsOn',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'dates.endDate',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'dates.endDate',
      sortDirection: 'desc',
    },
  },
  INITIATED_ON: {
    i18nKey: 'payment.sort.initiatedOn',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'createdAt',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
  },
  PRODUCT: {
    i18nKey: 'payment.sort.product',
    FROM_A_TO_Z: {
      i18nKey: 'payment.sort.fromAToZ',
      sortBy: 'name',
      sortDirection: 'asc',
    },
    FROM_Z_TO_A: {
      i18nKey: 'payment.sort.fromZToA',
      sortBy: 'name',
      sortDirection: 'desc',
    },
  },
  NAME: {
    i18nKey: 'payment.sort.name',
    FROM_A_TO_Z: {
      i18nKey: 'payment.sort.fromAToZ',
      sortBy: 'totalTrans',
      sortDirection: 'asc',
    },
    FROM_Z_TO_A: {
      i18nKey: 'payment.sort.fromZToA',
      sortBy: 'totalTrans',
      sortDirection: 'desc',
    },
  },
  QTY: {
    i18nKey: 'payment.sort.qty',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'licencesBought',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'licencesBought',
      sortDirection: 'asc',
    },
  },
  AMOUNT: {
    i18nKey: 'payment.sort.amount',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'totalAmount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'totalAmount',
      sortDirection: 'asc',
    },
  },
  NET_AMOUNT: {
    i18nKey: 'payment.sort.netAmount',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'incomeDetail.netAmount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'incomeDetail.netAmount',
      sortDirection: 'asc',
    },
  },
  NET_AMOUNT_RECEIVED: {
    i18nKey: 'payment.sort.netAmountReceived',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'totalPaidAmount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'totalPaidAmount',
      sortDirection: 'asc',
    },
  },
  TOTAL_SPENT: {
    i18nKey: 'payment.sort.totalSpent',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'totalAmountPaid',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'totalAmountPaid',
      sortDirection: 'asc',
    },
  },
  TOTAL_AMOUNT: {
    i18nKey: 'payment.sort.totalAmount',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'productId.totalAmount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'productId.totalAmount',
      sortDirection: 'asc',
    },
  },
  AMOUNT_PAID: {
    i18nKey: 'payment.sort.amountPaid',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'totalPaidAmount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'totalPaidAmount',
      sortDirection: 'asc',
    },
  },
  ESTIMATED_ARRIVAL: {
    i18nKey: 'payment.sort.estimatedArrival',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'arrivalDate',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'arrivalDate',
      sortDirection: 'desc',
    },
  },
  CUSTOMER_SINCE: {
    i18nKey: 'payment.sort.customerSince',
    ASC: {
      i18nKey: 'payment.sort.asc',
      sortBy: 'createdAt',
      sortDirection: 'asc',
    },
    DESC: {
      i18nKey: 'payment.sort.desc',
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
  },
  NEXT_INSTALLMENT: {
    i18nKey: 'payment.sort.nextInstallement',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'nextInstallmentDate',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'nextInstallmentDate',
      sortDirection: 'asc',
    },
  },
  INVOLVED_TRANSACTIONS: {
    i18nKey: 'payment.sort.involvedTransactions',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'transactionCount',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'transactionCount',
      sortDirection: 'asc',
    },
  },
  ENROLLED_SUBSCRIPTIONS: {
    i18nKey: 'payment.sort.enrolledSubscriptions',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'subscriptionCount',
      sortDirection: 'asc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'subscriptionCount',
      sortDirection: 'desc',
    },
  },
  ACTIVE_SUBSCRIPTIONS: {
    i18nKey: 'payment.sort.activeSubscriptions',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'activeSubscriptionCount',
      sortDirection: 'asc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'activeSubscriptionCount',
      sortDirection: 'desc',
    },
  },
  PLANNED_INSTALLMENT: {
    i18nKey: 'payment.sort.plannedInstallement',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'plannedInstallmentNumber',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'plannedInstallmentNumber',
      sortDirection: 'asc',
    },
  },
  PAID_INSTALLMENT: {
    i18nKey: 'payment.sort.paidInstallement',
    HIGH_TO_LOW: {
      i18nKey: 'payment.sort.highToLow',
      sortBy: 'paidInstallmentNumber',
      sortDirection: 'desc',
    },
    LOW_TO_HIGH: {
      i18nKey: 'payment.sort.lowToHigh',
      sortBy: 'paidInstallmentNumber',
      sortDirection: 'asc',
    },
  },
};
export const SORTED_OPTIONS = {
  [DATA_TYPES.TRANS_SPENDING]: [
    {
      text: SORT_MAPPING.OCCURED_ON.i18nKey,
      icon: 'fa fa-arrow-up',
      sortOptions: [
        SORT_MAPPING.OCCURED_ON.ASC.i18nKey,
        SORT_MAPPING.OCCURED_ON.DESC.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.QTY.i18nKey,
      icon: 'fa-regular fa-arrow-down-wide-short',
      sortOptions: [
        SORT_MAPPING.QTY.HIGH_TO_LOW.i18nKey,
        SORT_MAPPING.QTY.LOW_TO_HIGH.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.AMOUNT.i18nKey,
      icon: 'fa-regular fa-arrow-down-wide-short',
      sortOptions: [
        SORT_MAPPING.AMOUNT.HIGH_TO_LOW.i18nKey,
        SORT_MAPPING.AMOUNT.LOW_TO_HIGH.i18nKey,
      ],
    },
  ],
  [DATA_TYPES.TRANS_INCOME]: [
    {
      text: SORT_MAPPING.OCCURED_ON.i18nKey,
      icon: 'fa fa-arrow-up',
      sortOptions: [
        SORT_MAPPING.OCCURED_ON.ASC.i18nKey,
        SORT_MAPPING.OCCURED_ON.DESC.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.QTY.i18nKey,
      icon: 'fa-regular fa-arrow-down-wide-short',
      sortOptions: [
        SORT_MAPPING.QTY.HIGH_TO_LOW.i18nKey,
        SORT_MAPPING.QTY.LOW_TO_HIGH.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.NET_AMOUNT.i18nKey,
      icon: 'fa-regular fa-arrow-down-wide-short',
      sortOptions: [
        SORT_MAPPING.NET_AMOUNT.HIGH_TO_LOW.i18nKey,
        SORT_MAPPING.NET_AMOUNT.LOW_TO_HIGH.i18nKey,
      ],
    },
  ],
  [DATA_TYPES.SUB_SPENDING]: {
    general: [
      {
        text: SORT_MAPPING.STARTED_ON.i18nKey,
        icon: 'fa-regular fa-arrow-up',
        sortOptions: [
          SORT_MAPPING.STARTED_ON.ASC.i18nKey,
          SORT_MAPPING.STARTED_ON.DESC.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.ENDS_ON.i18nKey,
        icon: 'fa-regular fa-arrow-up',
        sortOptions: [
          SORT_MAPPING.ENDS_ON.ASC.i18nKey,
          SORT_MAPPING.ENDS_ON.DESC.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.QTY.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.QTY.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.QTY.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.AMOUNT_PAID.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.AMOUNT_PAID.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.AMOUNT_PAID.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.TOTAL_AMOUNT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.TOTAL_AMOUNT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.TOTAL_AMOUNT.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
    installments: [
      {
        text: SORT_MAPPING.PAID_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.PAID_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.PAID_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.PLANNED_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.PLANNED_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.PLANNED_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.NEXT_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.NEXT_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.NEXT_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
  },
  [DATA_TYPES.SUB_INCOME]: {
    general: [
      {
        text: SORT_MAPPING.STARTED_ON.i18nKey,
        icon: 'fa-regular fa-arrow-up',
        sortOptions: [
          SORT_MAPPING.STARTED_ON.ASC.i18nKey,
          SORT_MAPPING.STARTED_ON.DESC.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.ENDS_ON.i18nKey,
        icon: 'fa-regular fa-arrow-up',
        sortOptions: [
          SORT_MAPPING.ENDS_ON.ASC.i18nKey,
          SORT_MAPPING.ENDS_ON.DESC.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.QTY.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.QTY.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.QTY.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.TOTAL_AMOUNT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.TOTAL_AMOUNT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.TOTAL_AMOUNT.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
    installments: [
      {
        text: SORT_MAPPING.PAID_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.PAID_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.PAID_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.PLANNED_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.PLANNED_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.PLANNED_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.NEXT_INSTALLMENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.NEXT_INSTALLMENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.NEXT_INSTALLMENT.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
  },
  [DATA_TYPES.CUSTOMER]: {
    general: [
      {
        text: SORT_MAPPING.CUSTOMER_SINCE.i18nKey,
        icon: 'fa fa-arrow-up',
        sortOptions: [
          SORT_MAPPING.CUSTOMER_SINCE.ASC.i18nKey,
          SORT_MAPPING.CUSTOMER_SINCE.DESC.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.TOTAL_SPENT.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.TOTAL_SPENT.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.TOTAL_SPENT.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.INVOLVED_TRANSACTIONS.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.INVOLVED_TRANSACTIONS.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.INVOLVED_TRANSACTIONS.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
    subscriptions: [
      {
        text: SORT_MAPPING.ENROLLED_SUBSCRIPTIONS.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.ENROLLED_SUBSCRIPTIONS.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.ENROLLED_SUBSCRIPTIONS.LOW_TO_HIGH.i18nKey,
        ],
      },
      {
        text: SORT_MAPPING.ACTIVE_SUBSCRIPTIONS.i18nKey,
        icon: 'fa-regular fa-arrow-down-wide-short',
        sortOptions: [
          SORT_MAPPING.ACTIVE_SUBSCRIPTIONS.HIGH_TO_LOW.i18nKey,
          SORT_MAPPING.ACTIVE_SUBSCRIPTIONS.LOW_TO_HIGH.i18nKey,
        ],
      },
    ],
  },
  [DATA_TYPES.PAYOUT]: [
    {
      text: SORT_MAPPING.INITIATED_ON.i18nKey,
      icon: 'fa fa-arrow-up',
      sortOptions: [
        SORT_MAPPING.INITIATED_ON.ASC.i18nKey,
        SORT_MAPPING.INITIATED_ON.DESC.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.ESTIMATED_ARRIVAL.i18nKey,
      icon: 'fa fa-arrow-up',
      sortOptions: [
        SORT_MAPPING.ESTIMATED_ARRIVAL.ASC.i18nKey,
        SORT_MAPPING.ESTIMATED_ARRIVAL.DESC.i18nKey,
      ],
    },
    {
      text: SORT_MAPPING.AMOUNT.i18nKey,
      icon: 'fa-regular fa-arrow-down-wide-short',
      sortOptions: [
        SORT_MAPPING.AMOUNT.HIGH_TO_LOW.i18nKey,
        SORT_MAPPING.AMOUNT.LOW_TO_HIGH.i18nKey,
      ],
    },
  ],
};
// Define icons for sort options globally
export const SORT_OPTION_ICONS = {
  'payment.sort.asc': 'fa fa-arrow-up',
  'payment.sort.desc': 'fa fa-arrow-down',
  'payment.sort.fromAToZ': 'fa-regular fa-arrow-up-a-z',
  'payment.sort.fromZToA': 'fa-regular fa-arrow-up-z-a',
  'payment.sort.highToLow': 'fa-regular fa-arrow-down-wide-short',
  'payment.sort.lowToHigh': 'fa-regular fa-arrow-up-short-wide',
};
export const DIALOG_TITLE_TYPES = {
  ...DATA_TYPES,
  CUS_VIEW_ALL_TRANS: 'customer_view_all_trans',
  CUS_VIEW_ALL_SUBS: 'customer_view_all_subs',
  PAYOUT_VIEW_ALL_TRANS: 'payout_view_all_trans',
};

export const PAYMENT_MODEL = {
  // Single payment
  ONE_TIME: 'one-time',
  RECURRING: 'recurring',
  FREE: 'free',
};

export const STRIPE_APPEARANCE = {
  theme: 'night',
  labels: 'floating',
  variables: {
    colorBackground: '#060606',
    colorPrimary: '#F0CA41',
    colorDanger: '#E74D3C',
    spacingUnit: '2px',
    borderRadius: '5px',
    fontSizeBase: '14px',
  },
  rules: {
    '.Input': {
      outline: 'none',
      border: 'none',
      borderRadius: '0',
    },
    '.Input:focus': {
      outline: 'none',
      border: 'none',
      borderBottom: '1px solid #F0CA41',
      boxShadow: 'none',
    },
    '.Input--invalid': {
      outline: 'none',
      border: 'none',
      borderBottom: '1px solid #E74D3C',
      boxShadow: 'none',
    },
    '.Tab:focus': {
      boxShadow: 'none',
    },
    '.Tab--selected': {
      boxShadow: 'none',
    },
  },
};

// todo: add more
/**
 * name: display name,
 * iconClass: font-awesome icon class - used in profile setting PaymentMethodList
 * iconSvg: svg icon - used in PaymentCarouselList
 * cardClass: card class - used in PaymentCarouselList
 * cardBgClass: card background class - used in PaymentCarouselList
 */
export const STRIPE_CARD_TYPES = {
  unionpay: {
    name: 'UnionPay',
    iconClass: 'fa-regular fa-credit-card',
  },
  visa: {
    name: 'Visa',
    iconClass: 'fa-brands fa-cc-visa',
    iconSvg: `<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="76" height="44" viewBox="0 0 750 471" enable-background="new 0 0 750 471" xml:space="preserve"><title>Slice 1</title><desc>Created with Sketch.</desc><g id="visa" sketch:type="MSLayerGroup"><path id="Shape" sketch:type="MSShapeGroup" fill="#0E4595" d="M278.198,334.228l33.36-195.763h53.358l-33.384,195.763H278.198L278.198,334.228z"/><path id="path13" sketch:type="MSShapeGroup" fill="#0E4595" d="M524.307,142.687c-10.57-3.966-27.135-8.222-47.822-8.222c-52.725,0-89.863,26.551-90.18,64.604c-0.297,28.129,26.514,43.821,46.754,53.185c20.77,9.597,27.752,15.716,27.652,24.283c-0.133,13.123-16.586,19.116-31.924,19.116c-21.355,0-32.701-2.967-50.225-10.274l-6.877-3.112l-7.488,43.823c12.463,5.466,35.508,10.199,59.438,10.445c56.09,0,92.502-26.248,92.916-66.884c0.199-22.27-14.016-39.216-44.801-53.188c-18.65-9.056-30.072-15.099-29.951-24.269c0-8.137,9.668-16.838,30.559-16.838c17.447-0.271,30.088,3.534,39.936,7.5l4.781,2.259L524.307,142.687"/><path id="Path" sketch:type="MSShapeGroup" fill="#0E4595" d="M661.615,138.464h-41.23c-12.773,0-22.332,3.486-27.941,16.234l-79.244,179.402h56.031c0,0,9.16-24.121,11.232-29.418c6.123,0,60.555,0.084,68.336,0.084c1.596,6.854,6.492,29.334,6.492,29.334h49.512L661.615,138.464L661.615,138.464z M596.198,264.872c4.414-11.279,21.26-54.724,21.26-54.724c-0.314,0.521,4.381-11.334,7.074-18.684l3.607,16.878c0,0,10.217,46.729,12.352,56.527h-44.293V264.872L596.198,264.872z"/><path id="path16" sketch:type="MSShapeGroup" fill="#0E4595" d="M232.903,138.464L180.664,271.96l-5.565-27.129c-9.726-31.274-40.025-65.157-73.898-82.12l47.767,171.204l56.455-0.064l84.004-195.386L232.903,138.464"/><path id="path18" sketch:type="MSShapeGroup" fill="#F2AE14" d="M131.92,138.464H45.879l-0.682,4.073c66.939,16.204,111.232,55.363,129.618,102.415l-18.709-89.96C152.877,142.596,143.509,138.896,131.92,138.464"/></g></svg>`,
    cardClass: 'from-[#0c84d3] to-[#3b0e5c]',
    bgClass: 'from-[#001137] to-[#000b20]',
  },
  mastercard: {
    name: 'MasterCard',
    iconClass: 'fa-brands fa-cc-mastercard',
    iconSvg: `<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="76" height="44" viewBox="0 0 482.51 374"> <title>mastercard</title> <g> <path d="M220.13,421.67V396.82c0-9.53-5.8-15.74-15.32-15.74-5,0-10.35,1.66-14.08,7-2.9-4.56-7-7-13.25-7a14.07,14.07,0,0,0-12,5.8v-5h-7.87v39.76h7.87V398.89c0-7,4.14-10.35,9.94-10.35s9.11,3.73,9.11,10.35v22.78h7.87V398.89c0-7,4.14-10.35,9.94-10.35s9.11,3.73,9.11,10.35v22.78Zm129.22-39.35h-14.5v-12H327v12h-8.28v7H327V408c0,9.11,3.31,14.5,13.25,14.5A23.17,23.17,0,0,0,351,419.6l-2.49-7a13.63,13.63,0,0,1-7.46,2.07c-4.14,0-6.21-2.49-6.21-6.63V389h14.5v-6.63Zm73.72-1.24a12.39,12.39,0,0,0-10.77,5.8v-5h-7.87v39.76h7.87V399.31c0-6.63,3.31-10.77,8.7-10.77a24.24,24.24,0,0,1,5.38.83l2.49-7.46a28,28,0,0,0-5.8-.83Zm-111.41,4.14c-4.14-2.9-9.94-4.14-16.15-4.14-9.94,0-16.15,4.56-16.15,12.43,0,6.63,4.56,10.35,13.25,11.6l4.14.41c4.56.83,7.46,2.49,7.46,4.56,0,2.9-3.31,5-9.53,5a21.84,21.84,0,0,1-13.25-4.14l-4.14,6.21c5.8,4.14,12.84,5,17,5,11.6,0,17.81-5.38,17.81-12.84,0-7-5-10.35-13.67-11.6l-4.14-.41c-3.73-.41-7-1.66-7-4.14,0-2.9,3.31-5,7.87-5,5,0,9.94,2.07,12.43,3.31Zm120.11,16.57c0,12,7.87,20.71,20.71,20.71,5.8,0,9.94-1.24,14.08-4.56l-4.14-6.21a16.74,16.74,0,0,1-10.35,3.73c-7,0-12.43-5.38-12.43-13.25S445,389,452.07,389a16.74,16.74,0,0,1,10.35,3.73l4.14-6.21c-4.14-3.31-8.28-4.56-14.08-4.56-12.43-.83-20.71,7.87-20.71,19.88h0Zm-55.5-20.71c-11.6,0-19.47,8.28-19.47,20.71s8.28,20.71,20.29,20.71a25.33,25.33,0,0,0,16.15-5.38l-4.14-5.8a19.79,19.79,0,0,1-11.6,4.14c-5.38,0-11.18-3.31-12-10.35h29.41v-3.31c0-12.43-7.46-20.71-18.64-20.71h0Zm-.41,7.46c5.8,0,9.94,3.73,10.35,9.94H364.68c1.24-5.8,5-9.94,11.18-9.94ZM268.59,401.79V381.91h-7.87v5c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25-7.87.41-12.43-5.8-12.43-13.25Zm306.08-20.71a12.39,12.39,0,0,0-10.77,5.8v-5h-7.87v39.76H532V399.31c0-6.63,3.31-10.77,8.7-10.77a24.24,24.24,0,0,1,5.38.83l2.49-7.46a28,28,0,0,0-5.8-.83Zm-30.65,20.71V381.91h-7.87v5c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25-7.87.41-12.43-5.8-12.43-13.25Zm111.83,0V366.17h-7.87v20.71c-2.9-3.73-7-5.8-12.84-5.8-11.18,0-19.47,8.7-19.47,20.71s8.28,20.71,19.47,20.71c5.8,0,9.94-2.07,12.84-5.8v5h7.87V401.79Zm-31.89,0c0-7.46,4.56-13.25,12.43-13.25,7.46,0,12,5.8,12,13.25,0,7.87-5,13.25-12,13.25C564.73,415.46,560.17,409.25,560.17,401.79Z" transform="translate(-132.74 -48.5)"/> <g> <rect x="169.81" y="31.89" width="143.72" height="234.42" fill="#ff5f00"/> <path d="M317.05,197.6A149.5,149.5,0,0,1,373.79,80.39a149.1,149.1,0,1,0,0,234.42A149.5,149.5,0,0,1,317.05,197.6Z" transform="translate(-132.74 -48.5)" fill="#eb001b"/> <path d="M615.26,197.6a148.95,148.95,0,0,1-241,117.21,149.43,149.43,0,0,0,0-234.42,148.95,148.95,0,0,1,241,117.21Z" transform="translate(-132.74 -48.5)" fill="#f79e1b"/> </g> </g></svg>`,
    cardClass: 'from-[#cf9420] to-[#c8465e]',
    bgClass: 'from-[#cf485e] to-[#983849]',
  },
  jbc: {
    name: 'JCB',
    iconClass: 'fa-brands fa-cc-jcb',
  },
  amex: {
    name: 'Amex',
    iconClass: 'fa-brands fa-cc-amex',
    iconSvg: `<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="76" height="44" viewBox="0 0 750 471" enable-background="new 0 0 752 471" xml:space="preserve"><title>Slice 1</title><desc>Created with Sketch.</desc><g><g><path fill="#2557D6" d="M554.594,130.608l-14.521,35.039h29.121L554.594,130.608z M387.03,152.321c2.738-1.422,4.349-4.515,4.349-8.356c0-3.764-1.693-6.49-4.431-7.771c-2.492-1.42-6.328-1.584-10.006-1.584h-25.978v19.523h25.63C380.7,154.134,384.131,154.074,387.03,152.321z M54.142,130.608l-14.357,35.039h28.8L54.142,130.608z M722.565,355.08h-40.742v-18.852h40.578c4.023,0,6.84-0.525,8.537-2.177c1.471-1.358,2.494-3.336,2.494-5.733c0-2.562-1.023-4.596-2.578-5.813c-1.529-1.342-3.76-1.953-7.434-1.953c-19.81-0.67-44.523,0.609-44.523-27.211c0-12.75,8.131-26.172,30.27-26.172h42.025v-17.492h-39.045c-11.783,0-20.344,2.81-26.406,7.181v-7.181h-57.752c-9.233,0-20.074,2.279-25.201,7.181v-7.181H499.655v7.181c-8.207-5.898-22.057-7.181-28.447-7.181H403.18v7.181c-6.492-6.262-20.935-7.181-29.734-7.181h-76.134l-17.42,18.775l-16.318-18.775H149.847v122.675h111.586l17.95-19.076l16.91,19.076l68.78,0.059v-28.859h6.764c9.125,0.145,19.889-0.223,29.387-4.311v33.107h56.731v-31.976h2.736c3.492,0,3.838,0.146,3.838,3.621v28.348h172.344c10.941,0,22.38-2.786,28.712-7.853v7.853h54.668c11.375,0,22.485-1.588,30.938-5.653v-22.853C746.069,351.297,736.079,355.08,722.565,355.08z M372.734,326.113h-26.325v29.488h-41.006L279.425,326.5l-26.997,29.102h-83.569v-87.914h84.855l25.955,28.818l26.835-28.818h67.414c16.743,0,35.555,4.617,35.555,28.963C409.473,321.072,391.176,326.113,372.734,326.113z M499.323,322.127c2.98,4.291,3.41,8.297,3.496,16.047v17.428h-21.182v-10.998c0-5.289,0.512-13.121-3.41-17.209c-3.08-3.149-7.781-3.901-15.48-3.901h-22.545v32.108h-21.198v-87.914h48.706c10.685,0,18.462,0.472,25.386,4.148c6.658,4.006,10.848,9.494,10.848,19.523c-0.002,14.031-9.399,21.19-14.953,23.389C493.684,316.473,497.522,319.566,499.323,322.127z M586.473,285.869h-49.404v15.982h48.197v17.938h-48.197v17.492l49.404,0.078v18.242h-70.414v-87.914h70.414V285.869z M640.686,355.6h-41.09v-18.852h40.926c4.002,0,6.84-0.527,8.619-2.178c1.449-1.359,2.492-3.336,2.492-5.73c0-2.564-1.129-4.598-2.574-5.818c-1.615-1.34-3.842-1.948-7.514-1.948c-19.73-0.673-44.439,0.606-44.439-27.212c0-12.752,8.047-26.174,30.164-26.174h42.297v18.709h-38.703c-3.836,0-6.33,0.146-8.451,1.592c-2.313,1.423-3.17,3.535-3.17,6.322c0,3.316,1.963,5.574,4.615,6.549c2.228,0.771,4.617,0.996,8.211,0.996l11.359,0.308c11.449,0.274,19.313,2.25,24.092,7.069c4.105,4.232,6.311,9.578,6.311,18.625C673.829,346.771,661.963,355.6,640.686,355.6z M751.192,343.838L751.192,343.838L751.192,343.838L751.192,343.838z M477.061,287.287c-2.549-1.508-6.311-1.588-10.066-1.588h-25.979v19.744h25.631c4.104,0,7.594-0.144,10.414-1.812c2.734-1.646,4.371-4.678,4.371-8.438C481.432,291.434,479.795,288.711,477.061,287.287z M712.784,285.697c-3.838,0-6.389,0.145-8.537,1.588c-2.227,1.426-3.081,3.537-3.081,6.326c0,3.315,1.879,5.572,4.612,6.549c2.228,0.771,4.615,0.996,8.129,0.996l11.437,0.303c11.537,0.285,19.242,2.262,23.938,7.08c0.855,0.668,1.369,1.42,1.957,2.174v-25.014h-38.453L712.784,285.697L712.784,285.697z M373.47,285.697h-27.509v22.391h27.265c8.105,0,13.146-4.006,13.149-11.611C386.372,288.789,381.086,285.697,373.47,285.697z M189.872,285.697v15.984h46.315v17.938h-46.315v17.49h51.87l24.1-25.791l-23.076-25.621H189.872L189.872,285.697z M325.321,347.176v-70.482l-32.391,34.673L325.321,347.176z M191.649,206.025v15.148h176.263l-0.082-32.046h3.411c2.39,0.083,3.084,0.302,3.084,4.229v27.818h91.164v-7.461c7.353,3.924,18.789,7.461,33.838,7.461h38.353l8.209-19.522h18.197l8.026,19.522h73.906V202.63l11.189,18.543h59.227V98.59h-58.611v14.477l-8.207-14.477h-60.143v14.477l-7.537-14.477h-81.24c-13.6,0-25.551,1.89-35.207,7.158V98.59h-56.063v7.158c-6.146-5.43-14.519-7.158-23.826-7.158H180.784l-13.742,31.662L152.928,98.59H88.417v14.477L81.329,98.59H26.312L0.763,156.874v46.621l37.779-87.894h31.346l35.88,83.217v-83.217h34.435l27.61,59.625l25.365-59.625h35.126v87.894h-21.625l-0.079-68.837l-30.593,68.837h-18.524l-30.671-68.898v68.898H83.899l-8.106-19.605H31.865l-8.19,19.605H0.762v17.682h36.049l8.128-19.523h18.198l8.106,19.523h70.925V206.25l6.33,14.989h36.819L191.649,206.025z M469.401,125.849c6.818-7.015,17.5-10.25,32.039-10.25h20.424v18.833h-19.996c-7.696,0-12.047,1.14-16.233,5.208c-3.599,3.7-6.066,10.696-6.066,19.908c0,9.417,1.881,16.206,5.801,20.641c3.248,3.478,9.152,4.533,14.705,4.533h9.478l29.733-69.12h31.611l35.719,83.134v-83.133h32.123l37.086,61.213v-61.213h21.611v87.891h-29.898l-39.989-65.968v65.968h-42.968l-8.209-19.605h-43.827l-7.966,19.605h-24.688c-10.254,0-23.238-2.258-30.59-9.722c-7.416-7.462-11.271-17.571-11.271-33.553C458.026,147.182,460.329,135.266,469.401,125.849z M426.006,115.6h21.526v87.894h-21.526V115.6z M328.951,115.6h48.525c10.779,0,18.727,0.285,25.547,4.21c6.674,3.926,10.676,9.658,10.676,19.46c0,14.015-9.393,21.254-14.864,23.429c4.614,1.75,8.559,4.841,10.438,7.401c2.979,4.372,3.492,8.277,3.492,16.126v17.267h-21.279l-0.08-11.084c0-5.29,0.508-12.896-3.33-17.122c-3.082-3.09-7.782-3.763-15.379-3.763H350.05v31.97h-21.098L328.951,115.6L328.951,115.6z M243.902,115.6h70.479v18.303h-49.379v15.843h48.193v18.017h-48.193v17.553h49.379v18.177h-70.479V115.6L243.902,115.6z"/></g></g></svg>`,
    cardClass: 'from-[#18c4c8] to-[#273b7f]',
    bgClass: 'from-[#1c6d88] to-[#10475a]',
  },
  diners: {
    name: 'Diners',
    iconClass: 'fa-brands fa-cc-diners-club',
    iconSvg: `<svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="76" height="44" viewBox="0 0 750 471" enable-background="new 0 0 750 471" xml:space="preserve"><title>diners</title><desc>Created with Sketch.</desc><g id="diners" sketch:type="MSLayerGroup"><path id="Shape-path" sketch:type="MSShapeGroup" fill="#0079BE" d="M584.934,236.947c0-99.416-82.98-168.133-173.896-168.1h-78.241c-92.003-0.033-167.73,68.705-167.73,168.1c0,90.931,75.729,165.641,167.73,165.203h78.241C501.951,402.587,584.934,327.857,584.934,236.947L584.934,236.947z"/><path id="Shape-path_1_" sketch:type="MSShapeGroup" fill="#FFFFFF" d="M333.281,82.932c-84.069,0.026-152.193,68.308-152.215,152.58c0.021,84.258,68.145,152.532,152.215,152.559c84.088-0.026,152.229-68.301,152.239-152.559C485.508,151.238,417.369,82.958,333.281,82.932L333.281,82.932z"/><path id="Path" sketch:type="MSShapeGroup" fill="#0079BE" d="M237.066,235.098c0.08-41.18,25.747-76.296,61.94-90.25v180.479C262.813,311.381,237.145,276.283,237.066,235.098z M368.066,325.373V144.848c36.208,13.921,61.915,49.057,61.981,90.256C429.981,276.316,404.274,311.426,368.066,325.373z"/></g></svg>`,
    cardClass: 'from-[#0a2041] to-[#496b87]',
    bgClass: 'from-[#253f5d] to-[#162636]',
  },
  discover: {
    name: 'Diners',
    iconClass: 'fa-brands fa-cc-discover',
  },
  default: {
    name: 'Unknown Card',
    iconClass: 'fa-regular fa-credit-card',
  },
};

export const PAYMENT_HISTORY_TABLE_COLUMNS = {
  CHECKBOX: {
    width: '45',
  },
  PRODUCT: {
    width: '260',
    headerName: 'filter.payment.history.product',
    dataKey: 'course',
  },
  AMOUNT: {
    width: '180',
    headerName: 'category.amount.label',
    dataKey: 'totalAmount',
  },
  QUANTITY: {
    width: '80',
    // isMinWidth: true,
    headerName: 'category.qty',
    dataKey: 'licencesBought',
  },
  PAYMENT_METHOD: {
    width: '160',
    // isMinWidth: true,
    headerName: 'payment.title',
  },
  TYPE: {
    width: '140',
    headerName: 'space.columns.elements.type',
    dataKey: 'purpose',
  },
  CUSTOMER: {
    width: '150',
    headerName: 'category.role.customer',
    dataKey: 'payer',
  },
  SELLER: {
    width: '150',
    headerName: 'category.role.seller',
    dataKey: 'recipient',
  },
  STATUS: {
    width: '120',
    headerName: 'category.transaction.status',
    dataKey: 'status',
  },
  OCCURRED_ON: {
    width: '160',
    headerName: 'base.occur.date',
    dataKey: 'createdAt',
  },
  TRANSACTION_ID: {
    width: '290',
    isMinWidth: true,
    headerName: 'filter.payment.history.transactionId',
    dataKey: 'id',
  },
  DOWNLOAD: {
    width: '50',
    dataKey: 'invoiceUrl',
  },
  // subscription new fields
  PAID_INSTALLMENT: {
    width: '150',
    headerName: 'filter.payment.history.installments.paid',
    dataKey: 'currentInstallment',
  },
  PLANNED_INSTALLMENT: {
    width: '180',
    headerName: 'filter.payment.history.installments.planned',
  },
  AMOUNT_PAID: {
    width: '180',
    headerName: 'filter.payment.history.amount',
  },
  TOTOAL_PAID: {
    width: '120',
    headerName: 'filter.payment.history.total',
  },
  NEXT_INSTALLMENT: {
    width: '160',
    headerName: 'filter.payment.history.installments.next',
  },
  FREQUENCY: {
    width: '120',
    headerName: 'course.duration.frequency',
  },
  STARTED_ON: {
    width: '160',
    headerName: 'filter.payment.history.startedOn',
  },
  ENDS_ON: {
    width: '160',
    headerName: 'filter.payment.history.endOn',
  },
  // payout new fields
  BANK: {
    width: '260',
    headerName: 'filter.payment.history.bank',
  },
  // customers new fields
  CUSTOMER_NAME: {
    width: '260',
    headerName: 'filter.payment.history.profile',
  },
};

export const AMOUNT_FILTER_OPTIONS = {
  equal: {
    label: 'Is Equal To',
    value: 'equal',
  },
  greater: {
    label: 'Is Greater Than',
    value: 'greater',
  },
  less: {
    label: 'Is Less Than',
    value: 'less',
  },
  between: {
    label: 'Is Between',
    value: 'between',
  },
};
export const CHECKOUT_NOTIFICATION = {
  EVENT_NAME: 'course-member-added',
  SUCCESS_TEXT: 'succeed',
  TIMEOUT_TEXT: 'timeout',
};

export const CHECKOUT_FROM_FLAGS = {
  // todo more
  MARKET: 'market',
  COURSE_DETAIL: 'course-detail',
  IAM_MANAGE_LICENSES_UPDATE_COURSE: 'iam-manage-licenses-update-course',
};
