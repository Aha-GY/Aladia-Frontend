<template>
  <BaseDialog
    v-model="profileStore.openSettingDialog"
    :is-locked-scroll="true"
    :title="$t('calendar.settings')"
    width="fit-content"
    class="!w-full md:!w-fit"
    destroy-on-close
  >
    <template #titleIcon>
      <i
        class="fa-solid fa-gear pr-2.5 text-base !font-normal text-[#b0b0b0]"
      />
    </template>

    <div class="flex h-[70vh] w-[58rem] justify-between">
      <div class="flex h-full w-[20rem] flex-col">
        <div class="flex w-full rounded-lg bg-[#E5E5E505]">
          <BaseAvatarNext
            :picture="profileStore.myProfileDetail.picture"
            :show-online="false"
            size="md"
            class="mr-1.5"
            :default-icon="
              profileStore.myProfileDetail.entityType === 'organization'
                ? 'fa-solid fa-building-ngo'
                : 'fa-solid fa-user'
            "
          />
          <div class="flex flex-col justify-center overflow-hidden">
            <div class="line-clamp-1 text-[#F1F1F1]">
              {{ profileStore.myProfileDetail.fullName }}
            </div>
            <div class="line-clamp-1 text-[#707070]">
              {{ profileStore.myProfileDetail.email }}
            </div>
          </div>
        </div>
        <div
          class="mr-[1.125rem] mt-2 flex w-full flex-1 scroll-mt-0 flex-col gap-4 overflow-hidden *:w-[20rem] hover:overflow-y-auto hover:pr-[0.0625rem]"
        >
          <BaseList
            v-for="(item, index) in menuList"
            :key="index"
            v-model="profileStore.settingDialogMenuId"
            :data="item.data"
            :title="item.title"
          />
        </div>
      </div>
      <div
        class="flex h-full flex-1 flex-col overflow-hidden pl-3 *:w-[36.5rem] hover:overflow-y-auto"
      >
        <ProfileSettingDialogOrgContent
          v-if="authStore.isOrg"
          :menu-id="profileStore.settingDialogMenuId"
        />
        <ProfileSettingDialogContent
          v-else
          :menu-id="profileStore.settingDialogMenuId"
        />
      </div>
    </div>
  </BaseDialog>
</template>
<script setup>
import { useMenuInfo } from './useMenuInfo';

const { menuList } = useMenuInfo();
const profileStore = useProfileStore();
const authStore = useAuthStore();
</script>
