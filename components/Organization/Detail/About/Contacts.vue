<template>
  <ProfileBox>
    <div class="mb-2 flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('org.info.label') }}
      </div>
      <div
        v-if="isMe && !isMobile"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        data-cy="b74058cd20b7fa89"
        @click="onEdit"
      >
        <i class="fa-light fa-pen-to-square text-[#D9D9D9]/50" />
      </div>
    </div>
    <div class="mb-2 flex flex-col gap-3">
      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-phone text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            <span
              v-if="!+phoneNumberInfo[0]"
              data-cy="phone-number-profile-detail"
            >
              ---
            </span>
            <span v-else data-cy="phone-number-profile-detail">
              +{{ phoneNumberInfo[2] }} {{ phoneNumberInfo[0] }}
            </span>
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('org.info.phone') }}
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-envelope text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            {{ detail?.email || '---' }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('org.info.email') }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-clock text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div
            class="truncate text-sm font-medium text-[#FAFAFA]"
            data-cy="time-zone-profile-detail"
          >
            {{ timezone }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('event.schedule.timezone') }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-briefcase text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            {{ detail?.industry?.name || '---' }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('org.info.industry') }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-users text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            {{ detail?.numberOf?.employees || '---' }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('org.employee.count') }}
          </div>
        </div>
      </div>
      <div class="flex items-center gap-2 py-1">
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-calendar-days text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            {{
              detail?.createdAt
                ? formatDate(detail?.createdAt, 'DD MMM YYYY')
                : '---'
            }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('org.info.created') }}
          </div>
        </div>
      </div>
    </div>
  </ProfileBox>
</template>

<script setup>
const profileStore = useProfileStore();
const { isMobile } = useDevice();
const detail = computed(() => profileStore.getOrganizationProfileDetail());
const sites = computed(() =>
  detail.value.sites?.length ? detail.value.sites[0] : {},
);
const timezone = computed(() => {
  const timezone = sites.value.timezone;
  const utc = getUTCOffsetForTimezone(timezone)
    ? `(${getUTCOffsetForTimezone(timezone)})`
    : '';
  return timezone ? `${timezone} ${utc}` : '---';
});

const isMe = computed(
  () => profileStore.myProfileDetail.id === detail.value.id,
);
// const handlerPhoneNumber = () => ({
//   ...profileStore.parseMyPhoneNumberStr(detail.value?.phoneNumber),
// });

const phoneNumberInfo = computed(
  () => detail.value?.phoneNumber?.split(',') || [],
);

const onEdit = () => {
  profileStore.openDialog();
  nextTick(() => {
    profileStore.updateActiveMenu(profileStore.orgMenuConst.AccountMenu[0]?.id);
  });
};
</script>
