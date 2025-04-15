<template>
  <client-only>
    <el-dialog
      v-model="paymentStore.successDialog"
      :show-close="false"
      :align-center="true"
      append-to-body
      width="24rem"
      destroy-on-close
      @close="onClose"
    >
      <div class="flex flex-col items-center p-6">
        <div
          class="mb-4 flex size-16 items-center justify-center rounded-full bg-[#3b693b]"
        >
          <i class="fa-sharp fa-solid fa-check scale-125 text-3xl text-white" />
        </div>
        <div class="mb-4 text-xl font-bold">
          {{ $t('payment.successful.label') }}
        </div>
        <div class="mb-4 text-center text-13 font-light text-white/70">
          <div>
            {{ $t('payment.successful.message') }}
          </div>
          <div>
            {{ $t('payment.successful.message2') }}
          </div>
        </div>

        <template
          v-if="
            paymentStore.checkoutFrom !==
            CHECKOUT_FROM_FLAGS.IAM_MANAGE_LICENSES_UPDATE_COURSE
          "
        >
          <div v-if="isOrg" class="flex w-full justify-around">
            <BaseButton
              type="secondary"
              data-cy="7426f0004e854161"
              @click="onClose"
            >
              {{ $t('course.see') }}
            </BaseButton>
            <BaseButton data-cy="4e543fd3cfa0b35d" @click="onAssignLicenses">
              {{ $t('org.assign.license') }}
            </BaseButton>
          </div>
          <BaseButton
            v-else
            data-cy="view-purchased-course-button"
            @click="onClose"
          >
            {{ $t('course.see') }}
          </BaseButton>
        </template>
      </div>
    </el-dialog>
  </client-only>
</template>

<script setup>
import { CHECKOUT_FROM_FLAGS } from '~/constant/payment';

const emits = defineEmits(['assign']);

const router = useRouter();
const paymentStore = usePaymentStore();
const authStore = useAuthStore();

const isOrg = computed(() => authStore.isOrg);

function onClose() {
  paymentStore.setSuccessDialog(false);
  if (
    paymentStore.checkoutFrom !==
    CHECKOUT_FROM_FLAGS.IAM_MANAGE_LICENSES_UPDATE_COURSE
  ) {
    router.push({
      path: `/courses/${paymentStore.currentCourseObject.id}`,
    });
  }
}

function onAssignLicenses() {
  emits('assign');
  paymentStore.setSuccessDialog(false);
}
</script>
