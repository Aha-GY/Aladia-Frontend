<template>
  <div class="overflow-hidden">
    <!-- body -->
    <div class="h-[calc(100vh-12rem)] overflow-auto">
      <div
        v-if="hubPaymentStore.dialogLoading"
        v-loading="true"
        class="fixed z-50 h-[calc(100vh-12rem)]"
        :class="$device.isMobile ? 'w-[22rem]' : 'w-[28.125rem]'"
      />
      <div
        class="mb-3 grid grid-cols-9 items-center overflow-auto bg-[#0C0C0C] pr-2 text-xs text-[#FAFAFA]"
      >
        <!-- row1 -->
        <div
          class="col-span-6 col-start-1 flex items-center gap-1 px-3 py-2 text-base text-[#FAFAFA]"
        >
          <i class="fa-regular fa-circle-dollar-to-slot" />
          <span>
            {{ $t('category.transaction.net') }}
          </span>
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="item.totalAmount - fee.totalFee"
              size="normal"
              :currency="item.currency"
            />
          </div>
          <OrganizationHubPaymentHistoryListDownload
            v-if="paySuccess"
            class="mx-3 justify-self-end"
            :item="{ invoiceUrl: item?.invoice.url }"
          />
        </div>
        <div class="col-span-3 justify-self-end pr-2">
          <OrganizationHubPaymentHistoryListStatus
            :item="{ status: item.status }"
          />
        </div>
        <div class="col-span-6 col-start-1 flex items-center gap-1.5 px-3 py-2">
          <div class="col-span-8 text-[#707070]">
            {{ formatDate(item.createdAt, 'DD MMM YYYY, HH:mm') }}
          </div>
        </div>
        <div
          data-cy="359f5e730cb752e2"
          class="item-center col-span-3 flex gap-1 justify-self-end rounded-md border border-gray-800 bg-[#0C0C0C]"
        >
          <OrganizationHubPaymentHistoryDialogCompsTransactionID
            :id="props.item.id"
          />
        </div>
      </div>
      <OrganizationHubPaymentHistoryDialogCompsCourseAndName
        :course="course"
        :course-owner="courseOwner"
        :licenses-bought="item.licencesBought"
        :course-price="item.totalAmount"
      />
      <div
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] text-[#d9d9d9]"
      >
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.customer') }}
        </div>

        <!-- row7 -->

        <div class="col-span-8 ml-3">
          <OrganizationHubPaymentHistoryListUser
            :user-item="item.payer"
            user-name-link="customer"
          />
        </div>

        <!-- row8 -->
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.supplier') }}
        </div>

        <!-- row9 -->

        <div class="col-span-8 ml-3">
          <OrganizationHubPaymentHistoryListUser :user-item="item.recipient" />
        </div>

        <div class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-[#F1F1F1]">
          <span class="text-[#565656]">
            {{ $t('category.transaction.purpose') }}
          </span>
          <div class="col-span-8 text-base">
            {{ props.item.purpose }}
          </div>
        </div>
      </div>

      <div
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] text-[#d9d9d9]"
      >
        <div v-if="subscriptionInfo" class="col-span-9 grid grid-cols-9 px-1">
          <div
            class="col-span-8 col-start-1 mb-2 mt-3 px-3 text-xl text-[#FAFAFA]"
          >
            <i class="fa-regular fa-calendar-clock text-xs" />
            <span class="ml-3 text-base">
              {{ $t('category.payout.reference.subscription') }}
            </span>
          </div>

          <div
            v-loading="subInfoLoading"
            class="col-span-9 cursor-pointer rounded-5 px-3 py-1 hover:bg-white/5"
            data-cy="332815fbfa2a953b"
            @click="handleClickSubscription"
          >
            <div class="flex items-center justify-between">
              <div class="text-[#707070]">
                {{ formatDate(subscriptionDates.startDate, 'DD MMM YYYY') }}
                ->
                {{ formatDate(subscriptionDates.endDate, 'DD MMM YYYY') }}
              </div>
              <OrganizationHubPaymentHistoryListStatus
                :item="{ status: checkStatus }"
              />
            </div>
            <div
              class="col-span-6 col-start-1 flex items-center py-2 text-base"
            >
              <div class="text-[#d9d9d9]">
                <div class="truncate text-sm font-semibold text-[#D9D9D9]">
                  {{ course?.title }}
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-xs text-[#707070]">
                {{ $t('category.payout.id', { id: subscriptionInfo.id }) }}
              </div>

              <div class="col-span-4 flex items-center justify-self-end">
                <div class="flex items-center text-[#d9d9d9]">
                  <div class="text-xs text-[#707070]">
                    {{
                      $t('category.payout.qty', {
                        license: item.licencesBought,
                      })
                    }}
                  </div>
                  <div>
                    <OrganizationHubPaymentHistoryDialogCompsAmountTip
                      :money="subscriptionInfo.amount"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="payoutInfo"
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] px-3 text-[#d9d9d9]"
      >
        <div class="col-span-8 col-start-1 mb-1 mt-2 text-xl text-[#FAFAFA]">
          <i class="fa-regular fa-square-dollar pl-1 text-xs" />
          <span class="ml-3 text-base">
            {{ $t('category.payout.reference.label') }}
          </span>
        </div>
        <div
          v-loading="payoutLoading"
          class="col-span-9 mb-2 cursor-pointer rounded-5 p-1 hover:bg-white/5"
          data-cy="5194f49734ae4ca8"
          @click="handleClickPayout"
        >
          <div class="mb-1 flex items-center justify-between">
            <div class="text-[#FAFAFA]">
              {{ formatDate(payoutInfo?.createdAt, 'DD MMM YYYY, HH:mm') }}
            </div>
            <OrganizationHubPaymentHistoryListStatus
              :item="{ status: payoutInfo.status }"
            />
          </div>
          <div class="flex items-center justify-between">
            <div class="text-xs text-[#707070]">
              {{ $t('category.payout.id', { id: payoutInfo.id }) }}
            </div>

            <div class="col-span-4 flex items-center justify-self-end">
              <div class="flex items-center text-[#d9d9d9]">
                <div class="text-xs">
                  <i class="fa-regular fa-circle-dollar-to-slot" />
                  <span>
                    {{ $t('category.payout.net') }}
                  </span>
                </div>
                <div>
                  <OrganizationHubPaymentHistoryDialogCompsAmountTip
                    :money="payoutInfo.amount"
                    :currency="payoutInfo.currency"
                    :is-bold="true"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-4 text-sm text-[#F1F1F1]"
      >
        <div class="col-span-8 col-start-1 mb-2 mt-3">
          <i class="fa-thin fa-square-info text-xs" />
          <span class="ml-3 text-base">
            {{ $t('category.details') }}
          </span>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span>
              {{ $t('category.payout.quantity') }}
            </span>
            <span>x{{ item.licencesBought }}</span>
          </div>
        </div>
        <div class="col-span-6 col-start-1 flex items-center gap-1.5 py-2">
          <div>
            {{ $t('category.amount.unit') }}
          </div>
        </div>
        <div class="col-span-3 flex items-center justify-self-end">
          <div class="flex items-center">
            <div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="item.unitAmount"
                :currency="item.currency"
              />
            </div>
          </div>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <div>
              {{ $t('payment.amount', { amount: '' }) }}
            </div>
            <div v-if="!paySuccess">---</div>
            <div v-else class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="item.totalAmount"
                  :currency="item.currency"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <span v-if="!paySuccess">
              {{ $t('category.payout.fees') }}
            </span>
            <div v-else class="flex items-center gap-3">
              <a
                :href="fee.feeInvoice.url"
                target="_blank"
                class="all-transition hover:text-white hover:underline"
              >
                {{ $t('category.payout.fees') }}
              </a>
              <OrganizationHubPaymentHistoryListDownload
                :item="{ invoiceUrl: fee.feeInvoice.pdf }"
              />
            </div>
            <div v-if="!paySuccess">---</div>
            <div v-else class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="fee.totalFee"
                  :currency="item.currency"
                  :is-negative="true"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-9 h-[1px] bg-white/10" />
        <div class="col-span-9 py-2">
          <div class="flex justify-between">
            <div>
              {{ $t('category.payout.net') }}
            </div>
            <div v-if="!paySuccess">---</div>
            <div v-else class="flex items-center">
              <div>
                <OrganizationHubPaymentHistoryDialogCompsAmountTip
                  :money="item.totalAmount - fee.totalFee"
                  :currency="item.currency"
                  :is-bold="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid h-auto grid-cols-9 bg-[#0C0C0C] px-4 text-[#d9d9d9]"
      >
        <div
          class="col-span-9 col-start-1 mb-2 mt-3 flex items-center text-base text-[#FAFAFA]"
        >
          <i class="fa-thin fa-square-info text-xs" />
          <div class="ml-3 flex items-center gap-1">
            <span>
              {{ $t('category.transaction.escrow.escrowDetails') }}
            </span>
            <span class="text-white">
              ({{ escrowDetails.committedTransfers }}/{{
                escrowDetails.totalTransfers
              }}
              {{ $t('category.transaction.escrow.commit') }})
            </span>
          </div>
        </div>
        <span class="col-span-9 col-start-1 my-2.5 text-base text-[#FAFAFA]">
          {{ $t('category.transaction.escrow.schedule') }}
        </span>
        <div
          v-for="(escrowItem, escrowIndex) in escrowItems"
          :key="escrowIndex"
          class="col-span-9 mb-3 grid grid-cols-9"
        >
          <div class="col-span-1">
            <OrganizationHubPaymentHistoryDialogCompsEscrowProgressItem
              :status="mapStatusForEscrow({ status: escrowItem.status })"
              :show-line="escrowIndex < escrowItems.length - 1"
              line-height="2.1rem"
            />
          </div>
          <div class="col-span-8 -ml-2.5 h-[4.5rem]">
            <!-- First row: Released On + Status -->
            <div
              class="flex items-center justify-between text-xs text-[#989898]"
            >
              <span v-if="escrowItem.status !== 'refunded'">
                {{ $t('category.transaction.escrow.releasedOn') }}
              </span>
              <span v-else>
                {{ $t('category.transaction.escrow.refundedOn') }}
              </span>
              <OrganizationHubPaymentHistoryListStatus
                :item="{
                  status: mapStatusForEscrow({ status: escrowItem.status }),
                }"
              />
            </div>

            <!-- Second row: Date + Tooltip + Amount -->
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-1 text-xs text-[#E2E2E2]">
                <span>
                  {{ formatDate(escrowItem.transferDate) }}
                </span>
                <!-- a Tooltip for escrow amount -->
                <div
                  v-if="escrowItem.status === 'transferred'"
                  class="flex items-center gap-3"
                >
                  <el-popover
                    v-model:visible="tipOpen"
                    trigger="hover"
                    destroy-on-close
                    placement="top"
                    popper-class="custom-popover"
                    width="450"
                    :popper-options="{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [59, 15],
                          },
                        },
                      ],
                    }"
                  >
                    <div
                      class="mb-2 grid grid-cols-9 bg-[#060606] px-4 text-sm text-[#d9d9d9]"
                    >
                      <div
                        class="col-span-6 col-start-1 flex items-center gap-1.5 py-2"
                      >
                        <div>
                          {{ $t('category.amount.label') }}
                        </div>
                      </div>
                      <div
                        class="col-span-3 flex items-center justify-self-end"
                      >
                        <div class="flex items-center text-[#d9d9d9]">
                          <div>
                            <OrganizationHubPaymentHistoryDialogCompsAmountTip
                              :money="escrowItem.amount"
                              :currency="escrowItem.currency"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        class="col-span-6 col-start-1 flex items-center py-2"
                      >
                        <div>{{ $t('category.exchange.title') }}</div>
                      </div>
                      <div
                        class="col-span-3 flex items-center justify-end gap-1"
                      >
                        <div class="flex items-center">
                          <OrganizationHubPaymentHistoryDialogCompsAmountTip
                            :money="1.0"
                            :currency="escrowItem.currency"
                          />
                        </div>
                        <span class="text-lg">→</span>
                        <div class="flex items-center">
                          <OrganizationHubPaymentHistoryDialogCompsAmountTip
                            :money="escrowItem.incomeDetail.exchangeRate"
                            :currency="escrowItem.incomeDetail.currency"
                          />
                        </div>
                      </div>
                      <div
                        class="col-span-6 col-start-1 flex items-center py-2"
                      >
                        <div>{{ $t('payment.amount', { amount: '' }) }}</div>
                      </div>
                      <div
                        class="col-span-3 flex items-center justify-end gap-1"
                      >
                        <div class="flex items-center">
                          <OrganizationHubPaymentHistoryDialogCompsAmountTip
                            :money="escrowItem.amount"
                            :currency="escrowItem.currency"
                          />
                        </div>
                        <span class="text-lg">→</span>
                        <div class="flex items-center">
                          <OrganizationHubPaymentHistoryDialogCompsAmountTip
                            :money="escrowItem.incomeDetail.amount"
                            :currency="escrowItem.incomeDetail.currency"
                          />
                        </div>
                      </div>
                    </div>
                    <template #reference>
                      <i
                        class="fa-circle-info ml-2 cursor-pointer text-xs text-[#707070] transition-all"
                        :class="tipOpen ? 'fa-solid' : 'fa-light'"
                      />
                    </template>
                  </el-popover>
                </div>
              </div>
              <OrganizationHubPaymentHistoryDialogCompsAmountTip
                :money="escrowItem.amount"
                :currency="escrowItem.currency"
                size="normal"
              />
            </div>

            <!-- Third row: ID -->
            <div
              v-if="escrowItem.status === 'transferred'"
              class="-mt-2 text-xs text-white"
            >
              {{
                $t('category.transaction.escrow.transfer', {
                  id: escrowItem.id,
                })
              }}
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="checkPaymentMethod"
        class="mb-2 grid h-[13.5rem] grid-cols-9 bg-[#0C0C0C] px-4 text-[#d9d9d9]"
      >
        <!-- Payment Method Row -->
        <div class="col-span-8 col-start-1 flex h-[2.5rem] items-center py-2">
          <i class="fa-regular fa-money-bill-wave text-xs" />
          <span class="ml-2 text-base">{{ $t('payment.title') }}</span>
        </div>

        <!-- Card and Information -->
        <div class="col-span-9 mb-2 mt-1 flex h-[10rem] items-center gap-10">
          <!-- Card Display (Left Side) -->
          <div class="w-[13.25rem]">
            <div class="-ml-8 scale-75">
              <OrganizationHubPaymentHistoryDialogCompsPaymentCarousel
                :show-set-default="false"
                :item="item"
              />
            </div>
          </div>
          <!-- Card Information (Right Side) -->
          <div class="w-[11.25rem] text-xs">
            <div class="mb-2.5">
              <span class="block text-[#707070]">Cardholder Name</span>
              <div class="flex items-center justify-between overflow-hidden">
                <span class="truncate text-xs">
                  {{ userName }}
                </span>
              </div>
            </div>
            <div class="mb-2.5">
              <span class="block text-[#707070]">Card Number</span>
              <span class="text-xs">
                **** **** **** {{ props.item.paymentMethod.card.lastFour }}
              </span>
            </div>
            <div class="mb-2.5">
              <span class="block text-[#707070]">Expiry Date</span>
              <span class="text-xs">
                {{
                  `${props.item.paymentMethod.card.expMonth} /
                  ${props.item.paymentMethod.card.expYear}`
                }}
              </span>
            </div>
            <div>
              <span class="block text-[#707070]">Security Code</span>
              <span class="text-xs">***</span>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid grid-cols-9 items-center bg-[#0C0C0C] text-[#d9d9d9]"
      >
        <div
          class="col-span-8 col-start-2 flex items-center py-2 text-base text-[#FAFAFA]"
        >
          <i class="fa-thin fa-clock -ml-8 text-xs" />
          <span class="ml-3">
            {{ $t('category.payout.timeline') }}
          </span>
        </div>
        <div
          class="relative row-span-2 -ml-1 flex h-full flex-col justify-around"
        >
          <div class="text-center">
            <i
              class="fa-regular fa-circle-check text-base"
              :class="[paySuccess ? 'text-[#88C359]' : 'text-[#EF4444]']"
            />
          </div>
          <div class="text-center">
            <i class="fa-regular fa-money-bills text-base text-[#707070]" />
          </div>
          <div
            class="top-8.5 absolute left-[1.6rem] h-7 w-[1px]"
            :class="[paySuccess ? 'bg-[#88C359]' : 'bg-[#EF4444]']"
          />
        </div>

        <div class="col-span-8 text-xs">
          <div class="my-1.5">
            {{ $t('payment.authorized') }}
          </div>
          <div class="my-1.5 text-[#707070]">
            {{ formatDate(dates.startDate, 'DD MMM YYYY, HH:mm') }}
          </div>
        </div>

        <div class="col-span-8 mt-1.5 text-xs">
          <div class="my-1.5">Payment started</div>
          <div class="my-1.5 text-[#707070]">
            {{ formatDate(dates.endDate, 'DD MMM YYYY, HH:mm') }}
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid h-[3.25rem] grid-cols-[auto_min-content_auto] items-center bg-[#0C0C0C] px-4 text-[#d9d9d9]"
      >
        <!-- Left (Committed) -->
        <div class="flex items-center">
          <i class="fa-regular fa-circle-check mr-2 text-base text-[#88C359]" />
          <span>{{ $t('category.transaction.escrow.committed') }}</span>
          <!-- Tooltip for Committed -->
          <div
            class="-mt-2 ml-1 cursor-pointer rounded-md text-xs transition-all"
          >
            <el-tooltip
              effect="light"
              content="Funds reserved but not yet transferred"
              placement="top"
            >
              <i class="fa-light fa-circle-info text-[#707070]" />
            </el-tooltip>
          </div>
          <span class="ml-2 flex items-center gap-1 text-xs text-[#FAFAFA]">
            <span>$</span>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="escrowDetails.committedAmount"
              :show-currency="false"
            />
            <span>USD</span>
          </span>
        </div>

        <!-- Divider as a vertical line (No extra space taken) -->
        <div class="h-[1.5rem] w-px bg-[#707070]" />

        <!-- Right (Escrow) -->
        <div class="flex items-center justify-end">
          <i class="fa-light fa-hourglass text-base text-[#E0B92C]" />
          <span class="ml-2">
            {{ $t('category.transaction.escrow.label') }}
          </span>
          <!-- Tooltip for Escrow -->
          <div
            class="relative -mt-2 ml-1 cursor-pointer rounded-md text-xs transition-all"
          >
            <el-tooltip
              effect="light"
              content="Funds held for scheduled release"
              placement="top"
            >
              <i class="fa-light fa-circle-info text-[#707070]" />
            </el-tooltip>
          </div>
          <span class="ml-2 flex items-center gap-1 text-xs text-[#FAFAFA]">
            <span>$</span>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="escrowDetails.remainingAmount"
              :show-currency="false"
            />
            <span>USD</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PAYMENT_STATUS, DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const hubPaymentStore = useHubPaymentStore();
const subInfoLoading = ref(false);
const payoutLoading = ref(false);
const fee = computed(() => props.item.fee);
const course = computed(() => props.item.course);
const courseOwner = computed(() => props.item.recipient?.owner);
const subscriptionInfo = computed(() => props.item.subscription);
const payoutInfo = computed(() => props.item.payout);
const userName = computed(
  () => props.item.payer.owner?.fullName || props.item.payer.owner.name || '--',
);
const escrowDetails = computed(() => props.item.escrowDetail);
const transfers = computed(() => props.item?.transfers || []);

const escrowItems = computed(() => {
  if (!props.item?.transferIds) {
    return [];
  }
  return props.item.transferIds
    .map((id) => transfers.value.find((transfer) => transfer.id === id) || null)
    .filter((item) => item !== null);
});
const checkStatus = computed(() =>
  mapStatusCanceledToCompleted({
    status: subscriptionInfo.value?.subscriptionStatus,
  }),
);
const dates = computed(() => props.item.dates);
const subscriptionDates = computed(() => props.item.subscription.dates);
const checkPaymentMethod = computed(() => props.item.paymentMethod);
const paySuccess = computed(
  () => props.item.status === PAYMENT_STATUS.SUCCESS.text,
);
async function handleClickSubscription() {
  if (subInfoLoading.value) {
    return;
  }
  if (payoutLoading.value) {
    return;
  }
  subInfoLoading.value = true;
  const subInfo = await hubPaymentStore.getPaymentSubscriptionsDetail(
    subscriptionInfo.value.id,
  );
  subInfoLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.SUB_INCOME,
    cacheData: subInfo,
  });
}

async function handleClickPayout() {
  if (subInfoLoading.value) {
    return;
  }
  if (payoutLoading.value) {
    return;
  }
  payoutLoading.value = true;
  const payoutRes = await hubPaymentStore.getPaymentPayoutDetail(
    payoutInfo.value.id,
  );
  payoutLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.PAYOUT,
    cacheData: payoutRes,
  });
}
</script>
