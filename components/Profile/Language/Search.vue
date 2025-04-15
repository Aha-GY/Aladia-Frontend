<template>
  <el-popover
    trigger="click"
    :width="318"
    :show-arrow="false"
    placement="bottom-start"
    :visible="optionShow"
    :persistent="false"
    :teleported="false"
  >
    <template #reference>
      <div class="flex gap-2 pl-3">
        <div class="flex h-7 items-center">
          <i
            v-if="optionShow"
            class="fa-light fa-magnifying-glass cursor-pointer text-xs text-white/30 transition-all active:scale-95"
          />
          <i
            v-else
            class="fa-light fa-circle-plus cursor-pointer text-xl text-[#EAB308CC] transition-all active:scale-95"
          />
        </div>

        <el-input
          v-model="language"
          class="input-box"
          :placeholder="$t('personal.language.placeholder')"
          data-cy="650191bab6862a6e"
          @click="optionShow = true"
        />
      </div>
    </template>
    <ProfileLanguageOption
      :list="languages"
      :item="item"
      @change="change"
      @close="optionShow = false"
    />
  </el-popover>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    change: {
      type: Function,
      default: () => {},
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
  },
  data() {
    return {
      language: '',
      optionShow: false,
    };
  },
  computed: {
    languages() {
      return this.globalStore.languages.find(
        (item) => item.name === this.language,
      );
    },
  },
  watch: {
    optionShow(value) {
      if (!value) {
        this.$emit('close');
      }
    },
  },
  mounted() {
    if (this.isEdit) {
      this.optionShow = true;
    }
  },
};
</script>
