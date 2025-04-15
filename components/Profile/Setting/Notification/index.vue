<template>
  <div class="flex h-0 flex-1 flex-col gap-4">
    <ProfileSettingBackHeader title="Custom" :store="store" />
    <ProfileSettingTitleHeader :title="store.settingTitle">
      <template #prefix>
        <div class="flex h-6 w-6 items-center justify-center">
          <i class="fa-solid fa-bell text-sm text-[#D9D9D9CC]" />
        </div>
      </template>
    </ProfileSettingTitleHeader>
    <div class="flex h-0 flex-1 flex-col gap-3">
      <div class="text-base font-medium text-[#D9D9D9CC]">
        {{ $t('calendar.notification.post') }}
      </div>
      <div class="flex items-center justify-between">
        <div class="text-base font-medium text-[#D9D9D9CC]">
          {{ $t('calendar.notification.disable') }}
        </div>
        <div class="flex h-7 w-7 items-center justify-center">
          <i class="fa-solid fa-chevron-down text-xs text-[#D9D9D9CC]" />
        </div>
      </div>
      <div class="text-base font-medium text-[#D9D9D9CC]">
        {{ $t('calendar.notification.all') }}
      </div>
      <div class="p-1.5 text-sm text-white/30">
        {{ $t('calendar.notification.messages.label') }}
      </div>

      <div
        class="flex items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5"
      >
        <div class="w-0 flex-1 truncate">
          <div class="text-base font-medium text-white/70">
            {{ $t('calendar.notification.messages.title') }}
          </div>
          <div class="text-xs text-white/30">
            {{ $t('calendar.notification.messages.title') }}
          </div>
        </div>
        <BaseCheckboxStyle
          :state="isMessage ? 'checked' : 'unchecked'"
          data-cy="d47e6539903776f8"
          @click="isMessage = !isMessage"
        />
      </div>

      <BaseCheckboxList
        name="flux.watch.preview"
        :active="isPreview"
        @change="isPreview = !isPreview"
      />
      <BaseCheckboxList
        name="base.notification.show"
        :active="isReaction"
        @change="isReaction = !isReaction"
      />
      <div class="mt-7 h-[1px] w-full bg-white/15" />
      <div class="p-1.5 text-sm text-white/30">
        {{ $t('personal.profile.notification.plural') }}
      </div>
      <div
        class="flex items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5"
      >
        <div class="w-0 flex-1 truncate">
          <div class="text-base font-medium text-white/70">
            {{ $t('personal.profile.notification.sound.singular') }}
          </div>
          <div class="text-xs text-white/30">
            {{ $t('personal.profile.notification.sound.description') }}
          </div>
        </div>
        <BaseCheckboxStyle
          :state="isSound ? 'checked' : 'unchecked'"
          data-cy="a281e055c37a1050"
          @click="isSound = !isSound"
        />
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
  data() {
    return {
      isMessage: false,
      isPreview: false,
      isReaction: false,
      isSound: false,
    };
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
