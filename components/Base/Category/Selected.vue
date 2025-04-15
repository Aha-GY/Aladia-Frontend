<template>
  <div
    v-if="selecteds.length"
    class="hide-scrollbar mb-4 flex max-h-[17.5rem] flex-wrap gap-1 overflow-y-auto px-1"
  >
    <div
      v-for="item in selectedList"
      :key="item.id"
      class="flex max-w-[49%] items-center rounded-3xl bg-[#111] p-1 text-white/70"
    >
      <div class="flex w-full items-center gap-2">
        <BaseCourseThumbnail class="h-[1.4rem]" :url="item.image?.url" />
        <div class="truncate text-sm text-[#F1F1F1]">
          {{ item.name }}
        </div>
        <div
          class="flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full hover:bg-white/10"
          data-cy="bbf9802d13af65ab"
          @click="onRemove(item)"
        >
          <i class="fa-solid fa-close text-xs" />
        </div>
      </div>
    </div>
    <div
      v-if="selecteds.length > max"
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
    selecteds: {
      type: Array,
      default: () => [],
    },
  },
  setup() {},
  data() {
    return {
      show: false,
      max: 4,
    };
  },
  computed: {
    selectedList() {
      return this.show ? this.selecteds : this.selecteds.slice(0, this.max);
    },
    label() {
      return this.show ? 'Less' : `More ${this.selecteds.length - this.max}`;
    },
  },
  methods: {
    onRemove(item) {
      this.$emit('remove', item);
    },
  },
};
</script>
