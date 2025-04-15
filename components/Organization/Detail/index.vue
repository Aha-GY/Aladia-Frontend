<template>
  <div class="relative mx-auto flex w-full flex-col px-1 md:px-4">
    <ProfileHeader
      :is-header="isHeader"
      :detail="detail"
      :class="headerShow ? 'opacity-100' : 'pointer-events-none opacity-0'"
    />
    <ProfileDetailHeader :detail="detail" />
    <div class="mx-auto w-[100vp]">
      <div
        class="relative max-w-[75rem] max-lg:w-[50rem] lg:w-[55rem] min-[1150px]:w-[65rem] xl:w-[75rem]"
      >
        <div
          class="my-7 flex items-center justify-center gap-2 border-b border-[#707070]"
        >
          <div
            v-for="(menu, index) in menus"
            :key="menu"
            class="flex h-12 w-28 cursor-pointer items-center justify-center border-b text-base transition-all"
            :class="
              action === index
                ? 'border-[#E9C238] font-semibold text-[#E9C238]'
                : 'hover:font-meduim border-transparent text-[#D9D9D9]/80 hover:border-[#D9D9D9] hover:text-[#D9D9D9]'
            "
            data-cy="49232f8babcd5b5a"
            @click="action = index"
          >
            <i :class="menu.icon" class="mr-1.5 text-sm" />
            {{ menu.label }}
          </div>
        </div>
        <OrganizationDetailAbout v-if="action === 0" :go-tab="goTab" />
        <div v-if="action === 1" class="relative flex">
          <ProfilePost id="profile-post" class="w-full md:w-[50rem]" />
          <div v-if="!$device.isMobile">
            <PostsWidgetsRight
              height="h-[70vh] w-[21rem]"
              :fixed="false"
              sticky
              class="max-lg:hidden"
            />
          </div>
        </div>
        <div v-if="action === 2" class="relative flex">
          <ProfileReels id="profile-reels" class="w-full md:w-[50rem]" />
          <div v-if="!$device.isMobile">
            <PostsWidgetsRight
              height="h-[70vh] w-[21rem]"
              :fixed="false"
              sticky
              class="max-lg:hidden"
            />
          </div>
        </div>
        <ProfileCourses v-if="action === 3" />
        <ProfileAlumini v-if="action === 4" />
        <ProfileQA v-if="action === 5" :detail="detail" />
        <ProfileReviews v-if="action === 6" :detail="detail" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';

defineProps({
  isHeader: {
    type: Boolean,
    default: false,
  },
});
const profileStore = useProfileStore();
const { t } = useI18n();

const menus = [
  { label: t('personal.about'), value: 'about', icon: 'fa-solid fa-user' },
  { label: t('personal.post'), value: 'post', icon: 'fa-solid fa-note-sticky' },
  { label: t('personal.reels'), value: 'reels', icon: 'fa-solid fa-video' },
  { label: t('personal.courses'), value: 'courses', icon: 'fa-solid fa-book' },
  {
    label: t('personal.alumini'),
    value: 'Alumini',
    icon: 'fa-solid fa-user-graduate',
  },
  {
    label: t('personal.qa'),
    value: 'qa',
    icon: 'fa-solid fa-messages-question',
  },
  { label: t('personal.reviews'), value: 'reviews', icon: 'fa-solid fa-star' },
];
const action = ref(0);
const goTab = (index) => {
  action.value = index;
};
const headerShow = ref(false);

const detail = computed(() => profileStore.getOrganizationProfileDetail());

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
const onScroll = () => {
  const st = window.pageYOffset || document.documentElement.scrollTop;
  if (st >= 350) {
    headerShow.value = true;
  } else {
    headerShow.value = false;
  }
};
</script>
