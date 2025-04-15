<template>
  <div
    ref="item"
    class="group/item flex h-[6rem] items-center px-4 text-base text-white/80 transition-all"
    :class="[
      item.isRead
        ? 'hover:bg-[#313131]'
        : 'bg-[#100E07] hover:bg-[#554301] active:bg-[#403308]',
      !isDeclined ? 'cursor-pointer' : '',
    ]"
    data-cy="a4796003776de8be"
    @click.stop="onOpen()"
  >
    <div class="mr-2 w-4 flex-shrink-0">
      <div v-if="!item.isRead" class="size-3 rounded-full bg-[#E0B92C]" />
    </div>

    <div class="relative">
      <BaseAvatarNext
        :picture="!isSystems ? lastSender.image : systemIcon"
        :show-online="false"
        size="md"
      >
        <template #button>
          <div
            class="flex size-full items-center justify-center rounded-full bg-[#262626]"
          >
            <template
              v-if="
                [
                  'comment-reaction',
                  'post-reaction',
                  'story-reaction',
                ].includes(item.type) && item.placeholders.reactionType
              "
            >
              <BaseReactionItem
                :name="item.placeholders.reactionType"
                :is-image="true"
                :size="4"
                image-type="gif"
              />
            </template>
            <template v-else>
              <i :class="`${typeIcons} scale-75 text-xs text-white/80`" />
            </template>
          </div>
        </template>
      </BaseAvatarNext>
    </div>

    <div class="ml-3 flex flex-1 flex-col truncate">
      <div>
        <div class="line-clamp-3 flex-1 truncate whitespace-normal">
          <span
            v-if="item.type === 'teacher-answer'"
            class="font-thin text-white/60"
          >
            {{ $t('nav.header.notification.teacher.title') }}
          </span>
          <span
            v-if="
              ![
                'all-questions-solved',
                'course-generation-failure',
                'course-generation-success',
                'organization-create',
                'organization-onboarding-complete',
                'content-remove',
                'become-teacher',
                'user-banned',
                'profile-complete',
                'profile-incomplete',
                'streaming-limit-exceeded',
                'token-limit-exceeded',
                'storage-limit-exceeded',
                'course-review',
              ].includes(item.type)
            "
            class="mr-1 inline-flex max-w-[12rem] cursor-pointer truncate font-bold hover:underline hover:underline-offset-4"
            data-cy="7ee00962b3839acd"
            @click.stop="visit"
          >
            <span class="truncate">{{ lastSender.fullName }}</span>
          </span>
          <span v-html="content" />
        </div>
      </div>
      <div v-if="notificationStore.show" class="text-xs text-white/30">
        {{ timeAgo2(item.updatedAt) }}
      </div>
    </div>
    <div class="flex-shrink-0 px-2">
      <template
        v-if="
          item.type === 'follow' &&
          item.senders.length === 1 &&
          item.senderCount === 0 &&
          !lastSender.mutualFollow
        "
      >
        <BaseButton
          v-if="!lastSender.isFollowing"
          size="small"
          :icon="!followLoading ? 'fa-solid fa-user-plus' : ''"
          :loading="followLoading"
          data-cy="c564aed4dda417a3"
          @click.stop="onFollow"
        >
          {{ $t('base.member.follow') }}
        </BaseButton>
        <div v-else class="flex items-center gap-1.5 text-xs">
          <i class="fa-solid fa-circle-check" />
          <span>{{ $t('base.member.following') }}</span>
        </div>
      </template>
      <div
        v-else-if="
          [
            'space-member-invite',
            'course-member-invite',
            'calendar-member-invite',
            'event-member-invite',
            'organization-member-invite',
            'branch-invite',
          ].includes(item.type)
        "
      >
        <div
          v-if="item.placeholders.invitationStatus === 'pending'"
          class="flex gap-1"
        >
          <BaseButton
            class="!border-[0.0625rem] !border-white/50"
            type="tertiary"
            size="small"
            :loading="inviteLoading && !inviteType"
            :style="{
              borderBottomColor: 'rgba(255,255,255,0.5) !important',
              borderBottomWidth: '0.0625rem !important',
            }"
            data-cy="9bcfbd354e1ea6c4"
            @click.stop="onInvite(false)"
          >
            {{ $t('nav.header.actions.decline') }}
          </BaseButton>
          <BaseButton
            size="small"
            :loading="inviteLoading && inviteType"
            data-cy="69f7211dccda439e"
            @click.stop="onInvite(true)"
          >
            {{ $t('nav.header.actions.accept') }}
          </BaseButton>
        </div>
        <div
          v-else-if="item.placeholders.invitationStatus === 'accepted'"
          class="rounded-[0.3125rem] border-[0.0313rem] border-[#86EFAC] bg-[#86EFAC]/30 px-1 py-0.5 text-xs text-[#86EFAC]"
        >
          {{ $t('nav.header.accepted') }}
        </div>
        <div
          v-else
          class="rounded-[0.3125rem] border-[0.0313rem] border-[#EF4444] bg-[#EF4444]/30 px-1 py-0.5 text-xs text-[#EF4444]"
        >
          {{ $t('nav.header.declined') }}
        </div>
      </div>
      <img
        v-else-if="isImage"
        :src="item.placeholders.file.url"
        class="h-12 w-20 rounded-sm object-cover"
      />
      <video
        v-else-if="isVideo"
        :src="item.placeholders.file.url"
        class="h-12 w-20 rounded-sm object-cover"
      />
    </div>

    <el-popover
      v-model:visible="showActions"
      trigger="hover"
      width="130"
      :teleported="false"
      :show-arrow="false"
      :popper-style="{
        padding: '0px !important',
        borderRadius: '0.3125rem',
      }"
    >
      <template #reference>
        <div
          class="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-base leading-none transition-all hover:bg-white/10 active:scale-95"
        >
          <i
            class="fa-solid fa-ellipsis text-xs group-hover/item:opacity-100 md:opacity-0"
          />
        </div>
      </template>
      <div class="flex flex-col gap-[0.375rem] p-[0.375rem] text-white/80">
        <div
          v-if="item.url && !isDeclined"
          class="flex cursor-pointer items-center gap-2 rounded-[0.3125rem] p-1 hover:bg-white/10 active:scale-95"
          data-cy="809ee79d52ed2d26"
          @click.stop="onOpen"
        >
          <i class="fa-solid fa-arrow-up-right-from-square" />
          {{ $t('nav.header.actions.goTo') }}
        </div>
        <div
          v-if="!item.isRead"
          class="flex cursor-pointer items-center gap-2 rounded-[0.3125rem] p-1 hover:bg-white/10 active:scale-95"
          :class="readLoading ? 'pointer-events-none' : ''"
          data-cy="224c2a7effb7f2f1"
          @click.stop="onRead"
        >
          <i
            v-if="readLoading"
            class="fa-solid fa-spinner animate-spin text-xs"
          />
          <i v-else class="fa-solid fa-check" />
          {{ $t('nav.header.notification.list.markRead') }}
        </div>
        <div
          class="flex cursor-pointer items-center gap-2 rounded-[0.3125rem] p-1 hover:bg-white/10 active:scale-95"
          :class="deleteLoading ? 'pointer-events-none' : ''"
          data-cy="041b7ab6421654e8"
          @click.stop="onDelete"
        >
          <i
            v-if="deleteLoading"
            class="fa-solid fa-spinner animate-spin text-xs"
          />
          <i v-else class="fa-solid fa-trash" />
          {{ $t('base.editor.delete') }}
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
import systemIcon from '~/assets/logo/image5.png';

