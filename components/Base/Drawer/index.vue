<template>
  <el-drawer
    v-model="currentModelValue"
    :with-header="false"
    :close-on-click-modal="closeOnClickModal"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :class="componentClass"
    v-bind="$attrs"
  >
    <div class="h-full overflow-hidden p-4 px-2">
      <div class="flex w-full items-center justify-between">
        <div><slot name="left-header" /></div>
        <BaseIconClose data-cy="c807d192d9ff3c91" @click="handleClose" />
      </div>
      <slot />
    </div>
  </el-drawer>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  closeOnPressEscape: {
    type: Boolean,
    default: false,
  },
  destroyOnClose: {
    type: Boolean,
    default: true,
  },
  class: {
    type: String,
    default: '!w-[100%]',
  },
});
const emit = defineEmits('update:modelValue', 'close');
const componentClass = computed(() => props.class);
const currentModelValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  () => {
    currentModelValue.value = props.modelValue;
  },
);
const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};
</script>
