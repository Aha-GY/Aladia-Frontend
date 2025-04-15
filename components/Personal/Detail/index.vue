<template>
  <div class="relative flex flex-col px-1 md:px-4">
    <ProfileHeader
      id="profile-header"
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
              profileStore.profileTab === index
                ? 'border-[#E9C238] font-semibold text-[#E9C238]'
                : 'hover:font-meduim border-transparent text-[#D9D9D9]/80 hover:border-[#D9D9D9] hover:text-[#D9D9D9]'
            "
            data-cy="23ae192a385f29eb"
            @click="profileStore.profileTab = index"
          >
            <i :class="menu.icon" class="mr-1.5 text-sm" />
            {{ menu.label }}
          </div>
          <!-- <PersonalDetailInfo @go-tab="goTab" /> -->
        </div>
        <PersonalDetailAbout
          v-if="profileStore.profileTab === 0"
          :go-tab="goTab"
        />
        <div v-if="profileStore.profileTab === 1" class="relative flex">
          <ProfilePost
            id="profile-post"
            class="w-full md:w-[50rem]"
            :is-view="!isMe"
          />

          <PostsWidgetsRight
            height="h-[70vh] w-[21rem]"
            :fixed="false"
            sticky
            class="max-lg:hidden"
          />
        </div>
        <div v-if="profileStore.profileTab === 2" class="relative flex">
          <ProfileReels
            id="profile-reels"
            class="w-full md:w-[50rem]"
            :is-view="!isMe"
          />

          <PostsWidgetsRight
            height="h-[70vh] w-[21rem]"
            :fixed="false"
            sticky
            class="max-lg:hidden"
          />
        </div>
        <ProfileCourses v-if="profileStore.profileTab === 3" />
        <ProfileQA v-if="profileStore.profileTab === 4" :detail="detail" />
        <ProfileReviews v-if="profileStore.profileTab === 5" :detail="detail" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isHeader: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    const fluxesStore = useFluxesStore();

    return { profileStore, authStore, fluxesStore };
  },
  data() {
    return {
      headerShow: false,
    };
  },
  computed: {
    menus() {
      const menus = [
        {
          label: this.$t('personal.about'),
          value: 'about',
          icon: 'fa-solid fa-user',
        },
        {
          label: this.$t('personal.post'),
          value: 'post',
          icon: 'fa-solid fa-note-sticky',
        },
        {
          label: this.$t('personal.reels'),
          value: 'reel',
          icon: 'fa-solid fa-video',
        },
        {
          label: this.$t('personal.courses'),
          value: 'courses',
          icon: 'fa-solid fa-book',
        },
        {
          label: this.$t('personal.qa'),
          value: 'qa',
          icon: 'fa-solid fa-messages-question',
        },
        {
          label: this.$t('personal.reviews'),
          value: 'reviews',
          icon: 'fa-solid fa-star',
        },
      ];
      return menus;
    },
    detail() {
      return this.profileStore.getPersonalProfileDetail();
    },
    isMe() {
      return this.profileStore.myProfileDetail.id === this.detail.id;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.onScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.onScroll);

    this.profileStore.profileTab = 0;
  },
  methods: {
    onScroll() {
      const st = window.pageYOffset || document.documentElement.scrollTop;

      if (st > 350) {
        this.headerShow = true;
      } else {
        this.headerShow = false;
      }
    },
    goTab(index) {
      this.profileStore.profileTab = index;
    },
  },
};
</script>
