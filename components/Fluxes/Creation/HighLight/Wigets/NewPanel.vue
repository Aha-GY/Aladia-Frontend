<template>
  <div class="relative">
    <div
      class="flex w-full flex-col items-center justify-center text-xl text-[#FAFAFA]"
    >
      <div
        class="flex aspect-[9/16] w-full cursor-pointer items-center justify-center rounded-5 border-[1px] border-white/40 transition-all duration-300"
      >
        <div class="swiper-no-swiping flex flex-col gap-4 text-center">
          <BaseButton type="tertiary" class="!opacity-100">
            <span class="w-[1rem]">
              <i class="fa-regular fa-photo-film" />
            </span>
            <span :class="sliderFontSize" class="text-left">
              {{ $t('base.upload.media') }}
            </span>
            <input
              ref="file"
              type="file"
              accept="image/*,video/*"
              class="absolute inset-0 z-10 opacity-0"
              :data-cy="`${dataCy}-media-input`"
              @change="handleChange"
            />
          </BaseButton>
          <BaseButton
            type="tertiary"
            class="!opacity-100"
            data-cy="0ce6d829473912e3"
            @click="$emit('new-blank')"
          >
            <span class="w-[1rem]">
              <i class="fa-regular fa-plus" />
            </span>
            <span :class="sliderFontSize" class="text-left">
              {{ $t('flux.highlight.story.blank.title') }}
            </span>
          </BaseButton>
          <BaseButton
            v-if="showGallery"
            type="tertiary"
            class="!opacity-100"
            :data-cy="`${dataCy}-gallery-trigger-button`"
            @click="$emit('new-gallery')"
          >
            <span class="w-[1rem]">
              <i class="fa-regular fa-rectangle-vertical-history" />
            </span>
            <span :class="sliderFontSize" class="text-left">
              {{ $t('flux.highlight.story.blank.get') }}
            </span>
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isSider: Boolean,
    showGallery: {
      type: Boolean,
      default: true,
    },
    dataCy: {
      type: String,
      default: 'default-story',
    },
  },
  computed: {
    sliderFontSize() {
      return this.isSider ? 'text-xs' : 'text-sm';
    },
  },
  methods: {
    handleChange(event) {
      event.stopPropagation();
      this.$emit('new-media', event);
    },
  },
};
</script>
