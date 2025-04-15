<template>
  <div
    class="flex items-center gap-2 rounded-5 p-1.5 pr-3.5 hover:bg-white/5"
    :class="type === 'invite' ? 'cursor-pointer' : ''"
    data-cy="6c485030dd90682a"
    @click="onChange"
  >
    <div class="relative">
      <BaseAvatarNext
        v-if="member.id"
        :picture="member.picture"
        :story="member.story"
        :user-id="member.id"
        :online="member.online"
        :source="source"
        :show-online="type !== 'invite'"
        :show-check="type === 'invite'"
        :checked="checked"
        size="md"
        @change="onChange"
      />
      <div v-else class="flex h-14 w-14 items-center justify-center">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2c2c]"
        >
          <i class="fa-solid fa-envelope text-xl" />
        </div>
      </div>
    </div>

    <div class="flex w-0 flex-1 flex-col">
      <div class="text-base text-[#f1f1f1]" v-html="name" />
      <div class="flex items-center text-xs">
        <div v-if="member.online" class="text-[#707070]">
          {{ $t('base.member.online') }}
        </div>
        <div v-else class="text-[#707070]">
          {{ $t('base.member.lastSeen') }}
          {{ member.lastActivity ? timeAgo(member.lastActivity) : 'Unknown' }}
        </div>
      </div>
    </div>

    <el-popover
      v-if="(type !== 'invite' || isPersonal) && isPopup"
      v-model:visible="open"
      :width="184"
      trigger="click"
      :show-arrow="false"
      placement="bottom-end"
    >
      <template #reference>
        <div
          class="relative flex size-6 cursor-pointer items-center justify-center rounded-5 hover:bg-white/5"
        >
          <i class="fa-light fa-ellipsis text-xs text-[#FAFAFA]" />
          <div
            v-if="isTag"
            class="absolute -right-1 -top-1 size-3 rounded-full bg-[#E0B92C]"
          />
        </div>
      </template>
      <div
        class="flex cursor-pointer flex-col gap-1.5 p-1.5 text-xs font-medium text-[#E5E5E5]"
      >
        <div
          v-if="isPersonal"
          class="flex items-center gap-2 rounded-5 p-1 hover:bg-white/5"
          data-cy="116039ec769f46fe"
          @click="onShow"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-solid fa-calendar-users" />
          </div>
          {{
            isTag
              ? $t('base.member.events.hide')
              : $t('base.member.events.show')
          }}
        </div>

        <div
          v-if="isRemove"
          class="flex cursor-pointer items-center gap-2 rounded-5 bg-[#961D1D26] p-1 hover:bg-white/5"
          data-cy="6e72c3a8bfdeadb7"
          @click="onRemove"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-solid fa-trash" />
          </div>
          {{ $t('base.member.invite.remove') }}
        </div>
      </div>
    </el-popover>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    member: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
    selecteds: {
      type: Array,
      default: () => [],
    },
    isResend: {
      type: Boolean,
      default: false,
    },
    isPersonal: {
      type: Boolean,
      default: false,
    },
    isRemove: {
      type: Boolean,
      default: true,
    },
    isTag: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: '',
    },
    searchValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    name() {
      const name =
        this.member.fullName ||
        this.member.name ||
        this.member.firstName ||
        this.member.email ||
        '';
      if (this.searchValue) {
        return highlightKeywords(name || '', [this.searchValue]);
      } else {
        return name;
      }
    },
    checked() {
      return !!this.selecteds.find(
        (selected) => selected.id === this.member.id,
      );
    },
    isPopup() {
      return this.isResend || this.isPersonal || this.isRemove;
    },
  },
  methods: {
    onChange() {
      if (this.type === 'invite') {
        this.$emit('change', this.member);
      }
    },
    onInvite() {
      this.$emit('invite', this.member);
      this.open = false;
    },
    onShow() {
      this.$emit('show', this.member);
      this.open = false;
    },
    onRemove() {
      this.$emit('remove', this.member);
      this.open = false;
    },
  },
};
</script>
