<template>
  <v-expansion-panels :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Suche
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col>
            <v-tabs>
              <v-tab>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=1</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=1 erlaubt es, nach einzelnen
                    Token (Layer: Wortform, Lemma oder POS) zu suchen.<br />
                    <strong>Beispiele: </strong>Wortform = berlin | Lemma = sein
                    | POS = ADJA | Wortform = *bayer* | POS = N* | Lemma =
                    *stadt
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=2</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=2 erlaubt es, nach zwei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen.<br />
                    <strong>Beispiele: </strong>1. Wortform = angela &amp; 2.
                    Wortform = merkel | 1. POS = ADJA &amp; 2. Lemma = lockdown
                    | 1. Lemma = *präsident &amp; 2. POS = N*
                  </span>
                </v-tooltip>
              </v-tab>
              <v-tab>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">N=3</span>
                  </template>
                  <span>
                    <strong>Hinweis: </strong>N=3 erlaubt es, nach drei direkt
                    aufeinanderfolgende Token (Layer: Wortform, Lemma oder POS)
                    zu suchen. Dabei kann die mittlere Position auch leer
                    gelassen werden.<br />
                    <strong>Beispiele: </strong>1. Wortform = sowohl &amp; 2.
                    LEER &amp; 3. Wortform = auch | 1. POS = ADJA &amp; 2. Lemma
                    = angela &amp; Lemma = merkel*
                  </span>
                </v-tooltip>
              </v-tab>

              <v-tab-item>
                <v-card flat>
                  <v-row>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="10" style="margin-top:7px">
                      <v-text-field label="Token"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field label="Token (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="4">
                      <v-text-field label="Token (2. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row cols="27">
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field label="Token (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field label="Token (2. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        v-model="layerDefault"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2">
                      <v-text-field label="Token (3. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn block> <v-icon>search</v-icon>Suchen </v-btn>
          </v-col>
        </v-row>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Erweiterte Suche
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "Search",

  data: () => {
    return {
      layer: [{ text: "Wortform" }, { text: "Lemma" }, { text: "POS" }],
      layerDefault: { text: "Wortform" },
      name: "world",
    };
  },
  // define methods under the `methods` object
  methods: {
    greet: function() {
      this.$store.commit("increment");
      alert("Hello " + this.$data + " (" + this.$store.state.count + ")!");
    },
  },
};
</script>
