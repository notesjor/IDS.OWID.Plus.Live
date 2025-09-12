<template> 
  <v-container>
    <v-expansion-panels :value="expensionPanelOpen">
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-dialog v-model="dialog_helpSearchSetting" width="600" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" style="float:right; display:block;" @click="stopClickSimple">
                <div style="display:block; float:left" @click="stopClickSimple">
                  <v-icon @click="stopClickSimple" left>mdi-magnify</v-icon>
                  <span @click="stopClickSimple">{{ $t("search_settings") }}</span>
                  <a @click="dialog_helpSearchSetting = true">
                    <sup>
                      <v-icon left small style="margin-left:5px">
                        mdi-information-outline
                      </v-icon>
                    </sup>
                  </a>
                </div>
              </div>
            </template>
            <v-card>
              <v-card-title class="headline grey lighten-2">
                {{ $t("search_settings_head") }}
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <span v-html="$t('search_settings_info')"> </span>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog_helpSearchSetting = false">
                  {{ $t("lbl_closeWindow") }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col cols="3">
              <h5>{{ $t("search_lbl_focusYear") }}:</h5>
                <v-select outlined v-model="focusYear" :items="years" style="max-width: 150px;margin:10px 0px 0px 0px"></v-select>
            </v-col>
            <v-col>
              <h5 style="margin:0px 0px 0px -10px">{{ $t("search_lbl_focusYearRange") }}:</h5>
              <v-range-slider 
              v-model="searchRange" 
              :max="years[years.length - 1]" 
              :min="years[0]" 
              step="1" 
              thumb-label="always" 
              ticks="always" 
              tick-size="5" 
              tick-labels
              style="margin:40px 0px 0px 0px"></v-range-slider>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header class="justify-self-start">
          <v-dialog v-model="dialog_helpSearchSimple" width="600" scrollable>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" style="float:right; display:block;" @click="stopClickSimple">
                <div style="display:block; float:left" @click="stopClickSimple">
                  <v-icon @click="stopClickSimple" left>mdi-magnify</v-icon>
                  <span @click="stopClickSimple">{{ $t("search_simple_head") }}</span>
                  <a @click="dialog_helpSearchSimple = true">
                    <sup>
                      <v-icon left small style="margin-left:5px">
                        mdi-information-outline
                      </v-icon>
                    </sup>
                  </a>
                </div>
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
              <h5>{{ $t("search_lbl_windowSize") }}:</h5>
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
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')" style="display:block-inline;"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer_show_pos" />
                      </v-col>
                      <v-col cols="9" style="margin-top:7px">
                        <v-text-field
                          :label="$t('search_lbl_queryExpression') + ' (' + $t('search_simple_singleToken') + ')'"
                          v-model="search_simple_1_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_1" :key="item.label">
                                <a v-on:click="
                                  sample_simple_click(fixSampleLanguage(item.query), [
                                    ['search_simple_1_layer', 'search_simple_1_value'],
                                  ]);
                                search_simple();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer_show_pos" />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field :label="$t('search_lbl_queryExpressionPosition', { pos: 1 })"
                          v-model="search_simple_1_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_2_layer"
                          :label="$t('lbl_layer')"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_2_layer_show_pos" />
                      </v-col>
                      <v-col cols="4">
                        <v-text-field :label="$t('search_lbl_queryExpressionPosition', { pos: 2 })"
                          v-model="search_simple_2_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_2" :key="item.label">
                                <a v-on:click="
                                  sample_simple_click(fixSampleLanguage(item.query), [
                                    ['search_simple_1_layer', 'search_simple_1_value'],
                                    ['search_simple_2_layer', 'search_simple_2_value'],
                                  ]);
                                search_simple();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_1_layer"
                          :label="$t('lbl_layer')"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_1_layer_show_pos" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field :label="$t('search_lbl_queryExpressionPosition', { pos: 1 })"
                          v-model="search_simple_1_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_2_layer"
                          :label="$t('lbl_layer')"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_2_layer_show_pos" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field :label="$t('search_lbl_queryExpressionPosition', { pos: 2 })"
                          v-model="search_simple_2_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                      <v-col cols="2">
                        <v-overflow-btn persistent-hint :items="layer" v-model="search_simple_3_layer"
                          :label="$t('lbl_layer')"></v-overflow-btn>
                        <TagsetInfo v-if="search_simple_3_layer_show_pos" />
                      </v-col>
                      <v-col cols="2">
                        <v-text-field :label="$t('search_lbl_queryExpressionPosition', { pos: 3 })"
                          v-model="search_simple_3_value" :rules="inputRules"
                          @keydown.enter="search_simple"></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col style="padding:0px; margin: -20px 0 15px 15px;">
                        <div>
                          <h5>{{ $t("lbl_samples") }}:</h5>
                          <div class="sampleSection">
                            <ul>
                              <li v-for="item in this.$config.sample_simple_3" :key="item.label">
                                <a v-on:click="
                                  sample_simple_click(fixSampleLanguage(item.query), [
                                    ['search_simple_1_layer', 'search_simple_1_value'],
                                    ['search_simple_2_layer', 'search_simple_2_value'],
                                    ['search_simple_3_layer', 'search_simple_3_value'],
                                  ]);
                                search_simple();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                <v-icon style="color:#c00">mdi-delete-circle-outline</v-icon>{{ $t("search_btn_delete") }}</v-btn>
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
              <div v-bind="attrs" v-on="on" style="float:right; display:block;" @click="stopClickComplex">
                <div style="float:left; display:block;" @click="stopClickComplex">
                  <v-icon @click="stopClickComplex" left>mdi-magnify</v-icon>
                  <span @click="stopClickComplex">{{ $t("search_complex_head") }}</span>
                  <a @click="dialog_helpSearchComplex = true">
                    <sup>
                      <v-icon left small style="margin-left:5px">
                        mdi-information-outline
                      </v-icon>
                    </sup>
                  </a>
                </div>
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
                        <v-text-field :label="$t('layer_wordform')" v-model="search_complex_1_1_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field :label="$t('layer_lemma')" v-model="search_complex_1_1_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col style="margin-top:7px">
                        <v-text-field :label="$t('layer_posTag')" v-model="search_complex_1_1_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
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
                                <a v-on:click="
                                  sample_complex_click(fixSampleLanguage(item.query), 'search_complex_1_');
                                search_complex();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                        <v-text-field :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_2_1_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_2_2_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
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
                                <a v-on:click="
                                  sample_complex_click(fixSampleLanguage(item.query), 'search_complex_2_');
                                search_complex();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                        <v-text-field :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_wordform') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_w" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_lemma') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_l" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col>
                        <v-text-field :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 1 })"
                          v-model="search_complex_3_1_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 2 })"
                          v-model="search_complex_3_2_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
                        <TagsetInfo />
                      </v-col>
                      <v-col>
                        <v-text-field :label="$t('layer_posTag') + ' ' + $t('search_lbl_Position', { pos: 3 })"
                          v-model="search_complex_3_3_p" :rules="inputRules"
                          @keydown.enter="search_complex"></v-text-field>
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
                                <a v-on:click="
                                  sample_complex_click(fixSampleLanguage(item.query), 'search_complex_3_');
                                search_complex();
                                ">{{ fixSampleLanguage(item.label) }}</a>
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
                <v-icon style="color:#c00">mdi-delete-circle-outline</v-icon>{{ $t("search_btn_delete") }}</v-btn>
            </v-col>
            <v-col cols="2"> </v-col>
            <v-col cols="5">
              <v-btn block @click="search_complex">
                <v-icon style="color:#1976d2">mdi-magnify</v-icon>{{ $t("search_btn_start") }}</v-btn>
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

