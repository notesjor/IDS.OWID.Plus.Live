<template>
  <v-app>
    <v-app-bar app dark class="d-print-none" style="z-index:999">
      <div class="d-flex">
        <a :href="leftIconHref" target="_blank" rel="nofollow">
          <img
            alt="Logo links"
            class="shrink mr-2"
            contain
            src="./assets/logo_left.png"
            transition="scale-transition"
            height="40"
          />
        </a>
      </div>

      <v-spacer></v-spacer>

      <div class="d-flex">
        <a :href="rightIconHref" target="_blank" rel="nofollow">
          <v-img
            alt="Logo rechts"
            class="shrink mr-2"
            contain
            src="./assets/logo_right.png"
            transition="scale-transition"
          />
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
        <v-list-item @click="newProject">
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
                <strong>{{ $t("main_menu_language") }}</strong
                ><br />
                <a @click="setLocale('de')"
                  ><img src="./locales/de.svg" alt="Deutsch" style="height:24px; margin:10px 10px 5px 0px"
                /></a>
                <a @click="setLocale('en')"
                  ><img src="./locales/gb.svg" alt="Englisch" style="height:24px; margin:10px 10px 5px 0px"
                /></a>
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
            {{ $t("app_dialog_welcome_message") }} {{ this.$config.appName }}
          </v-card-title>
          <video
            v-if="tutorial_mp4"
            controls
            crossorigin
            playsinline
            autoplay
            ref="tutorial_video"
            style="max-width:600px"
          >
            <source size="1080" ref="tutorial_video_source" src="" type="video/mp4" />
          </video>
          <iframe
            v-if="tutorial_iframe"
            ref="tutorial_iframe"
            src=""
            title="Video-Tutorial"
            style="width:600px; max-width:600px; height:414px; max-height:414px;"
          ></iframe>
          <v-card-text>
            {{ $t("app_dialog_welcome_message_info") }}
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="tutorial = false" class="blink">
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
          <v-card-title class="headline"> {{ $t("app_dialog_serverError_message") }} {{ this.$config.appName }} </v-card-title>
          <v-card-text>
            {{ $t("app_dialog_serverError_message_info") }}             
          </v-card-text>
        </v-card>
      </div>
    </v-overlay>
  </v-app>
</template>

<style scoped>
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
</style>

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
    tutorial: true,
    tutorial_iframe: true,
    tutorial_mp4: true,
    alert: false,

    leftIconHref: null,
    rightIconHref: null,
  }),

  methods: {
    newProject: function() {
      location.reload();
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
      this.$i18n.locale = locale;
    },
  },

  mounted() {
    var store = this.$store;
    var search = this.$refs.searchComponent;
    var config = this.$config;

    this.leftIconHref = config.leftIconHref;
    this.rightIconHref = config.rightIconHref;

    // Als Tutorial lassen sich MP4-Video-Dateien (inkl. PNG-Poster => myvideo.mp4.png) oder
    // eine externe HTML-Datei mit Video-Player laden.
    if (config.tutorialUrl.length < 1) this.tutorial = false;
    else {
      if (config.tutorialUrl.endsWith(".mp4")) {
        this.$refs.tutorial_video.poster = config.tutorialUrl + ".png";
        this.$refs.tutorial_video_source.src = config.tutorialUrl;
        this.tutorial_iframe = false;
      } else {
        this.$refs.tutorial_iframe.src = config.tutorialUrl;
        this.tutorial_mp4 = false;
      }
      this.tutorial = true;
    }

    // Der Aufruf INIT sowie NORM lädt notwendige Normdaten herunter.
    // INIT kann serverseitig zur Flood-Detection und Loging verwendet werden.
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
