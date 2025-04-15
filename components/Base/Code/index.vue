<template>
  <div
    ref="compRef"
    class="relative flex h-10 w-full justify-between text-xl text-black"
  >
    <input
      v-for="n in 6"
      :key="n"
      v-model="codes[n - 1]"
      maxlength="1"
      :disabled="props.disabled"
      class="flex w-10 items-center justify-center rounded bg-white text-center outline-none transition-transform active:scale-90"
      data-cy="8c68883ef62e4798"
      @input="onInput(n - 1)"
      @paste="onPaste"
      @click="onClick"
      @keyup.delete="onDelete(n - 1)"
      @keydown.enter="onEnter"
    />
  </div>
</template>
<script setup>
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});
const emits = defineEmits(['enter']);
const compRef = ref(null);
const codes = defineModel({ type: Array, default: ['', '', '', '', '', ''] });

const onInput = (index) => {
  const $next = compRef.value.children[index + 1];
  if ($next && codes.value[index].trim()) {
    $next.focus();
    $next.select();
  }
};
const onPaste = (event) => {
  codes.value = event.clipboardData.getData('text').split('');
};
const onClick = (event) => {
  event.target.select();
};
const onDelete = (index) => {
  const $prev = compRef.value.children[index - 1];
  if ($prev && !codes.value[index].trim()) {
    $prev.focus();
    $prev.select();
  }
};
const onEnter = async () => {
  emits('enter', codes);
};
</script>
