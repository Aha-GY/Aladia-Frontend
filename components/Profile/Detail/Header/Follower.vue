<template>
  <div class="flex flex-col justify-between pt-2 md:flex-row md:items-center">
    <div class="mb-3 flex items-center text-base md:mb-0 md:gap-9">
      <ProfileFollowers
        :detail="detail"
        follower-type="followers"
        :label="$t('base.member.followers')"
        data-cy="profile-followers-button"
      />
      <ProfileFollowers
        :detail="detail"
        follower-type="following"
        :label="$t('base.member.following')"
        data-cy="profile-following-button"
      />
    </div>

    <div class="flex items-center justify-between">
      <div v-if="detail.id && !isMe" class="flex gap-2 align-middle">
        <div
          class="flex h-8 cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-xs text-black transition-all active:scale-95"
          :data-cy="
            detail.isFollowing ? 'unfollow-user-button' : 'follow-user-button'
          "
          @click="onChangeFollow()"
        >
          <i v-if="loading" class="fa-solid fa-spinner animate-spin" />
          <i v-else-if="detail.isFollowing" class="fa-solid fa-circle-check" />
          <i v-else class="fa-light fa-user-plus" />
          {{
            detail.isFollowing
              ? $t('base.member.following')
              : $t('base.member.follow')
          }}
        </div>
        <div
          class="flex h-8 cursor-pointer items-center gap-1 rounded-md border border-white/50 px-2 text-xs transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
          data-cy="ad7a6f97ec128ba9"
          @click="handleChat"
        >
          <i class="fa-light fa-message" />
          {{ $t('personal.profile.message') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const router = useRouter();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const loading = ref(false);
const isMe = computed(
  () => profileStore.myProfileDetail.id === props.detail.id,
);
const onChangeFollow = async () => {
  if (loading.value) {
    return;
  }
  loading.value = true;
  try {
    await profileStore.follow(props.detail);
  } finally {
    loading.value = false;
  }
};

const handleChat = () => {
  const url = `${authStore.hub}/chat?${props.detail?.entityType === 'organization' ? 'orgId' : 'userId'}=${
    props.detail?.id
  }`;
  router.push(url);
};
</script>
