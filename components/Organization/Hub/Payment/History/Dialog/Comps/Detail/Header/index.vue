<template>
  <div class="px-2 transition-all duration-500 md:px-0">
    <div
      class="relative w-full overflow-hidden rounded-md pb-[32%] md:pb-[18.75%]"
    >
      <div class="absolute left-0 top-0 h-full w-full">
        <img
          v-if="detail.owner.owner.cover"
          :src="detail.owner.owner.cover"
          class="h-full w-full object-cover"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-[#060606]"
        >
          <div class="rounded-md bg-[#1C1C1C] px-7 py-3">
            <i class="fa-solid fa-panorama text-[1.5rem] text-[#505050]" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="ml-auto mr-auto flex max-w-[75rem] flex-col items-start md:flex-row"
    >
      <div
        class="border-1 relative cursor-pointer rounded-full border-[#101010] bg-[#101010] transition-all md:-mt-8"
      >
        <BaseAvatarNext
          :picture="detail.owner.owner.picture"
          :story="detail?.owner.owner.story"
          :user-id="detail?.owner.owner.id"
          size="lg"
          :online="detail?.owner.owner.online"
        />
      </div>

      <div class="mt-1 flex-1 flex-col">
        <OrganizationHubPaymentHistoryDialogCompsDetailHeaderName
          :detail="detail"
        />
      </div>
    </div>
    <div
      class="absolute right-4 top-1 flex items-center justify-center rounded-full bg-black/20 p-0.5"
    >
      <div
        data-cy="359f5e730cb752e2"
        class="item-center col-span-3 flex gap-1 justify-self-end rounded-md border border-gray-800 bg-[#0C0C0C]"
      >
        <OrganizationHubPaymentHistoryDialogCompsTransactionID
          :id="props.detail.owner.owner.id"
        />
      </div>
    </div>
    <div
      class="mt-2 flex w-full items-center justify-between rounded-5 bg-[#fff]/5 px-3.5 py-2"
    >
      <div class="flex items-center">
        <BaseButton
          class="mr-1 text-[#FAFAFA]"
          icon="fa-sharp fa-light fa-comment"
          type="tertiary"
          label="$t:nav.header.notification.banner.chat.message"
          @click="handleChat"
        />
        <BaseButton
          class="mr-1 text-[#FAFAFA]"
          icon=" fa-solid fa-envelope"
          type="tertiary"
          label="$t:personal.email"
          @click="handleEmail"
        />
      </div>
      <div class="flex flex-col items-start pr-2">
        <div class="mb-1 text-center">
          {{ $t('category.money.spent.total') }}
        </div>
        <div class="flex items-center">
          <div>
            <OrganizationHubPaymentHistoryDialogCompsAmountTip
              :money="props.detail.totalSpent"
              :is-bold="true"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const $toast = useToast();
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const profileStore = useProfileStore();
const handleChat = () => {
  if (!props.detail.owner.owner.id) {
    return;
  }
  const url = `/${authStore.isOrg ? 'organization' : 'user'}/hub/${profileStore.myProfileDetail.id}/chat?${props.detail.value?.entityType === 'organization' ? 'orgId' : 'userId'}=${props.detail.owner.owner.id}`;
  router.push(url);
};
const handleEmail = () => {
  const email = props.detail.owner.owner.email;
  if (!email) {
    $toast.error(t('error.no_email_provided')); // Show an error toast if email is not available.
    return;
  }
  // Open user's default email client
  window.location.href = `mailto:${email}`;
};
</script>
