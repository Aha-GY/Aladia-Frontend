<template>
  <ProfileBox>
    <div class="flex flex-col gap-3">
      <div class="mb-2 flex h-7 items-center gap-3">
        <div class="text-base font-medium text-[#B0B0B0]">
          {{ $t('personal.organizations') }}
        </div>
      </div>
      <div v-if="organizationsData && organizationsData.length">
        <div
          v-for="item in organizationsData"
          :key="item.id"
          class="flex gap-3 border-b-[1px] border-[#56565690] p-1.5 px-3 transition-all duration-300 last:border-none hover:cursor-pointer hover:bg-[#191919]"
          data-cy="8013e67ebd868c42"
          @click="openProfilePage(item)"
        >
          <BaseAvatarNext
            :show-online="false"
            size="md"
            :picture="item.picture"
            default-icon="fa-solid fa-building-ngo text-base"
          />
          <div class="flex w-0 flex-1 flex-col justify-center gap-0.5">
            <div class="line-clamp-1 text-base text-[#F1F1F1]">
              {{ item.name }}
            </div>
            <div
              class="line-clamp-2 text-xs text-[#707070]"
              v-html="item.bio || item.description || item.domain"
            />
          </div>
        </div>
      </div>
      <BaseNoData v-else />
    </div>
  </ProfileBox>
</template>

<script setup>
const profileStore = useProfileStore();
const organizationsData = computed(
  () => profileStore.getPersonalProfileDetail()?.organizations || [],
);
const openProfilePage = (item) => {
  profileStore.gotoProfilePage({
    ...item,
    entityType: 'organization',
  });
};
</script>
