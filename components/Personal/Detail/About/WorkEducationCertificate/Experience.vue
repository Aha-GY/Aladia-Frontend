<template>
  <client-only>
    <BaseDialog
      :model-value="props.showDialog"
      :title="titleName"
      destroy-on-close
      :is-locked-scroll="true"
      class="!w-[90%] md:!w-[28.125rem]"
      :before-close="onOPenModal"
    >
      <div
        class="-mr-4 grid max-h-[38rem] overflow-y-auto pr-4"
        :class="isView ? 'gap-4 text-white' : 'gap-2 text-[#707070]'"
      >
        <div
          v-if="['work', 'certificate'].includes(showType)"
          :class="RowClass"
        >
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{
                showType === 'work'
                  ? $t('personal.job.role')
                  : $t('personal.certificate.name')
              }}
            </div>
            <div class="flex items-center">
              <i class="fa-regular fa-briefcase text-sm" />
              <span class="truncate pl-3">{{ state.name }}</span>
            </div>
          </div>
          <template v-else>
            <i class="fa-regular fa-briefcase text-sm" />
            <template v-if="showType === 'work'">
              <el-popover
                v-model:visible="show.jobRole"
                trigger="click"
                width="85%"
                :teleported="false"
                placement="bottom-start"
                :persistent="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state.name"
                    :placeholder="$t('payment.subscribe.packages.select')"
                    :title="$t('personal.job.role')"
                    data-cy="work-job-role"
                    @focus="keyboardNavigation && (show.jobRole = true)"
                    @blur="keyboardNavigation && (show.jobRole = false)"
                  />
                </template>
                <BaseSelectSingle
                  class="w-full"
                  :name="state.name"
                  :load="searchJobRole"
                  :active="state.name"
                  @select="
                    (d) => {
                      state.name = d.name;
                      show.jobRole = false;
                    }
                  "
                />
              </el-popover>
            </template>
            <template v-if="showType === 'certificate'">
              <BaseInput
                v-model="state.name"
                :title="$t('personal.certificate.name')"
                data-cy="certificate-name"
              />
            </template>
          </template>
        </div>
        <div :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              <span v-if="showType === 'work'">
                {{ $t('personal.name.company') }}
              </span>
              <span v-if="showType === 'study'">
                {{ $t('personal.name.school') }}
              </span>
              <span v-if="showType === 'certificate'">
                {{ $t('personal.issue.organization') }}
              </span>
            </div>
            <div class="flex items-center">
              <i
                v-if="['certificate'].includes(showType)"
                class="fa-light fa-building h-4 w-4 text-sm"
              />
              <img
                v-if="state?.brand?.picture"
                :src="state?.brand?.picture"
                class="h-4 w-4 rounded-sm"
              />
              <i
                v-else-if="['work', 'study'].includes(showType)"
                class="fa-light fa-building h-4 w-4 text-sm"
              />
              <span class="pl-3">{{ state.authority }}</span>
            </div>
          </div>
          <template v-if="!isView">
            <i
              v-if="['certificate'].includes(showType)"
              class="fa-light fa-building h-4 w-4 text-sm"
            />
            <img
              v-if="state?.brand?.picture"
              :src="state?.brand?.picture"
              class="h-4 w-4 rounded-sm"
            />
            <i
              v-else-if="['work', 'study'].includes(showType)"
              class="fa-light fa-building h-4 w-4 text-sm"
            />
            <template v-if="['study', 'work'].includes(showType)">
              <el-popover
                v-model:visible="show.brands"
                trigger="click"
                width="85%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state.authority"
                    :title="
                      showType === 'work'
                        ? $t('personal.name.company')
                        : $t('personal.name.school')
                    "
                    :placeholder="$t('payment.subscribe.packages.select')"
                    :data-cy="`${showType}-authority`"
                    @focus="keyboardNavigation && (show.brands = true)"
                    @blur="keyboardNavigation && (show.brands = false)"
                  />
                </template>
                <BaseSelectBrands
                  class="w-full"
                  :name="state.authority"
                  :brand="state.brand"
                  @select="handleChangeBrands"
                  @init-brand="initBrand"
                />
              </el-popover>
            </template>
            <template v-if="showType === 'certificate'">
              <el-popover
                v-model:visible="show.organization"
                trigger="click"
                width="85%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state.authority"
                    :title="$t('personal.issue.organization')"
                    :placeholder="$t('payment.subscribe.packages.select')"
                    data-cy="certificate-authority"
                    @focus="keyboardNavigation && (show.organization = true)"
                    @blur="keyboardNavigation && (show.organization = false)"
                  />
                </template>
                <BaseSelectOrganizations
                  class="w-full"
                  :name="state.authority"
                  :active="state.authority"
                  @select="
                    (d) => {
                      state.authority = d.name;
                      show.organization = false;
                    }
                  "
                />
              </el-popover>
            </template>
          </template>
        </div>
        <div v-if="showType === 'work'" :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.domain.company') }}
            </div>
            <div class="flex items-center">
              <i
                class="fa-regular fa-arrow-up-right-from-square h-4 w-4 text-sm"
              />
              <div
                :class="{
                  '!text-[#FED54A]': state?.brand?.domain,
                  'hover:!text-[#FED54A]/70': state?.brand?.domain,
                }"
                class="cursor-pointer break-words pl-3 underline underline-offset-4 transition-colors duration-300"
                data-cy="work-domain-open-button"
                @click="openWorkExperiencesWebsite()"
              >
                {{ state?.brand?.domain || $t('personal.noWebsite') }}
              </div>
            </div>
          </div>
          <template v-if="!isView">
            <i
              class="fa-regular fa-arrow-up-right-from-square h-4 w-4 text-sm"
            />
            <BaseInput
              v-model="state.brand.domain"
              :title="$t('personal.domain.company')"
              :disabled="disabledDomain"
              data-cy="work-domain"
            />
          </template>
        </div>
        <div v-if="showType === 'work'" :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.job.type') }}
            </div>
            <div class="flex items-center">
              <i class="fa-regular fa-briefcase text-sm" />
              <span class="pl-3">
                {{ state.jobType ? $t(state.jobType.label) : '' }}
              </span>
            </div>
          </div>
          <template v-if="!isView">
            <i class="fa-regular fa-briefcase text-sm" />
            <el-popover
              v-model:visible="show.jobType"
              trigger="click"
              width="85%"
              :teleported="false"
              :trigger-keys="[]"
            >
              <template #reference>
                <BaseInput
                  v-model="state.jobType.label"
                  :title="$t('personal.job.type')"
                  readonly
                  :placeholder="$t('course.payment.select')"
                  data-cy="work-job-type"
                  @focus="keyboardNavigation && (show.jobType = true)"
                  @blur="keyboardNavigation && (show.jobType = false)"
                />
              </template>
              <BaseSelect
                :data="JobType"
                @select="
                  (d) => {
                    state.jobType = d;
                    show.jobType = false;
                  }
                "
              />
            </el-popover>
          </template>
        </div>
        <template v-if="showType === 'study'">
          <div :class="RowClass">
            <div v-if="isView" class="w-full">
              <div class="pl-6 text-[#707070]/70">
                {{ $t('personal.degree') }}
              </div>
              <div class="flex items-center">
                <i class="fa-regular fa-graduation-cap h-4 w-4 text-sm" />
                <span class="pl-3">{{ state.degree }}</span>
              </div>
            </div>
            <template v-if="!isView">
              <i class="fa-regular fa-graduation-cap h-4 w-4 text-sm" />
              <el-popover
                v-model:visible="show.degree"
                trigger="click"
                width="85%"
                :teleported="false"
                placement="bottom-start"
                :persistent="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state.degree"
                    :placeholder="$t('payment.subscribe.packages.select')"
                    :title="$t('personal.degree')"
                    data-cy="study-degree"
                    @focus="keyboardNavigation && (show.degree = true)"
                    @blur="keyboardNavigation && (show.degree = false)"
                  />
                </template>
                <BaseSelectSingle
                  class="w-full"
                  :name="state.degree"
                  :load="searchDegrees"
                  :active="state.degree"
                  @select="
                    (d) => {
                      state.degree = d.name;
                      show.degree = false;
                    }
                  "
                />
              </el-popover>
            </template>
          </div>
          <div :class="RowClass">
            <div v-if="isView" class="w-full">
              <div class="pl-6 text-[#707070]/70">
                {{ $t('personal.field') }}
              </div>
              <div class="flex items-center">
                <i class="fa-regular fa-book-open-cover h-4 w-4 text-sm" />
                <span class="pl-3">{{ state.fieldOfStudy }}</span>
              </div>
            </div>
            <template v-if="!isView">
              <i class="fa-regular fa-book-open-cover h-4 w-4 text-sm" />
              <BaseInput
                v-model="state.fieldOfStudy"
                :title="$t('personal.field')"
                data-cy="study-field"
              />
            </template>
          </div>
        </template>
        <div v-if="['work', 'study'].includes(showType)" :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.address') }}
            </div>
            <div class="flex items-center">
              <i class="fa-regular fa-location-dot text-sm" />
              <span class="truncate pl-3">{{ state.address }}</span>
            </div>
          </div>
          <template v-if="!isView">
            <i class="fa-regular fa-location-dot text-sm" />
            <el-popover
              :visible="!!show.address && !!state.address"
              trigger="click"
              width="85%"
              :teleported="false"
              :trigger-keys="[]"
            >
              <template #reference>
                <BaseInput
                  v-model="state.address"
                  :title="$t('personal.address')"
                  :data-cy="`${showType}-address`"
                  @click="show.address = true"
                  @blur="show.address = false"
                />
              </template>
              <ProfileAddress
                :address="state.address"
                @change="
                  (d) => {
                    state.address = d.formattedAddress;
                    show.address = false;
                  }
                "
              />
            </el-popover>
          </template>
        </div>
        <div v-if="showType === 'work'" :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.contract.type') }}
            </div>
            <div class="flex items-center">
              <i class="fa-light fa-file-contract text-sm" />
              <span class="pl-3">{{ state.contractType?.label }}</span>
            </div>
          </div>
          <template v-if="!isView">
            <i class="fa-light fa-file-contract text-sm" />
            <el-popover
              v-model:visible="show.contractType"
              trigger="click"
              width="85%"
              :teleported="false"
              :trigger-keys="[]"
            >
              <template #reference>
                <BaseInput
                  v-model="state.contractType.label"
                  :title="$t('personal.contract.type')"
                  readonly
                  :placeholder="$t('course.payment.select')"
                  data-cy="work-contract-type"
                  @focus="keyboardNavigation && (show.contractType = true)"
                  @blur="keyboardNavigation && (show.contractType = false)"
                />
              </template>
              <BaseSelect
                :data="ContractType"
                @select="
                  (d) => {
                    state.contractType = d;
                    show.contractType = false;
                  }
                "
              />
            </el-popover>
          </template>
        </div>
        <div v-if="showType === 'certificate'" :class="RowClass">
          <div v-if="isView" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.credential.url') }}
            </div>
            <div class="flex items-center">
              <i
                class="fa-regular fa-arrow-up-right-from-square h-4 w-4 text-sm"
              />
              <div
                v-if="state.link"
                class="cursor-pointer break-words pl-3 !text-[#FED54A] underline underline-offset-4 transition-colors duration-300 hover:!text-[#FED54A]/70"
                data-cy="certificate-link-open-button"
                @click="openUrl(state.link)"
              >
                {{ state.link }}
              </div>
            </div>
          </div>
          <template v-if="!isView">
            <i
              class="fa-regular fa-arrow-up-right-from-square h-4 w-4 text-sm"
            />
            <BaseInput
              v-model="state.link"
              :title="$t('personal.credential.url')"
              data-cy="certificate-link"
            />
          </template>
        </div>
        <div :class="RowClass">
          <div v-if="isView && state.skills?.length" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.skills') }}
            </div>
            <div class="mt-1.5 flex items-start">
              <i class="fa-regular fa-align-left h-4 w-4 text-sm" />
              <div class="flex flex-wrap gap-[0.625rem] pl-3">
                <div
                  v-for="(skill, index) in state.skills"
                  :key="skill"
                  :class="{
                    'bg-[#D8B4FE] text-[#3B0764]': index % 2 === 0,
                    'bg-[#3B0764] text-[#E9D5FF]': index % 2 === 1,
                  }"
                  class="flex items-center gap-3 rounded-[0.3125rem] px-2 py-[0.125rem] text-xs font-medium leading-5 transition-all"
                >
                  {{ skill }}
                </div>
              </div>
            </div>
          </div>
          <template v-if="!isView">
            <div class="flex w-full items-center gap-x-2">
              <i class="fa-regular fa-align-left mt-[1.2rem] h-4 w-4 text-sm" />
              <div class="-ml-1 w-full">
                <BaseSelectMultipleSkills
                  v-model="state.skills"
                  :auto-focus-search-input="true"
                  :title="$t('personal.skills')"
                  :placeholder="$t('course.payment.select')"
                />
              </div>
            </div>
          </template>
        </div>
        <div class="flex flex-col">
          <span :class="isView ? 'pl-6 text-[#707070]/70' : 'ml-5'">
            {{
              showType === 'certificate'
                ? $t('personal.certificate.date.issued')
                : $t('personal.certificate.from')
            }}
          </span>
          <div :class="RowClass">
            <i class="fa-regular fa-calendar text-sm" />
            <template v-if="isView">
              <div class="flex flex-1 gap-1">
                <span class="w-2/4">{{ state._startDate.month?.label }}</span>
                <span class="w-2/4">{{ state._startDate.year?.label }}</span>
              </div>
            </template>
            <template v-else>
              <el-popover
                v-model:visible="show.startDate.month"
                trigger="click"
                width="42%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state._startDate.month.label"
                    readonly
                    :title="$t('course.price.timeline.month')"
                    :placeholder="$t('course.payment.select')"
                    :data-cy="`${showType}-start-month`"
                    @focus="keyboardNavigation && (show.startDate.month = true)"
                    @blur="keyboardNavigation && (show.startDate.month = false)"
                  />
                </template>
                <BaseSelectDate
                  data-cy="start-month"
                  type="month"
                  @select="selectedStartMonth"
                />
              </el-popover>
              <el-popover
                v-model:visible="show.startDate.year"
                trigger="click"
                width="42%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state._startDate.year.label"
                    readonly
                    :title="$t('course.price.timeline.year')"
                    :placeholder="$t('course.payment.select')"
                    :data-cy="`${showType}-start-year`"
                    @focus="keyboardNavigation && (show.startDate.year = true)"
                    @blur="keyboardNavigation && (show.startDate.year = false)"
                  />
                </template>
                <BaseSelectDate
                  data-cy="start-year"
                  type="year"
                  @select="selectedStartYear"
                />
              </el-popover>
            </template>
          </div>
        </div>
        <div v-if="!state.isNow" class="flex flex-col">
          <span :class="isView ? 'pl-6 text-[#707070]/70' : 'ml-5'">
            {{
              showType === 'certificate'
                ? $t('personal.certificate.date.expire')
                : $t('personal.certificate.to')
            }}
          </span>
          <div :class="RowClass">
            <i class="fa-regular fa-calendar text-sm" />
            <template v-if="isView">
              <div class="flex flex-1 gap-1">
                <span class="w-2/4">{{ state._endDate.month?.label }}</span>
                <span class="w-2/4">{{ state._endDate.year?.label }}</span>
              </div>
            </template>
            <template v-else>
              <el-popover
                v-model:visible="show.endDate.month"
                trigger="click"
                width="42%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state._endDate.month.label"
                    readonly
                    :title="$t('course.price.timeline.month')"
                    :placeholder="$t('course.payment.select')"
                    :data-cy="`${showType}-end-month`"
                    @focus="keyboardNavigation && (show.endDate.month = true)"
                    @blur="keyboardNavigation && (show.endDate.month = false)"
                  />
                </template>
                <BaseSelectDate
                  type="month"
                  data-cy="end-month"
                  :disabled-month="endMonthDisabled"
                  @select="selectedEndMonth"
                />
              </el-popover>
              <el-popover
                v-model:visible="show.endDate.year"
                trigger="click"
                width="42%"
                :teleported="false"
                :trigger-keys="[]"
              >
                <template #reference>
                  <BaseInput
                    v-model="state._endDate.year.label"
                    readonly
                    :title="$t('course.price.timeline.year')"
                    :placeholder="$t('course.payment.select')"
                    :data-cy="`${showType}-end-year`"
                    @focus="keyboardNavigation && (show.endDate.year = true)"
                    @blur="keyboardNavigation && (show.endDate.year = false)"
                  />
                </template>
                <BaseSelectDate
                  type="year"
                  data-cy="end-year"
                  :end-year="endYear"
                  :start-year="state._startDate.year.label"
                  @select="selectedEndYear"
                />
              </el-popover>
            </template>
          </div>
        </div>
        <div
          v-if="!isView"
          :class="RowClass"
          class="my-2"
          data-cy="54d64c83ee9a4d4f"
          @click="state.isNow = !state.isNow"
        >
          <BaseCheckbox class="!h-3.5 !w-3.5" :active="state.isNow" />
          <span :class="isView ? 'text-[#707070]/70' : 'cursor-pointer'">
            <span v-if="showType === 'work'">
              {{ $t('personal.experience.working') }}
            </span>
            <span v-if="showType === 'study'">
              {{ $t('personal.experience.studying') }}
            </span>
            <span v-if="showType === 'certificate'">
              {{ $t('personal.noExpire') }}
            </span>
          </span>
        </div>
        <div :class="RowClass">
          <div v-if="isView && state.description" class="w-full">
            <div class="pl-6 text-[#707070]/70">
              {{ $t('personal.description.label') }}
            </div>
            <div class="mt-1.5 flex items-start">
              <i class="fa-regular fa-align-left text-sm" />
              <div class="ml-3 w-full rounded bg-white/[.03] px-3">
                <div
                  class="max-h-40 min-h-20 overflow-y-auto break-words py-2 pr-3.5"
                  :class="isViewRowClass"
                >
                  <BaseEditorRenderContent :content="state.description" />
                </div>
              </div>
            </div>
          </div>
          <template v-if="!isView">
            <i class="fa-regular fa-align-left text-sm" />
            <div class="experience-description relative flex-1">
              <LazyBaseEditor
                v-model="state.description"
                name="description-editor"
                type="textarea"
                :options="{
                  placeholder: t('personal.description.add'),
                }"
                area-height="10rem"
                limit-character
                :characters-limit="2000"
                :auto-focus="false"
                :data-cy="`${showType}-description`"
              />
            </div>
          </template>
        </div>
        <ProfileSettingDialogCompsConsole
          v-if="!isView"
          class="!px-0"
          :disabled-save="disabledSave"
          @reset="onReset"
          @save="onSave"
        />
      </div>
    </BaseDialog>

    <BaseDialog
      v-model="isOpenClearAllConfirmModal"
      :title="$t('personal.experienceCloseConfirmation.title')"
      title-class="!text-xl !text-[#EB4937]"
      class="!w-[90%] md:!w-[580px]"
      @close="onCloseModal"
    >
      <template #titleIcon>
        <i
          class="fa-solid fa-floppy-disk-circle-xmark pr-1.5 text-xl !font-normal !text-[#EB4937]"
        />
      </template>

      <div class="grid grid-cols-1 gap-4 text-sm text-[#b0b0b0]">
        {{ $t('personal.experienceCloseConfirmation.content') }}
      </div>
      <div class="mt-[1.125rem] flex justify-end">
        <BaseButton
          type="tertiary"
          label="$t:personal.profile.logged.cancel"
          @click="onCloseModal"
        />
        <BaseButton
          class="ml-3 !bg-[#EB4937]/15 !text-[#EB4937] hover:!bg-[#EB4937]/20"
          label="$t:personal.experienceCloseConfirmation.close"
          @click="onCloseAllModal"
        />
      </div>
    </BaseDialog>
  </client-only>
