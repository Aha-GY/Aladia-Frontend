<template>
  <div
    ref="follower"
    class="relative flex cursor-pointer items-center gap-2 px-2.5 py-1.5 transition-all hover:bg-white/5"
    :class="
      followerShow
        ? 'rounded-t-md bg-[#060606] text-[#D9D9D9]'
        : 'rounded-md text-[#707070]'
    "
    :data-cy="dataCy"
    @click="handleFollowerShow"
  >
    <div class="font-semibold text-white">{{ formatNumber(total) }}</div>
    <span class="pr-[0.75rem] font-thin capitalize text-white">
      {{ label }}
    </span>
    <BaseMemberPreview :members="members" :total="total" />

    <client-only>
      <el-dialog
        v-model="followerShow"
        :show-close="false"
        destroy-on-close
        append-to-body
        :width="isMobile ? '23.5rem' : '26.625rem'"
        :modal="false"
        @close="handleDialogClose"
      >
        <ProfileFollowersPreview
          :follower-type="followerType"
          :detail="detail"
          @close="handleDialogClose"
        />
      </el-dialog>
    </client-only>
  </div>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    default: () => ({
      followers: [],
      followings: [],
      numberOf: { followers: 0, followings: 0 },
    }),
  },
  followerType: {
    type: String,
    default: '', // followers or following
  },
  label: {
    type: String,
    default: '',
  },
  dataCy: {
    type: String,
    default: '',
  },
});
const { isMobile } = useDevice();
const followerShow = ref(false);
const members = computed(() => props.detail[props.followerType] || []);
const total = computed(() => {
  if (props.detail?.numberOf) {
    return props.followerType === 'followers'
      ? props.detail.numberOf?.followers || 0
      : props.detail.numberOf?.followings || 0;
  } else {
    return 0;
  }
});
const handleFollowerShow = () => {
  followerShow.value = true;
};
const handleDialogClose = () => {
  followerShow.value = false;
};
</script>
