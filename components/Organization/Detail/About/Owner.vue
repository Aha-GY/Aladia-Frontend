<template>
  <ProfileBox>
    <div class="mb-3 flex h-7 items-center justify-between">
      <div class="text-[1rem] text-base font-medium text-[#B0B0B0]">
        {{ $t('org.owner') }}
      </div>
    </div>

    <div class="flex items-center gap-2.5">
      <div class="relative">
        <BaseAvatarNext
          :picture="ownerInfo?.picture"
          :story="ownerInfo?.story"
          :user-id="ownerInfo?.id"
          :size="'md'"
          :online="ownerInfo?.online"
        />
      </div>

      <div class="flex flex-col justify-between space-y-0.5 truncate">
        <div
          class="cursor-pointer truncate text-[#F1F1F1] underline-offset-2 hover:underline"
          :data-cy="`profile-${(ownerInfo.name || ownerInfo.fullName || '').toLowerCase().split(' ').join('-')}-name-button`"
          @click="handleUserClick"
        >
          {{ ownerInfo.name || ownerInfo.fullName }}
        </div>

        <div class="w-full">
          <div
            v-if="ownerInfo?.address"
            class="flex items-center gap-1 text-[#707070]"
          >
            <i
              v-if="
                ownerInfo?.address?.city ||
                ownerInfo?.address?.country ||
                ownerInfo?.address?.state
              "
              class="fa-regular fa-location-dot text-11"
            />
            <div class="flex flex-wrap space-x-1 text-xs font-medium leading-3">
              <span
                v-if="ownerInfo?.address?.city || ownerInfo?.address?.state"
              >
                {{ ownerInfo?.address.city || ownerInfo?.address?.state }}
              </span>
              <span
                v-if="
                  (ownerInfo?.address?.city || ownerInfo?.address?.state) &&
                  ownerInfo?.address?.country
                "
              >
                |
              </span>
              <span v-if="ownerInfo?.address?.country">
                {{ ownerInfo?.address?.country }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProfileBox>
</template>

<script setup>
const profileStore = useProfileStore();
const detail = computed(() => profileStore.getOrganizationProfileDetail());
const ownerInfo = computed(() => detail.value?.owner || {});
function handleUserClick() {
  profileStore.gotoProfilePage(ownerInfo.value);
}
</script>
