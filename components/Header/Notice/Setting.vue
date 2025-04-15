<template>
  <Transition name="setting">
    <div
      v-if="isShow"
      class="flex h-full w-full flex-col bg-[#090909] text-base text-white/80"
      :class="!hideHeader ? 'absolute left-0 top-0' : ''"
    >
      <div
        v-if="!hideHeader"
        class="flex w-full items-center justify-between bg-[#131313] p-4"
      >
        <div class="flex items-center gap-2">
          <div class="flex w-11 items-center justify-center">
            <div
              class="flex w-8 cursor-pointer items-center justify-center rounded-5 px-2 py-1 text-[1.25rem] transition-all hover:bg-white/15 hover:text-white/80"
              data-cy="57ed450cb32d2c2f"
              @click="$emit('hide')"
            >
              <i class="fa-solid fa-arrow-left" />
            </div>
          </div>
          <div class="flex-1 truncate">
            {{ $t('nav.header.notification.settings') }}
          </div>
        </div>
      </div>
      <div
        class="hide-scrollbar flex flex-col overflow-y-auto overscroll-contain py-4 md:px-2 md:py-4"
      >
        <div class="mb-4 flex flex-col gap-2 rounded-5 bg-[#131313] p-2">
          <div
            class="flex cursor-pointer items-center justify-between rounded-5 py-2 pr-2 hover:bg-white/5"
            data-cy="86da5cf433dac90b"
            @click="toggle('reset')"
          >
            <div class="flex items-center">
              <div class="flex w-8 justify-center">
                <i class="fa-regular fa-wrench" />
              </div>
              <div>{{ $t('nav.header.notification.reset.title') }}</div>
            </div>
            <i
              class="fa-light fa-chevron-up transition-all"
              :class="notificationExpand['reset'] ? '' : 'rotate-180 transform'"
            />
          </div>

          <div
            class="transition-all"
            :class="notificationExpand['reset'] ? 'display' : 'hidden'"
          >
            <div class="flex gap-2 px-2 py-2 text-white/60">
              <div class="size-10 text-xl text-[#F35D4E]">
                <i class="fa-regular fa-triangle-exclamation" />
              </div>
              <div class="flex flex-col items-end gap-2">
                <div class="flex flex-col gap-4">
                  <div>
                    {{ $t('nav.header.notification.reset.content') }}
                  </div>
                  <div>
                    {{ $t('nav.header.notification.reset.confirmation') }}
                  </div>
                </div>
                <div class="flex items-end">
                  <BaseButton
                    :loading="resetLoading"
                    data-cy="043afe94b212402e"
                    @click="reset"
                  >
                    {{ $t('nav.header.notification.reset.name') }}
                  </BaseButton>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-for="key in Object.keys(notification)"
          :key="key"
          class="mb-4 flex flex-col gap-4 rounded-5 bg-[#131313] p-2"
        >
          <div
            class="flex cursor-pointer items-center justify-between rounded-5 py-2 pr-2 hover:bg-white/5"
            data-cy="02b794e4f006f528"
            @click="toggle(key)"
          >
            <div class="flex items-center">
              <div class="flex w-8 justify-center">
                <i :class="notificationIcon[key]" />
              </div>
              <div>{{ $t(notificationKeys[key]) }}</div>
            </div>
            <i
              class="fa-light fa-chevron-up transition-all"
              :class="notificationExpand[key] ? '' : 'rotate-180 transform'"
            />
          </div>
          <div
            class="transition-all"
            :class="notificationExpand[key] ? 'display' : 'hidden'"
          >
            <div
              v-if="hasObjectProperty(notification[key])"
              class="flex flex-col gap-2"
            >
              <div
                v-for="itemKey in Object.keys(notification[key])"
                :key="itemKey"
                class="flex flex-col gap-4 rounded-5 border-2 border-white/5 pb-2"
              >
                <div
                  class="flex items-center justify-between bg-white/5 px-2 py-3"
                >
                  <div class="flex items-center">
                    {{ $t(notificationKeys[itemKey]) }}
                  </div>
                  <BaseSwitcher
                    :active="notification[key][itemKey]['enabled']"
                    @change="
                      change(notification[key][itemKey], 'enabled', $event)
                    "
                  />
                </div>
                <template
                  v-for="childKey in Object.keys(notification[key][itemKey])"
                  :key="childKey"
                >
                  <template v-if="childKey !== 'enabled'">
                    <div class="flex flex-col gap-2 px-2">
                      <div class="flex items-center justify-between">
                        <div class="flex items-center">
                          {{ $t(notificationKeys[childKey]) }}
                        </div>
                        <BaseSwitcher
                          :active="notification[key][itemKey][childKey]"
                          @change="
                            change(notification[key][itemKey], childKey, $event)
                          "
                        />
                      </div>
                      <div class="text-xs text-white/30">
                        {{ $t(notificationDesc[key][itemKey][childKey]) }}
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
            <div
              v-else
              class="flex flex-col gap-4 rounded-5 border-2 border-white/5 py-2"
            >
              <div
                v-for="itemKey in Object.keys(notification[key])"
                :key="itemKey"
                class="flex flex-col justify-between gap-2 px-2"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    {{ $t(notificationKeys[itemKey]) }}
                  </div>
                  <BaseSwitcher
                    :active="notification[key][itemKey]"
                    @change="change(notification[key], itemKey, $event)"
                  />
                </div>
                <div class="text-xs text-white/30">
                  {{ $t(notificationDesc[key][itemKey]) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script>
export default {
  props: {
    isShow: Boolean,
    hideHeader: Boolean,
  },
  emits: ['hide'],
  setup() {
    const notificationStore = useNotificationStore();
    return { notificationStore };
  },
  data() {
    return {
      resetLoading: false,
      notificationIcon: {
        socials: 'fa-regular fa-share-nodes',
        courses: 'fa-regular fa-person-chalkboard',
        spaces: 'fa-regular fa-box',
        reviews: 'fa-regular fa-star',
        qas: 'fa-regular fa-messages-question',
        calendars: 'fa-regular fa-calendar',
        systems: 'fa-regular fa-gears',
        payments: 'fa-regular fa-credit-card',
      },
      notificationExpand: {
        reset: false,
        socials: false,
        courses: false,
        spaces: false,
        reviews: false,
        qas: false,
        calendars: false,
        systems: false,
        payments: false,
      },
      notificationKeys: {
        calendars: 'nav.header.notificationKey.calendars.label',
        eventUpdates:
          'nav.header.notificationKey.calendars.event.updates.label',
        eventCreated:
          'nav.header.notificationKey.calendars.event.updates.created',
        eventDeleted:
          'nav.header.notificationKey.calendars.event.updates.deleted',
        eventModified:
          'nav.header.notificationKey.calendars.event.updates.modified',
        eventReminders:
          'nav.header.notificationKey.calendars.event.reminders.label',
        upcomingEvent:
          'nav.header.notificationKey.calendars.event.reminders.upcoming',
        missedEvent:
          'nav.header.notificationKey.calendars.event.reminders.missed',
        invitations:
          'nav.header.notificationKey.calendars.event.reminders.invitations',
        courses: 'nav.header.notificationKey.courses.label',
        courseUpdatesAndEnrollment:
          'nav.header.notificationKey.courses.changes.label',
        newCoursesAvailable: 'nav.header.notificationKey.courses.changes.new',
        courseUpdates: 'nav.header.notificationKey.courses.changes.updated',
        courseStartingSoon:
          'nav.header.notificationKey.courses.changes.startingSoon',
        yourCourses: 'nav.header.notificationKey.courses.yours.label',
        missedCourse: 'nav.header.notificationKey.courses.yours.missed',
        newCourseInCategory:
          'nav.header.notificationKey.courses.yours.inCategory',
        courseTagged: 'nav.header.notificationKey.courses.yours.tagged',
        courseSuspended: 'nav.header.notificationKey.courses.yours.suspended',
        payments: 'nav.header.notificationKey.payments.label',
        reports: 'nav.header.notificationKey.payments.reports.label',
        monthlyReport: 'nav.header.notificationKey.payments.reports.monthly',
        weeklyReport: 'nav.header.notificationKey.payments.reports.weekly',
        transactions: 'nav.header.notificationKey.payments.transactions.label',
        paymentReceived:
          'nav.header.notificationKey.payments.transactions.received',
        paymentSent: 'nav.header.notificationKey.payments.transactions.sent',
        paymentSuccessful:
          'nav.header.notificationKey.payments.transactions.successful',
        installmentPaid:
          'nav.header.notificationKey.payments.transactions.installment',
        coursePayments: 'nav.header.notificationKey.payments.course.payment',
        coursePurchased: 'nav.header.notificationKey.payments.course.purchased',
        subscriptionFeePaid:
          'nav.header.notificationKey.payments.subscription.feePaid',
        paymentIssuesAndUpdates:
          'nav.header.notificationKey.payments.issues.label',
        paymentFailed: 'nav.header.notificationKey.payments.issues.failed',
        refundIssued: 'nav.header.notificationKey.payments.issues.refund',
        upcomingPayment: 'nav.header.notificationKey.payments.issues.upcoming',
        subscriptionRenewal:
          'nav.header.notificationKey.payments.subscription.renewal',
        promotionsAndOffers: 'nav.header.notificationKey.payments.offers.label',
        specialOffer: 'nav.header.notificationKey.payments.offers.special',
        qas: 'nav.header.notificationKey.qas.label',
        answerAboutYourQuestion: 'nav.header.notificationKey.qas.answer.yours',
        newAnswer: 'nav.header.notificationKey.qas.answer.new',
        questionsInCoursesAndCategories:
          'nav.header.notificationKey.qas.question.label',
        newQuestionInCourse: 'nav.header.notificationKey.qas.question.course',
        newQuestionInCategory:
          'nav.header.notificationKey.qas.question.category',
        yourQuestions: 'nav.header.notificationKey.qas.answer.label',
        yourAnswerMarkedAsBest:
          'nav.header.notificationKey.qas.answer.markedAsBest',
        teacherAnsweredYourQuestion:
          'nav.header.notificationKey.qas.answer.teacher',
        allYourQuestionsAnswered: 'nav.header.notificationKey.qas.answer.all',
        generalQAndAActivity: 'nav.header.notificationKey.qas.general',
        questionMarkedAsSolved:
          'nav.header.notificationKey.qas.question.solved',
        reviews: 'nav.header.notificationKey.reviews.label',
        newReview: 'nav.header.notificationKey.reviews.new',
        reviewUpdated: 'nav.header.notificationKey.reviews.updated',
        commentOnReview: 'nav.header.notificationKey.reviews.comment',
        teacherRespondedToReview:
          'nav.header.notificationKey.reviews.teacherResponded',
        socials: 'nav.header.notificationKey.socials.label',
        connections: 'nav.header.notificationKey.socials.connections.label',
        newFollowers:
          'nav.header.notificationKey.socials.connections.followers',
        newContact: 'nav.header.notificationKey.socials.connections.contact',
        interactions: 'nav.header.notificationKey.socials.interactions.label',
        commentsAndReactions:
          'nav.header.notificationKey.socials.interactions.reactions',
        reposts: 'nav.header.notificationKey.socials.interactions.reposts',
        mentionsInPosts:
          'nav.header.notificationKey.socials.interactions.mentions',
        profile: 'nav.header.notificationKey.socials.profile.label',
        userVisitedProfile:
          'nav.header.notificationKey.socials.profile.visited',
        updatesFromPeopleYouFollow:
          'nav.header.notificationKey.socials.profile.updates',
        spaces: 'nav.header.notificationKey.spaces.label',
        invitationsAndMembership:
          'nav.header.notificationKey.spaces.invitations.label',
        invitationToSpace: 'nav.header.notificationKey.spaces.invitations.sent',
        acceptedDeclinedInvitation:
          'nav.header.notificationKey.spaces.invitations.status',
        userAddedOrInvitedToSpace:
          'nav.header.notificationKey.spaces.invitations.added',
        userRemovedFromSpace:
          'nav.header.notificationKey.spaces.invitations.removed',
        roleManagement: 'nav.header.notificationKey.spaces.roles.label',
        roleChanged: 'nav.header.notificationKey.spaces.roles.changed',
        userRoleAssignedOrChanged:
          'nav.header.notificationKey.spaces.roles.assigned',
        spaceManagement: 'nav.header.notificationKey.spaces.management.label',
        spaceDeleted: 'nav.header.notificationKey.spaces.management.deleted',
        spaceEdited: 'nav.header.notificationKey.spaces.management.edited',
        lowStorageSpace: 'nav.header.notificationKey.spaces.management.storage',
        systems: 'nav.header.notificationKey.systems.label',
        accountAndProfile: 'nav.header.notificationKey.systems.account.label',
        ban: 'nav.header.notificationKey.systems.account.ban',
        becomeTeacher:
          'nav.header.notificationKey.systems.account.becomeTeacher',
        completedProfile:
          'nav.header.notificationKey.systems.account.completed',
        inCompleteProfile:
          'nav.header.notificationKey.systems.account.incomplete',
        accountSuspendedDueToPaymentIssue:
          'nav.header.notificationKey.systems.account.suspend.payment',
        accountSuspendedDueToInappropriateContent:
          'nav.header.notificationKey.systems.account.suspend.content',
        accountSuspendedDueToMassiveReports:
          'nav.header.notificationKey.systems.account.suspend.report',
        platformUpdatesAndStatus:
          'nav.header.notificationKey.systems.platform.label',
        systemUpdates: 'nav.header.notificationKey.systems.platform.updates',
        storageStatus: 'nav.header.notificationKey.systems.platform.storage',
        streamingStatus:
          'nav.header.notificationKey.systems.platform.streaming',
        access: 'nav.header.notificationKey.systems.platform.access',
      },
      notificationDesc: {
        calendars: {
          eventUpdates: {
            enabled: true,
            eventCreated: 'nav.header.notificationDesc.calendar.event.created',
            eventDeleted: 'nav.header.notificationDesc.calendar.event.deleted',
            eventModified:
              'nav.header.notificationDesc.calendar.event.modified',
          },
          eventReminders: {
            enabled: true,
            upcomingEvent:
              'nav.header.notificationDesc.calendar.event.reminder.upcoming',
            missedEvent:
              'nav.header.notificationDesc.calendar.event.reminder.missed',
            invitations:
              'nav.header.notificationDesc.calendar.event.reminder.invitations',
          },
        },
        courses: {
          courseUpdatesAndEnrollment: {
            enabled: true,
            newCoursesAvailable:
              'nav.header.notificationDesc.course.enrollment.new',
            courseUpdates:
              'nav.header.notificationDesc.course.enrollment.updated',
            courseStartingSoon:
              'nav.header.notificationDesc.course.enrollment.startingSoon',
          },
          yourCourses: {
            enabled: true,
            missedCourse: 'nav.header.notificationDesc.course.yours.missed',
            newCourseInCategory: 'nav.header.notificationDesc.course.yours.new',
            courseTagged: 'nav.header.notificationDesc.course.yours.tagged',
            courseSuspended:
              'nav.header.notificationDesc.course.yours.suspended',
          },
        },
        payments: {
          reports: {
            enabled: true,
            monthlyReport: 'nav.header.notificationDesc.payment.report.monthly',
            weeklyReport: 'nav.header.notificationDesc.payment.report.weekly',
          },
          transactions: {
            enabled: true,
            paymentReceived:
              'nav.header.notificationDesc.payment.transaction.received',
            paymentSent: 'nav.header.notificationDesc.payment.transaction.sent',
            paymentSuccessful:
              'nav.header.notificationDesc.payment.transaction.successful',
            installmentPaid: 'nav.header.notificationDesc.payment.installment',
          },
          coursePayments: {
            enabled: true,
            coursePurchased: 'nav.header.notificationDesc.course.purchased',
            subscriptionFeePaid:
              'nav.header.notificationDesc.payment.subscriptionFee',
          },
          paymentIssuesAndUpdates: {
            enabled: true,
            paymentFailed: 'nav.header.notificationDesc.payment.issue.failed',
            refundIssued: 'nav.header.notificationDesc.payment.issue.refund',
            upcomingPayment: 'nav.header.notificationDesc.payment.upcoming',
            subscriptionRenewal:
              'nav.header.notificationDesc.payment.issue.subscriptionRenewal',
          },
          promotionsAndOffers: {
            enabled: true,
            specialOffer: 'nav.header.notificationDesc.payment.offer.special',
          },
        },
        qas: {
          answerAboutYourQuestion: {
            enabled: true,
            newAnswer: 'nav.header.notificationDesc.question.answer.new',
          },
          questionsInCoursesAndCategories: {
            enabled: true,
            newQuestionInCourse:
              'nav.header.notificationDesc.question.inCourse',
            newQuestionInCategory:
              'nav.header.notificationDesc.question.inCategory',
          },
          yourQuestions: {
            enabled: true,
            yourAnswerMarkedAsBest:
              'nav.header.notificationDesc.question.answer.markedAsBest',
            teacherAnsweredYourQuestion:
              'nav.header.notificationDesc.question.answer.teacher',
            allYourQuestionsAnswered:
              'nav.header.notificationDesc.question.answer.all',
          },
          generalQAndAActivity: {
            enabled: true,
            questionMarkedAsSolved:
              'nav.header.notificationDesc.question.solved',
          },
        },
        // qas: {
        //   questionsAboutYourCourses: {
        //     enabled: true,
        //     newQuestionAboutYourCourse: 'Question about one of your courses',
        //   },
        //   questionsInCategories: {
        //     enabled: true,
        //     newQuestionInCategory:
        //       'Get notified when a new question is asked in a category you follow',
        //   },
        //   yourQuestions: {
        //     enabled: true,
        //     newAnswerToYourQuestion:
        //       'Get notified when someone answers one of your questions',
        //     yourAnswerMarkedAsBest:
        //       'Get notified when one of your answers is selected as the best',
        //     teacherAnsweredYourQuestion:
        //       'Get notified when a teacher answers one of your questions',
        //     allYourQuestionsAnswered:
        //       'Get notified when all of your pending questions have been answered',
        //   },
        //   generalQAndAActivity: {
        //     enabled: true,
        //     questionMarkedAsSolved:
        //       'Get notified when a question you participated in (with a question or an answer) is marked as solved by the original author',
        //   },
        // },
        reviews: {
          newReview: 'nav.header.notificationDesc.review.new',
          reviewUpdated: 'nav.header.notificationDesc.review.updated',
          commentOnReview: 'nav.header.notificationDesc.review.comment',
          teacherRespondedToReview:
            'nav.header.notificationDesc.review.teacher.responded',
        },
        socials: {
          connections: {
            enabled: true,
            newFollowers:
              'nav.header.notificationDesc.social.connection.follow',
            newContact: 'nav.header.notificationDesc.social.connection.contact',
          },
          interactions: {
            enabled: true,
            commentsAndReactions:
              'nav.header.notificationDesc.social.interaction.title',
            reposts: 'nav.header.notificationDesc.social.interaction.repost',
            mentionsInPosts:
              'nav.header.notificationDesc.social.interaction.mention',
          },
          profile: {
            enabled: true,
            userVisitedProfile:
              'nav.header.notificationDesc.social.profile.visited',
            updatesFromPeopleYouFollow:
              'nav.header.notificationDesc.social.profile.updated',
          },
        },
        spaces: {
          invitationsAndMembership: {
            enabled: true,
            invitationToSpace:
              'nav.header.notificationDesc.space.invitation.sent',
            acceptedDeclinedInvitation:
              'nav.header.notificationDesc.space.invitation.status',
            userAddedOrInvitedToSpace:
              'nav.header.notificationDesc.space.invitation.added',
            userRemovedFromSpace:
              'nav.header.notificationDesc.space.invitation.removed',
          },
          roleManagement: {
            enabled: true,
            roleChanged: 'nav.header.notificationDesc.space.role.changed',
            userRoleAssignedOrChanged:
              'nav.header.notificationDesc.space.role.assigned',
          },
          spaceManagement: {
            enabled: true,
            spaceDeleted: 'nav.header.notificationDesc.space.deleted',
            spaceEdited: 'nav.header.notificationDesc.space.edited',
            lowStorageSpace: 'nav.header.notificationDesc.space.storage',
          },
        },
        systems: {
          accountAndProfile: {
            enabled: true,
            ban: 'nav.header.notificationDesc.system.profile.ban',
            becomeTeacher:
              'nav.header.notificationDesc.system.profile.becomeTeacher',
            completedProfile:
              'nav.header.notificationDesc.system.profile.completed',
            inCompleteProfile:
              'nav.header.notificationDesc.system.profile.inComplete',
            accountSuspendedDueToPaymentIssue:
              'nav.header.notificationDesc.system.profile.suspend.payment',
            accountSuspendedDueToInappropriateContent:
              'nav.header.notificationDesc.system.profile.suspend.content',
            accountSuspendedDueToMassiveReports:
              'nav.header.notificationDesc.system.profile.suspend.report',
          },
          platformUpdatesAndStatus: {
            enabled: true,
            systemUpdates:
              'nav.header.notificationDesc.system.platform.status.update',
            storageStatus:
              'nav.header.notificationDesc.system.platform.status.storage',
            streamingStatus:
              'nav.header.notificationDesc.system.platform.status.streaming',
            access: 'nav.header.notificationDesc.system.platform.status.access',
          },
        },
      },
    };
  },
  computed: {
    notification() {
      return this.notificationStore.notification;
    },
  },
  methods: {
    camelCaseToTitleCase(str) {
      switch (str) {
        case 'newCourseInCategory':
          return 'nav.header.notificationDesc.label.course.inCategory';
        case 'courseTagged':
          return 'nav.header.notificationDesc.label.course.tagged';
        case 'acceptedDeclinedInvitation':
          return 'nav.header.notificationDesc.label.course.invitation.status';
        case 'userAddedOrInvitedToSpace':
          return 'nav.header.notificationDesc.label.course.invitation.toSpace';
        default: {
          const result = str.replace(/([A-Z])/g, ' $1');
          const title = result.charAt(0).toUpperCase() + result.slice(1);
          return title.replace('And', '&');
        }
      }
    },
    isAnyOn(items) {
      return Object.keys(items).some((key) => items[key] && key !== 'enabled');
    },
    changeAll(items, active) {
      Object.keys(items).forEach((key) => {
        items[key] = active;
      });
      this.updateSettings();
    },
    change(item, key, active) {
      if (key === 'enabled') {
        this.changeAll(item, active);
      } else {
        item[key] = active;
        if (Object.keys(item).some((key) => key === 'enabled')) {
          item.enabled = this.isAnyOn(item);
        }
        this.updateSettings();
      }
    },
    updateSettings() {
      this.notificationStore.updateSettings({
        ...this.notification,
      });
    },
    isObject(value) {
      return value && typeof value === 'object' && !Array.isArray(value);
    },
    hasObjectProperty(obj) {
      return Object.values(obj).some(this.isObject);
    },
    toggle(key) {
      this.notificationExpand[key] = !this.notificationExpand[key];
    },
    async reset() {
      this.resetLoading = true;
      await this.notificationStore.resetSettings();
      this.resetLoading = false;
    },
  },
};
</script>
<style scoped>
.setting-enter-active,
.setting-leave-active {
  transition: all 0.2s ease;
}
.setting-enter-from,
.setting-leave-to {
  transform: translateX(100%);
}
.setting-enter-to,
.setting-leave {
  transform: translateX(0);
}
</style>
