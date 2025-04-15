<template>
  <div class="fixed inset-0 z-[9999] bg-black">
    <div class="flex h-full w-full items-center overflow-hidden">
      <div class="h-screen w-screen" />

      <div
        class="absolute inset-x-0 z-10 flex h-full w-full flex-col items-center bg-[#101010]/60 py-4 md:py-10"
      >
        <div
          class="absolute left-0 top-6 z-[110] hidden rounded-md px-6 py-1.5 hover:bg-[#101010]/40 md:block"
        >
          <div class="flex items-center gap-2">
            <div
              class="rounded-full bg-[#FFFFFF1A]/10 p-3"
              @click="handleClose"
            >
              <BaseIconClose class="close-btn stories-main-slider__item-btn" />
            </div>
            <p>
              {{ $t('post.reel.preview') }}
            </p>
          </div>
        </div>

        <div
          class="card relative flex aspect-[9/16] h-full w-full max-w-fit overflow-hidden rounded-5"
        >
          <div
            ref="watchRef"
            class="flex h-full w-full justify-center rounded-md"
          >
            <div class="gradient-mask z-[101]" />
            <div class="relative aspect-[9/16]">
              <video
                ref="videoElement"
                class="h-full w-full object-cover hover:cursor-pointer"
                autoplay
                :poster="selectedMedia"
                :src="fluxesStore.createMediaReel?.file?.src"
                @click="handleClickPause"
                @loadedmetadata="onMetadataLoaded"
                @timeUpdate="onTimeUpdate"
              />

              <div
                class="absolute right-2.5 top-2.5 z-[8888] flex items-center gap-2.5"
              >
                <span
                  class="relative z-[101] flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-5 hover:bg-[#E5E5E51A]/10"
                  @click="handleClickPause"
                >
                  <i v-if="playing" class="fa-solid fa-pause" />
                  <i v-if="!playing" class="fa-regular fa-play" />
                </span>

                <span
                  class="relative z-[101] flex h-[1.875rem] w-[1.875rem] cursor-pointer items-center justify-center rounded-5 hover:bg-[#E5E5E51A]/10"
                  @click="handleClickMute"
                >
                  <i
                    v-if="muted"
                    class="fa-regular fa-volume-xmark drop-shadow-md"
                  />
                  <i
                    v-if="!muted"
                    class="fa-regular fa-volume drop-shadow-md"
                  />
                </span>

                <!-- No more actions for preview mode -->
              </div>

              <div :class="[!isExpanded ? 'mask z-[101]' : '']" />

              <div
                :class="
                  isExpanded
                    ? 'expand-mask absolute bottom-0 left-0 z-[101] mb-2 flex h-fit w-full flex-col px-4 py-6 text-base'
                    : 'absolute bottom-0 left-0 z-[101] mb-2 flex h-fit w-full flex-col px-5 py-6 text-base'
                "
              >
                <div class="relative flex shrink-0 items-center gap-2">
                  <BaseAvatarNext
                    :picture="user.picture"
                    :user-id="user?.id"
                    :online="user?.online"
                    :story="user?.story"
                    size="sm"
                    class="shrink-0"
                  />

                  <p class="cursor-pointer hover:underline">
                    {{ profileStore.myProfileDetail.fullName }}
                  </p>
                </div>

                <div class="z-[105] h-fit w-full">
                  <div
                    v-if="isExpanded"
                    class="hide-scrollbar mb-2 w-[87%] overflow-y-scroll text-justify"
                    style="max-height: 9.375rem"
                  >
                    <span
                      class="w-full font-['Inter'] text-sm font-normal leading-[18.90px] text-[#d9d9d9]"
                      style="word-break: break-word; overflow-wrap: anywhere"
                    >
                      {{ fullContent }}
                      <span
                        class="cursor-pointer font-['Inter'] text-sm font-normal leading-[1.181rem] text-[#e0b92c] underline"
                        @click="toggleExpand"
                      >
                        {{ $t('post.content.less') }}
                      </span>
                    </span>
                  </div>
                  <div v-else class="flex w-[90%]">
                    <p
                      class="font-['Inter'] text-sm font-normal leading-[18.90px] text-[#d9d9d9]"
                      style="word-break: break-word; overflow-wrap: anywhere"
                    >
                      {{ truncatedContent }}

                      <span
                        v-if="showToggle"
                        class="cursor-pointer font-['Inter'] text-sm font-normal leading-[18.90px] text-[#e0b92c] underline"
                        @click="toggleExpand"
                      >
                        {{ $t('post.content.more') }}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div
                class="absolute bottom-40 right-1 z-[103] flex w-10 flex-col gap-2"
                style="height: 5rem"
              >
                <div
                  class="group relative flex h-[3rem] cursor-pointer flex-col items-center justify-between"
                  @mouseenter="onMouseenterGroup"
                  @mouseleave="onMouseleaveGroup"
                >
                  <div ref="react" data-cy="fd494757f0a08ff4">
                    <SocialReaction
                      id=""
                      name="like"
                      :count="0"
                      @mouseenter="onMouseEnterReactBox"
                    />
                  </div>
                  <div
                    class="absolute -top-2 right-12 z-10 scale-0 opacity-0 transition-all duration-300"
                    :class="
                      reactboxHover
                        ? 'scale-100 opacity-100'
                        : 'scale-0 opacity-0'
                    "
                  >
                    <BaseReaction
                      ref="reaction"
                      class="!gap-0 bg-[#06060666]"
                      :emojis="['Clap', 'Lovely', 'Angry', 'Funny', 'Sad']"
                      :hover-show-text="true"
                      hover-text-style="!-top-8 rounded-full bg-black px-2 py-0.5"
                    />
                  </div>
                </div>

                <div
                  class="flex h-[3rem] cursor-pointer flex-col items-center text-[#B0B0B0]"
                  :class="popUpOpened ? 'blur-lg' : ''"
                  data-cy="53469bddc29dbf52"
                  @click="handleCommentListPopup(true)"
                >
                  <div
                    class="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
                  >
                    <i
                      class="fa-regular fa-comment text-shadow text-[#f1f1f1f1]"
                    />
                  </div>
                  <div class="text-shadow text-xs text-[#f1f1f1f1]">0</div>
                </div>

                <div
                  class="flex h-[3rem] flex-col items-center text-xl text-[#B0B0B0]"
                  @click="handleShareVisible(true)"
                >
                  <div
                    class="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-5 transition-all hover:bg-white/5 active:scale-95 active:text-[#E0B92C]"
                  >
                    <i
                      class="fa-regular fa-share-nodes text-shadow text-[#f1f1f1f1]"
                    />
                  </div>
                  <div class="text-shadow text-xs text-[#f1f1f1f1]">0</div>
                </div>

                <div
                  class="flex h-[3rem] flex-col items-center text-neutral-50"
                  data-cy="d5b38d6291f8b0bf"
                  @click="handleReactListPopup(true)"
                >
                  <div
                    class="relative flex h-8 w-8 cursor-pointer items-center justify-center"
                  >
                    <i class="fa-solid fa-eye text-shadow text-[#f1f1f1f1]" />
                  </div>
                  <div
                    class="text-shadow mt-1 w-full text-center text-xs text-[#f1f1f1f1]"
                  >
                    0
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute bottom-0 left-0 z-[103] w-full p-1">
            <div
              ref="progressBar"
              class="h-1 w-full cursor-pointer rounded-lg bg-gray-400"
              @mousedown="startDragging"
              @click="handleProgressClick"
            >
              <div
                class="progress-bar h-full rounded-lg bg-white"
                :style="{
                  width: `${(currentTime / duration) * 100}%`,
                }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedMedia: {
      type: Object,
    },
  },
  setup() {
    const fluxesStore = useFluxesStore();
    const authStore = useAuthStore();
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();

    const videoElement = ref(null);
    const { playing, muted } = useMediaControls(videoElement);

    const handleClickPause = () => {
      if (videoElement.value.paused) {
        videoElement.value.play();
      } else {
        videoElement.value.pause();
      }
    };

    const handleClickMute = () => {
      videoElement.value.muted = !videoElement.value.muted;
    };

    return {
      fluxesStore,
      authStore,
      socialStore,
      profileStore,
      videoElement,
      playing,
      muted,
      handleClickMute,
      handleClickPause,
    };
  },
  data() {
    return {
      isExpanded: false,
      currentTime: 0,
      isDragging: false,
      wasPlaying: false,
      reactboxHover: false,
      truncateLength: 30,
    };
  },
  computed: {
    user() {
      return this.authStore.user;
    },

    showToggle() {
      return (
        this.fluxesStore.createMediaReel?.content?.length > this.truncateLength
      );
    },
    truncatedContent() {
      if (this.showToggle) {
        return `${this.fluxesStore.createMediaReel?.content?.slice(0, this.truncateLength).trim()}...`; // Trim to avoid spaces
      }
      return this.fluxesStore.createMediaReel?.content;
    },

    fullContent() {
      return this.fluxesStore.createMediaReel?.content;
    },
  },
  mounted() {
    const video = this.$refs.videoElement;
    video.addEventListener('timeupdate', this.updateProgress);
  },
  beforeUnmount() {
    const video = this.$refs.videoElement;
    video.removeEventListener('timeupdate', this.updateProgress);
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },

    handleProgressClick(event) {
      const progressBar = this.$refs.progressBar;
      const rect = progressBar.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newTime = (clickX / rect.width) * this.duration;

      this.currentTime = newTime;
      this.$refs.videoElement.currentTime = newTime;
    },
    startDragging(event) {
      const video = this.$refs.videoElement;

      this.wasPlaying = !video.paused;
      video.pause();

      this.isDragging = true;
      this.updateProgressOnDrag(event);

      document.addEventListener('mousemove', this.updateProgressOnDrag);
      document.addEventListener('mouseup', this.stopDragging);
    },
    stopDragging() {
      const video = this.$refs.videoElement;

      this.isDragging = false;

      document.removeEventListener('mousemove', this.updateProgressOnDrag);
      document.removeEventListener('mouseup', this.stopDragging);

      video.currentTime = this.currentTime;

      if (this.wasPlaying) {
        video.play();
      }
    },
    updateProgressOnDrag(event) {
      if (!this.isDragging) {
        return;
      }

      const progressBar = this.$refs.progressBar;
      const rect = progressBar.getBoundingClientRect();
      const dragX = Math.min(
        Math.max(event.clientX - rect.left, 0),
        rect.width,
      );
      const newTime = (dragX / rect.width) * this.duration;

      this.currentTime = newTime;
    },
    updateProgress() {
      if (!this.isDragging) {
        const video = this.$refs.videoElement;
        this.currentTime = video.currentTime;
        this.duration = video.duration;
      }
    },

    onMouseenterGroup() {
      this.reactboxHover = true;
    },
    onMouseleaveGroup() {
      this.reactboxHover = false;
    },

    handleClose() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
.expand-mask {
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  right: 0;
  height: auto;
  z-index: 0;
  background: linear-gradient(
    180deg,
    rgba(38, 38, 38, 0) 4.25%,
    rgba(0, 0, 0, 0.8) 24%
  );
}
.mask {
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  mask-image: linear-gradient(
    to top,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
}

.gradient-mask {
  position: absolute;
  top: -2px;
  left: 0;
  right: 0;
  height: 30%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1),
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0)
  );
}

.text-shadow {
  text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.5);
}

.progress-bar {
  z-index: 9999;
  transition: width 0.1s linear;
}

.progress-bar {
  width: var(--progress);
}
</style>
