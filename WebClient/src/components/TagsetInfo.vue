<template>
  <v-dialog v-model="dialog" width="600" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on" style="float:right; display:block; margin-top:-70px;" @click="dialog = true">
        <sup>
          <v-icon left small>
            mdi-information-outline
          </v-icon>
        </sup>
      </div>
    </template>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ $t("tagset_name") }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <span v-html="$t('tagset_info')"> </span>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="dialog = false">
          {{ $t("lbl_closeWindow") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "TagsetInfo",
  theme: { dark: false },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
