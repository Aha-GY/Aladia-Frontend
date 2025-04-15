<template>
  <div
    class="absolute left-4 top-1/2 -translate-x-full -translate-y-1/2 pr-10 transition-all"
  >
    <div
      class="w-[16.75rem] overflow-hidden rounded border border-[#565656]/20 bg-black backdrop-blur-sm"
    >
      <div class="flex justify-center pb-2 pt-3">
        <div class="pt-3 text-xs">
          <div class="flex justify-center font-semibold">
            <img
              src="~/assets/social/followers.svg"
              class="mr-1 h-3 w-3"
              alt=""
            />
            {{ item?.numberOf?.followers || 0 }}
          </div>
          <div class="text-[#707070]">
            {{ $t('base.member.followers') }}
          </div>
        </div>
        <div class="mx-6 flex w-[3.75rem] flex-col">
          <BaseAvatarNext
            :show-online="false"
            size="md"
            :picture="item?.picture"
            class="mb-1 size-[3.75rem] bg-transparent"
          />
          <div class="line-clamp-2 text-sm font-semibold">
            {{ item?.fullName }}
          </div>
        </div>
        <div class="pt-3 text-xs">
          <div class="flex justify-center font-semibold">
            <img
              src="~/assets/social/option-follow.svg"
              class="mr-1 h-3 w-3"
              alt=""
            />
            {{ item?.numberOf?.followings || 0 }}
          </div>
          <div class="text-[#707070]">
            {{ $t('base.member.following') }}
          </div>
        </div>
      </div>
      <div
        class="group relative flex h-8 cursor-pointer items-center justify-center rounded-b border border-transparent text-[#565656] transition-all hover:border-[#f1f1f1] hover:font-semibold hover:text-[#f1f1f1]"
        data-cy="713617d75e25c4ff"
        @click="handleUserClick"
      >
        <div
          class="bg-gradient-top absolute left-0 top-0 h-[1px] w-full group-hover:opacity-0"
        />
        <div class="text-xs group-hover:mr-2">
          {{ $t('post.record.view.profile') }}
        </div>
        <i class="fa-solid fa-chevron-right" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({
        numberOf: { followers: 0, followings: 0 },
      }),
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const profileStore = useProfileStore();
    return { socialStore, profileStore };
  },
  data() {
    return {
      animation: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.animation = true;
    }, 100);
  },
  methods: {
    handleUserClick() {
      this.profileStore.gotoProfilePage(this.item);
    },
  },
};
</script>
