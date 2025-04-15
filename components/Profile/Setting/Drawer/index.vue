<template>
  <client-only>
    <div
      class="px-5 py-5"
      :class="{
        'h-full overflow-hidden': isMobile,
      }"
    >
      <div
        class="mb-4 flex cursor-pointer items-center gap-3 rounded-5 bg-white/5 p-2"
        data-cy="open-profile-menu-button"
        @click="handleOpenProfileSettings"
      >
        <BaseAvatarNext
          size="md"
          :show-online="false"
          :picture="profileStore.myProfileDetail.picture"
          :default-icon="
            profileStore.myProfileDetail.entityType === 'organization'
              ? 'fa-solid fa-building-ngo'
              : 'fa-solid fa-user'
          "
        />
        <div class="flex max-w-[21.5rem] flex-1 flex-col">
          <div
            data-cy="name-profile-text"
            class="line-clamp-1 w-full text-base font-semibold leading-5 text-[#F1F1F1]"
          >
            {{ profileStore.myProfileDetail.fullName }}
          </div>
          <div
            data-cy="email-profile-text"
            class="line-clamp-1 w-full text-xs leading-4 text-[#707070]"
          >
            {{ profileStore.myProfileDetail.email }}
          </div>
        </div>
      </div>
      <div
        class="flex w-full flex-col gap-4"
        :class="{
          'hide-scrollbar h-[calc(100%-4.5rem)] overflow-y-auto': isMobile,
        }"
      >
        <BaseList
          v-for="(item, index) in menuList"
          :key="index"
          v-model="menuId"
          :data="item.data"
          :title="item.title"
          @change="handleChange"
        />
      </div>
    </div>
    <el-drawer
      v-model="showInfo"
      :with-header="true"
      :show-close="false"
      :lock-scroll="false"
      :modal="false"
      :close-on-press-escape="false"
      :class="!isMobile ? '!w-[30rem]' : '!w-[100%]'"
      class="ProfileMenuDrawer"
      @close="closeShowInfo"
    >
      <template #header>
        <div class="flex items-center">
          <div
            class="mr-3 flex h-6 w-6 cursor-pointer items-center justify-center"
            data-cy="close-profile-setting-drawer"
            @click="closeShowInfo"
          >
            <i class="fa-sharp fa-solid fa-arrow-left text-lg text-[#b0b0b0]" />
          </div>
          <div class="text-lg">
            {{ renderI18nLabel(menuId) }}
          </div>
        </div>
      </template>
      <div class="h-full">
        <ProfileSettingDialogOrgContent
          v-if="authStore.isOrg"
          is-left-drawer
          :menu-id="menuId"
        />
        <ProfileSettingDialogContent v-else :menu-id="menuId" is-left-drawer />
      </div>
    </el-drawer>
    <ProfileSettingDialog v-if="!isMobile" />
  </client-only>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

import { useMenuInfo } from '../Dialog/useMenuInfo';

const emit = defineEmits(['handle-emit']);
const { t } = useI18n();
const { menuList, renderLabel } = useMenuInfo();

const profileStore = useProfileStore();
const authStore = useAuthStore();
const { isMobile } = useDevice();
const showInfo = ref(false);
const menuId = ref('');

const renderI18nLabel = (id) => {
  const label = renderLabel(id);
  return label ? t(label) : label;
};
const handleOpenProfileSettings = () => {
  if (!isMobile) {
    profileStore.openDialog();
    nextTick(() => {
      profileStore.updateActiveMenu(profileStore.menuConst.AccountMenu[0].id);
    });
    emit('handle-emit', 'close');
  }
};

const handleChange = (item) => {
  if (item.id !== 'RoadMap') {
    menuId.value = item.id;
    showInfo.value = true;
  }
};
const closeShowInfo = () => {
  menuId.value = '';
  showInfo.value = false;
};
const parentOpen = inject('parentOpen');
watch(
  () => parentOpen?.value,
  (value) => {
    if (!value) {
      setTimeout(() => {
        nextTick(() => {
          showInfo.value = false;
        });
      }, 500);
    }
  },
  { immediate: true, deep: true },
);
</script>
<style lang="scss">
.ProfileMenuDrawer {
  .el-drawer__header {
    padding: 16px 0 0 16px;
    color: #b0b0b0;
    font-size: 20px;
    margin-bottom: 10px !important;
  }
  .el-drawer__body {
    border: none;
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    #about {
      padding-left: 0rem;
    }
    .profile-box {
      padding: 0rem;
    }
  }
}
</style>
