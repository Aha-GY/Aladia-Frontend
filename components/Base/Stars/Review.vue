<template>
  <div class="relative flex size-4 items-center justify-center text-9">
    <div v-if="value === 1">
      <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
    </div>
    <div v-if="value === 2" class="flex items-center gap-0.5">
      <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
    </div>
    <div v-if="value === 3" class="flex flex-col items-center gap-0.5">
      <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      <div class="flex items-center gap-0.5">
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      </div>
    </div>
    <div v-if="value === 4" class="flex flex-col items-center gap-0.5">
      <div class="flex items-center gap-0.5">
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      </div>
      <div class="flex items-center gap-0.5">
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      </div>
    </div>
    <div v-if="value === 5" class="flex flex-col items-center gap-0">
      <div class="flex translate-y-0.5 items-center gap-0.5">
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      </div>
      <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      <div class="flex -translate-y-0.5 items-center gap-0.5">
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
        <i class="fa-star" :class="active ? 'fa-solid' : 'fa-regular'" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
