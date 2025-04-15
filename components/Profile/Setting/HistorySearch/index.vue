<template>
  <div class="flex h-0 flex-1 flex-col gap-4">
    <ProfileSettingBackHeader :title="$t('calendar.privacy')" :store="store" />
    <ProfileSettingTitleHeader :title="store.settingTitle">
      <template #prefix>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-solid fa-lock text-sm text-[#D9D9D9CC]" />
        </div>
      </template>
    </ProfileSettingTitleHeader>
    <div class="flex h-0 flex-1 flex-col gap-3">
      <div class="p-1.5 text-xs text-[#D9D9D980]">
        {{ $t('calendar.search.history.content') }}
      </div>
      <div
        class="flex h-9 cursor-pointer items-center justify-center rounded-md bg-white/5 transition-all active:scale-95"
      >
        {{ $t('calendar.search.history.clear') }}
      </div>
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
  computed: {
    detail() {
      return this.store.getPersonalProfileDetail();
    },
  },
  methods: {
    onPrivateChange() {
      this.detail.isPrivate = !this.detail.isPrivate;
    },
    onPublicChange() {
      this.detail.isPublic = !this.detail.isPublic;
    },
  },
};
</script>
