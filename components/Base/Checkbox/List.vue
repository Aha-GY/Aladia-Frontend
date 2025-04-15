<template>
  <div
    class="flex items-center gap-2 rounded-md p-1.5 text-[#B0B0B0] transition-all hover:bg-white/5 hover:text-[#D9D9D9]"
  >
    <div v-if="icon" class="flex h-4 w-4 items-center justify-center">
      <i class="fa-solid" :class="icon" />
    </div>
    <div class="w-0 flex-1 truncate text-xs">{{ $t(name) }}</div>
    <BaseCheckboxStyle
      :state="active ? 'checked' : 'unchecked'"
      data-cy="check-box-check-uncheck-button"
      @click="$emit('change')"
    />
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
