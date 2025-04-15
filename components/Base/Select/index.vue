<template>
  <div
    ref="container"
    class="flex h-fit max-h-56 flex-col gap-1 overflow-y-auto"
    tabindex="0"
  >
    <div
      v-for="item in props.data"
      :key="item.key"
      class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
      :class="{
        'bg-white/5': item.key === current,
        [item.rowClass]: true,
        '!cursor-not-allowed': item.disabled,
      }"
      :data-cy="
        props.dataCy
          ? `${props.dataCy}-${item.key}-option`
          : `${item.key}-option`
      "
      @click="onClick(item)"
    >
      <slot v-if="$slots.default" :row="item" :data-cy="item.key" />
      <template v-else>
        <i v-if="item.iconClass" :class="item.iconClass" />
        <span :data-cy="item.key + '-label'" class="ml-1.5 capitalize">
          {{ item.label }}
        </span>
      </template>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  data: Array,
  defaultValue: String,
  dataCy: String || undefined,
});

const emits = defineEmits(['select']);
const current = ref(props.defaultValue);
const container = ref(null);
const currentFilter = ref(null);
const currentChar = ref(null);
const currentIndex = ref(-1);

const onClick = (item) => {
  if (item.disabled) {
    return;
  }
  currentFilter.value = null;
  current.value = item.key;
  emits('select', item);
};

// Handle keydown events
const onKeyDown = (event) => {
  const char = event.key.toUpperCase();

  // Handle Enter key to select the current item
  if (event.key === 'Enter' && current.value) {
    const selectedItem = props.data.find((item) => item.key === current.value);
    if (selectedItem) {
      onClick(selectedItem);
    }
    return;
  }

  // If the key is not a letter, ignore
  if (!/^[A-Z]$/.test(char)) {
    return;
  }

  // Filter items starting with the pressed character
  const matchingItems = props.data.filter((item) => {
    const label = String(item.label || '');
    return label.charAt(0).toUpperCase() === char;
  });

  if (matchingItems.length > 0) {
    // Determine the next index to select
    if (currentChar.value !== char) {
      currentIndex.value = 0; // Start at the first match
    } else {
      currentIndex.value = (currentIndex.value + 1) % matchingItems.length; // Cycle through matches
    }

    currentChar.value = char;
    const targetItem = matchingItems[currentIndex.value];
    current.value = targetItem.key;

    nextTick(() => {
      const targetIndex = props.data.findIndex(
        (item) => item.key === targetItem.key,
      );
      const targetElement = container.value?.children[targetIndex];
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetElement.focus();
      }
    });
  }
};

// Attach keydown event listener to document.body
onMounted(() => {
  document.body.addEventListener('keydown', onKeyDown);
});

// Clean up event listener
onUnmounted(() => {
  document.body.removeEventListener('keydown', onKeyDown);
});
</script>
