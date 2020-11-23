<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/owid_plus.png"
          transition="scale-transition"
          height="40"
        />
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/ids-wbmarke.svg"
          transition="scale-transition"
          height="80"
        />
      </div>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <Search />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <MainChart />
          </v-col>
        </v-row>
        <v-row class="text-center" cols="12">
          <v-col cols="4">
            Hello
          </v-col>
          <v-col cols="8">
            <HelloWorld />
          </v-col>
        </v-row>
        <v-row class="text-center" cols="12">
          <v-col cols="4"> </v-col>
          <v-col cols="8">
            Hello
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";
import MainChart from "./components/MainChart";
import Search from "./components/Search";

export default {
  name: "App",

  components: {
    HelloWorld,
    MainChart,
    Search,
  },

  data: () => ({
    //
  }),
};
</script>
