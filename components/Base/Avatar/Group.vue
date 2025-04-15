<template>
  <div
    class="relative flex size-8 items-center justify-center rounded-5 text-xl text-white/50"
    :class="[picture ? '' : 'bg-[#1f1f1f]']"
  >
    <img
      v-if="picture"
      :src="picture"
      class="h-full w-full rounded-5 object-cover"
    />
    <div v-else class="flex h-full w-full items-center justify-center">
      <i class="fa-light fa-users" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    picture: {
      type: String,
      default: '',
    },
  },
};
</script>