</template>
<script setup>
import { useI18n } from 'vue-i18n';

const props = defineProps({
  showDialog: {
    type: Boolean,
    default: false,
  },
  showType: {
    // work、education、certificate
    type: String,
    default: '',
  },
  isView: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object,
    default: () => null,
  },
});
const emits = defineEmits(['update:showDialog', 'refresh']);
const { t } = useI18n();
const endYear = computed(() =>
  props.showType === 'certificate'
    ? new Date().getFullYear() + 10
    : new Date().getFullYear(),
);

const selectedStartMonth = (d) => {
  if (show.startDate.month) {
    state.value._startDate.month = d;
    show.startDate.month = false;
    state.value._endDate.month = {
      label: '',
      key: '',
    };
  }
};
const selectedStartYear = (d) => {
  state.value._startDate.year = d;
  show.startDate.year = false;
  state.value._endDate.year = {
    label: '',
    key: '',
  };
};
const endMonthDisabled = computed(() => {
  if (state.value._endDate.year.label === state.value._startDate.year.label) {
    return Array.from(
      { length: state.value._startDate.month.key - 1 },
      (_, i) => i + 1,
    );
  }
  return [];
});
const selectedEndMonth = (d) => {
  if (show.endDate.month) {
    state.value._endDate.month = d;
    show.endDate.month = false;
  }
};

