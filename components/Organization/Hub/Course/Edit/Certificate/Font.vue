<template>
  <div class="mb-4 flex w-full cursor-pointer items-end gap-2 text-sm">
    <div class="flex size-5 items-center justify-center pb-1">
      <i class="fa-light fa-font text-sm text-white/50" />
    </div>
    <el-popover
      :visible="focus"
      :width="384"
      trigger="click"
      placement="bottom"
      :offset="10"
    >
      <template #reference>
        <BaseInput
          v-model="placeholder.signatureFont"
          class="flex-1"
          readonly
          title="Signature Font"
          @click="focus = true"
          @blur="focus = false"
        />
      </template>
      <div class="flex max-h-72 flex-col overflow-y-auto p-1">
        <div
          v-for="item in fonts"
          :key="item.id"
          class="flex cursor-pointer items-center rounded px-2 py-1 hover:bg-white/5"
          @click="onFontClick(item)"
        >
          {{ item.name }}
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
  data() {
    return {
      focus: false,
      fonts: [
        { id: 1, name: 'Dancing Script' },
        { id: 2, name: 'Great Vibes' },
        { id: 3, name: 'Pacifico' },
        { id: 4, name: 'Satisfy' },
      ],
    };
  },
  computed: {
    placeholder() {
      return this.hubCourse.detail.certificateTemplate;
    },
  },
  methods: {
    onFontClick(item) {
      this.placeholder.signatureFont = item.name;
      this.focus = false;
    },
  },
};
</script>
