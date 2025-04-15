<template>
  <div class="location-comp w-full">
    <div>{{ title }}</div>
    <div class="mt-3 flex items-center">
      <div class="mr-3 flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-flag text-base text-white/20" />
      </div>
      <BaseSelectElselect
        v-model="currentCountry"
        :list="searchStore.countries"
        :title="$t('personal.profile.country')"
        :auto-focus-search-input="true"
        fixed
        :data-cy="`${dataCy}-country`"
        :fields="{ label: 'name', value: 'name', searchKey2: 'alpha2' }"
        @change="handleCountryChange"
      >
        <template #custom="{ row }">
          <div
            class="flex h-full w-full items-center"
            :data-cy="`${dataCy}-${row.alpha2}-country-option`"
          >
            <img :src="row.flagIcon" alt="flag icon" class="mr-2 h-4 w-6" />
            <div class="text-sm">
              <span
                class="text-gray-500"
                v-html="highlightKeywords(row.alpha2, [row.searchVal])"
              />
              <span
                class="ml-2"
                v-html="highlightKeywords(row.name, [row.searchVal])"
              />
            </div>
          </div>
        </template>
      </BaseSelectElselect>
    </div>
    <div class="mt-6 flex items-center">
      <div class="mr-3 flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-map text-base text-white/20" />
      </div>
      <BaseSelectElselect
        v-model="currentState"
        :list="stateList"
        :title="$t('personal.profile.state')"
        fixed
        :data-cy="`${dataCy}-state`"
        :fields="{ label: 'name', value: 'name' }"
        :auto-focus-search-input="true"
        @change="handleStateChange"
      />
    </div>
    <div class="mt-6 flex items-center">
      <div class="mr-3 flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-house text-base text-white/20" />
      </div>
      <BaseSelectElselect
        v-model="currentCity"
        :list="cityList"
        :title="$t('personal.profile.city')"
        :auto-focus-search-input="true"
        fixed
        :data-cy="`${dataCy}-city`"
        :fields="{ label: 'name', value: 'name' }"
        @change="handleCityChange"
      />
    </div>
    <div v-if="!hiddenStreetAddress" class="mt-6 flex items-center">
      <div class="mr-3 flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-location-dot text-base text-white/20" />
      </div>
      <el-popover
        :visible="!!showStreetAddress && !!streetAddress"
        trigger="click"
        width="90%"
        :teleported="false"
        :trigger-keys="[]"
      >
        <template #reference>
          <BaseInput
            v-model="streetAddress"
            fixed
            :title="$t('personal.profile.street')"
            data-cy="street-address"
            @click="showStreetAddress = true"
            @blur="showStreetAddress = false"
          />
        </template>
        <ProfileStreetAddress
          :address="streetAddress"
          :country="currentCountry"
          :state="currentState"
          :city="currentCity"
          @change="
            (d) => {
              streetAddress = d.address;
              zipCode = d.zipCode;
              setMapCenter(d);
              showStreetAddress = false;
            }
          "
        />
      </el-popover>
    </div>
    <div v-if="!hiddenZipCode" class="mt-6 flex items-center">
      <div class="mr-3 flex h-4 w-4 items-center justify-center">
        <i class="fa-regular fa-envelope text-base text-white/20" />
      </div>
      <BaseInput
        v-model="zipCode"
        fixed
        :title="$t('personal.profile.zip')"
        data-cy="zip-code"
      />
    </div>
    <slot />
    <div v-if="mapCenter && showMap" class="mt-3">
      <BaseGoogleMaps :center="mapCenter" :draggable="draggable" />
    </div>
  </div>
</template>
<script setup>
import { searchStates, searchCities } from '~/api/v2/global';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  hiddenZipCode: {
    type: Boolean,
    default: false,
  },
  hiddenStreetAddress: {
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  value: {
    type: Object,
    default: () => ({}),
  },
  showMap: {
    type: Boolean,
    default: true,
  },
  dataCy: {
    type: String,
    default: 'location',
  },
});
const emit = defineEmits(['change']);

const searchStore = useSearchStore();

const showStreetAddress = ref(false);
const mapCenter = ref(null);
const currentCountry = ref('');

const handleCountryChange = async (val) => {
  currentState.value = '';
  stateList.value = [];
  currentCity.value = '';
  streetAddress.value = '';
  zipCode.value = '';
  mapCenter.value = null;
  cityList.value = [];
  if (!val?.name) {
    return false;
  }
  const { data } = await searchStates({
    limit: 0,
    countryName: ['TW'].includes(val.alpha2) ? val.name1 : val.name,
  });
  stateList.value = data;
};

const currentState = ref('');
const stateList = ref([]);
const handleStateChange = async (val) => {
  setMapCenter(val);
  currentCity.value = '';
  streetAddress.value = '';
  zipCode.value = '';
  cityList.value = [];
  if (!val?.name) {
    return false;
  }
  const { data } = await searchCities({
    limit: 0,
    countryName: currentCountry.value,
    stateName: val?.name,
  });
  cityList.value = data;
};
const currentCity = ref('');
const cityList = ref([]);
const handleCityChange = (val) => {
  console.log(val, '----');
  setMapCenter(val);
};

const setMapCenter = (val) => {
  if (val?.latitude && val?.longitude) {
    mapCenter.value = { lat: +val.latitude, lng: +val.longitude };
  } else {
    mapCenter.value = null;
  }
};

const zipCode = ref('');

const streetAddress = ref('');

watch(
  () => props.value,
  async (val) => {
    if (val.country) {
      currentCountry.value = val.country;
      await handleCountryChange({ name: val.country });
    } else {
      currentCountry.value = '';
    }
    if (val.state) {
      currentState.value = val.state;
      await handleStateChange({ name: val.state });
      const currentStateItem = stateList.value.find(
        (item) => item.name === val.state,
      );
      setMapCenter(currentStateItem);
    } else {
      currentState.value = '';
      mapCenter.value = null;
    }
    if (val.city) {
      currentCity.value = val.city;
      const currentCityItem = cityList.value.find(
        (item) => item.name === val.city,
      );
      setMapCenter(currentCityItem);
    } else {
      currentCity.value = '';
      mapCenter.value = null;
    }
    zipCode.value = val.zipCode || '';
    streetAddress.value = val.streetAddress || '';
  },
  { immediate: true, deep: true },
);
const getLocationInfo = () => ({
  country: currentCountry.value || '',
  state: currentState.value || '',
  city: currentCity.value || '',
  zipCode: zipCode.value || '',
  streetAddress: streetAddress.value || '',
  lat: mapCenter.value?.lat ? `${mapCenter.value.lat}` : '',
  lng: mapCenter.value?.lng ? `${mapCenter.value.lng}` : '',
});
watch(
  () => [
    currentCountry.value,
    currentState.value,
    currentCity.value,
    zipCode.value,
    streetAddress.value,
  ],
  () => {
    emit('change', getLocationInfo());
  },
);

defineExpose({
  getLocationInfo,
});
</script>
<style lang="scss">
.location-comp {
  .el-select {
    .el-select__wrapper {
      background-color: transparent;
    }
  }
}
</style>
