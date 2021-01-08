<template>
  <Help>
    <v-app>
      <v-app-bar app dark class="d-print-none">
        <div class="d-flex align-center">
          <v-img
            alt="OWIDplus Logo"
            class="shrink mr-2"
            contain
            src="./assets/owid_plus.png"
            transition="scale-transition"
            height="40"
          />
        </div>

        <v-spacer></v-spacer>
        <a>
          <div style="min-width:350px">
            <v-icon style="font-size:48px; float:left; margin-right:5px"
              >mdi-help-circle-outline</v-icon
            >
            <div class="d-none d-sm-flex">
              <span
                style="font-size:14px; line-height:1; font-weight:200; margin-top:10px; color:white"
              >
                <p>
                  <strong>Schnelle Hilfe</strong><br />
                  Tutorial / Dokumentation / Tipps&amp;Tricks anzeigen
                </p>
              </span>
            </div>
          </div>
        </a>
        <v-spacer></v-spacer>

        <div class="d-flex align-center">
          <v-img
            alt="IDS Logo"
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
          <v-row class="text-center">
            <v-alert type="error" :value="alert">
              Achtung: Es konnte keine Verbindung zum Server aufgebaut werden.
              Bitte versuchen Sie es zu einem späteren Zeitpunkt erneut.
            </v-alert>
          </v-row>
          <v-row>
            <v-col>
              <Search />
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              <VizPanel />
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              <VizOptions />
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              <Clipboard />
            </v-col>
          </v-row>
          <v-row class="text-center">
            <v-col>
              <Export />
            </v-col>
          </v-row>
        </v-container>
      </v-main>

      <v-overlay :value="overlay">
        <div class="text-center">
          <v-progress-circular indeterminate size="64"></v-progress-circular>
          <h3>Bitte warten...</h3>
          <!--<v-btn>Abbrechen</v-btn>-->
        </div>
      </v-overlay>
    </v-app>
  </Help>
</template>

<script>
//import DataGrid from "./components/DataGrid";
import VizPanel from "./components/VizPanel";
import VizOptions from "./components/VizOptions";
import Search from "./components/Search";
import Export from "./components/Export";
import Clipboard from "./components/Clipboard";
import Help from "./components/documentation/Help";

export default {
  name: "App",

  components: {
    //DataGrid,
    VizPanel,
    VizOptions,
    Search,
    Export,
    Clipboard,
    Help,
  },

  data: () => ({
    overlay: false,
    alert: false,
  }),

  mounted() {
    var store = this.$store;

    fetch(store.state.baseUrl + "/init")
      .then((response) => response.text())
      .then((response) => {
        store.commit("id", response);

        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function() {
          if (this.readyState === 4) {
            store.commit("init", JSON.parse(this.responseText));
          }
        });

        xhr.open("GET", store.state.baseUrl + "/norm");
        xhr.send(store);
      })
      .catch((ex) => {
        console.log(ex);
        this.$data.alert = true;
      });
  },

  created() {
    this.$store.watch(
      () => {
        return this.$store.state.status;
      },
      (status) => {
        this._data.overlay = status === "pending";
      },
      {
        deep: true,
      }
    );
  },
};
</script>
