<template>
  <div
    class="flex h-8 cursor-pointer items-center justify-between gap-2 text-xs"
  >
    <div
      class="flex h-full cursor-pointer items-center justify-center gap-1 rounded-md bg-[#E0B92C] px-2 text-black transition-all active:scale-95"
      @click="onChangeFollow"
    >
      <i v-if="loading" class="fa-solid fa-spinner animate-spin" />
      <i v-else-if="isFollowing" class="fa-solid fa-circle-check" />
      <i v-else class="fa-light fa-user-plus" />
      <span>
        {{
          isFollowing ? $t('base.member.following') : $t('base.member.follow')
        }}
      </span>
    </div>
    <div
      class="flex h-full items-center gap-1 rounded-md border border-white/50 px-2 transition-all hover:border-white/0 hover:bg-white/5 active:scale-95"
      @click="onMessage"
    >
      <i class="fa-light fa-message" />
      <span>{{ $t('nav.header.notification.banner.chat.message') }}</span>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
    default: () => ({
      numberOf: { followers: 0, followings: 0 },
    }),
  },
});
const emit = defineEmits(['onFollow', 'onChat']);
const router = useRouter();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const loading = ref(false);
const isFollowing = ref(false);
const numberOf = ref({ followers: 0, followings: 0 });
watch(
  () => props.detail,
  () => {
    isFollowing.value = props.detail.isFollowing;
    numberOf.value = props.detail.numberOf;
  },
  { immediate: true, deep: true },
);

const onChangeFollow = async () => {
  if (authStore.logged) {
    if (loading.value) {
      return;
    }
    try {
      loading.value = true;
      const data = await profileStore.follow(props.detail);
      isFollowing.value = !!data.followed;
      loading.value = false;
      numberOf.value = {
        followers: data.followed
          ? numberOf.value.followers + 1
          : numberOf.value.followers - 1 <= 0
            ? 0
            : numberOf.value.followers - 1,
        followings: numberOf.value.followings,
      };
      emit('onFollow', {
        ...props.detail,
        isFollowing: isFollowing.value,
        numberOf: numberOf.value,
      });
    } catch (error) {
      loading.value = false;
      throw error;
    }
  } else {
    authStore.popup = true;
  }
};

const onMessage = () => {
  if (authStore.logged) {
    emit('onChat');
    router.push(
      `${authStore.hub}/chat?${props.detail.entityType === 'organization' ? 'orgId' : 'userId'}=${props.detail.id}`,
    );
  } else {
    authStore.popup = true;
  }
};
</script>
