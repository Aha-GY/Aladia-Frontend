<template>
  <div class="card relative w-full rounded-5">
    <div
      class="flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-5 bg-[#060606]"
    >
      <div v-if="item.loading" class="skeleton h-full w-full rounded-5" />
      <template v-else>
        <div class="h-full w-full">
          <div
            class="flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-5"
            :style="{
              backgroundImage: backgroundGradient || 'rgba(255,255,255,0.1)',
            }"
          >
            <video
              :class="[
                'h-full w-full object-contain transition-all duration-300',
              ]"
              :src="videoUrl"
              autoplay
              playsinline
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  computed: {
    videoUrl() {
      return this.item?.files?.[0]?.url || '';
    },
  },
};
</script>

<style lang="scss" scoped>
@media (max-width: 48rem) {
  .card {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
  }
}
</style>
