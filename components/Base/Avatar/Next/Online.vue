<template>
  <div
    class="absolute inset-0 size-full rounded-full"
    :class="{
      'bg-[#4d854c]': active,
      'bg-[#555555]': !active,
    }"
  />
</template>

<script setup>
const props = defineProps({
  size: {
    type: String,
    default: 'sm',
  },
  online: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: '',
  },
});

const appStore = useAppStore();

const active = computed(() => props.online || appStore.onlines[props.userId]);
</script>
