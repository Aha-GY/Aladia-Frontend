<template>
  <el-popover
    v-model:visible="open"
    width="24rem"
    :show-arrow="false"
    placement="bottom-start"
    trigger="click"
    :teleported="false"
    :popper-options="{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 10],
          },
        },
      ],
    }"
  >
    <template #reference>
      <div
        class="group/input relative flex flex-1 items-center justify-between pb-1 pr-8 font-light"
      >
        <div
          class="flex-1 cursor-pointer text-[#d9d9d9] hover:text-white"
          data-cy="4d6b4c9985cfdd26"
          @click.stop="handleClickSelect"
        >
          <div v-if="selectedStatus.length" class="flex flex-wrap gap-2">
            <div
              v-for="item in selectedStatus"
              :key="item"
              class="flex items-center gap-2"
            >
              <OrganizationHubPaymentHistoryListStatus
                :item="{
                  status:
                    dataType === DATA_TYPES.SUB_INCOME ||
                    dataType === DATA_TYPES.SUB_SPENDING
                      ? mapStatusCanceledToCompleted({
                          status: item,
                        })
                      : item,
                }"
                less-padding-y
              />
              <i
                class="fa-regular fa-circle-xmark transition-all hover:rotate-180 hover:scale-125"
                @click.stop="handleClickItem(item, true)"
              />
            </div>
          </div>
          <div v-else class="text-[#707070] hover:text-white">
            {{ $t('category.transaction.selectStatus') }}
          </div>
        </div>
        <BaseLine :active="open" />
      </div>
    </template>

    <div class="p-2">
      <div
        v-for="item in options"
        :key="item.text"
        v-loading="sidebarFilterLoading"
        element-loading-spinner="none"
        class="mb-2 flex items-center gap-2"
        @click="handleClickItem(item)"
      >
        <BaseCheckboxStyle
          :state="
            selectedStatus.includes(item.text) ? 'correctChecked' : 'unchecked'
          "
        />
        <OrganizationHubPaymentHistoryListStatus
          :item="{
            status:
              dataType === DATA_TYPES.SUB_INCOME ||
              dataType === DATA_TYPES.SUB_SPENDING
                ? mapStatusCanceledToCompleted({
                    status: item.text,
                  })
                : item.text,
          }"
          less-padding-y
        />
      </div>
    </div>
  </el-popover>
</template>

<script setup>
import { PAYMENT_STATUS, FILTER_KEYS, DATA_TYPES } from '~/constant/payment';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
});
const emits = defineEmits(['change']);

const hubPaymentStore = useHubPaymentStore();

const open = ref(false);
const selectedStatus = ref([]);
const sidebarFilterLoading = computed(
  () => hubPaymentStore.sidebarFilterLoading,
);
const dataType = computed(() => hubPaymentStore.dataType);

// document : docs/payment.md #### transaction Status details
const options = computed(() => {
  if (
    dataType.value === DATA_TYPES.TRANS_INCOME ||
    dataType.value === DATA_TYPES.TRANS_SPENDING
  ) {
    return [
      PAYMENT_STATUS.SUCCESS,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.FAILED,
    ];
  }

  if (
    dataType.value === DATA_TYPES.SUB_INCOME ||
    dataType.value === DATA_TYPES.SUB_SPENDING
  ) {
    return [
      PAYMENT_STATUS.CANCELED,
      PAYMENT_STATUS.PAST_DUE,
      PAYMENT_STATUS.ACTIVE,
      PAYMENT_STATUS.UNPAID,
    ];
  }

  if (dataType.value === DATA_TYPES.PAYOUT) {
    return [
      PAYMENT_STATUS.PAID,
      PAYMENT_STATUS.FAILED,
      PAYMENT_STATUS.PENDING,
      PAYMENT_STATUS.IN_TRANSIT,
      PAYMENT_STATUS.CANCELED,
    ];
  }

  return [];
});

watch(
  () => props.filterParams,
  (filterParams) => {
    if (filterParams && filterParams[FILTER_KEYS.STATUS]) {
      selectedStatus.value = filterParams[FILTER_KEYS.STATUS];
    } else {
      selectedStatus.value = [];
    }
  },
  { immediate: true },
);

function handleClickSelect() {
  open.value = true;
}

function handleClickItem(statusItem, remove) {
  if (sidebarFilterLoading.value) {
    return;
  }

  let newSelectedStatus;

  if (remove) {
    newSelectedStatus = selectedStatus.value.filter(
      (item) => item !== statusItem,
    );
  } else if (selectedStatus.value.some((item) => item === statusItem.text)) {
    newSelectedStatus = selectedStatus.value.filter(
      (item) => item !== statusItem.text,
    );
  } else {
    newSelectedStatus = [...selectedStatus.value, statusItem.text];
  }

  selectedStatus.value = newSelectedStatus;
  emits('change', {
    [FILTER_KEYS.STATUS]: newSelectedStatus,
  });
}
</script>
