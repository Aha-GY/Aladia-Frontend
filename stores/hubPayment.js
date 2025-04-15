import {
  paymentTransactions,
  paymentSubscriptions,
  paymentTransactionDetail,
  paymentSubscriptionsDetail,
  paymentPayoutsDetail,
  paymentPayouts,
  paymentCustomers,
  getFuturePayments,
  paymentTimeline,
  paymentLastIncome,
  paymentSpending,
  paymentIncome,
  paymentBalance,
  paymentCreatePayout,
  paymentSuppliersSearch,
  paymentCustomersSearch,
} from '~/api/v2/payment';
import {
  QUERY_PARAMS,
  PAYMENT_STATUS,
  DATA_TYPES,
  SORT_MAPPING,
} from '~/constant/payment';
import { filterNullAndUndefinedValues } from '~/utils';
import {
  handleSubscriptionItem,
  handlePaymentFilterParams,
  handleCustomerItem,
} from '~/utils/payment';

export const useHubPaymentStore = defineStore('hubPayment', {
  state: () => ({
    // ----- table相关 -----
    // table中选中的rowId, 没有API支持
    usersSelect: [],
    // table 数据loading
    loading: false,
    currentPage: 1,
    v2PaymentTransactions: [],
    // 分页用的, API会返回cursor
    v2PaymentTransactionsCursor: {
      next: null,
      prev: null,
      totalItems: 0,
    },
    // sort state
    sortState: {
      selectedOption: null,
      sortOrder: {}, // Tracks the sort order for each option
    },
    // public filter
    v2PaymentTransactionsFilterQuery: {
      filterQuery: QUERY_PARAMS.FILTER_QUERY.SPENDING.key,
      endpoints: QUERY_PARAMS.ENDPOINTS.TRANSCATIONS.key,
      limit: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc',
    },
    // dialog
    // [{ dataType: DATA_TYPES.*, details: items}]
    dialogLoading: false,
    dialogNavHistory: [],

    // ----- filter相关 -----
    sidebarFilters: {},
    sidebarFilterLoading: false,
    sidebarFilterResCount: 0,
    // ----- chart相关 -----
    // 控制图表切换
    index: 0,
    // 控制图表展开
    open: true,
    analyticsQuery: {
      startDate: null,
      endDate: null,
    },
    chartLoading: false,
    startDate: null,
    endDate: null,
    timeLineDatas: [],
    spendingDatas: null,
    futurePayments: [],
    lastIncomes: [],
    incomeDatas: null,
    balanceDatas: null,
    payoutSchedule: null,
  }),
  getters: {
    dataType() {
      const { PAYOUTS, CUSTOMERS } = QUERY_PARAMS.FILTER_QUERY;
      const { SUBSCRIPTIONS } = QUERY_PARAMS.ENDPOINTS;
      const { filterQuery, endpoints } = this.v2PaymentTransactionsFilterQuery;

      if (filterQuery === PAYOUTS.key) {
        return DATA_TYPES.PAYOUT;
      }
      if (filterQuery === CUSTOMERS.key) {
        return DATA_TYPES.CUSTOMER;
      }
      if (endpoints === SUBSCRIPTIONS.key) {
        if (filterQuery === QUERY_PARAMS.FILTER_QUERY.INCOMING.key) {
          return DATA_TYPES.SUB_INCOME;
        }
        return DATA_TYPES.SUB_SPENDING;
      }

      if (filterQuery === QUERY_PARAMS.FILTER_QUERY.INCOMING.key) {
        return DATA_TYPES.TRANS_INCOME;
      }
      return DATA_TYPES.TRANS_SPENDING;
    },
  },
  actions: {
    async getPaymentTransactions(params) {
      try {
        if (this.loading) {
          return;
        }
        this.v2PaymentTransactions = [];
        this.usersSelect = [];

        let queryParams = filterNullAndUndefinedValues({
          ...this.v2PaymentTransactionsFilterQuery,
          ...handlePaymentFilterParams(this.sidebarFilters),
        });
        if (params) {
          queryParams = {
            ...queryParams,
            ...params,
          };
        }
        this.loading = true;
        let data;
        // payout and customer has higher priority
        if (this.dataType === DATA_TYPES.PAYOUT) {
          delete queryParams.filterQuery;
          delete queryParams.endpoints;
          data = await paymentPayouts(queryParams);
          this.v2PaymentTransactions = data.data;
        } else if (this.dataType === DATA_TYPES.CUSTOMER) {
          delete queryParams.endpoints;
          delete queryParams.filterQuery;
          data = await paymentCustomers(queryParams);
          this.v2PaymentTransactions = data.data.map((item) =>
            handleCustomerItem(item),
          );
        } else if (
          this.dataType === DATA_TYPES.SUB_INCOME ||
          this.dataType === DATA_TYPES.SUB_SPENDING
        ) {
          delete queryParams.endpoints;
          data = await paymentSubscriptions(queryParams);
          // todo remove the filter?
          this.v2PaymentTransactions = data.data
            .filter((item) => item.course)
            .map((item) =>
              handleSubscriptionItem({
                item,
                successTextStatus: PAYMENT_STATUS.SUCCESS.text,
              }),
            );
        } else {
          delete queryParams.endpoints;
          data = await paymentTransactions(queryParams);
          this.v2PaymentTransactions = data.data;
        }

        // this.v2PaymentTransactions = data.data;
        this.v2PaymentTransactionsCursor = data.cursor;
        this.loading = false;
        return data;
      } catch (err) {
        console.error('err', err);
        return [];
      } finally {
        this.loading = false;
      }
    },
    // Sort By for the payment table
    async updateSort(sortCategory, sortOption) {
      try {
        // Map i18nKey to SORT_MAPPING keys
        const categoryKey = Object.keys(SORT_MAPPING).find(
          (key) => SORT_MAPPING[key].i18nKey === sortCategory,
        );
        const optionKey = Object.keys(SORT_MAPPING[categoryKey] || {}).find(
          (key) => SORT_MAPPING[categoryKey]?.[key]?.i18nKey === sortOption,
        );

        // Fetch the correct sort option based on the mapped keys
        const selectedSortOption = SORT_MAPPING[categoryKey]?.[optionKey];

        if (selectedSortOption) {
          // Update the filter query and fetch the data
          this.v2PaymentTransactionsFilterQuery = {
            ...this.v2PaymentTransactionsFilterQuery,
            sortBy: selectedSortOption.sortBy,
            sortDirection: selectedSortOption.sortDirection,
          };
          this.currentPage = 1;
          await this.getPaymentTransactions();
        } else {
          console.error(
            `Invalid sort option: ${sortCategory} -> ${sortOption}`,
          );
        }
      } catch (error) {
        console.error('Error updating sort:', error);
      }
    },

    async getPaymentTransactionsPageChange({ type, token }) {
      if (type === 'next') {
        this.currentPage = this.currentPage + 1;
      }
      if (type === 'prev') {
        this.currentPage = this.currentPage - 1;
      }
      this.getPaymentTransactions({ [type]: token });
    },
    // 用于所有带public filer的查询
    // spending/income/subscriptions/payouts/customers tabs switch
    async getPaymentTransactionsQueryChange(params) {
      // close sidebar
      const hubSidebar = useHubSidebarStore();
      hubSidebar.payment.state = false;
      hubSidebar.state = false;
      this.v2PaymentTransactionsFilterQuery = {
        ...this.v2PaymentTransactionsFilterQuery,
        ...params,
      };
      this.currentPage = 1;
      this.sidebarFilters = {};
      this.sidebarFilterResCount = 0;

      this.getPaymentTransactions();
    },
    // for dialogs
    addDialogNavHistory({ dataType, cacheData, id }) {
      const index = this.dialogNavHistory.findIndex(
        (item) => item.cacheData.id === cacheData?.id,
      );
      if (index !== -1) {
        this.dialogNavHistory = this.dialogNavHistory.slice(0, index + 1);
      } else {
        this.dialogNavHistory = [
          ...this.dialogNavHistory,
          { dataType, cacheData, id },
        ];
      }
    },
    removeLastDialogNavHistory() {
      this.dialogNavHistory.pop();
    },
    async getPaymentSubscriptionsDetail(id) {
      const data = await paymentSubscriptionsDetail(id);

      return handleSubscriptionItem({
        item: data,
        successTextStatus: PAYMENT_STATUS.SUCCESS.text,
      });
    },
    async getPaymentTransactionDetail(id) {
      const data = await paymentTransactionDetail(id);
      return data;
    },
    async getPaymentPayoutDetail(id) {
      const data = await paymentPayoutsDetail(id);
      return data;
    },
    async getPaymentCustomerDetail(customerId) {
      const res = await paymentCustomers({
        customerIds: [customerId],
      });
      if (res.data?.length > 0) {
        return handleCustomerItem(res.data[0]);
      }
      return null;
    },
    // retrieve all the transaction for the customer pop up
    async getAllTransactionCustomer(data) {
      const res = await paymentTransactions(data);
      return res;
    },
    // retrieve all the subscription for the customer pop up
    async getAllSubscriptionCustomer(queryParams) {
      const res = await paymentSubscriptions(queryParams);
      const handledRes = {
        ...res,
        data: res.data.map((item) =>
          handleSubscriptionItem({
            item,
            successTextStatus: PAYMENT_STATUS.SUCCESS.text,
          }),
        ),
      };

      return handledRes;
    },
    // for dialogs end
    // for filters in sidebar Filters
    async getPaymentFilterInDrawersChange(params) {
      const newParams = {
        ...this.sidebarFilters,
        ...params,
      };
      this.sidebarFilters = newParams;
      let cpParams = handlePaymentFilterParams(newParams);
      cpParams = filterNullAndUndefinedValues(cpParams);
      // no filter params
      if (Object.keys(cpParams).length === 0) {
        this.handleClearFilters();
        return;
      }

      this.sidebarFilterLoading = true;
      let res;
      if (
        this.dataType === DATA_TYPES.TRANS_SPENDING ||
        this.dataType === DATA_TYPES.TRANS_INCOME
      ) {
        res = await paymentTransactions({
          ...cpParams,
          filterQuery: this.v2PaymentTransactionsFilterQuery.filterQuery,
        });
      }

      if (
        this.dataType === DATA_TYPES.SUB_SPENDING ||
        this.dataType === DATA_TYPES.SUB_INCOME
      ) {
        res = await paymentSubscriptions({
          ...cpParams,
          filterQuery: this.v2PaymentTransactionsFilterQuery.filterQuery,
        });
      }

      if (this.dataType === DATA_TYPES.CUSTOMER) {
        res = await paymentCustomers(cpParams);
      }

      if (this.dataType === DATA_TYPES.PAYOUT) {
        res = await paymentPayouts(cpParams);
      }

      this.sidebarFilterLoading = false;
      if (res) {
        this.sidebarFilterResCount = res.cursor.totalItems;
      }
    },
    handleClearFilters() {
      this.sidebarFilterResCount = 0;
      this.sidebarFilters = {};
      this.getPaymentTransactions();
    },
    handleClickFilters() {
      const hubSidebar = useHubSidebarStore();
      hubSidebar.payment.state = false;
      hubSidebar.state = false;
      this.getPaymentTransactions();
    },
    setSortOption(option) {
      if (this.sortState.selectedOption === option) {
        // If the same option is clicked, clear it
        this.sortState.selectedOption = null;
      } else {
        this.sortState.selectedOption = option;
      }
    },
    setSortOrder(option, order) {
      this.sortState.sortOrder[option] = order;
    },
    getSortOrder(option) {
      return this.sortState.sortOrder[option] || null;
    },
    async paymentSuppliersSearch(params) {
      // If text exists, replace it with name
      const modifiedParams = { ...params };
      if (modifiedParams.text) {
        modifiedParams.name = modifiedParams.text;
        delete modifiedParams.text;
      }

      const data = await paymentSuppliersSearch(modifiedParams);
      return data;
    },

    async paymentCustomersSearch(params) {
      // If text exists, replace it with name
      const modifiedParams = { ...params };
      if (modifiedParams.text) {
        modifiedParams.name = modifiedParams.text;
        delete modifiedParams.text;
      }

      const data = await paymentCustomersSearch(modifiedParams);
      return data;
    },

    // charts相关
    switchChartIndex(index) {
      this.index = index;
    },
    async getPaymentAnalytics(startDate, endDate) {
      const authStore = useAuthStore();
      this.startDate = startDate;
      this.endDate = endDate;
      this.chartLoading = true;

      let requestArr = [
        paymentTimeline({
          startDate,
          endDate,
        }),
        paymentSpending({
          startDate,
          endDate,
        }),
        paymentIncome({
          startDate,
          endDate,
        }),
        getFuturePayments(),
        paymentLastIncome(),
      ];

      if (authStore.isTeacher) {
        requestArr = [...requestArr, paymentBalance()];
      }

      const [
        timeLineRes,
        spendingRes,
        incomeRes,
        futurePaymentsRes,
        lastIncomeRes,
        balanceRes,
        payoutScheduleRes,
      ] = await Promise.allSettled(requestArr);

      if (timeLineRes.status === 'fulfilled') {
        this.timeLineDatas = timeLineRes.value.timeline;
      }

      if (spendingRes.status === 'fulfilled') {
        this.spendingDatas = spendingRes.value;
      }

      if (incomeRes.status === 'fulfilled') {
        this.incomeDatas = incomeRes.value;
      }

      if (futurePaymentsRes.status === 'fulfilled') {
        this.futurePayments = futurePaymentsRes.value;
      }

      if (lastIncomeRes?.status === 'fulfilled') {
        this.lastIncomes = lastIncomeRes.value.courses;
      }

      if (balanceRes?.status === 'fulfilled') {
        this.balanceDatas = balanceRes.value;
      }

      if (payoutScheduleRes?.status === 'fulfilled') {
        this.payoutSchedule = payoutScheduleRes.value;
      }

      this.chartLoading = false;
      return timeLineRes;
    },
    // async updatePayoutSchedule(params) {
    //   await paymentSetPayoutSchedule(params);
    //   const newRes = await paymentGetPayoutSchedule();
    //   this.payoutSchedule = newRes;
    // },
    async createPayout(params) {
      const res = await paymentCreatePayout(params);
      if (res) {
        await paymentBalance();
      }
      return res;
    },
    handleCheckbox({ titleCheckbox = false, rowId }) {
      if (titleCheckbox) {
        if (this.usersSelect.length === this.v2PaymentTransactions.length) {
          this.usersSelect = [];
        } else {
          this.usersSelect = this.v2PaymentTransactions.map((item) => item.id);
        }
      } else {
        if (this.usersSelect.includes(rowId)) {
          this.usersSelect = this.usersSelect.filter((item) => item !== rowId);
        } else {
          this.usersSelect.push(rowId);
        }
      }
    },
    // ---charts相关--end
    /**
     * @param {
     *  userInfoId: {
     *    type: 'totalFollowers' || 'totalFollowings',
     *    operation: 'add' || 'minues',
     *  },
     * } updateObject
     */
    updateFollower(updateObject) {
      try {
        const updateUserInfo = (userInfo, updateInfo) => {
          let newUser;
          if (updateInfo) {
            ['followers', 'followings'].forEach((type) => {
              if (updateInfo.type === type) {
                newUser = {
                  isFollowing: !userInfo.isFollowing,
                  owner: {
                    ...userInfo.owner,
                    [type]:
                      updateInfo.operation === 'add'
                        ? userInfo.owner[type] + 1
                        : userInfo.owner[type] - 1,
                  },
                };
              }
            });
          }
          return newUser || userInfo;
        };

        this.v2PaymentTransactions = this.v2PaymentTransactions.map(
          (transactionItem) => {
            const { payer, recipient } = transactionItem;
            const updatePayerInfo = updateObject[payer?.owner?.id];
            const updateRecipientInfo = updateObject[recipient?.owner?.id];

            const newPayer = updateUserInfo(payer, updatePayerInfo);
            const newRecipient = updateUserInfo(recipient, updateRecipientInfo);

            if (newPayer || newRecipient) {
              return {
                ...transactionItem,
                payer: newPayer || transactionItem.payer,
                recipient: newRecipient || transactionItem.recipient,
              };
            }

            return transactionItem;
          },
        );
      } catch (err) {
        console.error('err when updateFollower in hubPayment', err);
      }
    },
    reset() {
      this.$reset();
      this.getPaymentTransactions();
    },
  },
});
