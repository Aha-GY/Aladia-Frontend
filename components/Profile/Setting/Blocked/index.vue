<template>
  <div class="flex h-0 flex-1 flex-col gap-4">
    <ProfileSettingBackHeader title="Followers" :store="store" />
    <ProfileSettingTitleHeader :title="store.settingTitle">
      <template #prefix>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-solid fa-ban text-sm text-[#D9D9D9CC]" />
        </div>
      </template>
      <template #suffix>
        <div
          class="flex h-6 items-center justify-center rounded-md bg-white/10 px-2 text-base font-medium text-white/80"
        >
          9
        </div>
      </template>
    </ProfileSettingTitleHeader>
    <div class="flex h-0 flex-1 flex-col gap-1.5">
      <BaseInput v-model="name" search fixed placeholder="Search" />
      <div class="hide-scrollbar h-0 flex-1 overflow-y-auto">
        <div v-for="item in 9" :key="item" class="flex items-center gap-2 p-3">
          <div class="h-9 w-9 rounded-full bg-white/80" />
          <div class="w-0 flex-1 truncate text-sm font-medium text-white/80">
            Tatiana Culhane
          </div>
          <div
            class="flex h-6 w-[6.25rem] cursor-pointer items-center justify-center gap-1.5 rounded-md bg-white/15 text-xs text-[#D9D9D9B2] transition-all active:scale-95"
          >
            <i class="fa-regular fa-lock" />
            {{ $t('personal.profile.locked') }}
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex h-9 cursor-pointer items-center justify-center rounded-md bg-white/5 transition-all active:scale-95"
    >
      {{ $t('base.upload.save') }}
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
      name: '',
    };
  },
};
</script>
