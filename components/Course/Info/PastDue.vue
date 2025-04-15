<template>
  <div v-if="suspend">
    <div
      v-show="cover"
      class="absolute left-0 right-0 top-0 flex h-full w-full items-center justify-center gap-2"
      :class="[
        suspend ? 'border-2 border-dashed border-red-600 bg-black/70' : '',
      ]"
    >
      <i class="fa-light fa-clock text-red-600" />
      <span class="text-red-600">
        {{ $t('filter.status.pastDue') }}
      </span>
    </div>
    <div
      v-show="!cover"
      class="absolute -left-48 bottom-4 flex h-10 w-44 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-red-600"
    >
      <i class="fa-light fa-clock text-red-600" />
      <span class="text-red-600">
        {{ $t('filter.status.pastDue') }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cover: {
      type: Boolean,
      default: false,
    },
    suspend: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
