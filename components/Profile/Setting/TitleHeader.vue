<template>
  <div class="flex items-center gap-1.5">
    <slot name="prefix" />
    <div
      class="flex w-0 flex-1 items-center text-lg font-semibold text-[#D9D9D9]/90"
    >
      {{ title }}
    </div>
    <template v-if="detail">
      <img
        v-if="detail?.picture"
        :src="detail?.picture"
        class="h-6 w-6 rounded-full object-cover"
        alt=""
      />
      <div
        v-else
        class="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-[#1C1C1C] pt-2"
      >
        <i class="fa-solid fa-user text-xl text-[#505050]" />
      </div>
    </template>
    <slot name="suffix" />
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    detail() {
      return this.store.getPersonalProfileDetail();
    },
  },
};
</script>
