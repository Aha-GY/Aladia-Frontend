<template>
  <div class="px-2.5 py-5">
    <div class="px-1.5 py-2.5 text-sm text-white/30">
      {{ $t('personal.profile.setting.theme.label') }}
    </div>
    <div class="flex flex-col gap-2.5">
      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex-1">
          <div
            class="text-sm font-[500] text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('personal.profile.setting.theme.dark') }}
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
            :class="'border-white/80 opacity-100'"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
              :class="'bg-white/80 opacity-100'"
            />
          </div>
        </div>
      </div>

      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex-1">
          <div
            class="text-sm font-[500] text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('personal.profile.setting.theme.light') }}
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
            />
          </div>
        </div>
      </div>
      <div class="group/item flex items-center gap-2 px-1.5 py-1">
        <div class="flex-1">
          <div
            class="text-sm font-[500] text-white/70 transition-all group-hover/item:text-white/80"
          >
            {{ $t('personal.profile.setting.theme.system') }}
          </div>
        </div>
        <div class="flex items-center">
          <div
            class="flex h-3 w-3 cursor-pointer items-center justify-center rounded-full border border-white/50 transition-all"
          >
            <div
              class="h-2 w-2 rounded-full bg-white/50 opacity-0 transition-all group-hover/item:opacity-100"
            />
          </div>
        </div>
      </div>

      <div class="mt-4 h-[1px] w-full bg-white/[0.15]" />

      <div class="px-1.5 py-2.5 text-sm text-white/60">
        {{ $t('org.activity.chat.background') }}
      </div>

      <div class="group/item flex flex-wrap gap-x-1.5 gap-y-2 px-1.5">
        <div
          v-for="item in colors"
          :key="item"
          class="h-[5.3125rem] w-[5.3125rem] cursor-pointer rounded-md border border-transparent transition-all hover:border-white/50"
          :class="hubChatStore.chatBgColor === item ? 'border-white/50' : ''"
          :style="{ backgroundColor: item }"
          data-cy="b295e92690b9cd40"
          @click="hubChatStore.chatBgColor = item"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      actives: [],
    };
  },
  computed: {
    colors() {
      return [
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
      ];
    },
  },
  methods: {
    onChange(id) {
      const index = this.actives.indexOf(id);
      if (index !== -1) {
        this.actives.splice(index, 1);
      } else {
        this.actives.push(id);
      }
    },
  },
};
</script>
