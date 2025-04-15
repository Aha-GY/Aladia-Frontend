<template>
  <div class="relative">
    <div class="my-2 text-xs text-[#707070]">
      {{ $t('base.member.selected') }}: {{ actives.length }}
    </div>
    <div
      v-if="actives.length"
      ref="select"
      class="group/item relative flex cursor-pointer flex-wrap gap-1 rounded-md bg-[#151515] p-1 transition-all hover:bg-white/5"
      data-cy="9a6654488fd30967"
      @click="popoverShow = true"
    >
      <div
        v-for="member in actives"
        :key="member.memberId"
        class="flex items-center gap-2 rounded-md bg-black px-2 py-1"
      >
        <img
          v-if="member.profilePicture"
          :src="member.profilePicture"
          class="relative z-10 h-5 w-5 rounded-full object-cover"
        />
        <i v-else class="fa-solid fa-envelope" />
        <div class="max-w-24 truncate text-xs font-medium">
          {{ member.nameSurname || member.email || 'None' }}
        </div>
        <i
          class="fa-light fa-close h-3 w-3 transition-all"
          data-cy="43d7f542e5b04000"
          @click.stop="change(false, member)"
        />
      </div>

      <div
        v-if="actives.length"
        class="absolute bottom-0 left-0 right-0 flex h-[1px] justify-center group-hover/item:bg-white/10"
      >
        <div
          class="h-full bg-[#937a32] transition-all duration-300"
          :class="popoverShow ? 'w-full' : 'w-0'"
        />
      </div>
    </div>
    <BaseInput
      v-else
      ref="select"
      v-model="username"
      fixed
      clear
      search
      class="text-xs font-medium"
      :placeholder="$t('base.member.organization.search')"
      data-cy="e542b43b0ddb270d"
      @click="popoverShow = true"
    />
  </div>
  <client-only>
    <el-popover
      :virtual-ref="select"
      :visible="popoverShow"
      placement="bottom-start"
      :popper-style="{
        border: 'none',
        background: 'transparent',
        'box-shadow': 'none',
        padding: '0',
      }"
      :offset="4"
      :width="468"
      :show-arrow="false"
      virtual-triggering
    >
      <div
        v-infinite-scroll="load"
        :infinite-scroll-disabled="loading || isEnd"
        :infinite-scroll-distance="20"
        class="flex h-[17rem] w-full flex-1 flex-col gap-1 overflow-y-auto rounded-md bg-[#060606] pb-8 pr-1"
      >
        <BaseMemberSelectedItem
          v-for="member in members"
          :key="member.memberId"
          :member="member"
          :actives="actives"
          @change="change($event, member)"
        />
        <BaseSkeleton v-show="loading" height="2.5rem" />
      </div>
    </el-popover>
  </client-only>
</template>

<script>
export default {
  props: {
    actives: {
      type: Array,
      default: () => [],
    },
    change: Function,
  },
  setup() {
    const globalStore = useGlobalStore();
    const select = ref(null);
    const popoverShow = ref(false);
    onClickOutside(
      select,
      () => {
        popoverShow.value = false;
      },
      {
        ignore: ['.el-popper'],
      },
    );
    return { globalStore, select, popoverShow };
  },
  data() {
    return {
      members: [],
      username: '',
      pageNumber: 1,
      loading: false,
      isEnd: false,
      next: null,
      timer: null,
    };
  },
  watch: {
    username() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.selecteds = this.actives;
    this.init();
  },
  methods: {
    async init() {
      this.isEnd = false;
      this.next = false;
      this.members = [];
      this.load();
    },
    async load() {
      try {
        this.loading = true;
        const {
          data,
          cursor: { next },
        } = await this.globalStore.searchProfile({
          limit: 20,
          next: this.next || undefined,
          text: this.username || undefined,
        });
        this.next = next;
        this.isEnd = !next;
        this.members = [...this.members, ...data];
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
