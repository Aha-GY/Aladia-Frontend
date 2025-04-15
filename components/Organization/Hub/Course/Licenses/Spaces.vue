<template>
  <div
    class="hide-scrollbar flex flex-col gap-1 overflow-y-auto overscroll-contain"
    :class="inSpace ? 'h-0 flex-1' : 'max-h-72'"
  >
    <div
      v-for="item in spaces"
      :key="item.id"
      class="flex items-center gap-3 rounded border p-1.5 hover:bg-white/5"
      :class="item.id === spaceId ? 'border-[#E0B92C]' : 'border-transparent'"
    >
      <BaseSpaceLogo class="!size-12 !text-xl" :space="item" />
      <div class="flex h-[3rem] flex-1 flex-col justify-between">
        <div class="max-w-56 flex-1 truncate text-base text-[#FAFAFA]">
          {{ item.name }}
        </div>
        <div class="shrink-0 text-xs font-medium text-[#707070]">
          {{ item.currentCourseTotal }} Licenses Assigned
        </div>
      </div>
      <BaseInputStepNumber
        v-model="item.assignedAmount"
        :max="getMaxAmount(item)"
        :disabled-incre="remainingLicenses <= 0"
        @change="(event) => handleNumberChange(event, item)"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  spaces: {
    type: Array,
    default: () => [],
  },
  spaceId: {
    type: String,
    default: '',
  },
  total: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['change']);

const route = useRoute();

const inSpace = computed(() => route.name.endsWith('name-spaces'));

// 计算已分配的证书总数
const totalAssigned = computed(() =>
  props.spaces.reduce((sum, space) => sum + (space.assignedAmount || 0), 0),
);

// 计算剩余可分配的证书数量
const remainingLicenses = computed(() => props.total - totalAssigned.value);

// 获取每个空间可分配的最大数量
const getMaxAmount = (currentSpace) => {
  const currentAmount = currentSpace.assignedAmount || 0;
  return currentAmount + remainingLicenses.value;
};

// 处理数量变化
const handleNumberChange = (event, space) => {
  const { value } = event;
  const oldValue = space.assignedAmount || 0;
  const change = value - oldValue;

  // 检查变化后的总数是否超过限制
  if (totalAssigned.value + change > props.total) {
    // 如果超过限制，重置为原值
    space.assignedAmount = oldValue;
    return;
  }

  // 更新值
  space.assignedAmount = value;

  // 发送剩余数量到父组件
  emit('change', remainingLicenses.value);
};
</script>
