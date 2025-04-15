<template>
  <div v-if="gif !== ''" class="mt-1 flex gap-1">
    <img :src="gif" alt="GIF" class="ml-2 size-10 rounded-lg border" />
    <i
      v-if="!editorLoading"
      class="fa-light fa-xmark cursor-pointer"
      @click="onGifClose"
    />
  </div>
</template>
<script setup>
const socialStore = useSocialStore();
const globalStore = useGlobalStore();

const gif = computed(() => socialStore.gif);
const editorLoading = computed(() => globalStore.editorLoading);
const onGifClose = () => {
  socialStore.gif = '';
};
</script>
