<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <template v-slot:activator="{ on, attrs }">
      <slot v-bind="attrs" v-on="on"></slot>
    </template>
    <v-card>
      <v-card-title class="headline">
        Herzlich willkommen bei OWID+LIVE
      </v-card-title>
      <video
        controls
        crossorigin
        playsinline
        autoplay
        data-poster="../../assets/owid_tutorial.png"
        style="max-width:600px"
      >
        <source
          size="1080"
          src="../../assets/owid_tutorial.mp4"
          type="video/mp4"
        />
      </video>
      <v-card-text>
        Dieses Video gibt Ihnen eine kurze 3-minütige Einführung in 'OWID+LIVE'
        mit hilfreichen Tipps.<br />
        Eine textbasiete Anleitung können Sie hier herunterladen.
      </v-card-text>
      <v-card-actions>
        <v-btn text @click="dialog = false">
          Tutorial beenden
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "Tutorial",
  theme: { dark: false },
  data() {
    return {
      dialog: false,
    };
  },
};
</script>