const selectedEndYear = (d) => {
  state.value._endDate.year = d;
  show.endDate.year = false;
  if (state.value._endDate.year.label === state.value._startDate.year.label) {
    state.value._endDate.month =
      state.value._endDate.month.key < state.value._startDate.month.key
        ? {
            label: '',
            key: '',
          }
        : state.value._endDate.month;
  }
};

const RowClass = computed(
  () =>
    `flex flex-row items-baseline gap-2 w-full ${props.isView ? 'overflow-hidden' : ''}`,
);

const isViewRowClass = 'break-words text-white';
const JobType = [
  { key: 'hybrid', label: t('base.courses.type.hybrid') },
  { key: 'onSite', label: t('base.courses.type.onSite') },
  { key: 'remote', label: t('base.courses.type.remote') },
];
const ContractType = [
  { key: 'fullTime', label: t('personal.contract.fullTime') },
  { key: 'partTime', label: t('personal.contract.partTime') },
  { key: 'selfEmployed', label: t('personal.contract.selfEmployed') },
  { key: 'freelance', label: t('personal.contract.freelance') },
  { key: 'internship', label: t('personal.contract.internship') },
];

const show = reactive({
  jobType: false, // work
  contractType: false, // work
  jobRole: false, // work
  degree: false, // study
  organization: false, // certificate
  address: false,
  brands: false, // work、education、certificate
  startDate: {
    month: false,
    year: false,
  },
  endDate: {
    month: false,
    year: false,
  },
});

