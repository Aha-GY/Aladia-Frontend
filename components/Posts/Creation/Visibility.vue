<template>
  <el-popover
    v-model:visible="optionsShow"
    trigger="manual"
    :disabled="loading"
    placement="bottom-start"
    :show-arrow="false"
    :persistent="false"
    :popper-style="{
      minWidth: '15rem !important',
    }"
  >
    <template #reference>
      <div
        class="flex h-7 cursor-pointer items-center justify-center gap-2 rounded-[0.3125rem] border-[0.03125rem] border-[rgba(226,226,226,0.03)] bg-[rgba(226,226,226,0.03)] px-2 py-1 leading-5 text-white/60 transition-all duration-100 hover:text-white/80"
        :class="{
          'hover:text-white/80': !loading,
          'cursor-not-allowed opacity-50': loading,
        }"
        @click="togglePopover"
      >
        <PostsItemWidgetsVisibility :visibility="active" />
        <span class="text-xs">{{ inlineActive }}</span>
        <i
          class="fa-solid fa-chevron-down text-white transition-all duration-300"
          :class="optionsShow ? 'fa-rotate-180' : ''"
        />
      </div>
    </template>
    <div class="flex flex-col gap-2">
      <div
        v-for="menu in menus"
        :key="menu"
        class="flex cursor-pointer flex-col gap-[0.375rem] rounded-[0.3125rem] px-3 py-1 transition-all duration-200 hover:bg-[#B0B0B0]/10"
        data-cy="4c14f993f1344ba1"
        @click="onSelect(menu.type)"
      >
        <div class="flex items-center gap-2 text-[#F1F1F1]">
          <PostsItemWidgetsVisibility :visibility="menu.type" />
          <span>{{ $t(menu.label) }}</span>
        </div>
        <div class="whitespace-nowrap text-[#707070]">{{ $t(menu.desc) }}</div>
      </div>
    </div>
  </el-popover>
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
  setup() {
    const globalStore = useGlobalStore();
    return { globalStore };
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
          label: 'post.create.menu.private.label',
          type: 'private',
          desc: 'post.create.menu.private.desc',
        },
        {
          label: 'post.create.menu.restricted.label',
          type: 'restricted',
          desc: 'post.create.menu.restricted.desc',
        },
        {
          label: 'post.create.menu.public.label',
          type: 'public',
          desc: 'post.create.menu.public.desc',
        },
      ];
    },
    loading() {
      return this.globalStore.editorLoading;
    },
    inlineActive() {
      return this.active
        ? this.active.charAt(0).toUpperCase() + this.active.slice(1)
        : '';
    },
  },
  methods: {
    togglePopover() {
      if (!this.loading) {
        this.optionsShow = !this.optionsShow;
      }
    },
    onSelect(menu) {
      this.optionsShow = false;
      this.$emit('select', menu);
    },
  },
};
</script>
