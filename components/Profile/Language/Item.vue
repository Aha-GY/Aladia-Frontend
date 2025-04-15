<template>
  <div class="flex flex-col gap-3">
    <ProfileLanguageSearch
      v-if="isEdit"
      :is-edit="isEdit"
      :item="item"
      :change="onChange"
      @close="isEdit = false"
    />
    <div
      v-if="!isEdit"
      class="flex h-10 items-center gap-2 rounded-md bg-white/5 px-3 transition-all"
    >
      <div class="text-sm font-semibold text-[#D9D9D9E5]">
        {{ item.language }}
      </div>
      <div class="w-0 flex-1 text-xs text-[#D9D9D9B2]">
        {{ item.level }}
      </div>
      <div
        class="flex h-4 w-4 cursor-pointer items-center justify-center transition-all active:scale-95"
        data-cy="697db6954189bcbd"
        @click="onDelete"
      >
        <i class="fa-light fa-trash text-xs" />
      </div>
      <div
        class="flex h-4 w-4 cursor-pointer items-center justify-center transition-all active:scale-95"
        data-cy="abf862d8b9013917"
        @click="onEdit"
      >
        <i class="fa-light fa-pen-to-square text-xs" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      language: '',
      optionShow: false,
      isEdit: false,
    };
  },
  methods: {
    onDelete() {
      this.$emit('delete', this.item);
    },
    onEdit() {
      this.isEdit = true;
    },
    onChange(item) {
      this.item.language = item.language;
      this.item.level = item.level;
      this.isEdit = false;
    },
  },
};
</script>
