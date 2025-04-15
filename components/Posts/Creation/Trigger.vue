<template>
  <div
    id="posts-creation-trigger"
    class="mb-6 flex items-center justify-between gap-2 rounded-[0.3125rem] bg-[#060606] px-4 py-2"
  >
    <BaseAvatarSwitch
      right-offset="0px"
      :show-drop-down="switchVisible"
      bottom-offset="0px"
    />

    <div class="flex flex-1 items-center gap-2 p-2">
      <div
        class="flex h-9 flex-1 cursor-pointer items-center gap-[0.625rem] rounded-[0.3125rem] bg-[#E2E2E2]/[0.03] p-1 text-[#555555] transition-all duration-300 hover:bg-black/30 hover:text-[#B0B0B0]/70"
        :data-cy="`${dataCy}-create-post-trigger`"
        @click="handleTriggerCreate"
      >
        <div class="flex-1 p-1 text-sm">
          {{ $t('post.create.placeholder') }}
        </div>
        <i class="fa-solid fa-face-smile text-[#E5E5E5]" />
      </div>

      <el-popover
        v-model:visible="optionsShow"
        trigger="click"
        placement="bottom-start"
        :show-arrow="false"
        :persistent="false"
      >
        <template #reference>
          <span
            class="flex h-9 cursor-pointer items-center justify-center rounded-[0.3125rem] bg-[#E2E2E2]/[0.03] px-2 hover:bg-[#E2E2E2]/[0.1]"
          >
            <i class="fa-solid fa-filter text-[#E5E5E5]" />
          </span>
        </template>
        <div class="flex flex-col gap-2">
          <div
            v-for="(menu, index) in menus"
            :key="menu"
            class="flex cursor-pointer flex-col gap-[0.375rem] rounded-[0.3125rem] px-3 py-1 transition-all duration-200 hover:bg-[#B0B0B0]/10"
            data-cy="46075435531c0525"
            @click="onChangeTab(index)"
          >
            {{ $t(menusLabel[index]) }}
          </div>
        </div>
      </el-popover>
    </div>

    <PostsCreation type="feed" @send="(type) => $emit('send', type)" />
  </div>
</template>

<script>
export default {
  props: {
    switchVisible: {
      type: Boolean,
      default: true,
    },
    dataCy: {
      type: String,
      default: 'default-create-post-trigger',
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    const profileStore = useProfileStore();
    return { authStore, socialStore, profileStore };
  },
  data() {
    return {
      menus: ['General', 'Social', 'Question'],
      menusLabel: ['post.general', 'post.social', 'post.question.label'],
      optionsShow: false,
    };
  },
  computed: {
    user() {
      return this.profileStore.myProfileDetail;
    },
  },
  methods: {
    onChangeTab(index) {
      this.$emit('change-tab', index);
      this.optionsShow = false;
    },
    handleTriggerCreate() {
      this.socialStore.answerReset();
      this.socialStore.creatorVisible = true;
    },
  },
};
</script>