const experiencesStore = useExperiencesStore();
const state = ref({});
const keyboardNavigation = ref(false);
const isOpenClearAllConfirmModal = ref(false);
const isChangedForm = computed(() => {
  const fields = [
    state.value.description,
    state.value._startDate?.year?.label,
    state.value._startDate?.month?.label,
    state.value._endDate?.year?.label,
    state.value._endDate?.month?.label,
    state.value.skills?.length,
    state.value.link,
    state.value.contractType?.label,
    state.value.address,
    state.value.fieldOfStudy,
    state.value.degree,
    state.value.jobType?.label,
    state.value.brand?.domain,
    state.value.authority,
    state.value.name,
    state.value.isNow,
  ];
  return fields.some((field) => field);
});
const disabledSave = computed(
  () => !experiencesStore.isRightExperience(state.value),
);
const titleName = computed(() => {
  if (props.isView) {
    return props.showType === 'study'
      ? t('personal.title.experience.education')
      : t('personal.title.experience.other', { showType: props.showType });
  }
  if (state.value.id) {
    if (props.showType === 'study') {
      return t('personal.title.edit.education');
    }
    return t('personal.title.edit.other', { showType: props.showType });
  } else {
    if (props.showType === 'study') {
      return t('personal.title.new.education');
    }
    return t('personal.title.new.other', { showType: props.showType });
  }
});