export default {
  props: {
    item: Object,
    open: Boolean,
  },
  setup() {
    const authStore = useAuthStore();
    const notificationStore = useNotificationStore();
    const profileStore = useProfileStore();
    return { authStore, notificationStore, profileStore, systemIcon };
  },
  data() {
    return {
      showActions: false,
      readLoading: false,
      deleteLoading: false,
      followLoading: false,
      inviteLoading: false,
      inviteType: false,
    };
  },
  computed: {
    isImage() {
      return (
        this.item.placeholders.file &&
        this.item.placeholders.file.metadata?.mimetype?.includes('image')
      );
    },
    isVideo() {
      return (
        this.item.placeholders.file &&
        this.item.placeholders.file.metadata?.mimetype?.includes('video')
      );
    },
    firstSender() {
      return this.item.senders[0];
    },
    lastSender() {
      return this.item.senders[this.item.senders.length - 1];
    },
    content() {
      switch (this.item.type) {
        case 'question-solved':
          return this.$t('nav.header.notification.actions.question.single', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholder: this.item.placeholders.text,
          });
        case 'follow':
          if (this.item.senders.length > 1 || this.item.senderCount > 0) {
            if (this.item.senders.length > 1) {
              return this.$t('nav.header.notification.actions.follower.two', {
                slotOpen: '<span class="font-thin text-white/60">',
                slotClosed: '</span>',
                name: `<span  class='notification-second-name cursor-pointer font-bold hover:underline hover:underline-offset-4'>${this.firstSender.fullName}</span>`,
              });
            } else {
              return this.$t(
                'nav.header.notification.actions.follower.multiple',
                {
                  slotOpen: '<span class="font-thin text-white/60">',
                  slotClosed: '</span>',
                  senderCount: this.item.senderCount,
                },
              );
            }
          }
          break;
        case 'profile-view':
          if (this.item.senders.length > 1 || this.item.senderCount > 0) {
            if (this.item.senders.length > 1) {
              return this.$t('nav.header.notification.actions.visitor.two', {
                slotOpen: '<span class="font-thin text-white/60">',
                slotClosed: '</span>',
                name: `<span  class='notification-second-name cursor-pointer font-bold hover:underline hover:underline-offset-4'>${this.firstSender.fullName}</span>`,
              });
            } else {
              return this.$t(
                'nav.header.notification.actions.visitor.multiple',
                {
                  slotOpen: '<span class="font-thin text-white/60">',
                  slotClosed: '</span>',
                  senderCount: this.item.senderCount,
                },
              );
            }
          }
          break;
        case 'event-create':
          return this.$t('nav.header.notification.actions.event.created', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderText: this.item.placeholders.text,
            placeholderName: this.item.placeholders.name,
          });
        case 'event-update':
          return this.$t('nav.header.notification.actions.event.updated', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderText: this.item.placeholders.text,
            placeholderName: this.item.placeholders.name,
          });
        case 'event-delete':
          return this.$t('nav.header.notification.actions.event.deleted', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderText: this.item.placeholders.text,
            placeholderName: this.item.placeholders.name,
          });
        case 'course-generation-success':
        case 'course-generation-failure':
          return this.$t(
            'nav.header.notification.actions.course.generation.successLabel',
            {
              placeholderText: this.item.placeholders.text,
              typeDesc: this.typeDesc,
            },
          );
        case 'course-purchase':
          return this.$t('nav.header.notification.actions.course.purchased', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderQuantity: this.item.placeholders.quantity,
            placeholderText: this.item.placeholders.text,
          });
        case 'course-review':
          return this.$t('nav.header.notification.actions.course.review', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderName: this.item.placeholders.name,
          });
        case 'free-course-enroll':
          return this.$t('nav.header.notification.actions.course.enroll', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderText: this.item.placeholders.text,
          });
        case 'course-subscription':
          return this.$t('nav.header.notification.actions.course.subscribe', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderQuantity: this.item.placeholders.quantity,
            placeholderText: this.item.placeholders.text,
          });
        case 'course-installment-payment':
          return this.$t('nav.header.notification.actions.course.payment', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            currentInstallment: this.item.placeholders.currentInstallment,
            totalInstallment: this.item.placeholders.totalInstallment,
            quantity: this.item.placeholders.quantity,
            text: this.item.placeholders.text,
          });
        case 'folder-update':
          return this.$t('nav.header.notification.actions.folder.removed', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderName: this.item.placeholders.name,
            placeholderText: this.item.placeholders.text,
          });
        case 'folder-remove':
          return this.$t('nav.header.notification.actions.folder.removed', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            placeholderName: this.item.placeholders.name,
            placeholderText: this.item.placeholders.text,
          });
        default:
          return this.$t('nav.header.notification.actions.default', {
            slotOpen: '<span class="font-thin text-white/60">',
            slotClosed: '</span>',
            typeDesc: this.typeDesc,
            placeholder: this.stripHtmlTags(this.item.placeholders.text),
          });
      }
      return this.$t('nav.header.notification.actions.default', {
        slotOpen: '<span class="font-thin text-white/60">',
        slotClosed: '</span>',
        typeDesc: this.typeDesc,
        placeholder: this.stripHtmlTags(this.item.placeholders.text),
      });
    },
    isSystems() {
      return [
        'organization-create',
        'organization-onboarding-complete',
        'content-remove',
        'become-teacher',
        'user-banned',
        'profile-complete',
        'profile-incomplete',
        'streaming-limit-exceeded',
        'token-limit-exceeded',
        'storage-limit-exceeded',
        'course-review',
      ].includes(this.item.type);
    },
    typeIcons() {
      switch (this.item.type) {
        case 'follow':
        case 'unfollow':
        case 'post-create':
        case 'user-comment':
        case 'comment':
        case 'comment-reply':
        case 'comment-mention':
        case 'profile-view':
        case 'certificate':
        case 'work-experience':
        case 'ongoing-work-experience':
        case 'education':
        case 'ongoing-education':
        case 'story-create':
          return 'fa-solid fa-comments';
        case 'question':
        case 'category-question':
        case 'course-question':
        case 'answer':
        case 'question-solved':
        case 'marked-as-best-answer':
        case 'all-questions-solved':
        case 'teacher-answer':
          return 'fa-solid fa-question';
        case 'review':
        case 'review-comment':
          return 'fa-solid fa-star';
        case 'course-create':
        case 'course-update':
        case 'course-generation-success':
        case 'course-generation-failure':
        case 'course-review':
        case 'course-published':
        case 'course-member-invite':
        case 'course-member-role-update':
        case 'course-member-accept-invite':
        case 'course-member-decline-invite':
        case 'course-member-remove':
          return 'fa-solid fa-play';
        case 'space-member-invite':
        case 'space-member-role-update':
        case 'space-member-remove':
        case 'space-delete':
        case 'space-update':
        case 'member-accept-invite':
        case 'member-decline-invite':
        case 'folder-update':
        case 'folder-remove':
          return 'fa-solid fa-box';
        case 'event-create':
        case 'event-update':
        case 'event-delete':
        case 'event-member-invite':
        case 'event-member-decline-invite':
        case 'event-member-accept-invite':
        case 'calendar-member-invite':
        case 'calendar-member-decline-invite':
        case 'calendar-member-accept-invite':
        case 'calendar-member-role-update':
        case 'calendar-member-remove':
        case 'calendar-delete':
        case 'calendar-update':
          return 'fa-solid fa-calendar';
        case 'course-installment-payment':
        case 'course-subscription':
        case 'course-purchase':
        case 'free-course-enroll':
          return 'fa-solid fa-credit-card';
        case 'organization-create':
        case 'organization-delete':
        case 'organization-onboarding-complete':
        case 'content-remove':
        case 'become-teacher':
        case 'user-banned':
        case 'profile-complete':
        case 'profile-incomplete':
        case 'streaming-limit-exceeded':
        case 'token-limit-exceeded':
        case 'storage-limit-exceeded':
          return 'fa-solid fa-gears';
        case 'organization-member-invite':
        case 'organization-member-accept-invite':
        case 'organization-member-decline-invite':
        case 'organization-member-role-change':
        case 'organization-member-remove':
        case 'branch-invite':
        case 'branch-member-decline-invite':
        case 'branch-member-accept-invite':
          return 'fa-solid fa-building-ngo';
        default:
          return 'fa-solid fa-bell';
      }
    },
    typeDesc() {
      const types = {
        like: 'nav.header.notification.actions.like',
        follow: this.lastSender.mutualFollow
          ? 'nav.header.notification.actions.follower.mutual'
          : 'nav.header.notification.actions.follower.single',
        unfollow: 'nav.header.notification.actions.follower.unFollow',
        comment: 'nav.header.notification.actions.post.commented',
        'post-mention': 'nav.header.notification.actions.post.mentioned',
        share: 'nav.header.notification.actions.shared',
        'course-create': 'nav.header.notification.actions.course.created',
        'course-update': 'nav.header.notification.actions.course.updated',
        'new-assignment': 'nav.header.notification.actions.assignment.new',
        'quiz-reminder': 'nav.header.notification.actions.quizRem',
        'comment-mention': 'nav.header.notification.actions.comment.mentioned',
        'profile-view': 'nav.header.notification.actions.visitor.single',
        'user-comment': 'nav.header.notification.actions.post.commented',
        'post-reaction': 'nav.header.notification.actions.post.reacted',
        'comment-reaction': 'nav.header.notification.actions.comment.reacted',
        'comment-reply': 'nav.header.notification.actions.comment.replied',
        'post-create': 'nav.header.notification.actions.post.created',
        'story-create': 'nav.header.notification.actions.story.created',
        'story-reaction': 'nav.header.notification.actions.story.reacted',
        question: 'nav.header.notification.actions.question.created',
        'category-question':
          'nav.header.notification.actions.question.category',
        'course-question': 'nav.header.notification.actions.question.course',
        answer: 'nav.header.notification.actions.answer.created',
        'teacher-answer': 'nav.header.notification.actions.answer.teacher',
        review: 'nav.header.notification.actions.review.created',
        'review-comment': 'nav.header.notification.actions.review.commented',
        'question-solved': 'nav.header.notification.actions.question.solved',
        'marked-as-best-answer': 'nav.header.notification.actions.answer.best',
        'all-questions-solved':
          'nav.header.notification.actions.question.allSolved',
        certificate: 'nav.header.notification.actions.certificate.got',
        'work-experience': 'nav.header.notification.actions.experience.work',
        'ongoing-work-experience':
          'nav.header.notification.actions.experience.ongoing.work',
        education: 'nav.header.notification.actions.experience.education',
        'ongoing-education':
          'nav.header.notification.actions.experience.ongoing.education',
        'space-member-invite':
          'nav.header.notification.actions.space.member.invited',
        'space-member-role-update':
          'nav.header.notification.actions.space.member.roleUpdate',
        'space-member-remove':
          'nav.header.notification.actions.space.member.removed',
        'space-delete': 'nav.header.notification.actions.space.deleted',
        'space-update': 'nav.header.notification.actions.space.updated',
        'member-accept-invite':
          'nav.header.notification.actions.space.member.invite.accept',
        'member-decline-invite':
          'nav.header.notification.actions.space.member.invite.decline',
        'course-generation-success':
          'nav.header.notification.actions.course.generation.success',
        'course-generation-failure':
          'nav.header.notification.actions.course.generation.failure',
        'content-remove': 'nav.header.notification.actions.content.remove',
        'become-teacher': 'nav.header.notification.actions.teacher.become',
        'user-banned': 'nav.header.notification.actions.user.banned',
        'course-member-invite':
          'nav.header.notification.actions.course.member.invited',
        'course-member-role-update':
          'nav.header.notification.actions.course.member.roleUpdate',
        'course-member-remove':
          'nav.header.notification.actions.course.member.remove',
        'course-member-accept-invite':
          'nav.header.notification.actions.course.member.invite.accept',
        'course-member-decline-invite':
          'nav.header.notification.actions.course.member.invite.decline',
        'course-published': 'nav.header.notification.actions.course.published',
        'profile-complete': 'nav.header.notification.actions.profile.complete',
        'profile-incomplete':
          'nav.header.notification.actions.profile.incomplete',
        'calendar-member-invite':
          'nav.header.notification.actions.calendar.member.invited',
        'calendar-member-decline-invite':
          'nav.header.notification.actions.calendar.member.invite.decline',
        'calendar-member-accept-invite':
          'nav.header.notification.actions.calendar.member.invite.accept',
        'event-member-invite':
          'nav.header.notification.actions.event.member.invited',
        'event-member-decline-invite':
          'nav.header.notification.actions.event.member.invite.decline',
        'event-member-accept-invite':
          'nav.header.notification.actions.event.member.invite.accept',
        'calendar-member-role-update':
          'nav.header.notification.actions.calendar.member.roleUpdate',
        'calendar-member-remove':
          'nav.header.notification.actions.calendar.member.removed',
        'calendar-delete': 'nav.header.notification.actions.calendar.deleted',
        'calendar-update': 'nav.header.notification.actions.calendar.updated',
        'streaming-limit-exceeded':
          'nav.header.notification.actions.streaming.limitExceeded',
        'token-limit-exceeded':
          'nav.header.notification.actions.token.limitExceeded',
        'storage-limit-exceeded':
          'nav.header.notification.actions.storage.limitExceeded',
        'organization-create':
          'nav.header.notification.actions.organization.create',
        'organization-onboarding-complete':
          'nav.header.notification.actions.organization.onboardingComplete',
        'organization-member-invite':
          'nav.header.notification.actions.organization.member.invited',
        'organization-member-decline-invite':
          'nav.header.notification.actions.organization.member.invite.decline',
        'organization-member-accept-invite':
          'nav.header.notification.actions.organization.member.invite.accept',
        'organization-member-role-change':
          'nav.header.notification.actions.organization.member.roleChange',
        'organization-member-remove':
          'nav.header.notification.actions.organization.member.removed',
        'organization-delete':
          'nav.header.notification.actions.organization.deleted',
        'branch-invite':
          'nav.header.notification.actions.organization.branch.invited',
        'branch-member-decline-invite':
          'nav.header.notification.actions.organization.branch.invite.decline',
        'branch-member-accept-invite':
          'nav.header.notification.actions.organization.branch.invite.accept',
      };
      const typeKey = types[this.item.type];

      if (!typeKey) {
        console.error('Invalid type:', this.item.type);
        return '';
      }
      if (this.item.type === 'content-remove') {
        return this.$t(typeKey, {
          entityType: this.item.placeholders.entityType,
        });
      }
      return this.$t(typeKey);
    },
    isDeclined() {
      return (
        this.item.placeholders.invitationStatus &&
        this.item.placeholders.invitationStatus === 'declined'
      );
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.item
        .querySelectorAll('.notification-second-name')
        .forEach((el) => {
          el.addEventListener('click', this.visitSecondUser);
        });
    });
  },
  methods: {
    visit() {
      if (this.isDeclined) {
        return;
      }
      this.profileStore.gotoProfilePage({
        id: this.lastSender.id,
        entityType: this.lastSender.type,
      });
    },
    visitSecondUser(e) {
      e.stopPropagation();
      this.profileStore.gotoProfilePage({
        id: this.firstSender.id,
        entityType: this.firstSender.type,
      });
    },
    onOpen() {
      if (this.deleteLoading) {
        return;
      }
      if (this.item.type === 'profile-view' && this.item.senderCount > 0) {
        this.notificationStore.show = false;
        this.notificationStore.showVisitors = true;
        return;
      }
      const path = this.removeDomain(this.item.url);
      if (path) {
        this.$router.push(path);
      }
      this.showActions = false;
      if (this.item.isRead) {
        return;
      }
      this.onRead();
    },
    async onRead() {
      if (this.deleteLoading || this.readLoading) {
        return;
      }
      this.readLoading = true;
      await this.notificationStore.read(this.item.id);
      this.readLoading = false;
    },
    async onDelete() {
      if (this.deleteLoading) {
        return;
      }
      this.deleteLoading = true;
      await this.notificationStore.delete(this.item.id, this.item.isRead);
      this.deleteLoading = false;
      this.showActions = false;
    },
    removeDomain(url) {
      if (!url) {
        return '';
      }
      const domainPattern = /https?:\/\/[^\\/]+/;
      return url.replace(domainPattern, '');
    },
    stripHtmlTags(html) {
      if (!html) {
        return '';
      }
      return html.replace(/<[^>]*>/g, '');
    },
    async onFollow() {
      if (this.followLoading) {
        return;
      }
      this.followLoading = true;
      const { followed } = await this.profileStore.follow({
        ...this.lastSender,
        entityType: this.lastSender.type,
      });
      if (followed) {
        this.lastSender.isFollowing = true;
        this.notificationStore.list = this.notificationStore.list.map((n) => {
          if (n.senders[n.senders.length - 1].id === this.lastSender.id) {
            n.senders[n.senders.length - 1].isFollowing = true;
          }
          return n;
        });
      }
      this.followLoading = false;
    },
    async onInvite(type) {
      if (this.inviteLoading) {
        return;
      }
      this.inviteType = type;
      this.inviteLoading = true;
      const {
        entityIds,
        placeholders: { token },
      } = this.item;
      const entityId = entityIds[0];
      try {
        const params = {
          token,
          type,
        };
        switch (this.item.type) {
          case 'space-member-invite':
            params.spaceId = entityId;
            break;
          case 'course-member-invite':
            params.courseId = entityId;
            break;
          case 'calendar-member-invite':
            params.calendarId = entityId;
            break;
          case 'organization-member-invite':
            params.organizationId = entityId;
            break;
          case 'event-member-invite':
            params.calendarId = entityIds[entityIds.length - 1];
            params.eventId = entityId;
            break;
          case 'branch-invite':
            params.branchId = entityId;
            break;
        }
        await this.notificationStore.handleInvite(params);
        this.item.placeholders.invitationStatus =
          type === true ? 'accepted' : 'declined';
        this.notificationStore.list = this.notificationStore.list.map((n) => {
          if (n.type === this.item.type && n.entityIds[0] === entityId) {
            n.placeholders.invitationStatus =
              type === true ? 'accepted' : 'declined';
          }
          return n;
        });
        if (type && this.item.type === 'organization-member-invite') {
          await this.profileStore.getMyOrganizations();
        }
        this.inviteLoading = false;
      } catch (e) {
        console.log('invite error:', e);
        this.inviteLoading = false;
      }
    },
  },
};
</script>
