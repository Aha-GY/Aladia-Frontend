<template>
  <div class="inline-block max-w-full truncate">
    <div class="ml-1 flex w-auto items-center rounded-full bg-white/5">
      <client-only>
        <el-popover
          v-if="!!userInfo"
          v-model:visible="open"
          trigger="hover"
          popper-class="table-popover"
          :width="270"
          :offset="5"
          :disabled="!showPopup"
          placement="bottom-start"
        >
          <div class="p-2 text-[#FAFAFA]">
            <!-- chat and follow -->
            <div
              v-if="currentUserId !== userInfo?.id"
              class="flex items-center justify-end text-xs"
            >
              <i
                class="fa-sharp fa-solid fa-comments mr-2 cursor-pointer text-[#707070] transition-all hover:text-white"
                data-cy="05d5cbb342286f4a"
                @click="handleClickToChat"
              />
              <i
                class="fa-solid flex-shirk-0 w-3 text-[#707070] transition-all hover:text-white"
                :class="[
                  followLoading
                    ? 'fa-spinner fa-spin cursor-not-allowed'
                    : userInfo?.isFollowing
                      ? 'fa-user-minus cursor-pointer'
                      : 'fa-user-plus cursor-pointer',
                  ,
                ]"
                data-cy="d3608068c276f0bd"
                @click="handleClickToFollow"
              />
            </div>
            <!-- userInfo -->
            <div class="mt-1 flex">
              <BaseAvatarNext
                :picture="userAvatar"
                :story="userInfo.story"
                :user-id="userInfo.id"
                :online="userInfo.online"
                source="transaction"
                size="md"
              />
              <div class="ml-4 flex flex-col justify-center overflow-hidden">
                <div class="text-xs text-[#707070]">
                  {{
                    userSignupYear !== ''
                      ? $t(userSignupYear, {
                          year: formatDate(userInfo.value?.createdAt, 'YYYY'),
                        })
                      : userSignupYear
                  }}
                </div>
                <div
                  class="truncate text-base font-semibold transition-all"
                  :class="{ 'cursor-pointer hover:underline': userNameLink }"
                  @click="handleUserNameLink"
                >
                  {{ userName }}
                </div>
              </div>
            </div>
            <!-- follow and follower -->
            <div class="mt-4 flex justify-around text-sm">
              <div class="flex">
                <div class="mr-1 font-bold">{{ totalFollowings }}</div>
                <div class="text-[#707070]">
                  {{ $t('base.member.following') }}
                </div>
              </div>
              <div class="flex">
                <div class="mr-1 font-bold">{{ userFollowers }}</div>
                <div class="text-[#707070]">
                  {{ $t('base.member.followers') }}
                </div>
              </div>
            </div>
          </div>

          <template #reference>
            <div class="flex cursor-pointer items-center">
              <BaseAvatarNext
                :picture="userAvatar"
                :story="userInfo.story"
                :user-id="userInfo.id"
                :online="userInfo.online"
                source="transaction"
                size="sm"
              />
            </div>
          </template>
        </el-popover>
      </client-only>
      <div
        class="mx-1.5 truncate text-sm text-[#d4d4d4] transition-all"
        :class="{ 'cursor-pointer hover:underline': userNameLink }"
        @click="handleUserNameLink"
      >
        {{ userName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { DIALOG_TITLE_TYPES } from '~/constant/payment';

const props = defineProps({
  userItem: {
    // 某些transaction的recipient返null
    type: [Object, null],
    required: true,
  },
  showPopup: {
    type: Boolean,
    default: true,
  },
  userNameLink: {
    type: String, // profile || customer
  },
});

const $toast = useToast();
const { t } = useI18n();
const authStore = useAuthStore();
const router = useRouter();
const profileStore = useProfileStore();
const hubPaymentStore = useHubPaymentStore();

const open = ref(false);
const followLoading = ref(false);
const userInfo = computed(() => {
  // api返回的数据又包了一层 - -!
  if (props.userItem) {
    return {
      ...props.userItem.owner,
      isFollowing: !!props.userItem.isFollowing,
      ownerType: props.userItem.ownerType,
    };
  }
  return null;
});
const userName = computed(
  () => userInfo.value?.fullName || userInfo.value?.name || '--',
);
const userAvatar = computed(() => userInfo.value?.picture);
const userSignupYear = computed(() =>
  userInfo.value?.createdAt ? 'auth.signup.year' : '',
);
const totalFollowings = computed(() => userInfo.value?.followings || 0);
const userFollowers = computed(() => userInfo.value?.followers || 0);
const currentUserId = computed(() => authStore.context);

function handleClickToChat() {
  if (userInfo.value?.id) {
    router.push(
      `${authStore.hub}/chat?${userInfo.value?.ownerType === 'organization' ? 'orgId' : 'userId'}=${userInfo.value?.id}`,
    );
  }
}

// when it's customer, we need to navigate to customer popup up
async function handleUserNameLink() {
  try {
    if (hubPaymentStore.dialogLoading) {
      return;
    }
    if (props.userNameLink === 'customer') {
      hubPaymentStore.dialogLoading = true;
      const customerDetail = await hubPaymentStore.getPaymentCustomerDetail(
        userInfo.value.id,
      );
      console.log('customerDetail', customerDetail);
      hubPaymentStore.addDialogNavHistory({
        dataType: DIALOG_TITLE_TYPES.CUSTOMER,
        cacheData: customerDetail,
      });
    }
  } catch (err) {
    console.error('err', err);
  } finally {
    hubPaymentStore.dialogLoading = false;
  }
}

async function handleClickToFollow() {
  if (followLoading.value) {
    return;
  }
  if (!userInfo.value?.id) {
    return;
  }
  followLoading.value = true;
  const followRes = await profileStore.follow({
    id: userInfo.value.id,
    entityType: userInfo.value.ownerType,
  });
  followLoading.value = false;
  if (followRes.followed) {
    $toast.success(t('base.member.followed'));
    hubPaymentStore.updateFollower({
      [userInfo.value.id]: {
        type: 'followers',
        operation: 'add',
      },
      [currentUserId.value]: {
        type: 'followings',
        operation: 'add',
      },
    });
  } else {
    $toast.success(t('base.member.unFollowed'));
    hubPaymentStore.updateFollower({
      [userInfo.value.id]: {
        type: 'followers',
        operation: 'minues',
      },
      [currentUserId.value]: {
        type: 'followings',
        operation: 'minues',
      },
    });
  }
}
</script>
