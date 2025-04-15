<template>
  <div
    class="group/item flex cursor-pointer items-center gap-2 rounded p-1 pr-2 text-[#707070] hover:bg-white/5 hover:text-[#D9D9D9]"
  >
    <div
      class="flex h-full flex-1 items-center gap-2"
      data-cy="c41ffec74230d901"
      @click="onChange"
    >
      <div class="relative flex h-8 w-8 items-center justify-center">
        <img
          v-if="active"
          class="absolute z-0 h-full w-full"
          src="~/assets/blank.png"
        />
        <img
          v-if="member.profilePicture"
          :src="member.profilePicture"
          class="relative z-10 h-7 w-7 rounded-full object-cover"
        />
        <i v-else class="fa-solid fa-envelope text-xl" />
        <div
          v-if="active"
          class="absolute -right-0.5 -top-0.5 z-20 flex h-3 w-3 cursor-pointer items-center justify-center rounded-full bg-red-600 opacity-0 transition-all duration-300 hover:rotate-180 group-hover/item:opacity-100"
          @clic.self.stop="onCloseClick"
        >
          <i class="fa-light fa-xmark" />
        </div>
      </div>
      <div class="w-0 flex-1 truncate text-xs">
        <div>{{ member.nameSurname }}</div>
        <div>{{ member.email }}</div>
      </div>
    </div>
    <div
      class="flex cursor-pointer items-center justify-center rounded p-1 transition-all duration-300"
      data-cy="5eba0c55e9e4c942"
      @click="onInfoClick"
    >
      <i class="fa-light fa-circle-info text-sm" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    member: Object,
    actives: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      active: false,
    };
  },
  watch: {
    actives: {
      handler() {
        this.active = this.actives
          .map((r) => r.memberId)
          .includes(this.member.memberId);
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async onChange() {
      if (this.active) {
        this.active = false;
        this.$emit('change', false);
      } else {
        this.active = true;
        this.$emit('change', true);
      }
    },
    onCloseClick() {
      //
    },
    onInfoClick() {},
  },
};
</script>
