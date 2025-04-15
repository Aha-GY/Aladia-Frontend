<template>
  <ProfileBox>
    <div class="mb-2 flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('personal.skills') }}
      </div>
      <div
        class="flex h-7 items-center gap-1.5 rounded-md px-1.5 text-sm text-[#D9D9D9B2]"
      >
        {{ skills?.length }}
      </div>
    </div>
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(skill, index) in skills"
        :key="skill"
        :class="{
          'bg-[#D8B4FE] text-[#3B0764]': index % 2 === 0,
          'bg-[#3B0764] text-[#E9D5FF]': index % 2 === 1,
        }"
        class="flex items-center gap-3 rounded-[0.3125rem] px-2 py-[0.125rem] text-xs font-medium leading-5 transition-all"
      >
        {{ skill }}
      </div>
    </div>
    <BaseNoData v-if="!skills?.length" />
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
    skills() {
      return this.detail.skills;
    },
  },
};
</script>
