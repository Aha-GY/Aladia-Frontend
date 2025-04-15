<template>
  <div class="flex">
    <div
      class="flex items-center gap-0.5 rounded-5 bg-black/85 p-1.5 font-semibold transition-all duration-300"
      :class="[
        renderStatus(item.status).textClassNames,
        renderStatus(item.status).bgClassName,
        lessPaddingY ? 'py-0.5' : 'py-1',
      ]"
    >
      <i
        class="w-4 text-center text-xs"
        :class="renderStatus(item.status).iconClassNames"
      />
      <span class="text-xs first-letter:uppercase">
        {{ $t(renderStatus(item.status).title) }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { PAYMENT_STATUS } from '~/constant/payment';

defineProps({
  item: Object,
  lessPaddingY: {
    type: Boolean,
    default: false,
  },
});

function renderStatus(status) {
  switch (status) {
    case PAYMENT_STATUS.SUCCESS.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.SUCCESS.iconClass} ${PAYMENT_STATUS.SUCCESS.colorClass}`,
        textClassNames: PAYMENT_STATUS.SUCCESS.colorClass,
        bgClassName: PAYMENT_STATUS.SUCCESS.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.SUCCESS.title,
      };
    case PAYMENT_STATUS.PAID.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.SUCCESS.iconClass} ${PAYMENT_STATUS.SUCCESS.colorClass}`,
        textClassNames: PAYMENT_STATUS.SUCCESS.colorClass,
        bgClassName: PAYMENT_STATUS.SUCCESS.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.PAID.title,
      };
    case PAYMENT_STATUS.REFUNDED.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.REFUNDED.iconClass} ${PAYMENT_STATUS.REFUNDED.colorClass}`,
        textClassNames: PAYMENT_STATUS.REFUNDED.colorClass,
        bgClassName: PAYMENT_STATUS.REFUNDED.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.REFUNDED.title,
      };
    case PAYMENT_STATUS.ACTIVE.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.ACTIVE.iconClass} ${PAYMENT_STATUS.ACTIVE.colorClass}`,
        textClassNames: PAYMENT_STATUS.ACTIVE.colorClass,
        bgClassName: PAYMENT_STATUS.ACTIVE.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.ACTIVE.title,
      };
    case PAYMENT_STATUS.PENDING.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.PENDING.iconClass} ${PAYMENT_STATUS.PENDING.colorClass}`,
        textClassNames: PAYMENT_STATUS.PENDING.colorClass,
        bgClassName: PAYMENT_STATUS.PENDING.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.PENDING.title,
      };
    case PAYMENT_STATUS.RETRY.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.RETRY.iconClass} ${PAYMENT_STATUS.RETRY.colorClass}`,
        textClassNames: PAYMENT_STATUS.RETRY.colorClass,
        bgClassName: PAYMENT_STATUS.RETRY.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.RETRY.title,
      };
    case PAYMENT_STATUS.CANCELED.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.CANCELED.iconClass} ${PAYMENT_STATUS.CANCELED.colorClass}`,
        textClassNames: PAYMENT_STATUS.CANCELED.colorClass,
        bgClassName: PAYMENT_STATUS.CANCELED.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.CANCELED.title,
      };
    case PAYMENT_STATUS.COMPLETED.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.COMPLETED.iconClass} ${PAYMENT_STATUS.COMPLETED.colorClass}`,
        textClassNames: PAYMENT_STATUS.COMPLETED.colorClass,
        bgClassName: PAYMENT_STATUS.COMPLETED.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.COMPLETED.title,
      };
    case PAYMENT_STATUS.PAST_DUE.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.PAST_DUE.iconClass} ${PAYMENT_STATUS.PAST_DUE.colorClass}`,
        textClassNames: PAYMENT_STATUS.PAST_DUE.colorClass,
        bgClassName: PAYMENT_STATUS.PAST_DUE.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.PAST_DUE.title,
      };
    case PAYMENT_STATUS.FAILED.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.FAILED.iconClass} ${PAYMENT_STATUS.FAILED.colorClass}`,
        textClassNames: PAYMENT_STATUS.FAILED.colorClass,
        bgClassName: PAYMENT_STATUS.FAILED.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.FAILED.title,
      };
    case PAYMENT_STATUS.UNPAID.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.UNPAID.iconClass} ${PAYMENT_STATUS.UNPAID.colorClass}`,
        textClassNames: PAYMENT_STATUS.UNPAID.colorClass,
        bgClassName: PAYMENT_STATUS.UNPAID.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.UNPAID.title,
      };
    case PAYMENT_STATUS.IN_TRANSIT.text:
      return {
        iconClassNames: `${PAYMENT_STATUS.IN_TRANSIT.iconClass} ${PAYMENT_STATUS.IN_TRANSIT.colorClass}`,
        textClassNames: PAYMENT_STATUS.IN_TRANSIT.colorClass,
        bgClassName: PAYMENT_STATUS.IN_TRANSIT.bgColorClass,
        text: status,
        title: PAYMENT_STATUS.IN_TRANSIT.title,
      };
    default:
      return {
        iconClassNames: `${PAYMENT_STATUS.FAILED.iconClass} ${PAYMENT_STATUS.FAILED.colorClass}`,
        textClassNames: PAYMENT_STATUS.FAILED.colorClass,
        bgClassName: PAYMENT_STATUS.FAILED.bgColorClass,
        text: status || 'unhandled status',
        title: 'filter.status.unhandled',
      };
  }
}
</script>
<style lang="scss">
/* fix tailwind can't pre-render color constants */
.payment-status-success {
  color: #6eea84;
}

.payment-status-success-bg {
  &:hover {
    background: rgba(106, 168, 79, 0.15);
  }
}

.payment-status-active {
  color: #6aa84f;
}

.payment-status-active-bg {
  &:hover {
    background: rgba(67, 163, 85, 0.15);
  }
}

.payment-status-pending {
  color: #e0b92c;
}

.payment-status-pending-bg {
  &:hover {
    background: rgba(224, 185, 44, 0.1);
  }
}

.payment-status-failed {
  color: #ef4444;
}

.payment-status-failed-bg {
  &:hover {
    background: rgba(239, 68, 68, 0.15);
  }
}

.payment-status-canceled {
  color: #989898;
}

.payment-status-canceled-bg {
  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.payment-status-unpaid {
  color: #a65722;
}

.payment-status-unpaid-bg {
  &:hover {
    background: rgba(166, 87, 34, 0.15);
  }
}

.payment-status-in-transit {
  color: #8f5734;
}

.payment-status-in-transit-bg {
  &:hover {
    background: rgba(143, 87, 52, 0.15);
  }
}
.payment-status-refunded {
  color: #b0bec5;
}
.payment-status-refunded-bg {
  &:hover {
    background: rgba(255, 120, 0, 0.1);
  }
}
</style>
