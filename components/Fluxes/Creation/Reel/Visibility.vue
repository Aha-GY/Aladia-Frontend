<template>
  <div
    class="flex flex-col gap-6 bg-[#0D0D0D] p-4"
    :class="$device.isMobile ? '' : 'small-screen-gap'"
  >
    <div>
      <p class="font-medium text-white">
        {{ $t('post.reel.access.label') }}
      </p>
      <p class="text-[#707070]">
        {{ $t('post.reel.access.content') }}
      </p>
    </div>
    <div class="flex flex-col gap-2">
      <div
        v-for="menu in menus"
        :key="menu"
        class="flex cursor-pointer flex-col gap-[0.375rem] rounded-[0.3125rem] px-3 py-1 transition-all duration-200 hover:bg-[#B0B0B0]/10"
        @click="onSelect(menu.type)"
      >
        <div class="flex items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2 text-[#F1F1F1]">
              <FluxesCreationReelWidgetsVisibility :visibility="menu.type" />
              <span>{{ menu.label }}</span>
            </div>
            <div class="whitespace-nowrap text-[#707070]">{{ menu.desc }}</div>
          </div>

          <span v-if="menu.type === active">
            <i class="fa-regular fa-check-circle text-[#E0B92C]" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: String, // _VISIBILITY
  },
  setup() {
    const section = ref(null);
    return { section };
  },
  data() {
    return {
      optionsShow: false,
    };
  },
  computed: {
    menus() {
      return [
        {
          label: this.$t('post.create.menu.private.label'),
          type: 'private',
          desc: this.$t('post.create.menu.private.desc'),
        },
        {
          label: this.$t('post.create.menu.restricted.label'),
          type: 'restricted',
          desc: this.$t('post.create.menu.restricted.desc'),
        },
        {
          label: this.$t('post.create.menu.public.label'),
          type: 'public',
          desc: this.$t('post.create.menu.public.desc'),
        },
      ];
    },
    inlineActive() {
      return this.active
        ? this.active.charAt(0).toUpperCase() + this.active.slice(1)
        : '';
    },
  },
  methods: {
    onSelect(type) {
      this.$emit('select', type);
    },
  },
};
</script>
