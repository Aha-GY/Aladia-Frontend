<template>
  <div
    v-if="selectedItems.length"
    class="mb-4 flex max-h-[8rem] flex-wrap gap-1 overflow-y-auto xl:max-h-[10rem]"
  >
    <div
      v-for="member in selectedList"
      :key="member.id"
      class="flex max-w-[49%] items-center rounded-3xl bg-white/10 p-1 text-white/70 hover:bg-white/20"
    >
      <div class="flex w-full items-center gap-2 pl-1">
        <div class="relative">
          <SocialShareMemberAvatar
            :item="member"
            size="small"
            :show-check="false"
          />
        </div>
        <div class="truncate text-13 text-white">{{ member.fullName }}</div>
        <div
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          data-cy="7288b2e610d85e85"
          @click="onRemove(member)"
        >
          <i class="fa-solid fa-close text-xs" />
        </div>
      </div>
    </div>
    <div
      v-if="selectedItems.length > maxSize"
      class="flex cursor-pointer items-center gap-2 rounded-3xl bg-white/10 p-1 text-white/70 hover:bg-white/20"
      @click="show = !show"
    >
      <div
        class="flex size-7 items-center justify-center rounded-full bg-white/5 text-sm"
      >
        <i class="fa-light fa-users" />
      </div>
      <div class="truncate text-13 text-white">{{ label }}</div>
      <div
        class="flex size-5 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
      >
        <i
          class="fa-light fa-chevron-down text-xs transition-all"
          :class="show ? 'rotate-180' : ''"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedItems: {
      type: Array,
      default: () => [],
    },
    maxSize: {
      type: Number,
      default: 6,
    },
  },
  data() {
    return {
      show: false,
    };
  },
  computed: {
    selectedList() {
      return this.show
        ? this.selectedItems
        : this.selectedItems.slice(0, this.maxSize);
    },
    label() {
      return this.show
        ? 'Less'
        : `More ${this.selectedItems.length - this.maxSize}`;
    },
  },
  methods: {
    onRemove(member) {
      this.$emit('remove', member);
    },
  },
};
</script>
