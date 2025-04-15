<template>
  <div class="relative w-full">
    <BaseInput
      v-model="model"
      class="z-10"
      :title="props.title"
      :placeholder="props.placeholder"
      open
      :max-length="32"
      :type="type"
      :data-cy="props.dataCy"
    />
    <span
      class="absolute bottom-0 right-0 z-20 cursor-pointer p-2 pb-1"
      data-cy="4b8e72bc526a2cac"
      @click="open = !open"
    >
      <i v-if="open" class="fa-regular fa-eye" />
      <i v-else class="fa-regular fa-eye-slash" />
    </span>
  </div>
</template>
<script setup>
const props = defineProps({
  title: String,
  placeholder: String,
  dataCy: String,
});
const open = ref(false);
const model = defineModel({ type: String });
const type = computed(() => (open.value ? 'text' : 'password'));
</script>
