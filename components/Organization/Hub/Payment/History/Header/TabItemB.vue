<template>
  <!-- transaction/subscription filter tab -->
  <div
    class="mr-1 flex items-center rounded px-1.5 py-0.5 text-xs transition-all"
    :class="[
      isActive ? 'bg-white/10' : 'hover:scale-105 hover:bg-white/10',
      loading || disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    data-cy="c5114ab16f5a2f75"
    @click="handleTabChange(name)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <i class="transition-all" :class="getIconClass(name)" />
    <span class="ml-1.5">{{ $t(title) }}</span>
  </div>
</template>

<script setup>
import { QUERY_PARAMS } from '~/constant/payment';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const authStore = useAuthStore();
const hubPaymentStore = useHubPaymentStore();
const isHover = ref(false);

const disabled = computed(() => {
  if (props.name !== QUERY_PARAMS.FILTER_QUERY.SPENDING.key) {
    if (!authStore.finishedSignup) {
      return true;
    }
  }
  return false;
});
const loading = computed(() => hubPaymentStore.loading);
const activeKey = computed(
  () => hubPaymentStore.v2PaymentTransactionsFilterQuery.filterQuery,
);
const isActive = computed(() => activeKey.value === props.name);

function handleTabChange(tabKey) {
  if (loading.value) {
    return;
  }
  if (disabled.value) {
    return;
  }
  hubPaymentStore.getPaymentTransactionsQueryChange({
    filterQuery: tabKey,
  });
}

function handleMouseEnter() {
  if (isActive.value) {
    return;
  }
  isHover.value = true;
}

function handleMouseLeave() {
  isHover.value = false;
}

function getIconClass(key) {
  const { SPENDING, INCOMING, PAYOUTS, CUSTOMERS } = QUERY_PARAMS.FILTER_QUERY;

  let colorClass = '';
  let iconClass = '';

  switch (key) {
    case SPENDING.key:
      colorClass = 'icon-red-tab-item-b';
      iconClass = 'fa-solid fa-arrow-down';
      break;
    case INCOMING.key:
      colorClass = 'icon-green-tab-item-b';
      iconClass = 'fa-solid fa-arrow-up';
      break;
    case PAYOUTS.key:
      iconClass = 'fa-regular fa-money-bill-transfer';
      colorClass = 'icon-white-tab-item-b';
      break;
    case CUSTOMERS.key:
    default:
      colorClass = 'icon-white-tab-item-b';
      iconClass = 'fa-regular fa-users';
  }

  return `${colorClass} ${iconClass}`;
}
</script>

<style lang="scss">
.icon-white-tab-item-b {
  color: #fafafa;
}

.icon-green-tab-item-b {
  color: #86efac;
}
.icon-red-tab-item-b {
  color: #851f1b;
}
</style>
