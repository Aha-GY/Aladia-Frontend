<template>
  <div class="group/avatar relative" :class="[sizeClasses]">
    <img
      v-if="picture && !srcError"
      :src="picture"
      :class="['h-full w-full object-cover object-center', circleType]"
      @error="srcError = true"
    />
    <div
      v-else
      class="flex h-full w-full items-center justify-center rounded-full bg-[#2c2c2c] text-[#515151]"
      :class="{
        'transition-all duration-300 group-hover/item:text-white': hasStory,
      }"
    >
      <i :class="defaultIcon" />
    </div>
    <div
      v-if="hasStory"
      class="absolute inset-0 h-full w-full rounded-full bg-[#000000] opacity-0 transition-opacity duration-300 group-hover/item:opacity-60"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  picture: {
    type: String,
    default: '',
  },
  hasStory: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
    require: true,
  },
  defaultIcon: {
    type: String,
    default: 'fa-solid fa-user ',
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  round: {
    type: Boolean,
    default: true,
  },
});

const srcError = ref(false);

const sizeClasses = computed(() => {
  if (props.size === 'sm') {
    return 'size-7';
  }
  if (props.size === 'md') {
    if (props.hasStory) {
      return 'size-[3rem] p-0.5';
    }
    return 'size-[3rem]';
  }
  if (props.size === 'lg') {
    return 'size-20 p-1';
  }
  if (props.size === 'xl') {
    if (props.hasStory) {
      return 'size-[12.5rem] p-1 text-8xl';
    }
    return 'size-48 text-8xl';
  }
  return '';
});

const defaultIcon = computed(() => {
  if (props.isGroup) {
    return 'fa-solid fa-users';
  }
  return props.defaultIcon;
});

const circleType = computed(() => {
  if (props.round) {
    return 'rounded-full';
  }
  return 'rounded-5';
});
</script>
