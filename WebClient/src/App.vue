<template>
  <v-app>
    <v-app-bar app dark class="d-print-none" style="z-index:999">
      <div>
        <a :href="leftIconHref" target="_blank">
          <img alt="Logo" height="40px" src="./assets/logo_left.svg" />
        </a>
      </div>

      <v-spacer></v-spacer>

      <div>
        <a :href="rightIconHref" target="_blank">
          <img alt="Logo" height="70px" src="./assets/logo_right.svg" />
        </a>
      </div>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <Search ref="searchComponent" @searchRequestSubmitted="scrollToVizPanel" />
          </v-col>
        </v-row>
        <v-row class="text-center">
          <v-col>
            <VizPanel id="vizPanel" />
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
        <v-row>
          <v-col>
            <v-footer padless>
              <v-card class="flex" flat tile>
                <v-card-text class="py-2" style="text-align:left">
                  <div style="display:inline-block">
                    {{ $t("footer_corpusSize") }}
                    <i>
                      ({{ $t("footer_lastUpdate") }}:
                      {{ this.$store.state.owid === null ? "" : this.$store.state.owid.LastDate }}):
                    </i>
                    <br />
                    {{ totalLabel }}
                  </div>
                </v-card-text>
              </v-card>
            </v-footer>
          </v-col>

          <v-col>
            <v-footer padless>
              <v-card class="flex" flat tile>
                <v-card-text class="py-2" style="text-align:right">
                  <div style="display:inline-block">
                    {{ new Date().getFullYear() }} — <strong>{{ this.$config.appName }}</strong>
                  </div>
                  <div style="display:inline-block">
                    <a :href="footerContact" style="margin-left:15px"
                      v-if="footerContact != null && footerContact.length > 1">{{ $t("footer_Contact") }}</a>
                    <a :href="footerImpressum" style="margin-left:15px"
                      v-if="footerImpressum != null && footerImpressum.length > 1">{{ $t("footer_Impressum") }}</a>
                    <a :href="footerDsgvo" style="margin-left:15px"
                      v-if="footerDsgvo != null && footerDsgvo.length > 1">{{ $t("footer_Dsgvo") }}</a>
                  </div>
                </v-card-text>
              </v-card>
            </v-footer>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-menu top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="#EF7D00" fab style="position:fixed; right:1em; bottom:1em" v-bind="attrs" v-on="on">
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="newProject">
          <div>
            <v-icon style="font-size:32px; float:left; margin-right:5px">mdi-file-outline</v-icon>
            <div class="d-none d-sm-flex">
              <span style="font-size:14px; line-height:1; font-weight:200;">
                <p v-html="$t('main_menu_new')"></p>
              </span>
            </div>
          </div>
        </v-list-item>
        <v-list-item @click="showTutorial" v-if="$config.tutorialUrl.length > 0">
          <v-icon style="font-size:32px; float:left; margin-right:5px">mdi-help-circle-outline</v-icon>
          <div class="d-none d-sm-flex">
            <span style="font-size:14px; line-height:1; font-weight:200; margin-top:10px;">
              <p v-html="$t('main_menu_videoTutorial')"></p>
            </span>
          </div>
        </v-list-item>
        <v-list-item>
          <div class="d-none d-sm-flex">
            <span style="font-size:14px; line-height:1; font-weight:200; margin-top:10px;">
              <p>
                <strong>{{ $t("main_menu_language") }}</strong><br />
                <a @click="setLocale('de')"><img src="./locales/de.svg" alt="Deutsch"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('en')"><img src="./locales/gb.svg" alt="Englisch"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('th')"><img src="./locales/th.svg" alt="Thai"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
                <a @click="setLocale('cmn')"><img src="./locales/cn.svg" alt="Mandarin"
                    style="height:24px; margin:10px 10px 5px 0px" /></a>
              </p>
            </span>
          </div>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-overlay :value="!tutorial">
      <div
        style="background-color: rgb(55, 55, 64); display: block; min-height: 410px; max-height: 410px; min-width: 300px; max-width: 300px; position: absolute; left: -320px; top: 50px; ">
        <h3 style="margin: 7px 0px 10px 15px;">Neuigkeiten</h3>
        <v-window v-model="newsAll" vertical>
          <v-window-item :key="0">
            <v-virtual-scroll :items="news" height="368" item-height="64">
              <template v-slot:default="{ item }">
                <v-list-item :key="item" class="newsItem" @click="newsSelected = item.id">
                  <div>
                    <span style="width: 100%;">
                      <v-icon>{{ item.icon }}</v-icon>&nbsp;
                      <b>{{ item.date }}:</b> {{ item.title }}
                    </span>
                  </div>
                </v-list-item>
                <v-divider></v-divider>
              </template>
            </v-virtual-scroll>
          </v-window-item>
          <v-window-item :key="1">
            <div style="height: 100%; width: 100%; padding: 0px 10px 0px 10px; min-height: 352px;">
              <v-row align="center" class="mb-4" style="margin: 5px 0px 0px 0px; font-size: 1.2rem;">
                <v-icon>{{ news[newsSelected]?.icon }}</v-icon>&nbsp;
                <b>{{ news[newsSelected]?.date }}:</b> {{ news[newsSelected]?.title }}
              </v-row>

              <div v-html="news[newsSelected]?.text" style="text-align:left;" class="newsText"></div>              
              <div style="margin: 10px 0px 0px 0px; position: absolute; bottom: 0px;">
                <v-btn @click="newsSelected = -1">
                  <v-icon>mdi-arrow-left-circle-outline</v-icon> Zeige alle Neuigkeiten
                </v-btn>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </div>

      <div class="text-center">
        <v-card>
          <v-card-title class="headline">
            {{ $t("app_dialog_welcome_message") }} {{ this.$config.appName }}
          </v-card-title>
          <iframe :src="tutorial_iframe_src" title="Video-Tutorial"
            style="width:600px; max-width:600px; height:414px; max-height:414px;"></iframe>
          <v-card-text>
            {{ $t("app_dialog_welcome_message_info") }}
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="closeTutorial" class="blink">
              <v-icon style="margin-right:10px">
                mdi-arrow-right-circle-outline
              </v-icon>
              <span>
                {{ $t("app_dialog_welcome_message_btn") }}
              </span>
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
            {{ $t("app_dialog_serverError_message") }} {{ this.$config.appName }}
          </v-card-title>
          <v-card-text>
            {{ $t("app_dialog_serverError_message_info") }}
          </v-card-text>
        </v-card>
      </div>
    </v-overlay>
  </v-app>
