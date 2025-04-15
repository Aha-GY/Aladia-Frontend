<template>
  <div class="flex items-center gap-4">
    <div class="flex h-10 shrink-0 items-center gap-2 text-lg">
      <BaseCategoryIcon v-if="image" size="xl" :image="image" />
      <i v-if="icon" class="fa-solid" :class="icon" />
      {{ title }}
      <div
        v-if="showClose"
        class="cursor-pointer text-sm text-[#707070] hover:text-[#ffffff]"
        data-cy="8b5715c910efa4c6"
        @click="$emit('close')"
      >
        <i class="fa-regular fa-xmark" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    showClose: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
