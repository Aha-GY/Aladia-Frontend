<template>
  <div class="mb-4 flex w-full cursor-pointer items-center gap-2 text-sm">
    <div class="flex size-5 items-center justify-center">
      <div
        class="size-4 rounded-sm"
        :style="{
          backgroundColor: placeholder.brandColor,
        }"
      />
    </div>
    <el-popover
      ref="popover"
      :width="384"
      trigger="click"
      placement="bottom"
      :offset="10"
    >
      <template #reference>
        <div
          class="relative flex flex-1 cursor-pointer items-end justify-between gap-2"
        >
          <BaseInput
            ref="color"
            v-model="placeholder.brandColor"
            readonly
            title="Brand Color"
          />
          <img src="~/assets/icons/color-pick.svg" class="h-6" />
        </div>
      </template>
      <div>
        <LazyBaseColor :color="placeholder.brandColor" @change="onChange" />
        <div class="px-2 pb-2">
          <BasePopupBottom @close="onClose" />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },
  computed: {
    placeholder() {
      return this.hubCourse.detail.certificateTemplate;
    },
  },
  methods: {
    onClose() {
      this.$refs.popover.hide();
    },
    onChange(color) {
      this.placeholder.brandColor = color;
    },
  },
};
</script>
