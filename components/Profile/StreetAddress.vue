<template>
  <div class="flex flex-col gap-1 rounded-md p-1 text-xs text-[#555555]">
    <div class="flex max-h-[25rem] flex-col gap-1 overflow-y-auto">
      <div
        v-for="item in predictions"
        :key="item.description"
        class="group w-full cursor-pointer font-medium text-[#E5E5E5]"
        data-cy="38c3d98761b20d2a"
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
    address: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      timer: null,
      predictions: [],
      autocompleteService: null,
      geocoder: null,
      loading: true,
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
        this.loading = false;
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.geocoder = new google.maps.Geocoder();
    });
  },
  methods: {
    async getBounds(placeName) {
      try {
        const response = await this.geocoder.geocode({ address: placeName });
        if (response.results.length > 0) {
          const bounds = response.results[0].geometry.bounds;
          const locationRestriction = {
            north: bounds.getNorthEast().lat() + 0.1,
            south: bounds.getSouthWest().lat() - 0.1,
            east: bounds.getNorthEast().lng() + 0.1,
            west: bounds.getSouthWest().lng() - 0.1,
          };
          return locationRestriction;
        }
      } catch (error) {
        return null;
      }
    },
    async getSuggestions() {
      try {
        const locationRestriction = await this.getBounds(
          this.city || this.state || this.country,
        );
        this.autocompleteService.getQueryPredictions(
          {
            input: this.address,
            bounds: locationRestriction,
            strictBounds: true,
          },
          (predictions, status) => {
            if (status === 'OK') {
              this.predictions = predictions || [];
            }
          },
        );
      } finally {
        this.loading = false;
      }
    },
    async getPosition(item) {
      const data = {
        zipCode: '',
        address: item.description,
        latitude: '',
        longitude: '',
      };
      const response = await this.geocoder.geocode({
        address: item.description,
      });
      if (response.results.length > 0) {
        const components = response.results[0]?.address_components;
        for (let index = 0; index < components.length; index++) {
          const component = components[index];
          if (component.types[0] === 'postal_code') {
            data.zipCode = component.long_name;
          }
          if (component.types[0] === 'locality') {
            data.city = component.long_name;
          }
          if (component.types[0] === 'administrative_area_level_1') {
            data.state = component.long_name;
          }
          if (component.types[0] === 'country') {
            data.country = component.long_name;
          }
        }
        data.latitude = response.results[0].geometry.location.lat();
        data.longitude = response.results[0].geometry.location.lng();
      }
      this.$emit('change', data);
    },
  },
};
</script>
