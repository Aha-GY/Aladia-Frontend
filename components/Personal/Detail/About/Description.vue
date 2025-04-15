<template>
  <ProfileBox class="!pb-2">
    <div class="mb-2 flex h-7 items-center gap-1.5">
      <div class="w-0 flex-1 text-base font-medium text-[#B0B0B0]">
        {{ $t('personal.about') }}
      </div>
      <div
        v-if="isMe && !isMobile"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        data-cy="edit-about-button"
        @click="onEdit"
      >
        <i class="fa-light fa-pen-to-square text-[#D9D9D9]/50" />
      </div>
    </div>

    <BaseNoData v-if="!htmlHasContent(aboutContent)" class="h-[16.5rem]" />
    <div
      v-else
      ref="container"
      :key="aboutContentKey"
      class="relative h-[16.5rem] overflow-hidden !pb-1"
    >
      <div ref="content" class="!h-min">
        <div>
          <div
            :class="contentHeight > containerHeight ? '!mb-3 -mt-1 !pb-3' : ''"
            class="h-min w-full break-words text-sm leading-6 text-[#D9D9D999]"
          >
            <BaseEditorRenderContent
              class="hyphens-auto !p-0"
              :content="cleanBreakContent(aboutContent)"
            />
          </div>
        </div>

        <div
          class="absolute bottom-1.5 right-0 -mb-0.5 bg-[#060606] pl-[0.125rem] text-right"
        >
          <span
            v-if="contentHeight > containerHeight"
            class="cursor-pointer text-xs leading-6"
            @click="isOpenModal = true"
          >
            <span>...</span>
            <span
              class="pl-3.5 text-[#E3C213] underline-offset-4 transition-all hover:underline active:scale-95"
            >
              {{ $t('post.show.more') }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </ProfileBox>
  <BaseDialog
    v-model="isOpenModal"
    :is-locked-scroll="true"
    :title="$t('personal.about')"
    width="fit-content"
    class="!w-full !p-0 md:!w-2/3 lg:!w-[59.375rem]"
    destroy-on-close
  >
    <div
      class="!max-h-[70vh] overflow-y-auto break-words !pb-3 text-sm leading-6 text-[#D9D9D999]"
    >
      <BaseEditorRenderContent :content="aboutContent" />
    </div>
  </BaseDialog>
</template>

<script setup>
const props = defineProps({
  from: {
    type: String,
    default: 'personal',
  },
});
const { isMobile } = useDevice();
const profileStore = useProfileStore();
const detail = computed(() =>
  props.from === 'personal'
    ? profileStore.getPersonalProfileDetail()
    : profileStore.getOrganizationProfileDetail(),
);
const aboutContent = computed(() =>
  props.from === 'personal' ? detail.value.about : detail.value.description,
);
const isMe = computed(
  () => profileStore.myProfileDetail.id === detail.value.id,
);
const isOpenModal = ref(false);
// Refs for elements
const container = ref(null);
const content = ref(null);
const aboutContentKey = ref(0);
const onEdit = () => {
  profileStore.openDialog();
  nextTick(() => {
    const id =
      props.from === 'personal'
        ? profileStore.menuConst.ProfileMenu[0].id
        : profileStore.orgMenuConst.ProfileMenu[0].id;
    profileStore.updateActiveMenu(id);
  });
};

// Reactive state for heights
const containerHeight = ref(0);
const contentHeight = ref(0);
// Function to measure heights
const measureHeights = () => {
  if (container.value && content.value) {
    containerHeight.value = container.value.getBoundingClientRect().height;
    contentHeight.value = content.value.getBoundingClientRect().height;
  }
};

// Watcher to detect changes in aboutContent and update the key
watch(
  aboutContent,
  () => {
    aboutContentKey.value += 1; // Change key to force DOM re-render

    nextTick(() => {
      measureHeights();
    }); // Measure heights after DOM updates
  },
  { immediate: true },
);

onMounted(() => {
  nextTick(() => {
    measureHeights();
  });
});

function cleanBreakContent(content) {
  if (!content) {
    return '';
  } // Return empty if content is null or undefined

  // Remove all <p><br></p> or <p><br/></p> tags
  return content.replace(/<p><br\s*\/?><\/p>/g, '').trim();
}
</script>
