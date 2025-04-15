<template>
  <ProfileBox>
    <div class="mb-2 flex h-7 items-center justify-between">
      <div class="text-base font-medium text-[#B0B0B0]">
        {{ $t('personal.info') }}
      </div>
      <div
        v-if="isMe && !$device.isMobile"
        class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/5 active:scale-95"
        data-cy="edit-profile-personal-info-button"
        @click="onEdit"
      >
        <i class="fa-light fa-pen-to-square text-[#D9D9D9]/50" />
      </div>
    </div>
    <div class="mb-2 flex flex-col gap-3">
      <div
        v-if="contactsVisibility?.phoneNumber"
        class="flex items-center gap-2 py-1"
      >
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
            {{ $t('personal.phone') }}
          </div>
        </div>
      </div>

      <div
        v-if="contactsVisibility?.email"
        class="flex items-center gap-2 py-1"
      >
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-envelope text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div class="truncate text-sm font-medium text-[#FAFAFA]">
            {{ detail.email || '---' }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">Email</div>
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

      <div
        v-if="contactsVisibility?.birthDate"
        class="flex items-center gap-2 py-1"
      >
        <div class="flex h-12 w-12 items-center justify-center">
          <i class="fa-regular fa-balloon text-xl text-[#FAFAFA]" />
        </div>
        <div class="flex-1 truncate">
          <div
            class="truncate text-sm font-medium text-[#FAFAFA]"
            data-cy="birth-date-profile-detail"
          >
            {{
              detail.birthDate
                ? formatDate(detail.birthDate, 'DD MMM YYYY')
                : '---'
            }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('personal.dob') }}
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
              detail.createdAt
                ? formatDate(detail.createdAt, 'DD MMM YYYY')
                : '---'
            }}
          </div>
          <div class="pt-1 text-xs text-[#707070]">
            {{ $t('personal.joined') }}
          </div>
        </div>
      </div>
    </div>
  </ProfileBox>
</template>

<script>
export default {
  setup() {
    const profileStore = useProfileStore();
    const authStore = useAuthStore();
    return { profileStore, authStore };
  },
  computed: {
    timezone() {
      const timezone = this.detail.timezone;
      const utc = getUTCOffsetForTimezone(timezone)
        ? `(${getUTCOffsetForTimezone(timezone)})`
        : '';
      return timezone ? `${timezone} ${utc}` : '---';
    },
    phoneNumberInfo() {
      const info = this.detail?.phoneNumber?.split(',') || [];
      return info;
    },
    detail() {
      return this.profileStore.getPersonalProfileDetail();
    },
    isMe() {
      return this.profileStore.myProfileDetail.id === this.detail.id;
    },
    birthAddress() {
      let birthAddress = '';
      if (this.detail.birthAddress) {
        birthAddress = `${this.detail.birthAddress.city}, ${this.detail.birthAddress.state}, ${this.detail.birthAddress.country}`;
      }
      return birthAddress;
    },
    contactsVisibility() {
      return this.detail.contactsVisibility;
    },
  },
  methods: {
    onEdit() {
      this.profileStore.openDialog();
      this.$nextTick(() => {
        this.profileStore.updateActiveMenu(
          this.profileStore.menuConst.AccountMenu[0].id,
        );
      });
    },
  },
};
</script>
