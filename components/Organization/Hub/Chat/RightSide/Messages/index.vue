<template>
  <div class="flex h-0 flex-1 flex-col gap-2.5">
    <OrganizationHubChatRightSideMessagesHeader
      @select="onSelect"
      @select-all="onSelectAll"
      @filter-member="openFilterMember"
      @filter-date="onFilterDate"
    />
    <OrganizationHubChatRightSideMediaFrom
      v-if="owner"
      :members="filterMembers"
      @remove="onRemove"
    />
    <div class="px-4">
      <BaseInput
        v-model="query"
        search
        clear
        fixed
        class="mb-2 text-sm"
        placeholder="Search "
        @enter="onEnter"
      />
    </div>
    <div
      v-if="dataList.length || loading"
      v-infinite-scroll="load"
      class="chat-bg hide-scrollbar relative flex h-full flex-1 flex-col gap-0.5 overflow-y-auto pb-4 text-white/80"
      :infinite-scroll-disabled="loading || !next"
    >
      <div v-for="key in Object.keys(groupDataList)" :key="key">
        <div class="flex justify-center px-3 py-2 text-xs">
          <div class="rounded-5 bg-white/[0.01] px-2 py-1">{{ key }}</div>
        </div>
        <div class="flex flex-col gap-1 px-2">
          <OrganizationHubChatRightSideMessagesItem
            v-for="item in groupDataList[key]"
            :key="item.messageId"
            :item="item"
            :right-id="rightId"
            :on-right="onRight"
            :is-select="isSelect"
            :on-check="onCheck"
            :on-select="onSelect"
            :checked-ids="checkedIds"
            :on-delete="onDelete"
            :on-cancel="onCancelCheck"
            :on-forward="onForward"
            @locate-message="$emit('locate-message', $event)"
          />
        </div>
      </div>
      <div v-show="loading" class="flex flex-col gap-1 px-2 py-1">
        <BaseSkeleton
          v-for="i in 6"
          :key="i"
          class="rounded-5"
          height="3rem"
          :length="1"
        />
      </div>
    </div>
    <div v-else class="flex flex-1 items-center">
      <BaseNoData />
    </div>
    <OrganizationHubChatRightSideMediaFloat
      :on-cancel="onCancelCheck"
      :checked-ids="checkedIds"
      :on-delete="onDelete"
      :on-forward="onForward"
    />
    <OrganizationHubChatRightSideMediaFilterMember
      :show="showFilterMember"
      @cancel="onCancelFilter"
      @filter="onFilterMember"
    />
  </div>
</template>
<script>
export default {
  setup() {
    const hubChatStore = useHubChatStore();
    return { hubChatStore };
  },
  data() {
    return {
      query: '',
      dataList: [],
      loading: false,
      next: null,
      timer: null,
      isSelect: false,
      checkedIds: [],
      deleteLoading: false,
      rightId: '',
      showFilterMember: false,
      owner: null,
      filterMembers: [],
      filterTypes: [],
      showDelete: false,
      readyDeleteId: null,
    };
  },
  computed: {
    groupDataList() {
      return this.dataList.reduce((acc, item) => {
        const date = formatDate(item.createdAt, 'DD MMMM, YYYY');
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(item);
        return acc;
      }, {});
    },
  },
  watch: {
    query() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.next = null;
        this.dataList = [];
        this.load();
      }, 500);
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    search() {
      this.dataList = [];
      this.next = null;
      this.load();
    },
    async load() {
      this.loading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.searchSavedMessages({
        roomId: this.hubChatStore.roomId,
        limit: 50,
        next: this.next,
        query: this.query.trim(),
        author: this.owner,
        date: this.date,
      });
      if (this.next === null) {
        this.dataList = data || [];
      } else {
        this.dataList = [...this.dataList, ...data];
      }
      if (this.query) {
        this.dataList = this.dataList.map((item) => ({
          ...item,
          content: this.highlightHtml(item.content),
        }));
      }
      this.next = next;
      this.loading = false;
    },
    onSelect(id) {
      this.isSelect = !this.isSelect;
      if (id) {
        this.isSelect = true;
        this.checkedIds = [id];
      } else {
        this.checkedIds = [];
      }
      this.showFilterMember = false;
    },
    onCheck(id) {
      this.checkedIds.includes(id)
        ? this.checkedIds.splice(this.checkedIds.indexOf(id), 1)
        : this.checkedIds.push(id);
    },
    onCancelCheck() {
      this.isSelect = false;
      this.checkedIds = [];
      this.readyDeleteId = null;
    },
    async onDelete(id) {
      this.deleteLoading = true;
      const ids = !id ? this.checkedIds : [id];
      await this.hubChatStore.deleteSavedMessages({
        roomId: this.hubChatStore.chatId,
        messageIds: ids,
      });

      this.dataList = this.dataList.filter((item) => !ids.includes(item.id));
      this.checkedIds = [];
      this.isSelect = false;
      this.deleteLoading = false;
    },
    onSelectAll() {
      const allIds = this.dataList.map((item) => item.id);
      if (!this.isSelect) {
        this.checkedIds = [];
        this.isSelect = true;
      } else if (this.isSelect && allIds.length > this.checkedIds.length) {
        this.isSelect = true;
        this.checkedIds = allIds;
      } else {
        this.checkedIds = [];
        this.isSelect = false;
      }
      this.showFilterMember = false;
    },
    onRight(id) {
      this.rightId = id;
    },
    openFilterMember() {
      this.showFilterMember = !this.showFilterMember;
      this.isSelect = false;
      this.checkedIds = [];
    },
    onFilterMember(members) {
      this.showFilterMember = false;
      this.owner = members[0].id;
      this.filterMembers = members;
      this.search();
    },
    onCancelFilter() {
      this.showFilterMember = false;
      this.owner = null;
      this.filterMembers = [];
    },
    onRemove(member) {
      this.filterMembers = this.filterMembers.filter((m) => m.id !== member.id);
      this.owner = this.filterMembers[0]?.id;
      this.search();
    },
    onFilterDate(date) {
      this.isSelect = false;
      this.checkedIds = [];
      this.date = date;
      this.search();
    },
    onForward(id) {
      this.hubChatStore.showForward = true;
      let messages = [];
      if (id) {
        messages = this.dataList.filter((item) => item.id === id);
      } else {
        messages = this.dataList.filter((item) =>
          this.checkedIds.includes(item.id),
        );
      }
      this.hubChatStore.forwardData = {
        roomId: this.hubChatStore.roomId,
        messages,
      };
    },
    highlightHtml(text) {
      if (this.query) {
        return highlightHTMLByKeywords(text || '', this.query.trim());
      }
      return text;
    },
  },
};
</script>
