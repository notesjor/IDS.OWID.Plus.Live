<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>Suche</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-select v-model="focusYear" :items="years" label="Fokusjahr" outlined />
            </v-col>
            <v-col cols="12" md="8">
              <v-range-slider v-model="searchRange" :max="maxYear" :min="minYear" step="1" thumb-label="always" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="query" label="Suchausdruck" @keydown.enter="search_simple" />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-btn block color="error" variant="outlined" @click="delete_simple">Löschen</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn block color="primary" @click="search_simple">Suchen</v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      years: [],
      focusYear: null,
      searchRange: [2000, 2024],
      minYear: 2000,
      maxYear: 2024,
      query: '',
    }
  },
  mounted() {
    const storeYears = this.$store?.state?.years || []
    this.years = storeYears
    if (storeYears.length) {
      this.minYear = storeYears[0]
      this.maxYear = storeYears[storeYears.length - 1]
      this.focusYear = storeYears[0]
      this.searchRange = [storeYears[0], storeYears[storeYears.length - 1]]
    }
  },
  methods: {
    search_simple() {
      this.$store?.commit?.('calculate')
    },
    delete_simple() {
      this.query = ''
      this.searchRange = [this.minYear, this.maxYear]
    },
    search_invoke() {},
    sample_simple_click() {},
    fixSampleLanguage(value) { return value },
    search_simple_n_change() {},
    search_complex_n_change() {},
    search_complex() {},
    stopClickSimple() {},
    stopClickComplex() {},
  },
}
</script>
