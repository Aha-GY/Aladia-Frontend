<template>
  <div
    class="flex w-24 items-center justify-between rounded-5 bg-[#303030] p-1 text-xs shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]"
  >
    <div
      class="flex h-6 w-6 cursor-pointer items-center justify-center"
      :class="{
        'cursor-not-allowed text-[#FAFAFA4D]': disabledDecrement,
      }"
      data-cy="b7a04fe470c00c04"
      @click="decrement"
    >
      <i class="fa-solid fa-minus" />
    </div>
    <input
      v-model="inputValue"
      type="number"
      class="h-6 min-w-0 flex-1 bg-transparent text-center text-sm font-medium [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      :min="min"
      :max="max"
      :disabled="disabledDecrement && disabledIncrement"
      @blur="handleBlur"
      @keypress="handleKeyPress"
      @keypress.enter="handleBlur"
    />
    <div
      class="flex h-6 w-6 cursor-pointer items-center justify-center"
      :class="{
        'cursor-not-allowed text-[#FAFAFA4D]': disabledIncrement,
      }"
      data-cy="b7a04fe470c00c01"
      @click="increment"
    >
      <i class="fa-solid fa-plus" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: null,
  },
  disabledDecre: {
    type: Boolean,
    default: false,
  },
  disabledIncre: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:modelValue', 'change']);
const value = ref(props.modelValue);
const inputValue = ref(props.modelValue);

const handleKeyPress = (e) => {
  const charCode = typeof e.charCode !== 'undefined' ? e.charCode : e.keyCode;
  const char = String.fromCharCode(charCode);
  if (!/^\d+$/.test(char) || char === 'e' || char === '+' || char === '-') {
    e.preventDefault();
  }
};

watch(
  () => props.modelValue,
  (val) => {
    value.value = val;
    inputValue.value = val;
  },
  { immediate: true },
);

const disabledDecrement = computed(
  () => props.disabledDecre || value.value <= props.min,
);

const disabledIncrement = computed(
  () => props.disabledIncre || (props.max !== null && value.value >= props.max),
);

const validateValue = (val) => {
  let newValue = Number(val);

  if (isNaN(newValue)) {
    newValue = props.min;
  }

  if (newValue < props.min) {
    newValue = props.min;
  }

  if (props.max !== null && newValue > props.max) {
    newValue = props.max;
  }

  return newValue;
};

const handleBlur = () => {
  const newValue = validateValue(inputValue.value);
  value.value = newValue;
  inputValue.value = newValue;
  emit('update:modelValue', newValue);
  emit('change', { value: newValue, type: 'input' });
};

const decrement = () => {
  if (disabledDecrement.value) {
    return;
  }
  value.value -= 1;
  inputValue.value = value.value;
  emit('update:modelValue', value.value);
  emit('change', { value: value.value, type: 'decrement' });
};

const increment = () => {
  if (disabledIncrement.value) {
    return;
  }
  value.value += 1;
  inputValue.value = value.value;
  emit('update:modelValue', value.value);
  emit('change', { value: value.value, type: 'increment' });
};
</script>