var global_layers = null; // wird in mounted gesetzt
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
    this.token = (upperCase ? element.toUpperCase() : element).trim();
  }

  toString() {
    return "[" + (this.position + 1) + ". " + global_layers[this.layer] + "] = " + this.token;
  }
}

async function sendSearchRequest(data, store, n, queryItems) {
  data.progressWait = true; 
  data.progressMsg = globalT.$t("search_progress_msg01");

  var baseUrl = "https://www.owid.de/plus/live-2021/api/v3";
  console.log(config.baseUrl);

  var years = data.focusYears.sort((a, b) => b - a);  
  var max = years[0];
  years = years.filter((x) => x !== data.focusYear);
  years = [data.focusYear].concat(years);

  var results = {};

  for (let i = 0; i < years.length; i++) {
    const year = years[i];

    try {
      data.progressMsg = globalT.$t("search_progress_msg02", { current: year, max: max });
      const response = await fetch(baseUrl + "/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          N: n,
          Items: queryItems,
          Year: year
        }),
      });

      if (!response.ok) {
        throw new Error(globalT.$t("search_progress_err01"));
      }

      const currentPage = await response.json();

      if (!currentPage || Object.keys(currentPage).length < 1) {
        throw new Error(globalT.$t("search_progress_err01"));
      }

      Object.keys(currentPage).forEach((key) => {
        if (results[key] === undefined) {
          results[key] = currentPage[key];
        } else {
          Object.keys(currentPage[key]).forEach((key2) => {
            if (results[key][key2] === undefined) {
              results[key][key2] = currentPage[key][key2];
            } else {
              results[key][key2] = results[key][key2].concat(currentPage[key][key2]);
            }
          });
        }
      });

    } catch (error) {
      data.snackbar = true;
      data.progressError = error.message;
    }
  }  

  try {
    data.progressMsg = globalT.$t("search_progress_msg03");
    store.commit("search", {
      n: n,
      queryItems: queryItems,
      items: results,
    });
    store.state.vizNoCommit = 1;
    store.commit("calculate");
  } catch (error) {
    data.snackbar = true;
    data.progressError = error.message;
  }

  data.progressWait = false;
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
      dialog_helpSearchSetting: false,
      expensionPanelOpen: 1,

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

      years: [],
      focusYears: [],
      focusYear: 2020,
      searchRange: [],
      yearWatcher: null,

      search_simple_n: 1,
      search_complex_n: 1,
      name: "world",
      snackbar: false,

      progressWait: false,
      progressMsg: "",
      progressError: "",

      iconSeachExt: mdiMagnifyPlus,
      inputRules: [
        function (v) {
          if (v === undefined) return true;
          return (v.toString().match("\\s") || []).length < 1 || globalT.$t("search_ruleError_01");
        },
        function (v) {
          if (v === undefined) return true;
          return (v.toString().match("[\\*]") || []).length < 3 || globalT.$t("search_ruleError_02");
        },
        function (v) {
          if (v === undefined) return true;
          return (v.toString().match("\\.\\*") || []).length < 1 || globalT.$t("search_ruleError_03");
        },
      ],
    };
  },
  created: function () {
    var self = this;
    this.yearWatcher = this.$store.watch(
      (state) => state.years,
      (newValue) => {
        console.log("years changed");
        self.years = newValue;
        self.focusYears = newValue;
        self.searchRange = [newValue[0], newValue[newValue.length - 1]];
      }
    );
  },
  watch: {
    searchRange: function (newVal) {
      this.focusYears = this.years.filter((x) => x >= newVal[0] && x <= newVal[1]);
      this.focusYear = this.focusYears.length > 2 ? this.focusYears[this.focusYears.length - 2] : this.focusYears[this.focusYears.length - 1];
    },
    focusYear: function (newVal) {
      this.$store.commit("focusYear", newVal);
    },
  },
  mounted: function () {
    config = this.$config;

    this.search_simple_1_layer = this.$t("layer_wordform");
    this.search_simple_2_layer = this.$t("layer_wordform");
    this.search_simple_3_layer = this.$t("layer_wordform");

    global_layers = [this.$t("layer_wordform"), this.$t("layer_lemma"), this.$t("layer_pos")];
    this.layer = global_layers;

    globalT = this;    
  },
  computed: {
    search_simple_1_layer_show_pos: function () {
      return this.search_simple_1_layer === this.$t("layer_pos");
    },
    search_simple_2_layer_show_pos: function () {
      return this.search_simple_2_layer === this.$t("layer_pos");
    },
    search_simple_3_layer_show_pos: function () {
      return this.search_simple_3_layer === this.$t("layer_pos");
    }
  },
  methods: {
    delete_simple: function () {
      this.search_simple_1_value = "";
      this.search_simple_2_value = "";
      this.search_simple_3_value = "";
    },
    delete_complex: function () {
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
    stopClickSimple: function (e) {
      this.expensionPanelOpen = 0;
      e.stopPropagation();
    },
    stopClickComplex: function (e) {
      this.expensionPanelOpen = 1;
      e.stopPropagation();
    },
    abortProgress: function () {
      this.$data.progressWait = false;
    },
    fixSampleLanguage: function (str) {
      str = str.replace("Wortform", this.$t("layer_wordform"));
      str = str.replace("Lemma", this.$t("layer_lemma"));
      return str.replace("POS", this.$t("layer_pos"));
    },
    sample_simple_click: function (queryStr, controlIds) {
      var query = JSON.parse(queryStr);
      for (let i = 0; i < query.length; i++) {
        const position = query[i];
        var key = Object.keys(position)[0];

        this.$data[controlIds[i][0]] = key;
        this.$data[controlIds[i][1]] = position[key];
      }
    },
    sample_complex_click: function (queryStr, controlIdTemplate) {
      var query = JSON.parse(queryStr);
      for (let i = 0; i < query.length; i++) {
        const position = query[i];
        Object.keys(position).forEach((key) => {
          this.$data[controlIdTemplate + (i + 1) + "_" + key[0].toLowerCase()] = position[key];
        });
      }
    },
    search_simple_n_change: function (n) {
      this.$data.search_simple_n = n;
      this.$store.commit("updateN", n);
    },
    search_complex_n_change: function (n) {
      this.$data.search_complex_n = n;
      this.$store.commit("updateN", n);
    },
    search_invoke: function (queries) {
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
    search_simple: function () {
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
    search_complex: function () {
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
    validate_notEmpty: function (value) {
      return value === "" || value == "*" ? this.$t("search_error_notEmpty") : true;
    },
  },
};
</script>
