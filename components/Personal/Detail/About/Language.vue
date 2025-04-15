<template>
  <ProfileBox>
    <div class="mb-2 flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('personal.languages') }}
      </div>
      <div class="flex h-6 items-center gap-1.5 rounded-full px-1.5 text-xs">
        {{ length }}
        <i class="fa-solid fa-comments text-[#D9D9D980]" />
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="(item, index) in detail.spokenLanguage"
        :key="index"
        class="flex h-8 items-center justify-between"
      >
        <div class="text-sm font-medium text-[#D9D9D9CC]">
          {{ item.language }}
        </div>
        <div class="text-sm text-[#D9D9D980]">{{ item.level }}</div>
      </div>
      <div
        v-if="detail.nativeLanguage"
        class="flex h-8 items-center justify-between"
      >
        <div class="text-sm font-medium text-[#D9D9D9CC]">
          {{ detail.nativeLanguage }}
        </div>
        <div class="text-sm text-[#D9D9D980]">
          {{ $t('personal.native') }}
        </div>
      </div>
    </div>
    <BaseNoData v-if="!length" />
  </ProfileBox>
</template>

<script>
export default {
  setup() {
    const profileStore = useProfileStore();
    return { profileStore };
  },
  computed: {
    detail() {
      return this.profileStore.getPersonalProfileDetail();
    },
    spokenLanguage() {
      return this.detail.spokenLanguage || [];
    },
    length() {
      return this.spokenLanguage.length + (this.detail.nativeLanguage ? 1 : 0);
    },
  },
};
</script>
