<template>
  <div class="flex flex-col gap-4 overflow-hidden">
    <div
      v-for="url in urls"
      :key="url"
      class="mb-1 w-[25rem] rounded-5 max-sm:w-[17.5rem]"
      :class="isPopup ? '!w-[17.5rem]' : ''"
    >
      <div
        class="flex-1 overflow-hidden rounded-5"
        style="position: relative; padding-bottom: 75%; height: 0"
      >
        <iframe
          :src="url"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
          frameborder="0"
          webkitallowfullscreen
          mozallowfullscreen
          allowfullscreen
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    urls: Array,
    isPopup: Boolean,
  },
};
</script>
