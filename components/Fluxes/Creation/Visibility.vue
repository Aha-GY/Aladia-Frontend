<template>
  <el-popover
    v-model:visible="optionsShow"
    trigger="click"
    placement="bottom-start"
    :show-arrow="false"
    :persistent="false"
    :popper-style="{
      minWidth: '15rem',
    }"
  >
    <template #reference>
      <span class="cursor-pointer text-white/60">
        <PostsItemWidgetsVisibility :visibility="active" />
      </span>
    </template>
    <div class="flex flex-col gap-2">
      <div
        v-for="menu in menus"
        :key="menu"
        class="flex cursor-pointer flex-col gap-[0.375rem] rounded-[0.3125rem] px-3 py-1 transition-all duration-200 hover:bg-[#B0B0B0]/10"
        data-cy="ee483bc13c1aeac2"
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
  data() {
    return {
      optionsShow: false,
    };
  },
  computed: {
    menus() {
      return [
        {
          label: 'flux.visibility.private.title',
          type: 'private',
          desc: 'flux.visibility.private.description',
        },
        {
          label: 'flux.visibility.restricted.title',
          type: 'restricted',
          desc: 'flux.visibility.restricted.description',
        },
        {
          label: 'flux.visibility.public.title',
          type: 'public',
          desc: 'flux.visibility.public.description',
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
    onSelect(menu) {
      this.optionsShow = false;
      this.$emit('select', menu);
    },
  },
};
</script>
