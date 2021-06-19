<template>
  <v-container>
    <v-expansion-panels :value="expensionPanelOpen">
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-dialog v-model="dialog_helpSearchSimple" width="600" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" style="float:right; display:block;">
                <div style="display:block; float:left">
                  <v-icon @click="stopClickSimple" left>mdi-magnify</v-icon>
                  <span @click="stopClickSimple">{{ $t("search_simple_head") }}</span>
                  <sup>
                    <v-icon left small style="margin-left:5px">
                      mdi-information-outline
                    </v-icon>
                  </sup>
                </div>
                <div style="display:block; width:100%; height:20px;" @click="stopClickSimple"></div>
              </div>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                {{ $t("search_simple_help_head") }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <span v-html="$t('search_simple_help_info')"> </span>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog_helpSearchSimple = false">
                  {{ $t("lbl_closeWindow") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <h5>{{ $t("Suchfenstergröße") }}:</h5>
              <v-tabs>
                <v-tab @click="search_simple_n_change(1)">
                  <span>N=1</span>
                </v-tab>
                <v-tab @click="search_simple_n_change(2)">
                  <span>N=2</span>
                </v-tab>
                <v-tab @click="search_simple_n_change(3)">
                  <span>N=3</span>
                </v-tab>

                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')"
                          style="display:block-inline;"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer === 'POS'" />
                      </v-col>
                      <v-col cols="9" style="margin-top:7px">
                        <v-text-field
                          :label="$t('search_lbl_queryExpression') + ' (' + $t('search_simple_singleToken') + ')'"
                          v-model="search_simple_1_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_1" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_simple_click(item.query, [
                                      ['search_simple_1_layer', 'search_simple_1_value'],
                                    ]);
                                    search_simple();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer === 'POS'" />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          :label="$t('search_lbl_queryExpressionPosition', { pos: 1 })"
                          v-model="search_simple_1_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_2_layer"
                          :label="$t('lbl_layer')"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_2_layer === 'POS'" />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field
                          :label="$t('search_lbl_queryExpressionPosition', { pos: 2 })"
                          v-model="search_simple_2_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_2" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_simple_click(item.query, [
                                      ['search_simple_1_layer', 'search_simple_1_value'],
                                      ['search_simple_2_layer', 'search_simple_2_value'],
                                    ]);
                                    search_simple();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row cols="27">
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer === 'POS'" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          :label="$t('search_lbl_queryExpressionPosition', { pos: 1 })"
                          v-model="search_simple_1_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_2_layer"
                          :label="$t('lbl_layer')"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_2_layer === 'POS'" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          :label="$t('search_lbl_queryExpressionPosition', { pos: 2 })"
                          v-model="search_simple_2_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn
                          persistent-hint
                          :items="layer"
                          v-model="search_simple_3_layer"
                          :label="$t('lbl_layer')"
                        ></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_3_layer === 'POS'" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field
                          :label="$t('search_lbl_queryExpressionPosition', { pos: 3 })"
                          v-model="search_simple_3_value"
                          :rules="inputRules"
                          @keydown.enter="search_simple"
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_3" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_simple_click(item.query, [
                                      ['search_simple_1_layer', 'search_simple_1_value'],
                                      ['search_simple_2_layer', 'search_simple_2_value'],
                                      ['search_simple_3_layer', 'search_simple_3_value'],
                                    ]);
                                    search_simple();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-btn block @click="delete_simple">
                <v-icon style="color:#c00">mdi-delete-circle-outline</v-icon>{{ $t("search_btn_delete") }}</v-btn
              >
            </v-col>
            <v-col cols="2"> </v-col>
            <v-col cols="5">
              <v-btn block @click="search_simple">
                <v-icon style="color:#1976d2">mdi-magnify</v-icon>{{ $t("search_btn_start") }}
              </v-btn>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-dialog v-model="dialog_helpSearchComplex" width="600" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" style="float:right; display:block;">
                <div style="float:left; display:block;">
                  <v-icon @click="stopClickComplex" left>mdi-magnify</v-icon>
                  <span @click="stopClickComplex">{{ $t("search_complex_head") }}</span>
                  <a @click="dialog = true">
                    <sup>
                      <v-icon left small style="margin-left:5px">
                        mdi-information-outline
                      </v-icon>
                    </sup>
                  </a>
                </div>
                <div style="display:block; width:100%; height:20px;" @click="stopClickComplex"></div>
              </div>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                {{ $t("search_complex_help_head") }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <span v-html="$t('search_complex_help_info')"> </span>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog_helpSearchComplex = false">
                  {{ $t("lbl_closeWindow") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col>
              <div>
                <h5>{{ $t("search_lbl_windowSize") }}:</h5>
              </div>
              <v-tabs>
                <v-tab @click="search_complex_n_change(1)">
                  <span>N=1</span>
                </v-tab>
                <v-tab @click="search_complex_n_change(2)">
                  <span>N=2</span>
                </v-tab>
                <v-tab @click="search_complex_n_change(3)">
                  <span>N=3</span>
                </v-tab>

                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 1 }) }}
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="Wortform"
                          v-model="search_complex_1_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="Lemma"
                          v-model="search_complex_1_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field
                          label="POS-Tag"
                          v-model="search_complex_1_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_complex_1" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_complex_click(item.query, 'search_complex_1_');
                                    search_complex();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 1 }) }}
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 2 }) }}
                        </p>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_complex_2" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_complex_click(item.query, 'search_complex_2_');
                                    search_complex();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
                <v-tab-item>
                  <v-card flat>
                    <v-row>
                      <v-col style="padding:0px; margin: 40px 0 -20px 15px">
                        <h5>{{ $t("search_lbl_query") }}:</h5>
                      </v-col>
                    </v-row>
                    <v-row cols="11">
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 1 }) }}
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 2 }) }}
                        </p>
                      </v-col>
                      <v-col>
                        <p style="text-align:center">
                          {{ $t("search_lbl_Position", { pos: 3 }) }}
                        </p>
                      </v-col>
                    </v-row>
                    <v-row cols="11">
                      <v-col>
                        <v-text-field
                          :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_w"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_l"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field
                          :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_p"
                          :rules="inputRules"
                          @keydown.enter="search_complex"
                        ></v-text-field>
                        <TagsetInfo />
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_complex_3" :key="item.label">
                                <a
                                  v-on:click="
                                    sample_complex_click(item.query, 'search_complex_3_');
                                    search_complex();
                                  "
                                  >{{ item.label }}</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-tab-item>
              </v-tabs>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-btn block @click="delete_complex">
                <v-icon style="color:#c00">mdi-delete-circle-outline</v-icon>{{ $t("search_btn_delete") }}</v-btn
              >
            </v-col>
            <v-col cols="2"> </v-col>
            <v-col cols="5">
              <v-btn block @click="search_complex">
                <v-icon style="color:#1976d2">mdi-magnify</v-icon>{{ $t("search_btn_start") }}</v-btn
              >
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-overlay :value="progressWait">
      <div class="text-center">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3>{{ $t("lbl_wait") }}</h3>
        <h4>{{ progressMsg }}</h4>
        <v-btn @click="abortProgress">{{ $t("lbl_abort") }}</v-btn>
      </div>
    </v-overlay>

    <v-snackbar v-model="snackbar">
      {{ progressError }}

      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false">
          {{ $t("lbl_ok") }}
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style>
.sampleSection {
  overflow: hidden;
  margin: 1em;
}
.sampleSection ul {
  list-style: none;
  padding: 0;
  margin-left: -4px;
}
.sampleSection ul li {
  display: inline;
  white-space: nowrap;
}
.sampleSection ul li:before {
  content: " | ";
}
</style>

