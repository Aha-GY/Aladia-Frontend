<template>
  <div
    ref="avatar"
    class="relative flex cursor-pointer items-center justify-center rounded-full text-white/20"
    :class="{
      'size-7 text-sm': size === 'sm',
      'size-12 text-lg': size === 'md',
    }"
  >
    <div
      class="relative size-full overflow-hidden rounded-5"
      :style="{ clipPath: clipPath }"
    >
      <div
        v-if="space"
        class="flex size-full items-center justify-center bg-white/10"
      >
        <SocialShareIcon :item="item" :is-shopping="isShopping" :size="size" />
      </div>
      <div v-else class="flex size-full items-center justify-center">
        <img
          v-if="open"
          class="h-full w-full"
          src="~/assets/icons/folder-open.svg"
        />
        <img v-else class="h-full w-full" src="~/assets/icons/folder.svg" />
      </div>
    </div>
  </div>

  <div class="absolute inset-0 rounded-full">
    <slot name="button" v-bind="props" />
  </div>
</template>

<script setup>
const props = defineProps({
  isShopping: {
    type: Boolean,
    default: false,
  },
  item: {
    type: Object,
    default: () => ({}),
  },
  border: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'sm',
  },
  space: {
    type: Boolean,
    default: true,
  },
  open: {
    type: Boolean,
    default: false,
  },
});
const avatar = ref(null);
const { width: elementWidth } = useElementSize(avatar);
const width = ref(0);
const slots = useSlots();
const hasButtonSlot = computed(() => !!slots.button);

const hole = computed(() => hasButtonSlot.value);
onMounted(() => {
  // Initialize width
  width.value = elementWidth.value || 0;
});

watch(elementWidth, (newWidth) => {
  width.value = newWidth || 0;
});

const clipPath = computed(() => {
  if (!width.value || !hole.value) {
    return '';
  }
  const { offset, radius } = {
    sm: { offset: 23.9, radius: 5.5 },
    md: { offset: 41, radius: 9 },
    lg: { offset: 70, radius: 13 },
    xl: { offset: 176, radius: 27 },
  }[props.size];
  return `path('M 0,0 H ${width.value} V ${width.value} H 0 V 0 Z M ${offset},${offset} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0 Z')`;
});
</script>
