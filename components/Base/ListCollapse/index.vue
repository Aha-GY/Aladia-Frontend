<template>
  <div class="flex items-center">
    <el-tooltip
      v-for="item in listViewType"
      :key="item.label"
      effect="light"
      :content="t(item.label)"
      placement="bottom"
    >
      <div
        class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-5"
        :class="{
          'bg-[#FFFFFF26]': item.value === isCollapse,
        }"
        data-cy="21f502d6e90c1075"
        @click="handlerChangeOpenType(item.value)"
      >
        <i :class="[item.icon]" />
      </div>
    </el-tooltip>
  </div>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue']);

const { t } = useI18n();

const listViewType = ref([
  {
    icon: 'fas fa-list',
    value: false,
    label: 'base.list.view',
  },
  {
    icon: 'fas fa-list-tree',
    value: true,
    label: 'base.list.open',
  },
]);
const isCollapse = ref(false);
watch(
  () => props.modelValue,
  (value) => {
    isCollapse.value = value;
  },
  { immediate: true },
);
const handlerChangeOpenType = (type) => {
  emit('update:modelValue', type);
};
</script>
