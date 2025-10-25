<template>
  <v-app>
    <v-app-bar app theme="dark" class="d-print-none" style="z-index:999">
      <div>
        <a href="https://www.owid.de/plus/" target="_blank">
          <img alt="Logo" src="/logo_left.svg" style="min-height:40px; margin-left:10px" />
        </a>
      </div>

      <v-spacer />

      <div>
        <a href="https://www.ids-mannheim.de/" target="_blank">
          <img alt="Logo" src="/logo_right.svg" style="min-height:70px" />
        </a>
      </div>
    </v-app-bar>

    <v-main>
      <v-container>

        Hello

      </v-container>
    </v-main>

    <v-menu top z-index="1000">
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

    <v-footer theme="dark"
      style="z-index: 100; max-height: 80px; position: absolute; bottom: 0; width: 100%; padding-left:25px;">
      <div style="color:white; margin-top: 20px; font-size: 12px;">
        <img alt="Logo" src="/owid-logo-dunkel.svg" style="max-height:15px; margin:-10px 0px 3px 0px" float="left" />
        <div>
          <a style="color: #fff" href="mailto:ruediger@ids-mannheim.de">Kontakt</a>
          &middot;
          <a style="color: #fff" href="https://www.owid.de/wb/owid/privacy.html">Datenschutzhinweis</a>
          &middot;
          <a style="color: #fff" href="https://www.owid.de/wb/owid/impressum.html">Impressum</a>
        </div>
        <div>
          &copy; Leibniz-Institut für Deutsche Sprache
        </div>
      </div>

      <v-spacer />

      <div style="text-align: right;">
        <a href="https://www.ids-mannheim.de/" target="_blank">
          <img alt="Logo" src="/logo_right.svg"
            style="max-height:65px; min-height: 45px; min-width: 200px; margin-left: auto; " />
        </a>
      </div>
    </v-footer>
  </v-app>

  <v-dialog v-model="tutorial" theme="dark">
    <div style="margin-left: auto; margin-right: auto; position: relative; color:white">
      <div
        style="background-color: rgb(55, 55, 64); display: block; min-height: 410px; max-height: 410px; min-width: 300px; max-width: 300px; position: absolute; left: -320px; top: 50px; ">
        <h3 style="margin: 7px 0px 10px 15px;">Neuigkeiten</h3>
        <v-window v-model="newsAll" vertical>
          <v-window-item :key="0">
            <v-virtual-scroll :items="this.$config.public.news" height="368" item-height="64">
              <template v-slot:default="{ item }">
                <v-list-item :key="item" class="newsItem" @click="newsSelected = item.id" style="margin:5px 0px">
                  <div>
                    <span style="width: 100%;">
                      <v-icon>{{ item.icon }}</v-icon>&nbsp;
                      <b>{{ item.date }}:</b> {{ item.title }}
                    </span>
                  </div>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-window-item>
          <v-window-item :key="1">
            <div style="height: 100%; width: 100%; padding: 0px 10px 0px 10px; min-height: 352px;">
              <v-row align="center" class="mb-4" style="margin: 5px 0px 0px 0px; font-size: 1.2rem;">
                <v-icon>{{ this.$config.public.news[newsSelected]?.icon }}</v-icon>&nbsp;
                <b>{{ this.$config.public.news[newsSelected]?.date }}:</b> {{
                  this.$config.public.news[newsSelected]?.title }}
              </v-row>

              <div v-html="this.$config.public.news[newsSelected]?.text" style="text-align:left;" class="newsText"></div>
              <div style="margin: 10px 0px 0px 0px; position: absolute; bottom: 0px;">
                <v-btn @click="newsSelected = -1" prepend-icon="mdi-arrow-left-circle-outline" class="pulse-btn">
                  Zeige alle Neuigkeiten
                </v-btn>
              </div>
            </div>
          </v-window-item>
        </v-window>
      </div>

      <div class="text-center">
        <v-card style="min-width: 300px;">
          <v-card-title class="headline">
            {{ $t("app_dialog_welcome_message") }} {{ this.$config.public.appName }}
          </v-card-title>
          <iframe :src="this.$config.public.tutorialUrl" title="Video-Tutorial"
            style="width:600px; max-width:600px; height:414px; margin:5px"></iframe>
          <v-card-text>
            {{ $t("app_dialog_welcome_message_info") }}
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="tutorial = false" prepend-icon="mdi-arrow-right-circle-outline" class="pulse-btn">
              {{ $t("app_dialog_welcome_message_btn") }}
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </div>
    </div>
  </v-dialog>

  <v-dialog v-model="alert">
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
  </v-dialog>
</template>

<script>
export default {
  name: "Index",
  theme: { dark: false },
  data() {
    return {
      tutorial: true,
      alert: false,
      newsSelected: -1,
    }
  },

  mounted() {
    var config = this.$config;
  },

  methods: {
  },

  computed: {
    newsAll: {
      get() {
        return this.newsSelected === -1 ? 0 : 1;
      },
    }
  }
}
</script>

<style>
.pulse-btn {
  border: 3px solid rgba(255, 255, 255, 1);
  border-radius: 8px;
  background-clip: padding-box;
  /* verhindert, dass der Hintergrund unter dem Radius sichtbar wird */
  animation: pulse-border 3s ease-in-out infinite;
  -webkit-animation: pulse-border 3s ease-in-out infinite;
}

@keyframes pulse-border {
  0% {
    border-color: rgba(255, 255, 255, 1);
  }

  50% {
    border-color: rgba(255, 255, 255, 0.25);
  }

  100% {
    border-color: rgba(255, 255, 255, 1);
  }
}

@-webkit-keyframes pulse-border {
  0% {
    border-color: rgba(255, 255, 255, 1);
  }

  50% {
    border-color: rgba(255, 255, 255, 0.25);
  }

  100% {
    border-color: rgba(255, 255, 255, 1);
  }
}

.newsItem {
  background-color: rgb(75, 75, 84);
}

.newsItem:hover {
  background-color: rgb(95, 95, 104);
  cursor: pointer;
}

div.newsText>a {
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