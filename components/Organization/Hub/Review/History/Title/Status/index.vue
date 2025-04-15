<template>
  <div class="group relative flex items-center gap-2">
    {{ $t('category.transaction.status') }}

    <div
      ref="buttonRef"
      class="flex h-4 w-4 cursor-pointer items-center justify-center rounded transition-all active:scale-90"
      :class="open ? 'bg-white/10' : 'hover:!bg-white/10'"
      data-cy="14c4daae97d57ece"
      @click="open = !open"
    >
      <i class="fa-solid fa-filter" />
    </div>
    <client-only>
      <el-popover
        :virtual-ref="buttonRef"
        trigger="click"
        :visible="open"
        placement="bottom-start"
        :width="176"
        :show-arrow="false"
        virtual-triggering
        :persistent="false"
      >
        <div class="mb-1 flex flex-col gap-1">
          <div
            v-for="item in dataList"
            :key="item.id"
            class="flex cursor-pointer items-center gap-2 rounded-md p-1.5 transition-all hover:bg-white/5 active:scale-95"
            :class="[item.class, item.id === params.status ? 'bg-white/5' : '']"
            data-cy="a5243720f4ebb0a7"
            @click="onChange(item.id)"
          >
            <div class="flex h-4 w-4 items-center justify-center">
              <i class="fa-light" :class="item.icon" />
            </div>
            {{ $t(item.name) }}
          </div>
        </div>
        <BasePopupBottom @close="open = false" />
      </el-popover>
    </client-only>
  </div>
</template>

<script>
export default {
  setup() {
    const open = ref(false);
    const buttonRef = ref(null);
    const hubReviewStore = useHubReviewStore();
    return { hubReviewStore, open, buttonRef };
  },
  data() {
    return {
      dataList: [
        {
          id: 2,
          name: 'course.question.status.answered',
          icon: 'fa-check',
          class: 'text-[#44AD1F]',
        },
        {
          id: 3,
          name: 'course.question.status.unread',
          icon: 'fa-clock',
          class: 'text-[#DCAE0C]',
        },
        {
          id: 1,
          name: 'course.question.status.notAnswered',
          icon: 'fa-xmark',
          class: 'text-[#B31414]',
        },
      ],
    };
  },
  computed: {
    params() {
      return this.hubReviewStore.params;
    },
  },
  watch: {
    async open(state) {
      if (state) {
        this.hubReviewStore.popupId = 'title-status';
      } else {
        this.hubReviewStore.popupId = '';
      }
    },
    'hubReviewStore.popupId'(state) {
      if (state && state !== 'title-status') {
        this.open = false;
      }
    },
    'hubReviewStore.params.pageNumber'() {
      this.open = false;
    },
  },
  methods: {
    onChange(status) {
      if (this.params.status === status) {
        this.params.status = '';
      } else {
        this.params.status = status;
      }
    },
  },
};
</script>
