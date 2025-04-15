<template>
  <div class="flex items-center gap-1.5 text-[#D9D9D9]">
    <!-- transaction -->
    <div v-if="paymentMethods.length === 0">---</div>

    <div v-else-if="paymentMethods.length === 1" class="flex items-center">
      <div class="h-5 w-5 justify-center rounded-sm">
        <i
          class="text-base"
          :class="renderCardTypeIcon(paymentMethods[0].cardType).iconClass"
        />
      </div>
      <div class="ml-2 flex text-xs">
        {{ `···· ${paymentMethods[0].lastFour}` }}
      </div>
    </div>

    <!-- subscription -->
    <div v-else class="w-full">
      <div v-if="!isSelect" class="flex items-center">
        <div class="flex">
          <div
            v-for="(paymentMethod, index) in paymentMethods.slice(0, 2)"
            :key="index"
          >
            <i
              class="mr-1 text-base"
              :class="renderCardTypeIcon(paymentMethod.cardType).iconClass"
            />
          </div>
        </div>
        <div class="ml-2 flex text-xs">
          {{ $t('payment.cards', { count: paymentMethods.length }) }}
        </div>
      </div>
      <el-select v-else v-model="selectModel" class="w-full">
        <template #label="{ value }">
          <div class="flex items-center">
            <i
              class="mr-1 text-base"
              :class="
                renderCardTypeIcon(paymentMethods[value].cardType).iconClass
              "
            />
            <div>
              {{ `···· ${paymentMethods[value].lastFour}` }}
            </div>
          </div>
        </template>
        <el-option
          v-for="(paymentMethod, index) in paymentMethods"
          :key="index"
          :value="index"
        >
          <div class="flex items-center">
            <i
              class="mr-1 text-base"
              :class="renderCardTypeIcon(paymentMethod.cardType).iconClass"
            />
            <div>
              {{ `···· ${paymentMethod.lastFour}` }}
            </div>
          </div>
        </el-option>
      </el-select>
    </div>
  </div>
</template>

<script setup>
import { STRIPE_CARD_TYPES } from '~/constant/payment';

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isSelect: {
    type: Boolean,
    required: false,
  },
});

const selectModel = ref(0);
const paymentMethods = computed(() => {
  const { paymentMethod, paymentMethods } = props.item;
  if (paymentMethod) {
    return [
      {
        cardType: paymentMethod.card.networks.available[0],
        lastFour: paymentMethod.card.lastFour,
      },
    ];
  }
  if (paymentMethods?.length) {
    return paymentMethods.map((item) => ({
      cardType: item.card.networks.available[0],
      lastFour: item.card.lastFour,
    }));
  }
  return [];
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
</script>
