<template>
  <div
    class="flex items-center gap-2 rounded-5 p-1.5 pr-3.5"
    :class="{
      'cursor-pointer': isInvite,
      'bg-[#E0B92C]/10 hover:bg-[#E0B92C]/15':
        !isInvite && member.invited && !from,
      'bg-[#FF2D2D]/10 hover:bg-[#FF2D2D]/15': !isInvite && expired && !from,
      'hover:bg-white/10':
        (!isInvite && !expired && !member.invited) || isInvite,
    }"
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
        :show-online="!isInvite"
        :show-check="isInvite"
        :checked="checked"
        size="md"
        @change="onChange"
      >
        <template #button>
          <div
            v-if="expired && !isInvite && !from"
            class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#B91C1C]"
          >
            <i
              class="fa-solid fa-paper-plane text-[0.5rem] font-extrabold text-white"
            />
          </div>
          <div
            v-else-if="member.invited && !isInvite && !from"
            class="absolute inset-0 flex size-full items-center justify-center rounded-full bg-[#E0B92C]"
          >
            <i
              class="fa-solid fa-paper-plane text-[0.5rem] font-extrabold text-[#3B2F02]"
            />
          </div>
        </template>
      </BaseAvatarNext>
      <div v-else class="flex h-14 w-14 items-center justify-center">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-full bg-[#2c2c2c]"
        >
          <i class="fa-solid fa-envelope text-xl" />
        </div>
      </div>
    </div>

    <div class="flex w-0 flex-1 flex-col">
      <div class="truncate text-base text-[#f1f1f1]" v-html="name" />
      <div v-if="from" class="text-xs font-medium text-[#707070]">
        {{
          member.online ? $t('base.member.online') : $t('base.member.offline')
        }}
      </div>
      <div v-else class="flex items-center text-xs">
        <div v-if="expired && !isInvite && !from">Invitation has expired</div>
        <div
          v-else-if="member.invited && !isInvite && !from"
          class="flex items-center gap-1"
        >
          Invited
          <span v-if="member.invitedAt">{{ timeAgo(member.invitedAt) }}</span>
          <el-tooltip v-if="member.expiresAt" effect="light" placement="bottom">
            <i
              class="fa-solid fa-info-circle cursor-pointer text-xs text-[#707070]"
            />
            <template #content>
              <div class="text-xs text-[#D9D9D9]">
                Expire in
                <span class="text-[#F35D4E]">
                  {{ formatDate(member.expiresAt, 'HH') }}hrs
                  {{ formatDate(member.expiresAt, 'mm') }}mins
                </span>
                on {{ formatDate(member.expiresAt, 'MMM DD, YYYY') }}
              </div>
            </template>
          </el-tooltip>
        </div>
        <div v-else-if="member.online" class="text-[#707070]">
          {{ $t('base.member.online') }}
        </div>
        <div v-else class="text-[#707070]">
          {{ $t('base.member.lastSeen') }}
          {{ member.lastActivity ? timeAgo(member.lastActivity) : 'Unknown' }}
        </div>
        <!-- <div
          v-if="member.invitationStatus === 'accepted'"
          class="flex items-center gap-1 text-[#35A823]"
        >
          <span class="text-[#707070]">・</span>
          <i class="fa-solid fa-check" />
          {{ $t('base.member.invite.accepted') }}
        </div> -->
        <!-- <div
          v-else-if="
            (member.invited || member.acceptedInvitation) &&
            from !== 'organization' &&
            type !== 'invite'
          "
          class="flex items-center gap-1 text-[#E0B92C]"
        >
          <span class="text-[#707070]">・</span>
          <i class="fa-solid fa-envelope-dot" />
          {{ $t('base.member.invite.sent') }}
        </div> -->
      </div>
    </div>

    <el-popover
      v-if="!isInvite && isPopup"
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
          v-if="isResend"
          class="flex items-center gap-2 rounded-5 p-1 hover:bg-white/5"
          data-cy="751816b33559421f"
          @click="onInvite"
        >
          <div class="flex h-5 w-5 items-center justify-center">
            <i class="fa-solid fa-reply-clock" />
          </div>
          {{ $t('base.member.invite.resend') }}
        </div>
        <div
          v-if="from === 'personal'"
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
import dayJS from 'dayjs';

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
      return this.isResend || this.from === 'personal' || this.isRemove;
    },
    isInvite() {
      return this.type === 'invite';
    },
    expired() {
      const nowAt = dayJS().toISOString();
      return (
        this.member.invited &&
        this.member.expiresAt &&
        nowAt > this.member.expiresAt
      );
    },
  },
  methods: {
    onChange() {
      if (this.isInvite) {
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
