<template>
  <div class="h-full w-full overflow-y-auto">
    <div
      class="mx-auto mb-auto mt-0 h-full w-full rounded-5"
      :class="[
        fluxesStore.creationTab === 'story'
          ? 'md:w-[360px] lg:w-[460px]'
          : 'md:w-[460px] lg:w-[560px]',
      ]"
    >
      <div class="aspect-[9/16] w-full overflow-hidden rounded-5">
        <div
          id="text-story-wrap"
          class="flex h-full w-full items-center transition-colors"
          :style="{ backgroundColor: fluxesStore.createTextStory.color }"
        >
          <div
            class="flex h-[90%] w-full items-center justify-center px-4 text-center"
          >
            <div
              class="max-h-[60%] w-2/3 overflow-y-auto whitespace-pre-wrap text-white"
              :style="textStyle"
            >
              {{ fluxesStore.createTextStory.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();
    return { authStore, fluxesStore };
  },
  computed: {
    textStyle() {
      const style = {
        fontWeight: 'bold',
        fontSize: '22px',
      };

      switch (this.fluxesStore.createTextStory.shape) {
        case 'clean':
          break;
        case 'casual':
          style.fontWeight = 'normal';
          break;
        case 'fancy':
          style.fontStyle = 'italic';
          break;
        case 'headline':
          style.fontWeight = '800';
          style.fontSize = '24px';
          break;
        default:
          break;
      }

      return style;
    },
  },
};
</script>
