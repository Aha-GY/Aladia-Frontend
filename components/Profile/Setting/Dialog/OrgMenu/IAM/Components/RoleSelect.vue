<template>
  <el-select
    :model-value="role"
    style="width: 9.5rem"
    :disabled="disabled"
    :placeholder="$t('calendar.role.label')"
    @change="changeRole"
  >
    <template #label="{ label }">
      <i
        :class="rolesList.find((item) => item.label === label)?.icon"
        class="mr-2"
      />
      <span>{{ label }}</span>
    </template>
    <el-option
      v-for="item in rolesList"
      :key="item.value"
      :label="$t(item.label)"
      :value="item.value"
    >
      <i :class="item.icon" class="mr-2" />
      <span>{{ $t(item.label) }}</span>
    </el-option>
  </el-select>
</template>
<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  rolesList: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['change', 'update:modelValue']);
const role = computed(() => props.modelValue);
const changeRole = (value) => {
  emit('update:modelValue', value);
  emit('change', value);
};
watch(
  () => props.disabled,
  (value) => {
    if (value) {
      emit('update:modelValue', null);
      emit('change', null);
    }
  },
);
</script>