const searchJobRole = (params) =>
  global.searchJobRole(params).then((res) => res);

const global = useGlobalStore();
const searchDegrees = (params) =>
  global.searchDegrees(params).then((res) => res);

const onSave = async (callback) => {
  try {
    await experiencesStore.handleUpdateExperience({
      ...state.value,
      type: props.showType,
    });
    emits('refresh');
    emits('update:showDialog', false);
  } finally {
    callback();
  }
};
const onReset = (callback) => {
  state.value = {
    ...experiencesStore.defaultExperienceParams,
    _startDate: {
      month: {
        label: '',
        key: '',
      },
      year: {
        label: '',
        key: '',
      },
    },
    _endDate: {
      month: {
        label: '',
        key: '',
      },
      year: {
        label: '',
        key: '',
      },
    },
    skills: [],
    type: props.showType,
  };
  callback();
};

const openUrl = (url, blank = true) => {
  if (url) {
    const link = url.includes('http') ? url : `https://${url}`;
    window.open(link, blank ? '_blank' : '_self');
  }
};
const openWorkExperiencesWebsite = () => {
  const { organization, brand } = state.value;
  openUrl(brand.domain, !organization.id);
};

const disabledDomain = ref(false);
const initBrand = () => {
  disabledDomain.value = false;
  state.value.organization = { id: null };
  state.value.brand = {
    name: '',
    domain: '',
    picture: '',
  };
};
const handleChangeBrands = (item) => {
  show.brands = false;
  disabledDomain.value = true;
  state.value.authority = item.name || item.domain;
  state.value.organization = item.aladiaOrganization
    ? { id: item.id }
    : { id: null };
  state.value.brand = {
    name: item.aladiaOrganization ? '' : state.value.authority,
    domain: item.domain || '',
    picture: item.picture || '',
  };
};

