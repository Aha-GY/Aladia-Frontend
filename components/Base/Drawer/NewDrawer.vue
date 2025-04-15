<template>
  <component
    :is="appendToBody ? Teleport : 'div'"
    :to="appendToBody ? 'body' : null"
  >
    <div
      class="fixed right-0 top-4 z-[70] flex h-[calc(100vh-2rem)] w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-5 border border-white/10 bg-[#060606] font-light transition-all duration-300 md:w-[28em]"
      :class="{
        'right-0': isShow,
        'right-[-100vw]': !isShow,
      }"
    >
      <!-- header -->
      <slot name="header" />
      <div
        v-if="!$slots.header"
        class="grid grid-cols-9 items-center bg-[#0C0C0C] p-2"
      >
        <BaseIconClose class="ml-2" @click="close" />
        <div class="col-span-5 flex items-center gap-2">
          <slot name="title" />
        </div>
        <div class="col-span-3 flex justify-end">
          <slot name="header-right" />
        </div>
      </div>
      <!-- body -->
      <slot />
      <!-- footer -->
      <slot name="footer" />
    </div>
  </component>
</template>
<script setup>
import { Teleport } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['update:modelValue', 'close']);

// import { useI18n } from 'vue-i18n';

// const { t } = useI18n();
const isShow = ref(props.modelValue);

const close = () => {
  emit('update:modelValue', false);
  emit('close');
};
watch(
  () => props.modelValue,
  (value) => {
    isShow.value = value;
  },
);
</script>
