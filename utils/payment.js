import { COURSE_TYPE } from '~/constant/course.ts';
import { FILTER_KEYS } from '~/constant/payment.js';

// 根据currency (例: 'usd') 获取对应的货币信息
export function getCountryItemByCurrency(currency, stripeCountries) {
  const upcaseCur = currency.toUpperCase();
  let targetItem;
  const items = stripeCountries.filter(
    (item) => item.currency_code === upcaseCur,
  );
  if (items.length > 1) {
    targetItem = items.find((i) => i?.country_flag_as_currency_flag);
  } else {
    targetItem = items[0];
  }
  if (!targetItem) {
    return {
      country_name: 'United States',
      alpha3: 'USA',
      currency_symbol: '$',
      currency_code: upcaseCur,
    };
  }
  return targetItem;
}

export function mapStatusCanceledToCompleted({ status }) {
  return status === 'canceled' ? 'completed' : status;
}
export function mapStatusForEscrow({ status }) {
  switch (status) {
    case 'scheduled':
      return 'pending';
    case 'transferred':
      return 'completed';
    default:
      return status; // return the original status (refunded)
  }
}
export function calculateSubscriptionTotalPaid({
  recurringTransactions,
  feeTransaction,
  successTextStatus,
}) {
  const transactionsArr = [feeTransaction, ...recurringTransactions];
  const totalNum = transactionsArr.reduce((acc, curr) => {
    if (curr?.status === successTextStatus) {
      return acc + curr.totalAmount;
    }
    return acc;
  }, 0);

  return totalNum;
}

export function calculateSubscriptionTotalReceived({
  recurringTransactions,
  feeTransaction,
  successTextStatus,
}) {
  const transactionsArr = [feeTransaction, ...recurringTransactions];
  let totalTransAmount = 0;
  let totalNet = 0;
  let totalFee = 0;
  let applicationFee = 0;
  let stripeFee = 0;
  const paymentMethods = [];

  transactionsArr.forEach((item) => {
    const { status, incomeDetail, paymentMethod } = item;
    if (status === successTextStatus && incomeDetail) {
      totalTransAmount += incomeDetail.totalAmount;
      totalNet += incomeDetail.netAmount;
      totalFee += incomeDetail.totalFee;
      applicationFee += incomeDetail.applicationFee;
      stripeFee += incomeDetail.stripeFee;
    }
    if (
      paymentMethod &&
      !paymentMethods.some((item) => item.id === paymentMethod.id)
    ) {
      paymentMethods.push(paymentMethod);
    }
  });

  return {
    totalTransAmount,
    totalNet,
    totalFee,
    applicationFee,
    stripeFee,
    paymentMethods,
  };
}

/**
 * @description:
 *  handle subscription item,
 *  loop all sub-fee and recurringTransactions (successful ones);
 *  calculate totalPaid(USD), totalReceived, fees, paymentMethods;
 * @param {*} param
 * @returns
 */
export function handleSubscriptionItem({ item, successTextStatus }) {
  const {
    totalTransAmount,
    totalNet,
    totalFee,
    applicationFee,
    stripeFee,
    paymentMethods,
  } = calculateSubscriptionTotalReceived({
    recurringTransactions: item.recurringTransactions,
    feeTransaction: item.feeTransaction,
    successTextStatus,
  });
  const totalPaid = calculateSubscriptionTotalPaid({
    recurringTransactions: item.recurringTransactions,
    feeTransaction: item.feeTransaction,
    successTextStatus,
  });
  return {
    ...item,
    totalPaid,
    paymentMethods,
    totalIncome: {
      totalTransAmount,
      totalNet,
      totalFee,
      applicationFee,
      stripeFee,
    },
  };
}

export function handleCustomerItem(item) {
  return {
    ...item,
    transactions: item.transactions?.data || [],
    subscriptions: item.subscriptions?.data || [],
    totalTransactions: item.transactions?.cursor.totalItems || 0,
    totalSubs: item.subscriptions?.cursor.totalItems || 0,
  };
}

export function handlePaymentFilterParams(filterParams) {
  const newParams = { ...filterParams };

  if (newParams[FILTER_KEYS.COURSE]) {
    if (newParams[FILTER_KEYS.COURSE].length) {
      newParams[FILTER_KEYS.COURSE] = newParams[FILTER_KEYS.COURSE].map(
        (item) => item.id,
      );
    } else {
      newParams[FILTER_KEYS.COURSE] = undefined;
    }
  }

  if (newParams[FILTER_KEYS.CUSTOMERS]) {
    if (newParams[FILTER_KEYS.CUSTOMERS].length) {
      newParams[FILTER_KEYS.CUSTOMERS] = newParams[FILTER_KEYS.CUSTOMERS].map(
        (item) => item.id,
      );
    } else {
      newParams[FILTER_KEYS.CUSTOMERS] = undefined;
    }
  }
  if (newParams[FILTER_KEYS.SELLERS]) {
    if (newParams[FILTER_KEYS.SELLERS].length) {
      newParams[FILTER_KEYS.SELLERS] = newParams[FILTER_KEYS.SELLERS].map(
        (item) => item.id,
      );
    } else {
      newParams[FILTER_KEYS.SELLERS] = undefined;
    }
  }
  return newParams;
}

/**
 * @description: handle course cycles
 * @param {*} course
 * @returns {
 *  courseAvailable: boolean, // course has more seat to buy or not
 *  cycles: [{ id, startDate, endDate, purchases, seatCount }...]
 * }
 */
export function handleCourseAvailableAndCycles(course) {
  const { cycles, seatCount, purchases, type } = course;
  // default could buy
  let courseAvailable = true;
  const cyclesArray = [];

  // on demand course
  if (type === COURSE_TYPE.ON_DEMAND) {
    const unlimited = !seatCount || seatCount === -1;

    if (!unlimited && seatCount <= purchases) {
      courseAvailable = false;
    }

    return {
      courseAvailable,
      cycles: [],
    };
  }

  // live course
  // one available cycle, the whole course is available

  courseAvailable = false;
  for (let i = 0; i < cycles.length; i += 1) {
    const cycle = cycles[i];
    const { purchases: cyclePurchases } = cycle;

    const unlimited = !seatCount || seatCount === -1;

    if (unlimited || cyclePurchases < seatCount) {
      courseAvailable = true;
    }

    cyclesArray.push({
      id: cycle.id,
      unlimited,
      startDate: cycle.dates.startDate,
      endDate: cycle.dates.endDate,
      purchases: cyclePurchases,
      seatCount,
      cycleDisabled: !unlimited && seatCount <= cyclePurchases,
    });
  }
  return {
    courseAvailable,
    cycles: cyclesArray,
  };
}
