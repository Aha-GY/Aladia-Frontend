<template>
  <div class="flex flex-col gap-1 rounded-md p-1 text-xs text-[#555555]">
    <div class="flex max-h-[25rem] flex-col gap-1 overflow-y-auto">
      <div
        v-for="item in predictions"
        :key="item.description"
        class="group w-full cursor-pointer font-medium text-[#E5E5E5]"
        :data-cy="`${item.description.toLowerCase().split(' ').join('-')}-option`"
        @click="getPosition(item)"
      >
        <div
          class="flex w-full items-center overflow-hidden rounded px-2 py-2 group-hover:bg-white/5"
        >
          {{ item.description }}
        </div>
      </div>
      <BaseSkeleton v-show="loading" :length="5" height="2rem" class="w-full" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    address: String,
  },
  data() {
    return {
      timer: null,
      predictions: [],
      autocompleteService: null,
      loading: true,
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
    };
  },
  watch: {
    address(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        clearTimeout(this.timer);
        this.predictions = [];
        this.loading = true;
        this.timer = setTimeout(() => {
          this.getSuggestions();
        }, 500);
      } else {
        this.predictions = [];
      }
    },
  },
  methods: {
    displaySuggestions(predictions, status) {
      if (
        status !== google.maps.places.PlacesServiceStatus.OK ||
        !predictions
      ) {
        return;
      }
      this.predictions = predictions;
    },
    getPostalCode(results, status) {
      if (status === 'OK' && results[0]) {
        this.addressObj.lat = results[0].geometry.location.lat().toString();
        this.addressObj.lon = results[0].geometry.location.lng().toString();
        this.addressObj.formattedAddress = results[0].formatted_address;
        let streetNumber = '';
        let route = '';
        const components = results[0].address_components;
        for (let index = 0; index < components.length; index++) {
          const component = components[index];
          if (component.types[0] === 'locality') {
            this.addressObj.city = component.long_name;
          }
          if (component.types[0] === 'postal_code') {
            this.addressObj.zipCode = component.long_name;
          }
          if (component.types[0] === 'administrative_area_level_1') {
            this.addressObj.state = component.long_name;
          }
          if (component.types[0] === 'country') {
            this.addressObj.country = component.long_name;
          }
          if (component.types[0] === 'street_number') {
            streetNumber = component.long_name;
          }
          if (component.types[0] === 'route') {
            route = component.long_name;
          }
          this.addressObj.streetAddress = `${streetNumber} ${route}`;
        }
        this.$emit('change', this.addressObj);
      }
    },
    getGeocoderResult(results, status) {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location }, this.getPostalCode);
      }
    },
    async getSuggestions() {
      try {
        if (!this.autocompleteService) {
          this.autocompleteService =
            new google.maps.places.AutocompleteService();
          await this.$nextTick();
        }
        this.autocompleteService.getQueryPredictions(
          { input: this.address || '' },
          this.displaySuggestions,
        );
      } finally {
        this.loading = false;
      }
    },
    async getPosition(item) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: item.description }, this.getGeocoderResult);
    },
  },
};
</script>