<script>
import { mdiMagnifyPlus } from "@mdi/js";
import TagsetInfo from "./TagsetInfo";

var global_layers = ["Wortform", "Lemma", "POS"];
var config;

class queryItem {
  layer;
  position;
  token;

  toJSON() {
    return {
      layer: this.layer,
      position: this.position,
      token: this.token,
    };
  }

  static load(obj) {
    var res = new queryItem(obj.layer, obj.position, "", false);
    res.token = obj.token;
    return res;
  }

  constructor(layer, position, element, upperCase) {
    this.layer = layer;
    this.position = position;
    this.token = (upperCase ? element.toUpperCase() : element.toLowerCase()).trim();
  }

  toString() {
    return "[" + (this.position + 1) + ". " + global_layers[this.layer] + "] = " + this.token;
  }
}

async function sendSearchRequest(data, store, n, queryItems) {
  data.progressWait = true;
  data.progressMsg = "Suche N-Gramme";

  fetch(config.baseUrl + "/find", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      sessionKey: store.state.sessionKey,
    },
    body: JSON.stringify({ N: n, Items: queryItems }),
  })
    .then((resp) => {
      try {
        return resp.ok ? resp.json() : null;
      } catch {
        data.snackbar = true;
        data.progressError = "Keine Ergebnisse - Abfrage zu spezifisch.";
        data.progressWait = false;
        return null;
      }
    })
    .then((searchResult) => {
      if (searchResult === null || searchResult.Items === null || searchResult.Items.length === 0) {
        data.snackbar = true;
        data.progressError = "Keine Ergebnisse - Abfrage zu spezifisch.";
        data.progressWait = false;
        return;
      }

      searchResult.Items = searchResult.Items.slice(i, 1000);

      var packageSize = 250;
      var result = {};
      var error = false;
      var done = 0;

      for (var i = 0; i < searchResult.Items.length; i += packageSize) {
        if (!data.progressWait) {
          error = true;
          break;
        }

        var request = searchResult.Items.slice(i, i + packageSize);

        fetch(config.baseUrl + "/pull", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ N: n, Items: request }),
        })
          .then((resp2) => {
            if (!resp2.ok) {
              error = true;
              return;
            }
            return resp2.json();
          })
          .then((page) => {
            if (page === null) return;
            if (error === true) return;
            if (!data.progressWait) {
              error = true;
              return;
            }

            if (page != null) {
              result = Object.assign({}, result, page);
            } else {
              error = true;
            }

            done += Object.keys(page).length;
            data.progressMsg = `Lade Zeitreihe(n): ${done} von ${searchResult.Items.length}`;

            if (done === searchResult.Items.length) {
              if (!data.progressWait) {
                error = true;
                return;
              }

              data.progressMsg = "Visualisiere die Daten";
              store.commit("search", {
                n: n,
                queryItems: queryItems,
                items: result,
              });
              store.state.vizNoCommit = 1;
              store.commit("calculate");
              data.progressWait = false;
            }
          });
      }

      if (error) if (!store.state.progressAbort) data.snackbar = true;
    });
}

