<template>
  <div
    class="flex items-center gap-2"
    :class="{
      'text-[#44AD1F]': status === 'published' || status === 'updated',
      'text-[#FF0000]': status === 'rejected',
      'text-[#FFA500]':
        status === 'verifying' ||
        status === 'published-verifying' ||
        status === 'generating',
      'text-[#dddadb]': status === 'draft',
    }"
  >
    <div class="flex size-5 items-center justify-center">
      <i v-if="status === 'published'" class="fa-regular fa-check" />
      <i v-if="status === 'rejected'" class="fa-regular fa-xmark" />
      <i
        v-if="status === 'verifying' || status === 'published-verifying'"
        class="fa-regular fa-clock"
      />
      <i v-if="status === 'draft'" class="fa-regular fa-pen-to-square" />
      <i v-if="status === 'updated'" class="fa-regular fa-check" />
      <i
        v-if="status === 'generating'"
        class="fa-solid fa-spinner animate-spin text-xs"
      />
    </div>
    <span class="capitalize">{{ status }}</span>
  </div>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
    },
  },
};
</script>
