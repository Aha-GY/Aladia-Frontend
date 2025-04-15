<template>
  <div class="flex">
    <div
      ref="toggleRef"
      class="group/input relative flex w-full items-center justify-between pb-1 font-light"
    >
      <div
        class="flex-1 cursor-pointer hover:text-white"
        data-cy="45b46987e79a91e4"
        @click="handleSelectFocus"
      >
        {{ OPTIONS[mode].label }}
      </div>
      <BaseLine :active="open" />
    </div>

    <div v-if="mode === OPTIONS.greater.value" class="flex items-center">
      <span class="mx-2">></span>
      <div>
        <BaseInput
          v-model="greater"
          type="number"
          placeholder="0"
          class="h-full !w-14"
        />
      </div>
    </div>

    <div v-if="mode === OPTIONS.equal.value" class="flex items-center">
      <span class="mx-2">=</span>
      <div>
        <BaseInput
          v-model="equal"
          type="number"
          placeholder="0"
          class="h-full !w-14"
        />
      </div>
    </div>

    <div v-if="mode === OPTIONS.less.value" class="flex items-center">
      <span class="mx-2">{{ `<` }}</span>
      <div>
        <BaseInput
          v-model="less"
          type="number"
          placeholder="0"
          class="h-full !w-14"
        />
      </div>
    </div>

    <div v-if="mode === OPTIONS.between.value" class="ml-2 flex items-center">
      <div>
        <BaseInput
          v-model="betweenA"
          type="number"
          placeholder="0"
          class="h-full !w-14"
        />
      </div>
      <i class="fa-regular fa-arrows-left-right mx-2" />
      <div>
        <BaseInput
          v-model="betweenB"
          type="number"
          placeholder="0"
          class="h-full !w-14"
        />
      </div>
    </div>

    <el-popover
      width="12rem"
      :visible="open"
      :virtual-ref="toggleRef"
      placement="bottom-start"
      :show-arrow="false"
    >
      <div ref="itemsRef">
        <div
          v-for="item in OPTIONS"
          :key="item.value"
          class="cursor-default p-2 hover:bg-white/5"
          :value="item.value"
          @click="handleClickItem(item.value)"
        >
          {{ item.label }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import {
  AMOUNT_FILTER_OPTIONS as OPTIONS,
  FILTER_KEYS,
} from '~/constant/payment';

const props = defineProps({
  filterParams: {
    type: Object || null,
  },
  filterKey: {
    type: String, // amount || netAmount || quantity
    required: true,
  },
});
const emits = defineEmits(['change']);

const open = ref(false);
const toggleRef = ref(null);
const itemsRef = ref(null);
const mode = ref(OPTIONS.greater.value);
const greater = ref('');
const equal = ref('');
const less = ref('');
const betweenA = ref('');
const betweenB = ref('');

const keys = computed(() => {
  if (props.filterKey === FILTER_KEYS.AMOUNT_EQUAL) {
    return [
      FILTER_KEYS.AMOUNT_EQUAL,
      FILTER_KEYS.AMOUNT_MIN,
      FILTER_KEYS.AMOUNT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.NET_AMOUNT_EQUAL) {
    return [
      FILTER_KEYS.NET_AMOUNT_EQUAL,
      FILTER_KEYS.NET_AMOUNT_MIN,
      FILTER_KEYS.NET_AMOUNT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.PAID_INSTALLMENT_EQUAL) {
    return [
      FILTER_KEYS.PAID_INSTALLMENT_EQUAL,
      FILTER_KEYS.PAID_INSTALLMENT_MIN,
      FILTER_KEYS.PAID_INSTALLMENT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.PLANNED_INSTALLMENT_EQUAL) {
    return [
      FILTER_KEYS.PLANNED_INSTALLMENT_EQUAL,
      FILTER_KEYS.PLANNED_INSTALLMENT_MIN,
      FILTER_KEYS.PLANNED_INSTALLMENT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.PAID_AMOUNT_EQUAL) {
    return [
      FILTER_KEYS.PAID_AMOUNT_EQUAL,
      FILTER_KEYS.PAID_AMOUNT_MIN,
      FILTER_KEYS.PAID_AMOUNT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.TOTAL_AMOUNT_EQUAL) {
    return [
      FILTER_KEYS.TOTAL_AMOUNT_EQUAL,
      FILTER_KEYS.TOTAL_AMOUNT_MIN,
      FILTER_KEYS.TOTAL_AMOUNT_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.NET_RECEIVED_EQUAL) {
    return [
      FILTER_KEYS.NET_RECEIVED_EQUAL,
      FILTER_KEYS.NET_RECEIVED_MIN,
      FILTER_KEYS.NET_RECEIVED_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.TOTAL_SPENDING_EQUAL) {
    return [
      FILTER_KEYS.TOTAL_SPENDING_EQUAL,
      FILTER_KEYS.TOTAL_SPENDING_MIN,
      FILTER_KEYS.TOTAL_SPENDING_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.TOTAL_TRANSACTIONS_EQUAL) {
    return [
      FILTER_KEYS.TOTAL_TRANSACTIONS_EQUAL,
      FILTER_KEYS.TOTAL_TRANSACTIONS_MIN,
      FILTER_KEYS.TOTAL_TRANSACTIONS_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.TOTAL_SUBSCRIPTIONS_EQUAL) {
    return [
      FILTER_KEYS.TOTAL_SUBSCRIPTIONS_EQUAL,
      FILTER_KEYS.TOTAL_SUBSCRIPTIONS_MIN,
      FILTER_KEYS.TOTAL_SUBSCRIPTIONS_MAX,
    ];
  }
  if (props.filterKey === FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_EQUAL) {
    return [
      FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_EQUAL,
      FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_MIN,
      FILTER_KEYS.ACTIVE_SUBSCRIPTIONS_MAX,
    ];
  }

  return [
    FILTER_KEYS.QUANTITY_EQUAL,
    FILTER_KEYS.QUANTITY_MIN,
    FILTER_KEYS.QUANTITY_MAX,
  ];
});

onClickOutside(itemsRef, () => {
  open.value = false;
});

watch(
  () => props.filterParams,
  (value) => {
    if (value) {
      // reset
      if (Object.keys(value).length === 0) {
        greater.value = '';
        equal.value = '';
        less.value = '';
        betweenA.value = '';
        betweenB.value = '';
        return;
      }

      if (value[keys.value[0]] !== undefined) {
        if (!equal.value) {
          mode.value = OPTIONS.equal.value;
          equal.value = value[keys.value[0]];
        }
        return;
      }

      if (
        value[keys.value[1]] !== undefined &&
        value[keys.value[2]] !== undefined
      ) {
        mode.value = OPTIONS.between.value;
        if (!betweenA.value) {
          betweenA.value = value[keys.value[1]];
        }
        if (!betweenB.value) {
          betweenB.value = value[keys.value[2]];
        }
        return;
      }

      if (value[keys.value[1]] !== undefined) {
        mode.value = OPTIONS.greater.value;
        greater.value = value[keys.value[1]];
        return;
      }

      if (value[keys.value[2]] !== undefined) {
        mode.value = OPTIONS.less.value;
        less.value = value[keys.value[2]];
      }
    }
  },
  { immediate: true },
);

watch(
  () => [
    mode.value,
    greater.value,
    equal.value,
    less.value,
    betweenA.value,
    betweenB.value,
  ],
  (newVal, oldVal) => {
    const [
      modeValue,
      greaterValue,
      equalValue,
      lessValue,
      betweenAValue,
      betweenBValue,
    ] = newVal;
    const [oldModeValue] = oldVal;
    if (oldModeValue !== modeValue) {
      // console.log('select option');
      return;
    }

    if (modeValue === OPTIONS.equal.value) {
      debouncedLoadData({
        [keys.value[0]]: equalValue > 0 ? equalValue : undefined,
        [keys.value[1]]: undefined,
        [keys.value[2]]: undefined,
      });
      return;
    }
    if (modeValue === OPTIONS.greater.value) {
      debouncedLoadData({
        [keys.value[0]]: undefined,
        [keys.value[1]]: greaterValue > 0 ? greaterValue : undefined,
        [keys.value[2]]: undefined,
      });
      return;
    }
    if (modeValue === OPTIONS.less.value) {
      debouncedLoadData({
        [keys.value[0]]: undefined,
        [keys.value[1]]: undefined,
        [keys.value[2]]: lessValue > 0 ? lessValue : undefined,
      });
      return;
    }
    if (modeValue === OPTIONS.between.value) {
      if (betweenAValue > 0 && betweenBValue > 0) {
        debouncedLoadData({
          [keys.value[0]]: undefined,
          [keys.value[1]]: betweenAValue,
          [keys.value[2]]: betweenBValue,
        });
      }
      if (!betweenAValue && !betweenBValue) {
        debouncedLoadData({
          [keys.value[0]]: undefined,
          [keys.value[1]]: undefined,
          [keys.value[2]]: undefined,
        });
      }
      return;
    }
  },
);

const debouncedLoadData = debounce((params) => {
  emits('change', params);
}, 500);

function handleSelectFocus() {
  open.value = true;
}

function handleClickItem(value) {
  mode.value = value;
  open.value = false;

  // clear numbers
  equal.value = '';
  less.value = '';
  betweenA.value = '';
  betweenB.value = '';
}
</script>
