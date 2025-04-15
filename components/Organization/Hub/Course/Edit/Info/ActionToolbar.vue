<template>
  <div
    class="flex w-full items-center justify-between rounded-md bg-[#171715] px-3 py-1.5 text-xs text-[#FAFAFA] shadow-[1px_1px_3px_0px_rgba(0,0,0,0.25)]"
    :class="{ 'py-2': hubCourse.isPreview }"
  >
    <div class="flex gap-2 px-3 py-1.5">
      <div>{{ numberOfElements }} Element Selected</div>
      <button @click="$emit('onCancel')">
        <i class="fa-light fa-circle-xmark text-sm" />
      </button>
    </div>
    <div class="flex gap-2 px-3 py-1.5">
      <button
        class="flex items-center gap-1.5 rounded-md bg-[#450A0A] px-1.5 py-1 text-[#EF4444]"
        @click="$emit('onDelete')"
      >
        <i v-if="deleting" class="fa-solid fa-spinner animate-spin text-sm" />
        <i v-else class="fa-light fa-trash-can" />

        <span>Delete</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numberOfElements: {
      type: Number,
      required: true,
    },
  },
  setup() {
    const hubCourse = useHubCoursesStore();
    return { hubCourse };
  },

  computed: {
    deleting() {
      return this.hubCourse.deleting;
    },
  },
  methods: {
    oncancel() {
      console.log('cancel');
    },
    async onRemove() {
      console.log('remove');
    },
  },
};
</script>
