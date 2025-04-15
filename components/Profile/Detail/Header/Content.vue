<template>
  <div>
    <div
      v-if="detail.bio"
      class="mb-3 line-clamp-2 break-all text-xl text-white/80"
      data-cy="bio-profile-detail"
      v-html="detail.bio"
    />
    <div>
      <div
        v-if="detail.birthAddress?.country || showAddress"
        class="flex items-center text-sm text-white"
      >
        <template v-if="detail.birthAddress?.country">
          <i class="fa-solid fa-house mr-3" />
          <span class="text-[#D9D9D9]/70">
            <span class="mr-1">
              {{ $t('personal.profile.birth') }}
            </span>
            <span
              class="text-[#e2e2e2]"
              :class="hoverClass(detail.birthAddress?.country)"
              data-cy="birth-address-country-profile-detail"
              @click="handleOpenGoogleMap(detail.birthAddress?.country)"
            >
              {{ detail.birthAddress?.country || $t('personal.country') }}
            </span>
            <template
              v-if="detail.birthAddress?.city || detail.birthAddress?.state"
            >
              <span class="mx-2">|</span>
              <span
                class="mr-4 text-[#e2e2e2]"
                :class="
                  hoverClass(
                    detail.birthAddress?.city || detail.birthAddress?.state,
                  )
                "
                data-cy="birth-address-city-profile-detail"
                @click="
                  handleOpenGoogleMap(
                    detail.birthAddress?.city || detail.birthAddress?.state,
                  )
                "
              >
                {{ detail.birthAddress?.city || detail.birthAddress?.state }}
              </span>
            </template>
          </span>
        </template>
        <template v-if="showAddress && address?.country">
          <i class="fa-solid fa-location-dot mr-3" />
          <span class="text-[#D9D9D9]/70">
            <span class="mr-1">{{ $t('personal.location') }}</span>
            <span
              class="text-[#e2e2e2]"
              :class="hoverClass(address?.country)"
              data-cy="current-address-country-profile-detail"
              @click="handleOpenGoogleMap(address?.country)"
            >
              {{ address?.country }}
            </span>
            <template v-if="address?.city || address?.state">
              <span class="mx-2">|</span>
              <span
                class="text-[#e2e2e2]"
                :class="hoverClass(address?.city || address?.state)"
                data-cy="current-address-city-profile-detail"
                @click="handleOpenGoogleMap(address?.city || address?.state)"
              >
                {{ address?.city || address?.state }}
              </span>
            </template>
          </span>
        </template>
      </div>
      <div
        v-if="mainExperience"
        class="mt-2 flex items-center text-sm text-white"
      >
        <i class="fa-solid fa-briefcase mr-3 text-white" />
        <span class="flex items-center text-[#D9D9D9]/70">
          <span class="mr-1">
            {{ $t('personal.profile.job') }}
          </span>
          <span
            class="max-w-[30rem] truncate text-[#e2e2e2]"
            :class="hoverClass(mainExperience)"
            data-cy="2206c4d6e147b893"
            @click="handleOpenWorkDetail()"
          >
            {{ mainExperience?.name || $t('personal.myJob') }}
          </span>
          <span class="mx-2">|</span>
          <img
            v-if="
              mainExperience?.brand?.picture ||
              mainExperience?.organization?.picture
            "
            :src="
              mainExperience?.brand.picture ||
              mainExperience?.organization.picture
            "
            class="mx-1 mr-2 h-4 w-4"
          />
          <span
            class="text-[#e2e2e2]"
            :class="hoverClass(mainExperience)"
            data-cy="98ea424440738a18"
            @click="hendleOpenWorkLink()"
          >
            {{ mainExperience?.authority || $t('personal.company') }}
          </span>
        </span>
      </div>
    </div>
    <PersonalDetailAboutWorkEducationCertificateExperience
      v-model:show-dialog="dialogShow"
      show-type="work"
      is-view
      :detail="experiencesdetail"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  detail: {
    type: Object,
    required: true,
  },
});
const experiencesStore = useExperiencesStore();
const dialogShow = ref(false);
const experiencesdetail = ref({});
const mainExperience = computed(() =>
  props.detail.mainExperience?.id ? props.detail.mainExperience : null,
);
const address = computed(() =>
  props.detail.entityType === 'organization'
    ? props.detail.sites
      ? props.detail.sites[0]
      : null
    : props.detail.address,
);
const showAddress = computed(
  () =>
    address.value?.country &&
    (props.detail.contactsVisibility.address ||
      props.detail.contactsVisibility.sites),
);

const hoverClass = (flag) => ({
  'transition-all': true,
  'cursor-pointer': flag,
  'hover:text-white': flag,
  'hover:underline': flag,
});

const hendleOpenWorkLink = () => {
  const mainExperiences = props.detail.mainExperience;
  const brand = mainExperiences?.brand;
  const organization = mainExperiences?.organization;
  if (organization?.domain) {
    openLink(organization.domain);
  } else if (brand?.domain) {
    openLink(brand.domain);
  }
};

const handleOpenWorkDetail = () => {
  if (mainExperience.value) {
    experiencesdetail.value = {
      ...experiencesStore.handleDetailExperienceData(mainExperience.value),
    };
    dialogShow.value = true;
  }
};
const handleOpenGoogleMap = (q) => {
  q && openLink(`https://www.google.com/maps?authuser=0&hl=en&q=${q}`);
};
</script>
