<template>
  <!-- transaction/subscription filter tab -->
  <div
    class="relative mr-2 flex h-8 items-center justify-center p-2 text-xs font-semibold text-[#707070] transition-all active:scale-95"
    :class="[
      activeClass(isActive, isHover),
      loading ? 'cursor-not-allowed' : 'cursor-pointer',
    ]"
    data-cy="9de89fbca8afeaab"
    @click="handleTabChange(name)"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <i v-if="icon" class="fa-light" :class="`${icon}`" />
    {{ $t(title) }}
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    required: true,
    default: 'calendar.notification.all',
  },
  name: {
    type: String,
    required: true,
  },
});

const hubPaymentStore = useHubPaymentStore();

const isHover = ref(false);
const loading = computed(() => hubPaymentStore.loading);
const activeKey = computed(
  () => hubPaymentStore.v2PaymentTransactionsFilterQuery.endpoints,
);
const isActive = computed(() => activeKey.value === props.name);

function handleTabChange(tabName) {
  if (loading.value) {
    return;
  }
  hubPaymentStore.getPaymentTransactionsQueryChange({
    endpoints: tabName,
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

function activeClass(isActiveParam, isHoverParam) {
  const baseLineClass =
    'after:absolute after:content-[""] after:h-[1px] after:w-full after:bottom-0 after:transition-all after:duration-300';
  const Class = `text-[#D9D9D9] ${baseLineClass} after:bg-[#D9D9D9]`;
  if (isHoverParam && !isActiveParam) {
    return Class;
  }
  return isActive.value ? Class : '';
}
</script>