</template>

<style>
.blink {
  width: 200px;
  height: 50px;
  padding: 15px;
  text-align: center;
  line-height: 50px;
}

.blink span {
  color: white;
  animation: blink 3s linear infinite;
}

.newsItem {
  background-color: rgb(75, 75, 84);
}

.newsItem:hover {
  background-color: rgb(95, 95, 104);
  cursor: pointer;
}

@keyframes blink {
  0% {
    opacity: 0.3;
  }

  25% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  75% {
    opacity: 0.7;
  }

  100% {
    opacity: 0.3;
  }
}

div.newsText > a {
  color: #ff9800;
  text-decoration: none;
}

div.newsText a:visited {
  color: #ff9800;
  text-decoration: none;
}

div.newsText {
  font-size: 1.1rem;
  font-weight: 200;
  line-height: 1.4;
}
</style>

<script>
//import VizTimeChart from "./components/visualizations/VizTimeChart";
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

    //VizTimeChart
  },

  data: () => ({
    tutorial: false,
    tutorial_iframe_src: "",
    alert: false,

    leftIconHref: null,
    rightIconHref: null,

    footerContact: null,
    footerImpressum: null,
    footerDsgvo: null,

    news: [
      // Hier neue News-Items einfügen - dann alle IDs anpassen!
      {
        id: 0,
        title: "Version 3.0",
        date: "2025-10-07",
        text: "Die neue API basiert auf dem <a href=\"https://notes.jan-oliver-ruediger.de/software/corpusexplorer-overview/\">CorpusExplorer</a>. Sie ist effizienter (schnellere Antwortzeiten / reduzierte Server-Ressourcen) und bietet mit der Auswahl eines Fokus-Jahres eine neue Möglichkeit, die Daten reproduzierbar zu analysieren. Außerdem wurde die Ausfallsicherheit verbessert.",
        icon: "mdi-xml"
      },
      {
        id: 1,
        title: "Daten-Crash",
        date: "2025-09-05",
        text: "Aufgrund einer Fehlfunktion und der parallelen Migration auf einen neuen Server sind die Daten im Zeitraum 03.07.-04.09.2025 leider verloren gegangen. Bitte berücksichtigen Sie dies bei der Interpretation Ihrer Analysen.",
        icon: "mdi-alert-decagram-outline"
      },
      {
        id: 2,
        title: "Print-Publikation",
        date: "2024-06-27",
        text: "Der Artikel \"Tagesaktuelle Aufbereitung, Analyse und Exploration sprachlicher Daten aus RSS-Feeds\" steht OpenAccess unter folgender DOI zur Verfügung: <a href=\"https://doi.org/10.1007/978-3-658-39625-1_1\">[Link zum Artikel]</a>",
        icon: "mdi-book-open-variant"
      },
      {
        id: 3,
        title: "Poster-Präsentation",
        date: "2023-03-14",
        text: "Poster-Präsentation im Rahmen der DHd 2023 (Trier). <a href=\"https://doi.org/10.5281/zenodo.7715470\">[Link zum Abstract]</a>",
        icon: "mdi-human-male-board"
      }, {
        id: 4,
        title: "Softwaredemo",
        date: "2022-07-14",
        text: "Softwaredemo „Day-to-day collection, exploration, analysis, and visualization of n-gram frequencies in German (online press) language: OWIDplusLIVE“ im Rahmen der EURALEX 2022 (Mannheim). <a href=\"https://videolectures.net/euralex2022_owid_plus_live/\">[Link zum Video (auf Englisch)]</a>",
        icon: "mdi-video-vintage"
      }, {
        id: 5,
        title: "Vortrag (GAL 2021)",
        date: "2021-09-15",
        text: "Die Vortragsfolien zum Vortrag \"OWIDplusLIVE\" im Rahmen der Jahrestagung der Gesellschaft für Angewandte Linguistik (GAL) sind online verfügbar: <a href=\"./2021-09-15_GAL.pdf\">[Link zum Download]</a>",
        icon: "mdi-human-male-board"
      },
      {
        id: 6,
        title: "Version 2.0",
        date: "2021-06-18",
        text: "Die API-basierte Version 2.0 von OWIDplusLIVE ist online. Neu: Zeitreihen-Visualisierung, Download-Funktion, verbesserte Suchfunktion, u.v.m. - Hinweis: Im News-Eintrag vom 2024-06-27 finden Sie eine Beschreibung was sich im Vergleich zur Vorversion geändert hat.",
        icon: "mdi-xml"
      }],
    newsSelected: -1,
  }),

  methods: {
    newProject: function () {
      location.reload();
    },
    showTutorial: function () {
      this.tutorial = false;
    },
    blink(event) {
      event.target.style.background = "red";
      setTimeout(() => {
        event.target.style.background = "purple";
      }, 500);
    },
    scrollToVizPanel() {
      document.getElementById("vizPanel").scrollIntoView(true);
      window.scrollBy(0, -100);
    },
    setLocale(locale) {
      localStorage.setItem("locale", locale);
      this.$vuetify.lang.current = this.$i18n.locale = locale;
    },
    closeTutorial() {
      localStorage.setItem("tutorial", new Date().toISOString());
      this.tutorial = true;
    }
    },

    created() {
    var locale = localStorage.getItem("locale");
    if (locale != null)
      this.setLocale(locale);

    const tutorialDate = localStorage.getItem("tutorial");
    if (tutorialDate) {
      const last = new Date(tutorialDate);
      if (isNaN(last.getTime())) {
        this.tutorial = false;
      } else {
        const diff = (new Date()) - last;
        this.tutorial = diff < 86400000; // 24 hours = 86400000 ms
      }
    } else {
      this.tutorial = false;
    }
  },

  mounted() {
    var self = this;
    var store = this.$store;
    var search = this.$refs.searchComponent;
    var config = this.$config;

    this.leftIconHref = config.leftIconHref;
    this.rightIconHref = config.rightIconHref;

    this.footerContact = config.footerContact;
    this.footerImpressum = config.footerImpressum;
    this.footerDsgvo = config.footerDsgvo;

    var baseUrl = "https://www.owid.de/plus/live-2021/api/v3";

    // Der Aufruf INIT sowie NORM lädt notwendige Normdaten herunter.
    // INIT kann serverseitig zur Flood-Detection und Loging verwendet werden.
    fetch(baseUrl + "/years")
      .then((response) => response.json())
      .then((response) => {
        store.commit("years", response);

        fetch(baseUrl + "/norm", {
          method: "GET",
        })
          .then((resp) => {
            if (resp.status != 200)
              throw new Error("Server Error");
            return resp;
          })
          .then((resp) => {
            return resp.ok ? resp.json() : null;
          })
          .then((obj) => {
            if (obj === null)
              throw new Error("No Data");

            store.commit("init", obj);

            store.commit("vizOption", { r: true, s: 16, g: 1 });
          })
          .then(() => {
            const queries = new URLSearchParams(window.location.search);
            var data = "";
            if (queries.has("data")) {
              data = queries.get("data");
            }
            if (queries.has("locale")) {
              var locale = queries.get("locale");
              // vermeidet reload
              if (this.$cookie.get("locale") != locale)
                self.setLocale(locale);
            }

            if (data.length < 10) return;

            this.tutorial = true;
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

    let trackingScript = document.createElement("script");
    trackingScript.setAttribute("src", "./tracking.js");
    document.head.appendChild(trackingScript);

    // Als Tutorial lassen sich MP4-Video-Dateien (inkl. PNG-Poster => myvideo.mp4.png) oder
    // eine externe HTML-Datei mit Video-Player laden.
    if (config.tutorialUrl.length < 1)
      this.tutorial = true;
    else
      this.$data.tutorial_iframe_src = config.tutorialUrl;
  },
  computed: {
    totalLabel: function () {
      if (this.$store.state.owid === null) return "";

      var totals = this.$store.state.owid.Total;
      var res = [];
      for (var i = 0; i < totals.length; i++) {
        res.push("N=" + (i + 1) + ": " + totals[i]);
      }

      return res.join(" / ");
    },
    newsAll: {
      get() {
        return this.newsSelected === -1 ? 0 : 1;
      },
    },
  },
};
</script>
