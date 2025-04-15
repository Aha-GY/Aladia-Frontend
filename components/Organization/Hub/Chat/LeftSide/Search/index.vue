<template>
  <div class="flex h-[3.125rem] p-2">
    <div class="flex flex-1 items-center justify-between">
      <div
        v-if="!showSearch"
        class="flex items-center gap-2 border-b-[1px] border-l-2 border-transparent text-sm text-white/80"
      >
        <div class="flex h-12 w-14 items-center justify-center">
          <div
            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/15 hover:text-white/80"
            data-cy="77674748de1e7936"
            @click="showSearch = true"
          >
            <i class="fa-solid fa-search" />
          </div>
        </div>
        <span>
          {{ $t('org.activity.chat.all') }}
        </span>
      </div>

      <client-only v-if="!showSearch">
        <el-popover
          v-if="!isPopup"
          v-model:visible="optionsShow"
          trigger="click"
          :width="160"
          :show-arrow="false"
          :popper-style="{
            border: 'none',
            background: 'transparent',
            'box-shadow': 'none',
            padding: '0',
          }"
        >
          <template #reference>
            <div
              class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-all hover:bg-white/15 hover:text-white/80"
            >
              <i
                class="fa-regular fa-ellipsis text-white/80"
                data-cy="chat-room-options-menu-button"
              />
            </div>
          </template>
          <OrganizationHubChatLeftSideSearchSetting
            :select-change="selectChange"
            @on-close="optionsShow = false"
          />
        </el-popover>
        <OrganizationHubChatGo v-else :is-popup="isPopup" />
      </client-only>
    </div>
    <OrganizationHubChatInput
      v-if="showSearch"
      v-model="name"
      :aways-show-close="true"
      @clear="onClose"
      @focus="onFocus"
    />
    <!-- <div
      v-if="!isSelect && showSearch"
      class="-mr-2.5 flex w-8 shrink-0 cursor-pointer items-center justify-center text-white/50 transition-all hover:text-white/70"
    >
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md transition-all hover:bg-white/5"
        @click="onClose" data-cy="5eb54992bd11c008">
        <i class="fa-solid fa-xmark text-xs" />
      </div>
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    modelValue: String,
    focus: Boolean,
    isFocus: Boolean,
    onFocus: Function,
    isSelect: Boolean,
    selectChange: Function,
    isPopup: Boolean,
  },
  data() {
    return {
      name: '',
      optionsShow: false,
      showSearch: false,
    };
  },
  watch: {
    name() {
      this.$emit('update:modelValue', this.name);
    },
  },
  methods: {
    onClose() {
      this.name = '';
      this.showSearch = false;
      this.$emit('onClose');
    },
  },
};
</script>
