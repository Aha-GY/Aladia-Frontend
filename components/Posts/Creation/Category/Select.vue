<template>
  <div
    class="absolute bottom-0 left-0 right-0 top-0 z-10 bg-[#070707] p-4 pt-0"
  >
    <div
      class="flex justify-between"
      :class="$device.isMobile ? 'w-full flex-col' : ''"
    >
      <div :class="$device.isMobile ? '' : 'flex-1 text-nowrap'">
        <div
          class="group flex cursor-pointer items-center"
          :class="$device.isMobile ? '' : 'py-2'"
          data-cy="65e2bfbef3b78397"
          @click="handleBack"
        >
          <span class="flex items-center gap-2 leading-6 text-[#FAFAFA]">
            <span
              class="translation-all duration-300 group-hover:-translate-x-1"
            >
              <i class="fa-solid fa-arrow-left" />
            </span>
            <span class="text-xs">
              {{ $t('course.question.create.back') }}
            </span>
          </span>
        </div>

        <div class="text-sm text-[#D9D9D9]">
          {{ $t('course.question.create.selectCategory') }}
        </div>
      </div>
      <BaseInput
        v-model="name"
        search
        fixed
        clear
        placeholder="Search a topic"
        :class="$device.isMobile ? 'mt-2 !w-full' : '!w-64'"
      />
    </div>

    <div
      v-infinite-scroll="load"
      class="my-2 flex h-[78%] w-full flex-wrap overflow-y-auto"
      :infinite-scroll-disabled="loading || !next"
      :infinite-scroll-distance="20"
    >
      <div
        v-for="item in categoryData"
        :key="item.id"
        class="mb-4 h-16 w-1/2 cursor-pointer rounded-[0.3125rem] p-[0.375rem] transition-all hover:bg-white/5"
        :class="{
          'bg-[#e2e2e2]/[0.03]': item.id === currSelect,
          '!w-full': $device.isMobile,
        }"
        data-cy="158f945b6d8d6558"
        @click.stop="onChecked(item)"
      >
        <div class="flex items-center gap-2">
          <div class="relative h-[3rem] w-[3rem] flex-shrink-0">
            <span
              class="block h-full w-full overflow-hidden rounded-[0.3125rem] border-2 border-white/5"
            >
              <img
                :src="item.image.url"
                :alt="item.name"
                class="h-full w-full object-contain"
              />
            </span>
            <BaseCheckboxStyle
              class="absolute bottom-0 right-0"
              :state="item.id === currSelect ? 'correctChecked' : 'unchecked'"
              @mousedown.stop
              @mouseup.stop
            />
          </div>
          <div class="flex flex-1 flex-col truncate">
            <div class="truncate leading-6 text-[#F1F1F1]">
              <div v-if="name">
                <div v-html="highlightKeywords(item.name, [name])" />
              </div>
              <div v-else>{{ item.name }}</div>
            </div>
            <p class="truncate text-xs leading-4 text-[grey]/70">
              {{ item.questions }}
            </p>
          </div>
        </div>
      </div>

      <div v-show="loading" class="flex w-full flex-wrap">
        <PostsCreationCategorySkeleton
          v-for="i in 8"
          :key="i"
          class="mb-4 w-1/2"
          :class="{
            '!w-full': $device.isMobile,
          }"
        />
      </div>
    </div>
    <div class="flex items-center justify-between">
      <BaseButton
        type="secondary"
        icon="trash-can"
        class="!w-[6.25rem]"
        data-cy="ab6bad006b082062"
        @click="handleBack"
      >
        <i class="fa-light fa-trash-can" />
        {{ $t('base.upload.cancel') }}
      </BaseButton>
      <BaseButton
        type="secondary"
        class="!w-[6.25rem]"
        data-cy="91f1289d5cae2e4a"
        @click="handleComfirm"
      >
        <i class="fa-thin fa-floppy-disk" />
        {{ $t('base.upload.confirm') }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    active: {
      type: String,
      default: '',
    },
  },
  setup() {
    const socialStore = useSocialStore();
    const authStore = useAuthStore();
    return { socialStore, authStore };
  },
  data() {
    return {
      name: '',
      checked: false,
      categoryData: [],
      next: null,
      loading: false,
      select: null,
      timer: null,
    };
  },
  computed: {
    currSelect() {
      return this.select?.id || this.active;
    },
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.next = null;
      this.categoryData = [];
      this.load();
    },
    async load() {
      this.loading = true;

      try {
        const {
          data,
          cursor: { next },
        } = await this.socialStore.searchCategories({
          limit: 20,
          next: this.next,
          name: this.name || undefined,
        });

        this.next = next;
        this.categoryData = [...this.categoryData, ...data].filter(
          (item) => item.status === 'active',
        );
      } finally {
        this.loading = false;
      }
    },
    onChecked(item) {
      this.select = item;
    },
    handleBack() {
      this.$emit('back');
    },
    handleComfirm() {
      this.$emit('select', this.select);
      this.handleBack();
    },
    initCategories() {},
  },
};
</script>
