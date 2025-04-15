<template>
  <Transition name="slide-fade-in" mode="out-in">
    <div
      v-if="reelPreview.visible"
      ref="previewWrapper"
      class="fixed inset-0 z-[100] flex items-center bg-[#101010]"
    >
      <div
        ref="wrapperContent"
        class="flex h-full w-full items-center overflow-hidden"
      >
        <div
          v-if="reelPreview.loading"
          v-loading="reelPreview.loading"
          class="h-screen w-screen"
        />
        <div v-else class="fixed inset-0 z-[9999] bg-black">
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
                    @click="closeReelsPreview"
                  >
                    <BaseIconClose
                      class="close-btn stories-main-slider__item-btn"
                    />
                  </div>
                  <p>Reels</p>
                </div>
              </div>

              <div
                class="absolute right-6 top-6 hidden items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 hover:bg-[#101010]/40 md:flex"
              >
                <div
                  class="flex items-center gap-2 whitespace-nowrap text-sm text-white hover:cursor-pointer"
                  @click="handleCreateReel"
                >
                  <i class="fa-solid fa-video-plus" />
                  <span>Create reel</span>
                </div>
              </div>
              <FluxesReelPreviewSlider
                v-if="props?.id"
                :id="props.id"
                ref="storiesMainSlider"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  id: {
    type: String,
  },
});

const fluxesStore = useFluxesStore();
const profileStore = useProfileStore();
const router = useRouter();

const reelPreview = computed(() => fluxesStore.reelPreview);

const wrapperContent = ref(null);
const storiesMainSlider = ref(null);
const previewWrapper = ref(null);

function handleCreateReel() {
  if (storiesMainSlider.value) {
    const activeIndex = storiesMainSlider.value.activeIndex;
    const sliderRef = storiesMainSlider.value.$refs.sliderRef[activeIndex];
    if (sliderRef) {
      sliderRef.handleClickPause();
      fluxesStore.creationTab = 'reel';
      fluxesStore.creationVisibility = 'public';
      fluxesStore.creationVisible = true;
    }
  }
}

function closeReelsPreview() {
  const profileType = profileStore.myProfileDetail.entityType;

  const previousRoute = fluxesStore.reelPreview.previousRoute;
  if (previousRoute) {
    fluxesStore.reelPopup.state = false;
    history.pushState(null, '', previousRoute);
    // router.push(previousRoute);
    fluxesStore.reelPreview.previousRoute = null;
  } else {
    if (profileType === 'profile') {
      router.push(`/user/hub/${profileStore.myProfileDetail.id}/feed`);
    } else {
      router.push(`/organization/hub/${profileStore.myProfileDetail.id}/feed`);
    }
  }

  fluxesStore.reelPreview.visible = false;
  fluxesStore.reelPreview.isCommentPopupOpen = false;
  fluxesStore.isCommentPopupOpen = false;
  fluxesStore.reelPreview.data = [];
}

watch(
  () => reelPreview.value.visible,
  (value) => {
    nextTick(() => {
      if (value) {
        disableScroll(previewWrapper.value);
      } else {
        enableAllScroll();
      }
    });
  },
);
</script>
