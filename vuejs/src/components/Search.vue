<template>
  <v-expansion-panels :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Einfache Suche
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                      <v-text-field label="Suchausdruck..."></v-text-field>
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
                    <v-col>
                      <p style="text-align:center">
                        (1. Position)
                      </p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="margin-top:7px">
                      <v-text-field label="Wortform"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="margin-top:7px">
                      <v-text-field label="Lemma"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col style="margin-top:7px">
                      <v-text-field label="POS-Tag"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row>
                    <v-col cols="2"> </v-col>
                    <v-col cols="5">
                      <p style="text-align:center">
                        (1. Position)
                      </p>
                    </v-col>
                    <v-col cols="5">
                      <p style="text-align:center">
                        (2. Position)
                      </p>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        Wortform
                      </p>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        label="Wortform (1. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        label="Wortform (2. Position)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        Lemma
                      </p>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field label="Lemma (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field label="Lemma (2. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        POS-Tag
                      </p>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        label="POS-Tag (1. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="5">
                      <v-text-field
                        label="POS-Tag (2. Position)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row cols="11">
                    <v-col cols="2"> </v-col>
                    <v-col cols="3">
                      <p style="text-align:center">
                        (1. Position)
                      </p>
                    </v-col>
                    <v-col cols="3">
                      <p style="text-align:center">
                        (2. Position)
                      </p>
                    </v-col>
                    <v-col cols="3">
                      <p style="text-align:center">
                        (3. Position)
                      </p>
                    </v-col>
                  </v-row>
                  <v-row cols="11">
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        Wortform
                      </p>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="Wortform (1. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="Wortform (2. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="Wortform (3. Position)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row cols="11">
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        Lemma
                      </p>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Lemma (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Lemma (2. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field label="Lemma (3. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row cols="11">
                    <v-col cols="2">
                      <p style="margin-top:30px; margin-left:15px">
                        POS-Tag
                      </p>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="POS-Tag (1. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="POS-Tag (2. Position)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="3">
                      <v-text-field
                        label="POS-Tag (3. Position)"
                      ></v-text-field>
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
  methods: {
    greet: function() {
      this.$store.commit("increment");
      alert("Hello " + this.$data + " (" + this.$store.state.count + ")!");
    },
    validate_notEmpty: function(value) {
      return value === "" || value == "*"
        ? "Das Feld darf nicht leer sein."
        : true;
    },
  },
};
</script>
