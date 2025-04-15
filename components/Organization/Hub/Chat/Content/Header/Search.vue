<template>
  <div class="relative z-10 flex flex-col px-4">
    <div
      class="flex w-full items-center gap-0.5 bg-[#0A0A0A]/80 px-2 py-1.5 backdrop-blur transition-all"
    >
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition-all"
        :class="
          isPrev && currentMessageId
            ? 'cursor-pointer text-white/70 hover:bg-white/5 hover:text-white/90'
            : ''
        "
        data-cy="603625b8cd0bf072"
        @click="isPrev && prevOrNext('prev')"
      >
        <i class="fa-solid fa-chevron-up text-xs" />
      </div>
      <div
        class="flex h-6 w-6 items-center justify-center rounded-md text-white/30 transition-all"
        :class="
          isNext && currentMessageId
            ? 'cursor-pointer text-white/70 hover:bg-white/5 hover:text-white/90'
            : ''
        "
        data-cy="659f345e59831d42"
        @click="isNext && prevOrNext('next')"
      >
        <i class="fa-solid fa-chevron-down text-xs" />
      </div>
      <div class="mx-4 flex-1 truncate">
        <OrganizationHubChatInput
          ref="search"
          v-model="searchParams.query"
          :prefixs="searchPrefixs"
          :loading="searchMemberLoading || searchLoading"
          @search="search"
          @focus="focus"
          @delete="deletePrefix"
          @clear="clearInput"
        />
      </div>
      <div
        v-show="!searchMemberShow"
        class="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/70 transition-all hover:bg-white/5 hover:text-white/90"
        data-cy="26406bcb2696f1a9"
        @click="searchByUser"
      >
        <i class="fa-solid fa-user-group text-xs" />
      </div>
      <div
        v-show="!searchMemberShow"
        ref="datepicker"
        class="ml-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-md text-white/70 transition-all hover:bg-white/5 hover:text-white/90"
        data-cy="9e4b92a5ace8a45b"
        @click="dateOpen = !dateOpen"
      >
        <i class="fa-solid fa-calendar-days text-xs" />
      </div>
      <BaseIconClose class="ml-2 !h-6 !w-6" @click="onSearch" />
    </div>
    <div
      v-show="showList"
      class="max-h-[18.75rem] overflow-y-auto bg-black shadow-[0px_6px_12px_rgba(0,0,0,0.75)]"
    >
      <div
        v-infinite-scroll="search"
        :infinite-scroll-disabled="searchLoading || !isSearchMore"
        class="h-full flex-1 overflow-y-auto"
      >
        <div
          v-for="message in searchMessages"
          :key="message.id"
          class="flex cursor-pointer items-center border-b border-white/5 p-1 text-sm text-white/70 hover:bg-white/10"
          data-cy="a9b1199939ab9f39"
          @click="locateMessage(message)"
        >
          <div class="flex w-full items-center">
            <div class="mx-2">
              <BaseAvatarNext
                :show-online="false"
                :picture="message.author?.image"
                size="sm"
              />
            </div>
            <div class="flex-1 truncate">
              <div class="truncate">{{ message.author?.fullname }}</div>
              <div
                v-if="message.attachments.length"
                class="text-xs text-white/50"
              >
                <div
                  v-if="message.attachments[0].category === 'file'"
                  class="truncate"
                >
                  {{ message.attachments[0].name }}
                </div>
                <div
                  v-else-if="message.attachments[0].mimetype.includes('video')"
                >
                  Video
                </div>
                <div
                  v-else-if="message.attachments[0].mimetype.includes('image')"
                >
                  Photo
                </div>
              </div>
              <div
                v-else
                class="truncate text-xs text-white/50 [&_p]:overflow-hidden [&_p]:text-ellipsis [&_p]:whitespace-nowrap"
                v-html="highlightText(message.text)"
              />
            </div>
            <div class="mr-2">
              {{ formatDate(message.createdAt, 'HH:mm') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-show="showMemberList"
      class="max-h-[18.75rem] overflow-y-auto bg-black shadow-[0px_6px_12px_rgba(0,0,0,0.75)]"
    >
      <div
        v-infinite-scroll="searchMember"
        :infinite-scroll-disabled="searchMemberLoading || !searchMemberMore"
        class="h-full flex-1 overflow-y-auto"
      >
        <div
          v-for="member in searchMembers"
          :key="member.id"
          class="flex cursor-pointer items-center border-b border-white/5 p-1 text-sm text-white/70 hover:bg-white/10"
          data-cy="c2033559e65709eb"
          @click="selectMember(member)"
        >
          <div class="flex w-full items-center">
            <div class="mx-2">
              <BaseAvatarNext
                :show-online="false"
                :picture="member.image"
                size="sm"
              />
            </div>
            <div class="flex-1 truncate">
              <div class="truncate" v-html="highlightText(member.fullName)" />
              <div class="text-xs text-white/30">{{ member.username }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-popover
      v-model:visible="showDatepicker"
      :virtual-ref="datepicker"
      popper-class="bg-[#0A0A0A]/80 p-0 "
      :show-arrow="false"
      placement="bottom"
      trigger="hover"
      virtual-triggering
      :width="220"
      :offset="0"
      @after-enter="showDatepicker = true"
      @after-leave="showDatepicker = false"
    >
      <BaseDatePicker
        v-model="dateValue"
        mode="date"
        :disabled-dates="disabledDates"
        @change="changeDate"
      />
    </el-popover>
  </div>
</template>
<script>
import dayJS from 'dayjs';

const dayjs = dayJS.tz;

export default {
  props: {
    onSelect: Function,
    roomId: String,
    onSearch: Function,
  },
  emits: ['locate-message'],
  setup() {
    const datepicker = ref();
    const hubChatStore = useHubChatStore();
    return { hubChatStore, datepicker };
  },
  data() {
    return {
      showDatepicker: false,
      disabledDates: [{ start: dayjs().subtract(1, 'day') }],
      dateValue: null,
      currentMessageId: null,
      showList: true,
      prefixs: [],
      showMemberList: false,

      searchMessages: [],
      searchMembers: [],
      searchMemberShow: false,
      searchMemberLoading: false,
      searchMemberMore: false,
      searchMemberNext: null,
      searchPrefixs: [],
      searchLoading: false,
      isSearchMore: false,
      searchParams: {
        limit: 100,
        query: '',
        author: '',
        from: '',
        to: '',
        next: null,
      },
    };
  },
  computed: {
    isPrev() {
      return this.searchMessages.findIndex(
        (message) => message.id === this.currentMessageId,
      ) ===
        this.searchMessages.length - 1
        ? false
        : true;
    },
    isNext() {
      return this.searchMessages.findIndex(
        (message) => message.id === this.currentMessageId,
      ) === 0
        ? false
        : true;
    },
  },
  watch: {
    'searchParams.query': debounce(function (val) {
      if (val) {
        if (this.searchPrefixs.length === 1 && this.showMemberList) {
          this.searchMember();
        } else {
          this.searchMessages = [];
          this.search();
        }
      } else {
        if (this.searchPrefixs.length === 1 && this.showMemberList) {
          this.searchMember();
        } else if (this.searchPrefixs.length >= 1) {
          this.searchMessages = [];
          this.search();
        } else {
          this.currentMessageId = null;
          this.searchMessages = [];
          this.showList = false;
        }
      }
    }, 500),
    roomId() {
      this.onSearch();
    },
  },
  methods: {
    async search() {
      this.showList = true;
      this.currentMessageId = null;
      this.searchLoading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.searchRoomMessages({
        roomId: this.roomId,
        ...this.searchParams,
      });
      const messages = data || [];
      if (this.searchParams.next) {
        this.searchMessages = this.searchMessages.concat(messages);
      } else {
        this.searchMessages = messages;
      }
      this.searchParams.next = next;
      this.isSearchMore = next ? true : false;
      this.searchLoading = false;
    },
    async changeDate(date) {
      this.searchParams.from = dayjs(date).toISOString();
      this.searchParams.to = dayjs(date).add(1, 'day').toISOString();
      this.showDatepicker = false;
      this.searchPrefixs = [
        {
          content: formatDate(this.searchParams.from, 'MMM D, YYYY'),
          class: 'text-[#FFC700]/80',
        },
      ];
      this.searchMessages = [];
      this.search();
      this.$refs.search.onFocus();
      const { data } = await this.hubChatStore.getFromDateMessages({
        roomId: this.roomId,
        date: dayjs(date).toISOString(),
        limit: 1,
      });
      if (data && data.length > 0) {
        this.$emit('locate-message', data[0].id);
      }
    },
    prevOrNext(type) {
      const index = this.searchMessages.findIndex(
        (message) => message.id === this.currentMessageId,
      );
      const msg = this.searchMessages[type === 'prev' ? index + 1 : index - 1];
      if (msg) {
        this.currentMessageId = msg.id;
        this.$emit('locate-message', this.currentMessageId);
      }
    },
    async locateMessage(message) {
      this.currentMessageId = message.id;
      this.$emit('locate-message', message.id);
      this.showList = false;
    },
    focus(state) {
      if (state && this.searchPrefixs.length !== 1) {
        this.showList = true;
      }
    },
    deletePrefix() {
      if (this.searchParams.query === '') {
        if (this.searchPrefixs.length === 2) {
          this.searchPrefixs.pop();
          this.showList = false;
          this.showMemberList = true;
        } else if (this.searchPrefixs.length === 1) {
          this.searchPrefixs.pop();
          this.searchMemberShow = false;
          this.searchParams.from = null;
          this.searchParams.to = null;
          this.showList = false;
          this.showMemberList = false;
        }
      }
    },
    async searchByUser() {
      this.searchPrefixs.push({
        content: 'from:',
      });
      this.searchMemberShow = true;
      this.searchParams = {
        limit: 100,
        query: '',
        author: '',
        from: '',
        to: '',
        next: null,
      };
      this.showMemberList = true;
      this.showList = false;
      this.$refs.search.onFocus();
      this.searchMember();
    },
    async searchMember() {
      this.showList = false;
      this.searchMemberLoading = true;
      const {
        data,
        cursor: { next },
      } = await this.hubChatStore.searchRoomMembers({
        query: this.searchParams.query,
        limit: 100,
        roomId: this.roomId,
        next: this.searchMemberNext,
      });
      this.searchMemberLoading = false;
      this.searchMembers = data;
      this.searchMemberNext = next;
      this.searchMemberMore = next ? true : false;
    },
    selectMember(member) {
      this.searchParams.author = member.id;
      this.searchParams.query = '';
      this.searchPrefixs.push({
        content: member.fullName,
        class: 'text-[#FFC700]/80 truncate',
      });
      this.showMemberList = false;
      this.searchMessages = [];
      this.search();
      this.showList = true;
      this.$refs.search.onFocus();
    },
    clearInput() {
      this.searchParams = {
        limit: 100,
        query: '',
        author: '',
        from: '',
        to: '',
        next: null,
      };
      this.searchPrefixs = [];
      this.searchMemberShow = false;
      this.searchMessages = [];
      this.currentMessageId = null;
      this.showMemberList = false;
      this.showList = false;
      this.$refs.search.onFocus();
    },
    highlightText(text) {
      if (this.searchParams.query) {
        return highlightKeywords(text || '', [this.searchParams.query]);
      }
      return text;
    },
  },
};
</script>