var globalT;
export default {
  name: "Search",
  components: {
    TagsetInfo,
  },
  data: () => {
    return {
      dialog_helpSearchSimple: false,
      dialog_helpSearchComplex: false,
      expensionPanelOpen: 0,

      layer: null,
      search_simple_1_layer: "",
      search_simple_2_layer: "",
      search_simple_3_layer: "",
      search_simple_1_value: "",
      search_simple_2_value: "",
      search_simple_3_value: "",

      search_complex_1_1_w: "",
      search_complex_1_1_l: "",
      search_complex_1_1_p: "",
      search_complex_2_1_w: "",
      search_complex_2_1_l: "",
      search_complex_2_1_p: "",
      search_complex_2_2_w: "",
      search_complex_2_2_l: "",
      search_complex_2_2_p: "",
      search_complex_3_1_w: "",
      search_complex_3_1_l: "",
      search_complex_3_1_p: "",
      search_complex_3_2_w: "",
      search_complex_3_2_l: "",
      search_complex_3_2_p: "",
      search_complex_3_3_w: "",
      search_complex_3_3_l: "",
      search_complex_3_3_p: "",

      search_simple_n: 1,
      search_complex_n: 1,
      name: "world",
      snackbar: false,

      progressWait: false,
      progressMsg: "",
      progressError: "",

      iconSeachExt: mdiMagnifyPlus,
      inputRules: [
        function(v) {
          if (v === undefined) return true;
          console.log(globalT);
          return (v.toString().match("\\s") || []).length < 1 || globalT.$t("search_ruleError_01");
        },
        function(v) {
          if (v === undefined) return true;
          return (v.toString().match("[\\*]") || []).length < 3 || globalT.$t("search_ruleError_02");
        },
        function(v) {
          if (v === undefined) return true;
          return (v.toString().match("\\.\\*") || []).length < 1 || globalT.$t("search_ruleError_03");
        },
      ],
    };
  },
  mounted: function() {
    config = this.$config;

    this.search_simple_1_layer = this.$t("layer_wordform");
    this.search_simple_2_layer = this.$t("layer_wordform");
    this.search_simple_3_layer = this.$t("layer_wordform");

    global_layers = [this.$t("layer_wordform"), this.$t("layer_lemma"), this.$t("layer_pos")];
    this.layer = global_layers;

    globalT = this;
  },
  methods: {
    delete_simple: function() {
      this.search_simple_1_value = "";
      this.search_simple_2_value = "";
      this.search_simple_3_value = "";
    },
    delete_complex: function() {
      this.search_complex_1_1_w = "";
      this.search_complex_1_1_l = "";
      this.search_complex_1_1_p = "";
      this.search_complex_2_1_w = "";
      this.search_complex_2_1_l = "";
      this.search_complex_2_1_p = "";
      this.search_complex_2_2_w = "";
      this.search_complex_2_2_l = "";
      this.search_complex_2_2_p = "";
      this.search_complex_3_1_w = "";
      this.search_complex_3_1_l = "";
      this.search_complex_3_1_p = "";
      this.search_complex_3_2_w = "";
      this.search_complex_3_2_l = "";
      this.search_complex_3_2_p = "";
      this.search_complex_3_3_w = "";
      this.search_complex_3_3_l = "";
      this.search_complex_3_3_p = "";
    },
    stopClickSimple: function(e) {
      e.stopPropagation();
      this.expensionPanelOpen = 0;
    },
    stopClickComplex: function(e) {
      e.stopPropagation();
      this.expensionPanelOpen = 1;
    },
    abortProgress: function() {
      this.$data.progressWait = false;
    },
    sample_simple_click: function(queryStr, controlIds) {
      var query = JSON.parse(queryStr);
      for (let i = 0; i < query.length; i++) {
        const position = query[i];
        var key = Object.keys(position)[0];

        this.$data[controlIds[i][0]] = key;
        this.$data[controlIds[i][1]] = position[key];
      }
    },
    sample_complex_click: function(queryStr, controlIdTemplate) {
      var query = JSON.parse(queryStr);
      for (let i = 0; i < query.length; i++) {
        const position = query[i];
        Object.keys(position).forEach((key) => {
          this.$data[controlIdTemplate + (i + 1) + "_" + key[0].toLowerCase()] = position[key];
        });
      }
    },
    search_simple_n_change: function(n) {
      this.$data.search_simple_n = n;
      this.$store.commit("updateN", n);
    },
    search_complex_n_change: function(n) {
      this.$data.search_complex_n = n;
      this.$store.commit("updateN", n);
    },
    search_invoke: function(queries) {
      var set = new Set();
      var qs = [];
      queries.forEach((x) => {
        qs.push(queryItem.load(x));
        set.add(x.position);
      });

      this.$store.state.owid.N = set.size;

      this.$emit("searchRequestSubmitted");
      sendSearchRequest(this.$data, this.$store, set.size, qs);
    },
    search_simple: function() {
      var queryItems = [
        new queryItem(
          this.$data.layer.indexOf(this.$data.search_simple_1_layer),
          0,
          this.$data.search_simple_1_value,
          this.$data.layer.indexOf(this.$data.search_simple_1_layer) === 2
        ),
      ];
      if (this.$data.search_simple_n > 1)
        queryItems.push(
          new queryItem(
            this.$data.layer.indexOf(this.$data.search_simple_2_layer),
            1,
            this.$data.search_simple_2_value,
            this.$data.layer.indexOf(this.$data.search_simple_2_layer) === 2
          )
        );
      if (this.$data.search_simple_n > 2)
        queryItems.push(
          new queryItem(
            this.$data.layer.indexOf(this.$data.search_simple_3_layer),
            2,
            this.$data.search_simple_3_value,
            this.$data.layer.indexOf(this.$data.search_simple_3_layer) === 2
          )
        );

      this.$emit("searchRequestSubmitted");
      sendSearchRequest(this.$data, this.$store, this.$data.search_simple_n, queryItems);
    },
    search_complex: function() {
      var queryItems = [];
      if (this.$data.search_complex_n === 1) {
        queryItems = [
          new queryItem(0, 0, this.$data.search_complex_1_1_w),
          new queryItem(1, 0, this.$data.search_complex_1_1_l),
          new queryItem(2, 0, this.$data.search_complex_1_1_p, true),
        ];
      } else if (this.$data.search_complex_n === 2) {
        queryItems = [
          new queryItem(0, 0, this.$data.search_complex_2_1_w),
          new queryItem(1, 0, this.$data.search_complex_2_1_l),
          new queryItem(2, 0, this.$data.search_complex_2_1_p, true),
          new queryItem(0, 1, this.$data.search_complex_2_2_w),
          new queryItem(1, 1, this.$data.search_complex_2_2_l),
          new queryItem(2, 1, this.$data.search_complex_2_2_p, true),
        ];
      } else if (this.$data.search_complex_n === 3) {
        queryItems = [
          new queryItem(0, 0, this.$data.search_complex_3_1_w),
          new queryItem(1, 0, this.$data.search_complex_3_1_l),
          new queryItem(2, 0, this.$data.search_complex_3_1_p, true),
          new queryItem(0, 1, this.$data.search_complex_3_2_w),
          new queryItem(1, 1, this.$data.search_complex_3_2_l),
          new queryItem(2, 1, this.$data.search_complex_3_2_p, true),
          new queryItem(0, 2, this.$data.search_complex_3_3_w),
          new queryItem(1, 2, this.$data.search_complex_3_3_l),
          new queryItem(2, 2, this.$data.search_complex_3_3_p, true),
        ];
      }

      this.$emit("searchRequestSubmitted");
      sendSearchRequest(this.$data, this.$store, this.$data.search_complex_n, queryItems);
    },
    validate_notEmpty: function(value) {
      return value === "" || value == "*" ? this.$t("search_error_notEmpty") : true;
    },
  },
};
</script>
