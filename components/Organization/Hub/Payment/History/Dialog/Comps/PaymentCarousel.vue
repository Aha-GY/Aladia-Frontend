<template>
  <div
    class="relative w-[18rem] overflow-hidden text-xs transition-all duration-500"
  >
    <div class="absolute h-full w-[17.91rem] overflow-hidden rounded-2xl">
      <div
        class="absolute -top-[14.25rem] left-4 h-[26rem] w-[30rem] skew-x-[53.9deg] overflow-hidden bg-gradient-to-tr transition-all duration-500"
        :class="bgClass"
      />
    </div>

    <el-carousel
      type="card"
      height="13.4375rem"
      class="-mx-9 !overflow-visible"
      indicator-position="none"
    >
      <el-carousel-item
        v-for="(method, index) in paymentMethods"
        :key="index"
        class="!overflow-visible"
      >
        <div class="h-full">
          <div class="relative h-full w-[18rem] transition-all duration-700">
            <div
              class="absolute h-full w-full overflow-hidden rounded-2xl border border-[#565656]/20 bg-black/20 backdrop-blur-xl"
              :data-cy="method.stripeId"
            >
              <div
                class="absolute -left-[11rem] -top-[1rem] h-[18.9rem] w-[26rem] skew-x-[56deg] bg-gradient-to-br shadow-[inset_0px_0px_5px_3px_rgba(0,0,0,0.2)] backdrop-blur-xl"
                :class="getCardClass(method.cardType)"
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
                  class="absolute left-0 top-0 h-full w-full"
                  v-html="getLogo(method.cardType)"
                />
              </div>

              <!-- card number -->
              <div class="relative z-10 px-5 pt-[5.625rem] leading-none">
                <div class="mb-9 flex">
                  <div class="-ml-2 h-6 px-2 text-base leading-none">
                    **** **** **** {{ method.lastFour }}
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
                      {{ userName }}
                    </div>
                  </div>
                  <div class="w-18 px-2">
                    <div
                      class="mb-2 text-xs leading-none tracking-widest opacity-70"
                    >
                      {{ $t('payment.card.expire') }}
                    </div>
                    <div class="truncate text-base uppercase leading-none">
                      {{ `${method.expMonth} / ${method.expYear}` }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { STRIPE_CARD_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: [Object, null],
    required: true,
  },
  showSetDefault: {
    type: Boolean,
    default: true,
  },
});
const cardClass = ref('from-[#1c2124] to-[#101315]');
const bgClass = ref('from-[#191d20] to-[#000000]');
const userName = computed(
  () => props.item.payer.owner?.fullName || props.item.payer.owner.name || '--',
);
const paymentMethods = computed(() => {
  const { paymentMethod, paymentMethods } = props.item;

  if (paymentMethod) {
    // If paymentMethod is a single object
    return [
      {
        cardType: paymentMethod.card.networks.available[0],
        lastFour: paymentMethod.card.lastFour,
        expMonth: paymentMethod.card.expMonth,
        expYear: paymentMethod.card.expYear,
      },
    ];
  }

  if (paymentMethods?.length) {
    // If paymentMethods is an array
    return paymentMethods.map((item) => ({
      cardType: item.card.networks.available[0],
      lastFour: item.card.lastFour,
      expMonth: item.card.expMonth,
      expYear: item.card.expYear,
    }));
  }

  return [];
});

const currentCardBrand = ref(null);

onMounted(() => {
  if (paymentMethods.value.length) {
    currentCardBrand.value = paymentMethods.value[0].cardType;
    getCardbgClass(currentCardBrand.value);
  }
});

watchEffect(() => {
  if (paymentMethods.value.length) {
    const targetCard = paymentMethods.value[0];
    if (targetCard) {
      currentCardBrand.value = targetCard.cardType;
      getCardbgClass(currentCardBrand.value);
    }
  }
});

function getLogo(brand) {
  if (STRIPE_CARD_TYPES[brand]) {
    return STRIPE_CARD_TYPES[brand].iconSvg;
  }
  return null;
}

function getCardClass(brand) {
  if (STRIPE_CARD_TYPES[brand]) {
    return STRIPE_CARD_TYPES[brand].cardClass;
  }
  return 'from-[#1c2124] to-[#101315]';
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
</script>

<style scoped>
:deep(.el-carousel__item) {
  cursor: default;
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
