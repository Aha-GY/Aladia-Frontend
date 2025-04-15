<template>
  <div
    class="flex items-center border-b border-[#565656] border-b-white/10 py-2 last-of-type:border-none"
  >
    <i
      class="mr-2 p-2 text-2xl"
      :class="renderCardTypeIcon(paymentMethodItem.cardType).iconClass"
    />
    <div class="flex-grow">
      <div class="flex items-center justify-between">
        <div class="text-base text-[#F1F1F1]">
          {{
            `${profileStore.myProfileDetail.fullName} ${renderCardTypeIcon(paymentMethodItem.cardType).name}`
          }}
        </div>
        <img
          v-if="paymentMethodItem.isDefault"
          class="mr-2 h-2 w-[2.8125rem]"
          src="~/assets/payment/default.svg"
        />
      </div>
      <div class="flex items-center justify-between">
        <span class="text-sm">
          {{
            $t('personal.profile.expire.end', {
              date: paymentMethodItem.lastFour,
            })
          }}
        </span>
        <span class="text-xs">
          {{
            $t('personal.profile.expire.content', {
              month: paymentMethodItem.expMonth,
              year: paymentMethodItem.expYear,
            })
          }}
        </span>
      </div>
    </div>
    <div>
      <div
        ref="popupButtonRef"
        class="h-6 w-6 cursor-pointer text-center hover:bg-white hover:bg-opacity-5"
        data-cy="2ecadcb48f2aabf0"
        @click="popupShow = true"
      >
        <i class="fa-solid fa-ellipsis text-xs text-[#707070]" />
      </div>
      <BasePopup
        :open="popupShow"
        :button-ref="popupButtonRef"
        placement="bottom-end"
        :width="130"
        :popper-style="{ 'min-width': '130px' }"
        class="p-1.5"
      >
        <div ref="popupRef">
          <div
            class="flex items-center rounded-md py-1 text-xs text-[#E5E5E5] hover:bg-white hover:bg-opacity-5"
            :class="
              paymentMethodItem.isDefault
                ? 'cursor-not-allowed opacity-70'
                : 'cursor-pointer'
            "
            data-cy="bb5471ad35c823af"
            @click="handleClickSetDefault"
          >
            <div class="flex w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="setLoading ? 'fa-spinner animate-spin' : 'fa-star'"
              />
            </div>
            <span class="ml-1">
              {{ $t('personal.profile.default') }}
            </span>
          </div>
          <div
            class="flex items-center rounded-md py-1 text-xs text-[#AE2B26] hover:bg-white hover:bg-opacity-5"
            :class="
              paymentMethodItem.isDefault
                ? 'cursor-not-allowed opacity-90'
                : 'cursor-pointer'
            "
            data-cy="60ff64abed96be49"
            @click="handleClickDelete"
          >
            <div class="flex w-5 items-center justify-center">
              <i
                class="fa-solid"
                :class="delLoading ? 'fa-spinner animate-spin' : 'fa-trash'"
              />
            </div>
            <span class="ml-1">
              {{ $t('base.editor.delete') }}
            </span>
          </div>
        </div>
      </BasePopup>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { STRIPE_CARD_TYPES } from '~/constant/payment';

const props = defineProps({
  paymentMethodItem: {
    type: Object,
    required: true,
  },
});

const profileStore = useProfileStore();

const $toast = useToast();
const { t } = useI18n();
const paymentStore = usePaymentStore();
const setLoading = ref(false);
const delLoading = ref(false);
const popupButtonRef = ref(null);
const popupRef = ref(null);
const popupShow = ref(false);

onClickOutside(popupRef, () => {
  popupShow.value = false;
});

function renderCardTypeIcon(cardType) {
  if (STRIPE_CARD_TYPES[cardType]) {
    return STRIPE_CARD_TYPES[cardType];
  }
  if (!cardType) {
    return {
      name: STRIPE_CARD_TYPES.default.name,
      iconClass: STRIPE_CARD_TYPES.default.iconClass,
    };
  }
  return {
    name: `${cardType.charAt(0).toUpperCase()}${cardType.slice(1)}`,
    iconClass: STRIPE_CARD_TYPES.default.iconClass,
  };
}

async function handleClickSetDefault() {
  if (props.paymentMethodItem.isDefault) {
    return;
  }
  setLoading.value = true;
  await paymentStore.setDefaultPaymentMethod({
    paymentMethodId: props.paymentMethodItem.stripeId,
  });
  $toast.success(t('payment.method.default.set.success'));
  setLoading.value = false;
}

async function handleClickDelete() {
  if (props.paymentMethodItem.isDefault) {
    return;
  }
  delLoading.value = true;
  await paymentStore.deleteStripePaymentMethodById(
    props.paymentMethodItem.stripeId,
  );
  $toast.success(t('payment.method.default.delete.success'));
  delLoading.value = false;
}
</script>
