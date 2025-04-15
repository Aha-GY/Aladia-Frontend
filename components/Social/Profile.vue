<template>
  <div
    id="profile-card"
    class="fixed z-[100] w-72 -translate-y-1/3 pt-2 transition-all"
    :class="show && profile ? 'opacity-100' : 'pointer-events-none opacity-0'"
  >
    <div class="rounded border border-[#222] bg-black/70 backdrop-blur">
      <div class="mb-4 flex justify-between px-5 pt-4">
        <div class="flex flex-col items-center pt-4">
          <div class="flex items-center gap-1">
            <img src="~/assets/icons/followers.svg" />
            <span class="text-sm font-semibold">1K</span>
          </div>
          <div class="text-xs text-white/50">
            {{ $t('base.member.followers') }}
          </div>
        </div>
        <div class="flex flex-col items-center">
          <img
            class="mb-4 h-16 w-16 rounded object-cover"
            :class="profile?.dataset?.image ? 'opacity-100' : 'opacity-0'"
            :src="profile?.dataset?.image"
          />
          <span class="text-sm font-semibold">
            {{ profile?.dataset?.value }}
          </span>
        </div>
        <div class="flex flex-col items-center pt-4">
          <div class="flex items-center gap-1">
            <img src="~/assets/icons/following.svg" />
            <span class="text-sm font-semibold">1K</span>
          </div>
          <div class="text-xs text-white/50">
            {{ $t('base.member.following') }}
          </div>
        </div>
      </div>
      <div
        class="next-icon group -mb-[1px] -ml-[1px] -mr-[1px] flex cursor-pointer items-center justify-center rounded border border-[#222] py-2 text-center text-sm text-white/50 transition-all hover:border-white hover:text-white"
      >
        <span class="translate-x-1 transition-all group-hover:translate-x-0">
          {{ $t('personal.profile.visit') }}
        </span>
        <BaseNext
          class="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const courseStore = useCourseStore();
    return { courseStore };
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    profile() {
      return this.courseStore.answerProfile;
    },
  },
  watch: {
    async profile(val) {
      if (val && val.dataset?.image) {
        const tagRect = val.getBoundingClientRect();
        const cardRect = this.$el.getBoundingClientRect();
        this.$el.style.top = `${tagRect.top + 20}px`;
        this.$el.style.left = `${tagRect.left - cardRect.width}px`;
        await sleep(200);
        this.show = true;
      } else {
        this.show = false;
      }
    },
  },
  mounted() {
    document.addEventListener('mousemove', this.onMouseMove);
  },
  beforeUnmount() {
    document.removeEventListener('mousemove', this.onMouseMove);
  },
  methods: {
    onMouseMove(event) {
      const tag = event.target.closest('.tag');
      const card = event.target.closest('#profile-card');
      if (tag) {
        this.courseStore.answerProfile = tag;
      } else {
        if (card) {
          //
        } else {
          this.courseStore.answerProfile = null;
        }
      }
    },
  },
};
</script>