watch(
  () => props.showDialog,
  () => {
    if (props.showDialog && props.detail?.id) {
      const organization = props.detail.organization;
      state.value = {
        ...props.detail,
        organization: organization?.id ? { id: organization.id } : { id: null },
        brand: organization?.id
          ? {
              name: organization.name,
              domain: organization.domain || '',
              picture: organization.picture || '',
            }
          : props.detail.brand,
      };
    } else {
      onReset(() => {});
    }
  },
  { immediate: true, deep: true },
);

// Listen for keyboard and mouse events globally
onMounted(() => {
  const handleKeydown = (event) => {
    if (event.key === 'Tab') {
      keyboardNavigation.value = true;
    }
  };
  const handleMousedown = () => {
    keyboardNavigation.value = false;
  };

  window.addEventListener('keydown', handleKeydown);
  window.addEventListener('mousedown', handleMousedown);

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeydown);
    window.removeEventListener('mousedown', handleMousedown);
  });
});

const onCloseAllModal = () => {
  emits('update:showDialog', false);
  isOpenClearAllConfirmModal.value = false;
  props.showDialog = false;
};
const onOPenModal = () => {
  if (isChangedForm.value && !props.isView) {
    emits('update:showDialog', true);
    isOpenClearAllConfirmModal.value = true;
    props.showDialog = true;
  } else {
    emits('update:showDialog', false);
  }
};
const onCloseModal = () => {
  isOpenClearAllConfirmModal.value = false;
};
</script>
<style lang="scss">
.experience-description {
  .ql-editor {
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
