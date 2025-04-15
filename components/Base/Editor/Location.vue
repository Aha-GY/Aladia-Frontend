<template>
  <BaseInput
    v-model="name"
    search
    fixed
    clear
    :placeholder="$t('event.location.ask')"
    class="!mx-auto p-2"
  />

  <div
    class="hide-scrollbar mt-4 h-[23.6875rem] overflow-y-auto rounded border-[0.5px] border-white/10 p-1.5"
  >
    <div
      v-for="item in locations"
      :key="item.id"
      class="cursor-pointer py-2 last:mb-0 hover:rounded-5 hover:bg-white/5"
      @click="onSelected(item)"
    >
      <div class="px-2.5">
        <div class="flex flex-col">
          <div class="flex items-center gap-2">
            <div
              class="flex size-10 items-center justify-center rounded-full bg-white/5 p-3"
            >
              <i class="fa-solid fa-map-marker-alt text-lg" />
            </div>
            <div class="flex flex-col gap-[0.2rem]">
              <div class="text-sm" v-html="item.highlightedDescription" />
              <div class="text-xs text-gray-400">
                {{ item?.structured_formatting?.secondary_text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <BaseSkeleton
      v-show="loading"
      :length="10"
      height="2rem"
      class="mx-2 my-2.5"
    />
  </div>
</template>

<script>
export default {
  emits: ['location-selected'],
  setup() {
    const globalStore = useGlobalStore();

    return {
      globalStore,
    };
  },
  data() {
    return {
      locations: [],
      loading: false,
      autocompleteService: null,
      addressObj: {
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        formattedAddress: '',
        lat: '',
        lon: '',
      },
      name: '',
      timer: null,
    };
  },
  watch: {
    name() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.init();
      }, 1000);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    closeDialog() {
      this.globalStore.editorLocationPickerVisible = false;
    },
    init() {
      this.locations = [];
      this.loading = false;
      this.next = null;
      this.load();
    },
    async load() {
      this.loading = true;
      if (!this.autocompleteService) {
        this.autocompleteService = new google.maps.places.AutocompleteService();
      }
      const modifiedQuery =
        this.name.length > 2 ? this.name.slice(0, -2) : this.name;
      const results = await Promise.all([
        this.fetchPredictions(this.name || 'Rome'),
        this.fetchPredictions(modifiedQuery || 'italy'),
      ]);

      const combinedPredictions = [...results[0], ...results[1]];
      const uniquePredictions = Array.from(
        new Map(
          combinedPredictions.map((item) => [item.description, item]),
        ).values(),
      );

      this.locations = uniquePredictions.map((item) => ({
        ...item,
        highlightedDescription: highlightKeywords(item.description, [
          this.name,
        ]),
      }));
      this.loading = false;
    },
    fetchPredictions(input) {
      return new Promise((resolve) => {
        this.autocompleteService.getQueryPredictions(
          { input },
          (predictions, status) => {
            if (
              status !== google.maps.places.PlacesServiceStatus.OK ||
              !predictions
            ) {
              resolve([]);
              return;
            }
            resolve(predictions);
          },
        );
      });
    },
    getLocationDetails(results) {
      const addressObj = {
        city: '',
        state: '',
        country: '',
        zipCode: '',
        formattedAddress: '',
        lat: '',
        lon: '',
      };
      addressObj.lat = results[0].geometry.location.lat().toString();
      addressObj.lon = results[0].geometry.location.lng().toString();
      addressObj.formattedAddress = results[0].formatted_address;
      const components = results[0].address_components;

      for (let index = 0; index < components.length; index++) {
        const component = components[index];
        if (component.types[0] === 'locality') {
          addressObj.city = component.long_name;
        }
        if (component.types[0] === 'postal_code') {
          addressObj.zipCode = component.long_name;
        }
        if (component.types[0] === 'administrative_area_level_1') {
          addressObj.state = component.long_name;
        }
        if (component.types[0] === 'country') {
          addressObj.country = component.long_name;
        }
      }
      return addressObj;
    },
    onSelected(item) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: item.description }, (results, status) => {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
          const addressObj = this.getLocationDetails(results);
          this.$emit('location-selected', addressObj);
          this.closeDialog();
        }
      });
    },
  },
};
</script>
