<template>
  <v-expansion-panels :value="0">
    <v-expansion-panel>
      <v-expansion-panel-header>
        Suche
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-row>
          <v-col cols="11">
            <v-tabs vertical style="min-height:181px">
              <v-tab>
                N=1
              </v-tab>
              <v-tab>
                N=2
              </v-tab>
              <v-tab>
                N=3
              </v-tab>

              <v-tab-item>
                <v-card flat>
                  <v-row style="margin-top:-30px">
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="10" style="margin-top:7px">
                      <v-text-field label="Token"></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="10" style="margin-top:-45px">
                      <v-alert icon="info" elevation="2" dismissible>
                        N=1 erlaubt es, nach einzelnen Token (Layer: Wortform,
                        Lemma oder POS) zu suchen.
                      </v-alert>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="2"></v-col>
                    <v-col cols="10" style="margin-top:-30px">
                      <v-alert icon="auto_awesome" elevation="2" dismissible>
                        <strong>Vorschläge:</strong> Lemma = Virus | POS = ADJA
                        | Wortform = Merkel* | Lemma = sein | Wortform = *bayer*
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row style="margin-top:20px">
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="4" style="margin-top:7px">
                      <v-text-field label="Token (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="4" style="margin-top:7px">
                      <v-text-field label="Token (2. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-row style="margin-top:67px" cols="27">
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2" style="margin-top:7px">
                      <v-text-field label="Token (1. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2" style="margin-top:7px">
                      <v-text-field label="Token (2. Position)"></v-text-field>
                    </v-col>
                    <v-col cols="2">
                      <v-overflow-btn
                        persistent-hint
                        :items="layer"
                        :selection="{ index: 0 }"
                        label="Layer"
                        item-value="text"
                      ></v-overflow-btn>
                    </v-col>
                    <v-col cols="2" style="margin-top:7px">
                      <v-text-field label="Token (3. Position)"></v-text-field>
                    </v-col>
                  </v-row>
                </v-card>
              </v-tab-item>
            </v-tabs>
          </v-col>
          <v-col cols="1">
            <v-btn block>
              <v-icon>search</v-icon><br /><br /><br /><br /><br />
              Suchen
            </v-btn>
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
