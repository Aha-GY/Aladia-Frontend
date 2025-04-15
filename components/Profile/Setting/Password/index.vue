<template>
  <div class="flex h-0 flex-1 flex-col gap-4">
    <ProfileSettingBackHeader title="Privacy" :store="store" />
    <ProfileSettingTitleHeader :title="store.settingTitle">
      <template #prefix>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-solid fa-lock text-sm text-[#D9D9D9CC]" />
        </div>
      </template>
    </ProfileSettingTitleHeader>
    <div class="flex h-0 flex-1 flex-col gap-3">
      <div class="py-1 text-base font-medium text-[#D9D9D9CC]">
        {{ $t('calendar.password.change') }}
      </div>
      <div class="flex items-center gap-0.5 text-xs text-[#B0B0B0]">
        {{ $t('calendar.password.your') }}
        <i class="fa-regular fa-asterisk text-10 text-[#A20F0F]" />
      </div>
      <input type="text" class="absolute left-0 top-[100rem] opacity-0" />
      <div class="h-8 rounded-md bg-white/5 px-3">
        <input
          v-model="oldPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="$t('calendar.password.old')"
          class="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#505050]"
        />
      </div>
      <div class="flex items-center gap-0.5 text-xs text-[#B0B0B0]">
        {{ $t('calendar.password.new') }}
        <i class="fa-regular fa-asterisk text-10 text-[#A20F0F]" />
      </div>
      <div class="h-8 rounded-md bg-white/5 px-3">
        <input
          v-model="newPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="$t('calendar.password.labelNew')"
          class="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#505050]"
        />
      </div>
      <div class="flex items-center gap-0.5 text-xs text-[#B0B0B0]">
        {{ $t('calendar.password.confirm') }}
        <i class="fa-regular fa-asterisk text-10 text-[#A20F0F]" />
      </div>
      <div class="h-8 rounded-md bg-white/5 px-3">
        <input
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          :placeholder="$t('calendar.password.labelNew')"
          class="h-full w-full bg-transparent text-sm outline-none placeholder:text-[#505050]"
        />
      </div>
      <BaseCheckboxList
        class="mt-3"
        name="personal.profile.setting.phone"
        :active="isPhone"
        @change="onChange"
      />
    </div>
    <div
      class="flex h-9 cursor-pointer items-center justify-center rounded-md bg-white/5 transition-all active:scale-95"
    >
      {{ $t('personal.profile.setting.save') }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    store: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      isPhone: false,
    };
  },
  methods: {
    onChange() {
      this.isPhone = !this.isPhone;
    },
  },
};
</script>
