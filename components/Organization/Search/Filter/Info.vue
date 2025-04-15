<template>
  <div class="mb-4 bg-white/5 px-4 py-2">
    <div class="mb-4 font-medium">
      {{ $t('org.info.general') }}
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="country"
        :visible="countryFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.country"
            :title="$t('personal.country')"
            @click="countryFocus = true"
            @blur="countryFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in countries"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            data-cy="6423e3ab5a83b309"
            @click.prevent="onCountryClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="mb-4 text-sm">
      <el-popover
        ref="state"
        :visible="stateFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.state"
            title="State"
            @click="stateFocus = true"
            @blur="stateFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in states"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            @click="onStateClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
    <div class="text-sm">
      <el-popover
        ref="city"
        :visible="cityFocus"
        width="384"
        placement="bottom"
      >
        <template #reference>
          <BaseInput
            v-model="query.city"
            :title="$t('personal.city')"
            @click="cityFocus = true"
            @blur="cityFocus = false"
          />
        </template>
        <div class="flex h-72 flex-col overflow-y-auto p-1">
          <div
            v-for="item in cities"
            :key="item.id"
            class="cursor-pointer rounded px-2 py-1 hover:bg-white/10 hover:text-white"
            @click="onCityClick(item)"
          >
            {{ item.name }}
          </div>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const searchStore = useSearchStore();
    return { searchStore };
  },
  data() {
    return {
      countryFocus: false,
      stateFocus: false,
      cityFocus: false,
      allStates: [],
      allCities: [],
    };
  },
  computed: {
    countries() {
      const result = [...this.searchStore.countries].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (
        this.query.country &&
        result.every((item) => item.name !== this.query.country)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.query.country.toLowerCase()),
        );
      }

      return result;
    },
    states() {
      const result = [...this.allStates].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (
        this.query.state &&
        result.every((item) => item.name !== this.query.state)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.query.state.toLowerCase()),
        );
      }

      return result;
    },
    cities() {
      const result = [...this.allCities].sort((prev, curr) =>
        prev.name.localeCompare(curr.name),
      );

      if (
        this.query.city &&
        result.every((item) => item.name !== this.query.city)
      ) {
        return result.filter((item) =>
          item.name.toLowerCase().includes(this.query.city.toLowerCase()),
        );
      }

      return result;
    },
  },
  mounted() {
    if (!this.countries.length) {
      this.searchStore.searchCountries();
    }
    if (this.query.country) {
      this.getStates();
    }
    if (this.query.country && this.query.state) {
      this.getCities();
    }
  },
  methods: {
    async getStates() {
      this.allStates = await this.searchStore.searchStates({
        countryName: this.query.country,
      });
    },
    async getCities() {
      this.allCities = await this.searchStore.searchCities({
        countryName: this.query.country,
        stateName: this.query.state,
      });
    },
    onCountryClick(item) {
      this.query.country = item.name;
      this.query.state = '';
      this.allStates = [];
      this.query.city = '';
      this.allCities = [];
      this.getStates();
    },
    onStateClick(item) {
      this.query.state = item.name;
      this.query.city = '';
      this.allCities = [];
      this.getCities();
    },
    onCityClick(item) {
      this.query.city = item.name;
    },
  },
};
</script>
