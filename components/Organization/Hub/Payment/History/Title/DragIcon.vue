<template>
  <div
    class="reset-width-icon absolute bottom-[6px] right-[-4px] top-[6px] z-10 h-[calc(100%-10px)] w-1.5 cursor-col-resize rounded opacity-0 transition-all hover:bg-[#F0CA41] hover:opacity-100"
    @mousedown="startDrag($event)"
  />
</template>

<script setup>
const props = defineProps({
  column: Object,
});

const dragging = ref(false);
const startX = ref(0);
const startWidth = ref(0);

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
});

const startDrag = (event) => {
  dragging.value = true;
  startX.value = event.clientX;
  startWidth.value = props.column.width;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
};

const onDrag = (event) => {
  if (dragging.value) {
    const deltaX = event.clientX - startX.value;
    const newWidth = startWidth.value + deltaX;
    const minWidth = props.column.minWidth || 50;
    // add padding value
    if (newWidth > minWidth + 26) {
      props.column.width = newWidth;
    }
  }
};

const stopDrag = () => {
  dragging.value = false;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};
</script>
