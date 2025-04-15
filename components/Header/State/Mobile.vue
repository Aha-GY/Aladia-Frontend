<template>
  <div class="flex">
    <HeaderStateJoin v-if="!isLogged" />
    <div v-else class="flex items-center">
      <i
        class="fa-regular fa-bars text-lg text-gray-400"
        data-cy="5c43bd68511c40d4"
        @click="menuDrawer = true"
      />
    </div>
    <client-only>
      <BaseDrawer v-model="menuDrawer" class="!w-[65%]">
        <div class="flex items-center gap-3">
          <BaseAvatarNext
            :show-online="false"
            :picture="profileStore.myProfileDetail.picture"
            size="md"
          />
          <div class="flex w-0 flex-1 flex-col">
            <div
              class="text-base font-semibold leading-5 text-[#D9D9D9]/90"
              data-cy="e243c29a24ec7bba"
              @click="handleSwitchAccount"
            >
              {{ profileStore.myProfileDetail.fullName }}
              <i
                v-if="profileStore.myOrganizationList.length > 0"
                class="fa-sharp-duotone fa-solid fa-arrow-up-arrow-down ml-2 rotate-90 text-sm"
              />
            </div>
            <div
              class="mt-1 line-clamp-1 break-all text-xs leading-4 text-[#D9D9D9]/50"
            >
              {{ profileStore.myProfileDetail.email }}
            </div>
          </div>
        </div>
        <div
          ref="accountContent"
          class="w-full overflow-hidden pl-2 transition-all duration-300"
          :style="{ height: showAccount ? contentHeight : '0px' }"
        >
          <div class="mt-2 text-white/50">
            {{ $t('nav.header.notification.banner.chat.personal') }}
          </div>
          <div>
            <div
              class="flex w-full items-center py-1 text-sm"
              :class="{
                'text-[#F7C02B]':
                  profileStore.myProfileDetail.id === authStore.user.id,
              }"
              data-cy="7e102e727b9c8c8e"
              @click="onAccountProfile(authStore.user)"
            >
              <span>{{ authStore.user.fullName }}</span>
              <i
                v-if="profileStore.myProfileDetail.id === authStore.user.id"
                class="fa-solid fa-check ml-3"
              />
            </div>
          </div>
          <div class="text-white/50">
            {{ $t('nav.header.notification.organization.name.singular') }}
          </div>
          <div
            v-for="(item, index) in profileStore.myOrganizationList"
            :key="index"
            data-cy="f76cf71834926559"
            @click="onAccountProfile(item)"
          >
            <div
              class="flex w-full items-center py-1 text-sm"
              :class="{
                'text-[#F7C02B]': profileStore.myProfileDetail.id === item.id,
              }"
            >
              <span>{{ item.name }}</span>
              <i
                v-if="profileStore.myProfileDetail.id === item.id"
                class="fa-solid fa-check ml-3"
              />
            </div>
          </div>
        </div>
        <div class="pl-2 pt-6 text-[#D9D9D9]/70">
          <div
            v-for="(item, index) in moblieMenuList"
            :key="index"
            class="mb-5 flex items-center"
            :class="item.class"
            data-cy="26574cea4734ee1a"
            @click="handleClick(item)"
          >
            <i :class="item.icon" />
            <div class="ml-3 font-medium">{{ $t(item.name) }}</div>
          </div>
        </div>
      </BaseDrawer>
      <BaseDrawer v-model="showInfo" @close="showType = null">
        <LazyOrganizationHubChat v-if="showType === 'Chat'" :is-popup="true" />
        <LazyHeaderNotice v-if="showType === 'Notice'" :open="true" />
        <LazyProfileSettingDrawer v-if="showType === 'Settings'" />
      </BaseDrawer>
    </client-only>
  </div>
</template>

<script setup>
const router = useRouter();
const authStore = useAuthStore();
const profileStore = useProfileStore();
const isLogged = computed(() => authStore.logged || false);
const moblieMenuList = ref([
  {
    icon: 'fa-regular fa-comment',
    name: 'nav.header.notification.banner.chat.name',
    title: 'Chat',
  },
  {
    icon: 'fa-regular fa-bell',
    name: 'nav.header.notification.banner.notice.name',
    title: 'Notice',
  },
  {
    icon: 'fa-regular fa-gear',
    name: 'nav.header.notification.banner.setting.name',
    title: 'Settings',
  },
  {
    class: 'text-[#DA4242]/80',
    icon: 'fa-regular fa-right-from-bracket',
    title: 'Logout',
    name: 'index.header.logout',
  },
]);
const menuDrawer = ref(false);
const showInfo = ref(false);
const showType = ref('');

const handleClick = async (item) => {
  if (item.title === 'Logout') {
    await authStore.logout();
  } else {
    showInfo.value = true;
    showType.value = item.title;
  }
  menuDrawer.value = false;
};

const showAccount = ref(false);
const contentHeight = ref('0px');
const accountContent = ref(null);
const handleSwitchAccount = () => {
  if (profileStore.myOrganizationList.length === 0) {
    return false;
  }
  showAccount.value = !showAccount.value;
  nextTick(() => {
    if (showAccount.value) {
      contentHeight.value = `${accountContent.value.scrollHeight}px`;
    } else {
      contentHeight.value = '0px';
    }
  });
};
const onAccountProfile = (item) => {
  if (profileStore.myProfileDetail.id === item.id) {
    return false;
  }
  if (item.entityType === 'organization') {
    profileStore.setMyOrganizationDetail(item);
  }
  router.push(`/${item.entityType}/hub/${item.id}/profile`);
};
</script>
