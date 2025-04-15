<template>
  <div
    class="group/item flex cursor-pointer items-center gap-2 rounded p-1 pr-2 text-white/50 hover:bg-white/5 hover:text-white"
  >
    <div
      class="flex h-full w-0 flex-1 items-center gap-2"
      data-cy="e2528785523f0338"
      @click="onChange"
    >
      <div class="relative flex h-8 w-8 items-center justify-center">
        <img
          v-if="active"
          class="absolute z-0 h-full w-full"
          src="~/assets/icons/member-active.svg"
        />
        <BaseAvatarNext
          :show-online="false"
          size="sm"
          :picture="member.picture"
        />
        <div
          v-if="active"
          class="absolute -right-0.5 -top-0.5 z-20 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-red-600 opacity-0 transition-all duration-300 hover:rotate-180 group-hover/item:opacity-100"
        >
          <i class="fa-light fa-xmark text-8" />
        </div>
      </div>
      <div class="w-0 flex-1 truncate text-13">
        {{ name }}
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      default: () => ({}),
    },
    actives: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    active() {
      return this.actives.includes(this.member.id);
    },
    name() {
      return (
        this.member.fullName || this.member.name || this.member.firstName || ''
      );
    },
  },
  methods: {
    async onChange() {
      if (this.active) {
        this.$emit('change', false);
      } else {
        this.$emit('change', true);
      }
    },
  },
};
</script>
