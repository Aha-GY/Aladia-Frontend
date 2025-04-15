<template>
  <div class="flex items-center gap-2">
    <BaseButton
      type="tertiary"
      class="flex items-center justify-center !gap-0 !text-white"
      :class="cursor?.prev ? '!opacity-100' : '!cursor-not-allowed !opacity-50'"
      data-cy="869b7b8c6beb6762"
      @click="onChange('prev')"
    >
      <i class="fa-regular fa-angle-left mr-2" />
      <span>
        {{ $t('base.pagination.prev') }}
      </span>
    </BaseButton>
    <BaseButton
      type="tertiary"
      class="flex items-center justify-center !gap-0 !text-white"
      :class="cursor?.next ? '!opacity-100' : '!cursor-not-allowed !opacity-50'"
      data-cy="3decb3be7e97cc49"
      @click="onChange('next')"
    >
      <span>{{ $t('base.pagination.next') }}</span>
      <i class="fa-regular fa-angle-right ml-2" />
    </BaseButton>
  </div>
</template>

<script>
export default {
  props: {
    cursor: {
      type: [Object, null],
      required: true,
      default: () => ({
        prev: '',
        next: '',
        totalItems: 0,
      }),
    },
  },
  methods: {
    onChange(type) {
      const token = this.cursor[type];
      if (!token) {
        return;
      }
      this.$emit(type, token);
      this.$emit('change', { type, token });
    },
  },
};
</script>
