<template>
  <div
    class="group/avatar flex shrink-0 items-center justify-center"
    :class="{
      'size-[2.25rem]': size === 'sm',
      'size-[3.875rem]': size === 'md',
      'size-[5.875rem]': size === 'lg',
      'size-[14.625rem]': size === 'xl',
    }"
    @click="handleShowUserStories"
  >
    <div
      ref="avatar"
      class="relative flex cursor-pointer items-center justify-center rounded-full text-white/20"
      :class="{
        'size-7 text-sm': size === 'sm',
        'size-12 text-lg': size === 'md',
        'size-20 text-3xl': size === 'lg',
        'size-[12.5rem] text-8xl': size === 'xl',
      }"
    >
      <BaseAvatarNextPicture
        :size="size"
        :width="width"
        :round="round"
        :picture="picture"
        :hole="hole"
        :border="showStory && story?.status === 'no-story'"
        :default-icon="defaultIcon"
      />
      <div v-if="showStory" class="pointer-events-none absolute">
        <client-only>
          <BaseAvatarNextRing
            :size="size"
            :status="story?.status"
            :hole="hole"
            :class="storyLoading || loading ? 'opacity-0' : ''"
          />
        </client-only>
      </div>
      <div
        v-if="storyLoading || loading"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <BaseAvatarNextLoading :size="size" />
      </div>
      <div v-if="showWork && work" class="pointer-events-none absolute inset-0">
        <client-only>
          <BaseAvatarNextWork :size="size" :width="width" :work="work" />
        </client-only>
      </div>
      <div
        v-if="hole"
        class="absolute bottom-0 right-0"
        :class="{
          'size-2': size === 'sm',
          'size-3.5': size === 'md',
          'size-5': size === 'lg',
          'size-10 -translate-x-1 -translate-y-1': size === 'xl',
        }"
      >
        <BaseAvatarNextOnline v-if="showOnline" v-bind="props" />
        <BaseAvatarNextCheck
          v-if="showCheck"
          v-bind="props"
          @click.stop="$emit('change')"
        />
        <BaseAvatarNextDropDown v-if="showDropDown" v-bind="props" />
        <div v-if="hasButtonSlot" class="absolute inset-0 rounded-full">
          <slot name="button" v-bind="props" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  picture: {
    type: String,
    default: '',
  },
  round: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: String,
    default: '',
  },
  defaultIcon: {
    type: String,
    default: 'fa-solid fa-user',
  },
  size: {
    type: String,
    default: 'sm',
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value),
  },
  storyLoading: {
    type: Boolean,
    default: false,
  },
  showStory: {
    type: Boolean,
    default: true,
  },
  story: {
    type: Object,
    default: () => ({
      status: 'no-story',
    }),
  },
  showOnline: {
    type: Boolean,
    default: true,
  },
  online: {
    type: Boolean,
    default: false,
  },
  showCheck: {
    type: Boolean,
    default: false,
  },
  checked: {
    type: Boolean,
    default: false,
  },
  showWork: {
    type: Boolean,
    default: false,
  },
  work: {
    type: String,
    default: '',
  },
  showDropDown: {
    type: Boolean,
    default: false,
  },
});
const avatar = ref(null);
const loading = ref(false);
const slots = useSlots();
const fluxesStore = useFluxesStore();
const profileStore = useProfileStore();
const { width } = useElementSize(avatar);
const hasButtonSlot = computed(() => !!slots.button);
const route = useRoute();

const hole = computed(
  () =>
    props.showOnline ||
    props.showCheck ||
    props.showDropDown ||
    hasButtonSlot.value,
);

const handleShowUserStories = async () => {
  if (!props.userId || !props.showStory) {
    return;
  }

  if (props.story?.status === 'no-story') {
    return profileStore.gotoProfilePage({ id: props.userId });
  }

  if (props.story?.status === 'active' || props.story?.status === 'viewed') {
    loading.value = true;

    await sleep(800);
    await fluxesStore.showUserStories({ userId: props.userId });
    props.story.status = 'viewed';

    fluxesStore.storyPopup.user_id = props.userId;
    fluxesStore.storyPopup.story_id = fluxesStore.currentUserStoryId;
    fluxesStore.storyPopup.state = true;
    fluxesStore.storyViewStartingRoute = route.fullPath;
    const url = `/stories/${props.userId}/${fluxesStore.currentUserStoryId}`;
    history.pushState(null, '', url);
    loading.value = false;
  }
};
</script>
