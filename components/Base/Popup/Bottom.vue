<template>
  <div
    class="flex w-full items-center justify-between border-white/10 pt-2 font-medium"
    :class="border ? 'border-t' : ''"
  >
    <div
      class="inline-flex cursor-pointer items-center justify-center gap-2 rounded bg-[#A20F0F]/5 px-2 py-0.5 text-[#94231b] hover:bg-[#a20f0f26]"
      data-cy="close-date-picker-button"
      @click.stop="$emit('close')"
    >
      <div class="flex size-3 items-center justify-center">
        <i class="fa-solid fa-arrow-turn-left text-sm" />
      </div>
      {{ $t('base.dialog.close') }}
    </div>
    <div
      v-if="clear"
      class="cursor-pointer py-0.5 text-[#dabb4b]"
      data-cy="2867a699cc88d63d"
      @click.stop="$emit('clear')"
    >
      {{ $t('base.dialog.clearAll') }}
    </div>
    <BasePopupOperator
      v-if="operator"
      :operator="operator"
      @operator="$emit('operator', $event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    clear: Boolean,
    operator: String,
    border: {
      type: Boolean,
      default: true,
    },
  },
};
</script>
