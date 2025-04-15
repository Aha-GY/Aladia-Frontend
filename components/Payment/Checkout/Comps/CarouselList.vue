<template>
  <div
    class="relative w-[26rem] overflow-hidden px-9 text-xs transition-all duration-500"
    :style="{ opacity: animation ? 0 : 1 }"
  >
    <div class="absolute h-full w-[21.5rem] overflow-hidden rounded-2xl">
      <div
        class="absolute -top-[12.25rem] left-20 h-[24rem] w-[30rem] skew-x-[60deg] overflow-hidden bg-gradient-to-tr transition-all duration-500"
        :class="bgClass"
      />
    </div>

    <el-carousel
      v-if="paymentMethodsList.length"
      type="card"
      height="13.4375rem"
      :loop="false"
      :autoplay="false"
      :initial-index="carouselActiveIndex"
      arrow="always"
      indicator-position="none"
      class="-mx-9 !overflow-visible"
      @change="onCarouselChange"
    >
      <el-carousel-item
        v-for="(item, index) in paymentMethodsList"
        :key="item.stripeId"
        class="!overflow-visible"
        :class="prevIndex === index ? '!-translate-x-[10rem] !scale-[0.7]' : ''"
      >
        <div class="h-full" style="perspective: 1000px">
          <div
            class="relative h-full w-full transition-all duration-700"
            style="transform-style: preserve-3d"
            :style="
              flippedList.includes(item.stripeId)
                ? 'transform: rotateY(180deg)'
                : ''
            "
          >
            <div
              class="absolute h-full w-full overflow-hidden rounded-2xl border border-[#565656]/20 bg-black/20 backdrop-blur-xl"
              style="backface-visibility: hidden"
              data-cy="8936b01357f67d73"
              @click.stop="flippedList.push(item.stripeId)"
            >
              <div
                class="absolute -left-[11rem] -top-[1rem] h-[16rem] w-[26rem] skew-x-[61deg] bg-gradient-to-br shadow-[inset_0px_0px_5px_3px_rgba(0,0,0,0.2)] backdrop-blur-xl"
                :class="getCardClass(item.cardType)"
              />
              <div
                class="absolute left-5 top-4 z-10 flex h-7 w-10 items-center justify-center rounded bg-gradient-to-bl from-[#ffecc7] to-[#b69b50]"
              >
                <div class="absolute top-2 h-[1px] w-full bg-[#333]" />
                <div class="absolute top-[0.875rem] h-[1px] w-full bg-[#333]" />
                <div class="absolute top-5 h-[1px] w-full bg-[#333]" />
                <div class="absolute left-5 h-full w-[1px] bg-[#333]" />
                <div
                  class="z-10 h-5 w-4 rounded border border-[#3a3a3a] bg-gradient-to-b from-[#ffecc7] to-[#c2aa68]"
                />
                <div
                  class="absolute -right-3 top-1/2 -translate-y-1/2 translate-x-full"
                >
                  <img src="/payment/wave.svg" class="object-cover" alt="" />
                </div>
              </div>

              <!-- logo -->
              <div class="absolute right-2 top-2 z-10 h-11 w-[4.75rem]">
                <div
                  id="ccsingle"
                  ref="ccsingle"
                  class="absolute left-0 top-0 h-full w-full"
                  v-html="getLogo(item.cardType)"
                />
              </div>

              <!-- card number -->
              <div class="relative z-10 px-5 pt-[5.625rem] leading-none">
                <div class="mb-9 flex">
                  <div class="-ml-2 h-6 px-2 text-2xl leading-none">
                    **** **** **** {{ item.lastFour }}
                  </div>
                </div>
                <div class="-ml-2 flex items-center justify-between">
                  <div class="mr-3 flex-1 truncate px-2">
                    <div
                      class="mb-2 text-xs leading-none tracking-wider opacity-70"
                    >
                      {{ $t('payment.card.holder') }}
                    </div>
                    <div class="truncate text-base uppercase leading-none">
                      {{ profileStore.myProfileDetail.fullName }}
                    </div>
                  </div>
                  <div class="w-18 px-2">
                    <div
                      class="mb-2 text-xs leading-none tracking-widest opacity-70"
                    >
                      {{ $t('payment.card.expire') }}
                    </div>
                    <div class="truncate text-base uppercase leading-none">
                      {{ `${item.expMonth} / ${item.expYear}` }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="absolute h-full w-full overflow-hidden rounded-2xl bg-gradient-to-tl"
              :class="getCardClass(item.cardType)"
              style="backface-visibility: hidden; transform: rotateY(180deg)"
              data-cy="2d89f48d2095f997"
              @click.stop="
                flippedList.splice(flippedList.indexOf(item.paymentMethodId), 1)
              "
            >
              <div class="mb-3 mt-5 h-10 w-full bg-black" />
              <div class="relative ml-4 mr-5 flex h-9 rounded bg-[#2B2B2B]">
                <div
                  class="absolute left-0 top-1 h-full w-[85%] overflow-hidden truncate pl-1 text-xl capitalize"
                  style="font-family: Ettlora"
                >
                  {{ profileStore.myProfileDetail.fullName }}
                </div>
                <div class="flex flex-1 flex-col justify-around py-1">
                  <div class="h-1 w-full bg-[#1C1C1C]" />
                  <div class="h-1 w-full bg-[#1C1C1C]" />
                  <div class="h-1 w-full bg-[#1C1C1C]" />
                </div>
                <div class="flex w-10 items-center pl-2 text-sm">***</div>
              </div>
              <div class="mt-1 pr-5 text-right font-light tracking-widest">
                {{ $t('payment.card.security.code') }}
              </div>
              <div
                class="absolute bottom-9 left-4 h-2 w-28 rounded-sm bg-[#2B2B2B]"
              />
              <div
                class="absolute bottom-[1.375rem] left-4 h-2 w-36 rounded-sm bg-[#1C1C1C]"
              />
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <PaymentCheckoutCompsEmptyCard v-else />

    <div v-if="showSetDefault" class="px-9">
      <div
        class="item-center mt-3 flex justify-between"
        :class="paymentMethodsList.length ? '' : 'opacity-0'"
      >
        <div class="flex items-center text-xs">
          <i class="fa-solid fa-house mr-1" />
          {{ $t('payment.default') }}
        </div>
        <div
          class="relative h-4 w-8 cursor-pointer overflow-hidden rounded-full border transition-all duration-500"
          :class="
            isDefaultPaymentMethod
              ? 'border-[#F0CA41] bg-[#F0CA41]'
              : 'border-[#565656]/20 bg-[#0F0E0E]'
          "
          data-cy="2665e0986dd827ed"
          @click="onDefaultPaymentMethod"
        >
          <div
            class="absolute left-0 top-0 flex items-center justify-center rounded-full transition-all duration-500"
            :class="
              isDefaultPaymentMethod
                ? 'h-3 w-3 translate-x-4 translate-y-[1px] bg-[#101010]'
                : 'h-[0.875rem] w-[0.875rem] bg-white'
            "
          >
            <div
              v-if="!isDefaultPaymentMethod"
              class="h-[0.685rem] w-[0.685rem] rounded-full bg-gradient-to-b from-[#cccccc] to-[#ffffff]"
            />
          </div>
          <div
            v-if="setLoading"
            class="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/80"
          >
            <i class="fa-solid fa-spinner animate-spin text-xs" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="from-[#0c84d3] to-[#3b0e5c]" />
  <div class="from-[#001137] to-[#000b20]" />
  <div class="from-[#cf9420] to-[#c8465e]" />
  <div class="from-[#cf485e] to-[#983849]" />
  <div class="from-[#18c4c8] to-[#273b7f]" />
  <div class="from-[#1c6d88] to-[#10475a]" />
  <div class="from-[#0a2041] to-[#496b87]" />
  <div class="from-[#253f5d] to-[#162636]" />
</template>

<script setup>
import { useI18n } from 'vue-i18n';
import { useToast } from 'vue-toastification';

import { STRIPE_CARD_TYPES } from '~/constant/payment';

defineProps({
  showSetDefault: {
    type: Boolean,
    default: true,
  },
});
const emits = defineEmits(['change']);
const { t } = useI18n();
const profileStore = useProfileStore();

const $toast = useToast();
const paymentStore = usePaymentStore();

const animation = ref(false);
const setLoading = ref(false);
const cardClass = ref('from-[#1c2124] to-[#101315]');
const bgClass = ref('from-[#191d20] to-[#000000]');
const currentCardBrand = ref(null);
const flippedList = ref([]);
const isDefaultPaymentMethod = computed(() => {
  if (paymentMethodsList.value.length === 0) {
    return false;
  }
  const targetCard = paymentMethodsList.value[carouselActiveIndex.value];
  return targetCard.isDefault;
});

const carouselActiveIndex = computed(
  () => paymentStore.selectedPaymentMethodIndex,
);

const paymentMethodsList = computed(() => paymentStore.paymentMethods);
const prevIndex = computed(() => carouselActiveIndex.value - 1);

onMounted(() => {
  flipAnimation();
  getCardbgClass(currentCardBrand.value);
});

watchEffect(() => {
  if (paymentMethodsList.value.length) {
    const targetCard = paymentMethodsList.value[carouselActiveIndex.value];
    getCardbgClass(targetCard?.cardType);
  }
});

function onCarouselChange(value) {
  // flipAnimation();
  paymentStore.selectedPaymentMethodIndex = value;
  emits('change', value);
}

function flipAnimation() {
  animation.value = true;
  setTimeout(() => {
    animation.value = false;
  }, 300);
}

async function onDefaultPaymentMethod() {
  if (setLoading.value) {
    return;
  }
  if (isDefaultPaymentMethod.value) {
    $toast.info(t('payment.unDefault'));
    return;
  }

  setLoading.value = true;
  const targetCard = paymentMethodsList.value[carouselActiveIndex.value];
  if (targetCard) {
    const res = await paymentStore.setDefaultPaymentMethod({
      paymentMethodId: targetCard.stripeId,
    });
    isDefaultPaymentMethod.value = !isDefaultPaymentMethod.value;
    if (res) {
      $toast.success(t('payment.setDefault'));
    }
  }
  setLoading.value = false;
}

function getLogo(brand) {
  if (STRIPE_CARD_TYPES[brand]) {
    return STRIPE_CARD_TYPES[brand].iconSvg;
  }
  return null;
}

function getCardbgClass(brand) {
  if (STRIPE_CARD_TYPES[brand]) {
    cardClass.value = STRIPE_CARD_TYPES[brand].cardClass;
    setTimeout(() => {
      bgClass.value = STRIPE_CARD_TYPES[brand].bgClass;
    }, 300);
  } else {
    cardClass.value = 'from-[#1c2124] to-[#101315]';
    bgClass.value = 'from-[#191d20] to-[#000000]';
  }
}

function getCardClass(brand) {
  if (STRIPE_CARD_TYPES[brand]) {
    return STRIPE_CARD_TYPES[brand].cardClass;
  }
  return 'from-[#1c2124] to-[#101315]';
}
</script>

<style scoped>
.el-carousel__item--card {
  transition: all 0.4s ease-in-out;
}

.el-carousel__item--card.is-active {
  width: 21.5rem;
  transform: translateX(36px) scale(1) !important;
}

.el-carousel__item--card.is-active + .el-carousel__item--card {
  transform: translateX(370px) scale(0.7) !important;
}
:deep(.el-carousel__arrow) {
  height: 147px;
  width: 28px;
  border-radius: 0;
  font-size: 20px;
}
:deep(.el-carousel__arrow--right) {
  right: 0;
}
:deep(.el-carousel__arrow--left) {
  left: 0;
}

:deep(.el-carousel__mask) {
  border-radius: 1rem;
}
</style>
