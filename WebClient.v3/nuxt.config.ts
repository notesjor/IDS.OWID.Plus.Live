import svgLoader from "vite-svg-loader"

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/css/main.css'
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    plugins: [svgLoader({
      defaultImport: 'url',
    })]
  },

  runtimeConfig: {
    public: {
      "baseUrl": "https://www.owid.de/plus/live-2021/api",
      "webUrl": "https://www.owid.de/plus/live-2021/",
      "tutorialUrl": "https://www.owid.de/plus/live-2021/tutorial/OWIDplusLIVE_01_player.html",
      "appName": "OWIDplusLIVE",
      "leftIconHref": "https://www.owid.de/plus/index.html",
      "rightIconHref": "https://www.ids-mannheim.de/",
      "appDescription": "OWIDplusLIVE erlaubt die LIVE-Frequenzanalyse von Token und N-Grammen in ausgewählten deutschsprachigen Tageszeitungen.",
      "footerContact": "mailto:ruediger@ids-mannheim.de",
      "footerImpressum": "https://www.owid.de/wb/owid/impressum.html",
      "footerDsgvo": "https://www.owid.de/wb/owid/privacy.html",
      "readme (de)": "Benutzen Sie für die Beispiele (s. u.) immer die Layer-Bezeichnung Wortform, Lemma und POS. Diese werden automatisch in die UI-Sprache übersetzt.",
      "readme (en)": "For the examples (see below) always use the layer names 'Wortform' (german: Wordform), 'Lemma' and 'POS'. These 'names' are automatically translated into the selected UI language.",
      "sample_simple_1": [
        {
          "label": "Wortform = deutschland",
          "query": "[{\"Wortform\":\"deutschland\"}]"
        },
        {
          "label": "Lemma = sagen",
          "query": "[{\"Lemma\":\"sagen\"}]"
        },
        {
          "label": "POS = ART",
          "query": "[{\"POS\":\"ART\"}]"
        },
        {
          "label": "Wortform = *sagte",
          "query": "[{\"Wortform\":\"*sagte\"}]"
        },
        {
          "label": "Lemma = *bayer*",
          "query": "[{\"Lemma\":\"*bayer*\"}]"
        },
        {
          "label": "POS = KO*",
          "query": "[{\"POS\":\"KO*\"}]"
        }
      ],
      "sample_simple_2": [
        {
          "label": "Wortform = angela / Wortform = merkel",
          "query": "[{\"Wortform\":\"angela\"},{\"Wortform\":\"merkel\"}]"
        },
        {
          "label": "Lemma = sprechen / POS = APPR",
          "query": "[{\"Lemma\":\"sprechen\"},{\"POS\":\"APPR\"}]"
        },
        {
          "label": "POS = ADJ* / Lemma = merkel",
          "query": "[{\"POS\":\"ADJ*\"},{\"Lemma\":\"merkel\"}]"
        }
      ],
      "sample_simple_3": [
        {
          "label": "POS = ART / Lemma = unglaublich / POS = NN",
          "query": "[{\"POS\":\"ART\"},{\"Lemma\":\"unglaublich\"},{\"POS\":\"NN\"}]"
        },
        {
          "label": "Wortform = merkel / POS = KON / POS = NE",
          "query": "[{\"Wortform\":\"merkel\"},{\"POS\":\"KON\"},{\"POS\":\"NE\"}]"
        },
        {
          "label": "POS = APPR / Lemma = menschlich / POS = NN",
          "query": "[{\"POS\":\"APPR\"},{\"Lemma\":\"menschlich\"},{\"POS\":\"NN\"}]"
        }
      ],
      "sample_complex_1": [
        {
          "label": "Wortform = berg* + POS = NN",
          "query": "[{\"Wortform\":\"berg*\",\"Lemma\":\"\",\"POS\":\"NN\"}]"
        },
        {
          "label": "Lemma = *kampf* + POS = ADJ*",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"*kampf*\",\"POS\":\"ADJ*\"}]"
        },
        {
          "label": "Lemma = die + POS = ART",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"die\",\"POS\":\"ART\"}]"
        }
      ],
      "sample_complex_2": [
        {
          "label": "POS = ADJ* / Lemma = *bayer* + POS = NN",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"\",\"POS\":\"ADJ*\"},{\"Wortform\":\"\",\"Lemma\":\"*bayer*\",\"POS\":\"NN\"}]"
        },
        {
          "label": "Lemma = *trag* + POS = VV* / Lemma = von",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"*trag*\",\"POS\":\"VV*\"},{\"Wortform\":\"\",\"Lemma\":\"von\",\"POS\":\"\"}]"
        }
      ],
      "sample_complex_3": [
        {
          "label": "Lemma = gehen / Lemma = nach / POS = NN",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"gehen\",\"POS\":\"\"},{\"Wortform\":\"\",\"Lemma\":\"nach\",\"POS\":\"\"},{\"Wortform\":\"\",\"Lemma\":\"\",\"POS\":\"NN\"}]"
        },
        {
          "label": "Lemma = pochen / Lemma = auf / POS = NN",
          "query": "[{\"Wortform\":\"\",\"Lemma\":\"pochen\",\"POS\":\"\"},{\"Wortform\":\"\",\"Lemma\":\"auf\",\"POS\":\"\"},{\"Wortform\":\"\",\"Lemma\":\"\",\"POS\":\"N*\"}]"
        }
      ],
      "news": [
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
        }]
    }
  },

  app: {
    baseURL: "/plus/live-2021/"
  },

  compatibilityDate: "2025-10-25"
})