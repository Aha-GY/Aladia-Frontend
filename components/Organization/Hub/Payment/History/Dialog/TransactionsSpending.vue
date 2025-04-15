<template>
  <div class="relative overflow-hidden">
    <!-- body -->
    <div class="h-[calc(100vh-12rem)] overflow-auto">
      <div
        class="mb-3 grid grid-cols-9 items-center overflow-auto bg-[#0C0C0C] px-2 text-xs text-[#FAFAFA]"
      >
        <!-- row1 -->
        <div
          class="col-span-6 col-start-1 flex items-center gap-3 p-2 text-base"
        >
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="item.totalAmount"
              size="normal"
              :currency="item.currency"
            />
          </div>
          <OrganizationHubPaymentHistoryListDownload
            v-if="paySuccess"
            class="justify-self-end text-[#FAFAFA]"
            :item="{ invoiceUrl: item?.invoice.url }"
          />
          <a
            v-else
            class="justify-self-end pr-2 transition-all hover:scale-105"
            :href="item?.invoice.url"
            target="_blank"
          >
            <OrganizationHubPaymentHistoryListStatus
              :item="{ status: PAYMENT_STATUS.RETRY.text }"
            />
          </a>
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

        <div class="col-span-8 ml-2">
          <OrganizationHubPaymentHistoryListUser :user-item="item.payer" />
        </div>

        <!-- row8 -->
        <div
          class="col-span-8 col-start-1 mb-2 mt-3 px-4 text-xs text-[#565656]"
        >
          {{ $t('category.role.supplier') }}
        </div>

        <!-- row9 -->

        <div class="col-span-8 ml-2">
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

              <div class="col-span-4 flex items-center justify-self-end pr-2">
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
                      :currency="subscriptionInfo.currency"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="mb-2 grid grid-cols-9 bg-[#0C0C0C] px-4 text-sm text-[#d9d9d9]"
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
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="item.amount"
              :currency="item.currency"
            />
          </div>
        </div>

        <div class="col-span-6 col-start-1 flex items-center gap-1.5 py-2">
          <div>
            {{ $t('payment.amount', { amount: '' }) }}
          </div>
        </div>
        <div class="col-span-3 flex items-center justify-self-end">
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="item.totalAmount"
              :currency="item.currency"
            />
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
                  `${props.item.paymentMethod.card.expMonth} / ${props.item.paymentMethod.card.expYear}`
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
          class="col-span-8 col-start-2 mb-2 mt-7 flex items-center text-base text-[#FAFAFA]"
        >
          <i class="fa-thin fa-clock -ml-8 text-xs" />
          <span class="ml-4">
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
            class="top-8.5 absolute left-[1.585rem] h-7 w-[1px]"
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
          <div class="my-1.5">
            {{ $t('payment.started') }}
          </div>
          <div class="my-1.5 text-[#707070]">
            {{ formatDate(dates.endDate, 'DD MMM YYYY, HH:mm') }}
          </div>
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
const checkPaymentMethod = computed(() => props.item.paymentMethod);
const subscriptionInfo = computed(() => props.item.subscription);
const course = computed(() => props.item.course);
const courseOwner = computed(() => props.item.recipient?.owner);
const dates = computed(() => props.item.dates);
const userName = computed(
  () =>
    props.item.payer.owner?.fullName || props.item.payer.owner?.name || '--',
);
const subscriptionDates = computed(() => props.item.subscription.dates);
const paySuccess = computed(
  () => props.item.status === PAYMENT_STATUS.SUCCESS.text,
);
const checkStatus = computed(() =>
  mapStatusCanceledToCompleted({
    status: subscriptionInfo.value?.subscriptionStatus,
  }),
);

async function handleClickSubscription() {
  if (subInfoLoading.value) {
    return;
  }
  subInfoLoading.value = true;
  const subTransactionInfo =
    await hubPaymentStore.getPaymentSubscriptionsDetail(
      subscriptionInfo.value.id,
    );
  subInfoLoading.value = false;
  hubPaymentStore.addDialogNavHistory({
    dataType: DIALOG_TITLE_TYPES.SUB_SPENDING,
    cacheData: subTransactionInfo,
  });
}
</script>
