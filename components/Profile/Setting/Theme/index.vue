<template>
  <div class="flex h-0 flex-1 flex-col gap-4">
    <ProfileSettingBackHeader title="Custom" :store="store" />

    <div class="flex h-0 flex-1 flex-col gap-3">
      <div class="p-1.5 text-sm text-white/30">
        {{ $t('personal.profile.setting.theme.label') }}
      </div>
      <BaseCheckboxList
        name="personal.profile.setting.theme.dark"
        :active="$colorMode.preference === 'dark'"
        @change="$colorMode.preference = 'dark'"
      />
      <BaseCheckboxList
        name="personal.profile.setting.theme.light"
        :active="$colorMode.preference === 'light'"
        @change="$colorMode.preference = 'light'"
      />
      <BaseCheckboxList
        name="personal.profile.setting.theme.system"
        :active="$colorMode.preference === 'system'"
        @change="$colorMode.preference = 'system'"
      />
      <div class="mx-2.5 mt-3 h-[1px] bg-white/15" />

      <div class="group/item flex flex-wrap gap-x-1.5 gap-y-2 p-2">
        <div
          v-for="item in colors"
          :key="item"
          class="cursor-pointer rounded-md border p-1 transition-all hover:border-white/50"
          :class="bgColor === item ? 'border-white/50' : 'border-[#020202]'"
          data-cy="7fbae86e36e68196"
          @click="bgColor = item"
        >
          <div
            class="h-[5.3125rem] w-[5.3125rem]"
            :style="{ backgroundColor: item }"
          />
        </div>
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
      colors: [
        '#101010',
        '#112424',
        '#121E26',
        '#112224',
        '#1F1D25',
        '#102125',
        '#212121',
        '#23231C',
        '#261F18',
        '#251717',
        '#251010',
        '#250B10',
        '#18060B',
        '#0F0C0C',
        '#111919',
      ],
      bgColor: '',
    };
  },
};
</script>
