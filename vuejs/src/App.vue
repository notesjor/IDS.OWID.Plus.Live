<template>
  <v-app>
    <v-app-bar app dark class="d-print-none">
      <div class="d-flex align-center">
        <a
          href="https://www.owid.de/plus/index.html"
          target="_blank"
          rel="nofollow"
        >
          <v-img
            alt="OWIDplus Logo"
            class="shrink mr-2"
            contain
            src="./assets/owid_plus.png"
            transition="scale-transition"
            height="40"
          />
        </a>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex align-center">
        <a href="https://www.ids-mannheim.de/" target="_blank" rel="nofollow">
          <v-img
            alt="IDS Logo"
            class="shrink mr-2"
            contain
            src="./assets/ids-wbmarke.svg"
            transition="scale-transition"
            height="80"
          />
        </a>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <Search ref="searchComponent" />
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
      </v-container>
    </v-main>

    <v-menu top :close-on-content-click="closeOnContentClick">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="#EF7D00"
          fab
          style="position:fixed; right:1em; bottom:1em"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="newProject">
          <div>
            <v-icon style="font-size:32px; float:left; margin-right:5px"
              >mdi-file-outline</v-icon
            >
            <div class="d-none d-sm-flex">
              <span style="font-size:14px; line-height:1; font-weight:200;">
                <p>
                  <strong>Neu</strong><br />
                  Löscht alle Suchabfragen.
                </p>
              </span>
            </div>
          </div>
        </v-list-item>
        <v-list-item @click="tutorial = true">
          <v-icon style="font-size:32px; float:left; margin-right:5px"
            >mdi-help-circle-outline</v-icon
          >
          <div class="d-none d-sm-flex">
            <span
              style="font-size:14px; line-height:1; font-weight:200; margin-top:10px;"
            >
              <p>
                <strong>Hilfe anzeigen</strong><br />
                Zeige das Video-Tutorial erneut an...
              </p>
            </span>
          </div>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-overlay :value="tutorial">
      <div class="text-center">
        <v-card>
          <v-card-title class="headline">
            Herzlich willkommen bei OWIDplusLIVE
          </v-card-title>
          <video
            controls
            crossorigin
            playsinline
            autoplay
            data-poster="./assets/owid_tutorial.png"
            style="max-width:600px"
          >
            <source
              size="1080"
              src="./assets/owid_tutorial.mp4"
              type="video/mp4"
            />
          </video>
          <v-card-text>
            Dieses Video gibt Ihnen eine kurze 3-minütige Einführung in
            'OWIDplusLIVE' mit hilfreichen Tipps.<br />
            Eine textbasiete Anleitung können Sie hier herunterladen.
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="tutorial = false">
              Tutorial beenden
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </v-overlay>

    <v-overlay :value="alert">
      <div class="text-center">
        <v-card>
          <v-card-title class="headline">
            Server-Wartung von OWIDplusLIVE
          </v-card-title>
          <v-card-text>
            Die OWIDplusLIVE-API ist aktuell nicht erreichbar. Der Server wird
            gerade gewartet. Bitte probieren Sie es zu einem späteren Zeitpunkt
            erneut.
          </v-card-text>
        </v-card>
      </div>
    </v-overlay>
  </v-app>
</template>

<script>
import VizPanel from "./components/VizPanel";
import VizOptions from "./components/VizOptions";
import Search from "./components/Search";
import Clipboard from "./components/Clipboard";

export default {
  name: "App",

  metaInfo() {
    return {
      title:
        this.$config.appName === "OWIDplusLIVE"
          ? this.$config.appName
          : this.$config.appName + " (powered by: OWIDplusLIVE)",
      meta: [
        {
          name: "description",
          content: "",
        },
        {
          property: "og:title",
          content: this.$config.appName,
        },
        { property: "og:site_name", content: "Epiloge" },
        { property: "og:type", content: "website" },
        { name: "robots", content: "index,nofollow" },
      ],
    };
  },

  components: {
    VizPanel,
    VizOptions,
    Search,
    Clipboard,
  },

  data: () => ({
    tutorial: false,
    alert: false,
  }),

  methods: {
    newProject: function() {
      location.reload();
    },
  },

  mounted() {
    var store = this.$store;
    var search = this.$refs.searchComponent;
    var config = this.$config;

    fetch(config.baseUrl + "/init")
      .then((response) => response.text())
      .then((response) => {
        store.commit("id", response);

        fetch(config.baseUrl + "/norm", {
          method: "GET",
        })
          .then((resp) => {
            return resp.ok ? resp.json() : null;
          })
          .then((obj) => {
            if (obj === null) return;
            store.commit("init", obj);
          })
          .then(() => {
            var data = window.location.href.replace(config.webUrl, "");
            if (data.length < 10) return;

            try {
              search.search_invoke(JSON.parse(atob(data)));
            } catch {
              // ignore
            }
            return;
          });
      })
      .catch((ex) => {
        console.log(ex);
        this.$data.alert = true;
      });
  },
};
</script>
