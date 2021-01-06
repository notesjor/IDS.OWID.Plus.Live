<template>
  <v-card>
    <v-card-title>
      <div>
        <v-icon>mdi-export</v-icon
        ><span style="margin-left:10px; font-size:15px"
          >EXPORT: Visualisierung &amp; Daten für Weiterverarbeitung
          exportieren</span
        >
      </div>
    </v-card-title>
    <v-card-text style="text-align:left;">
      <p>
        <span style="margin:5px 5px 0 0">Rohdaten:</span>
        <v-btn @click="toTsv">TSV</v-btn>
        <v-btn @click="toJson">JSON</v-btn>
        <span style="margin:5px 5px 0 20px">Grafik:</span>
        <v-btn>PNG</v-btn>
        <v-btn>SVG</v-btn>
        <span style="margin:5px 5px 0 20px">Web:</span>
        <v-btn>LINK</v-btn>
        <v-btn>IFRAME</v-btn>
      </p>
    </v-card-text>
  </v-card>
</template>

<script>
function saveBlob(blob, fileType, fileName) {
  var newBlob = new Blob([blob], { type: fileType });

  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  const data = window.URL.createObjectURL(newBlob);
  var link = document.createElement("a");
  link.href = data;
  link.download = fileName;
  link.click();
  setTimeout(function() {
    window.URL.revokeObjectURL(data);
  }, 100);
}

export default {
  name: "Export",

  data: () => {
    return {
      name: "world",
    };
  },
  methods: {
    toTsv: function() {
      fetch(this.$store.state.baseUrl + "/down", {
        method: "post",
        body: JSON.stringify({ Format: "TSV", Owid: this.$store.state.owid }),
      })
        .then(function(r) {
          return r.arrayBuffer();
        })
        .then(function(buffer) {
          saveBlob(buffer, "text/tab-separated-value", "data.tsv");
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    },
    toJson: function() {
      fetch(this.$store.state.baseUrl + "/down", {
        method: "post",
        body: JSON.stringify({ Format: "JSON", Owid: this.$store.state.owid }),
      })
        .then(function(r) {
          return r.arrayBuffer();
        })
        .then(function(buffer) {
          saveBlob(buffer, "application/json", "data.json");
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    },
    toSvg: function() {
      fetch(this.$store.state.baseUrl + "/down", {
        method: "post",
        body: JSON.stringify({ Format: "SVG", Owid: this.$store.state.owid }),
      })
        .then(function(r) {
          return r.arrayBuffer();
        })
        .then(function(buffer) {
          saveBlob(buffer, "image/svg+xml", "image.svg");
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    },
    toPng: function() {
      fetch(this.$store.state.baseUrl + "/down", {
        method: "post",
        body: JSON.stringify({ Format: "PNG", Owid: this.$store.state.owid }),
      })
        .then(function(r) {
          return r.arrayBuffer();
        })
        .then(function(buffer) {
          saveBlob(buffer, "image/png", "image.png");
        })
        .catch(function(error) {
          console.log("Request failed", error);
        });
    },
  },
};
</script>
