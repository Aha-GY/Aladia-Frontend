<template>
  <div class="flex items-center">
    <div
      class="flex h-6 w-6 items-center justify-center rounded-md bg-[#060606] transition-all hover:bg-white hover:bg-opacity-20"
      :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      data-cy="773ea344f8605c7d"
      @click="decrement"
    >
      <i class="fa-solid fa-minus" />
    </div>
    <div class="mx-1 border-b border-[#707070] px-2">
      <input
        type="number"
        class="h-6 w-12 appearance-none bg-transparent text-center text-white outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        :value="displayValue"
        :min="minValue"
        step="1"
        data-cy="16cd62086f6883a4"
        :disabled="disabled"
        @input="handleInput"
        @blur="handleBlur"
        @keydown="preventInvalidInput"
      />
    </div>
    <div
      class="flex h-6 w-6 items-center justify-center rounded-md bg-[#060606] transition-all hover:bg-white hover:bg-opacity-20"
      :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'"
      data-cy="e3680bf00904471e"
      @click="increment"
    >
      <i class="fa-solid fa-plus" />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  minValue: {
    type: Number,
    default: 1,
  },
  maxValue: {
    type: Number,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  invalidInput: {
    type: Array,
    default: () => ['e', 'E', '+', '-', '.'],
  },
});

const emit = defineEmits(['update:modelValue', 'onchange']);

const displayValue = computed(() =>
  +props.modelValue <= 0 ? props.minValue : props.modelValue,
);

watch(
  () => props.modelValue,
  (newValue) => {
    emit('onchange', newValue);
  },
);

function handleInput(event) {
  const inputValue = event.target.value;
  if (inputValue === '') {
    emit('update:modelValue', 0);
  } else {
    const numValue = parseInt(inputValue, 10);
    emit(
      'update:modelValue',
      isNaN(numValue) ? props.minValue : Math.max(props.minValue, numValue),
    );
  }
}

function handleBlur() {
  if (props.modelValue === 0) {
    emit('update:modelValue', props.minValue);
  }
}

function increment() {
  if (props.disabled) {
    return;
  }
  if (props.maxValue) {
    if (props.modelValue < props.maxValue) {
      emit('update:modelValue', props.modelValue + 1);
    }
  } else {
    emit('update:modelValue', props.modelValue + 1);
  }
}

function decrement() {
  if (props.disabled) {
    return;
  }
  if (props.modelValue > props.minValue) {
    emit('update:modelValue', props.modelValue - 1);
  }
}

function preventInvalidInput(event) {
  const invalidChars = props.invalidInput;
  if (invalidChars.includes(event.key)) {
    event.preventDefault();
  }
}
</script>

<style scoped>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type='number'] {
  appearance: textfield;
}
</style>
