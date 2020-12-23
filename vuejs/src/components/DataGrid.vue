<template>
  <v-expansion-panels :value="0">
    <!--
    <v-expansion-panel>
      <v-expansion-panel-header>
        <div><v-icon>mdi-pencil</v-icon><span style="margin-left:10px">VERFEINERN: Daten der aktuellen Suche</span></div>
      </v-expansion-panel-header>
      <v-expansion-panel-content v-if="status === 'success'">
        <v-data-table
          :headers="headers"
          :items="data_items"
          :search="search"
          :single-select="false"
          v-model="selected"
          item-key="key"
          mutli-sort
          show-select
        >
          -- eslint-disable --
          <template v-slot:item.spark="x">
            <v-sparkline
              :value="x.item.spark"
              :gradient="gradient"
              :smooth="true"
              :padding="0"
              :gradient-direction="gradientDirection"
              :fill="false"
              :type="type"
              :auto-line-width="true"
              auto-draw
            ></v-sparkline>
          </template>
          <template v-slot:item.sparkNorm="x">
            <v-sparkline
              :value="x.item.spark"
              :gradient="gradient"
              :smooth="true"
              :padding="0"
              :gradient-direction="gradientDirection"
              :fill="false"
              :type="type"
              :auto-line-width="true"
              auto-draw
            ></v-sparkline>
          </template>
          -- eslint-enable --
        </v-data-table>      
      </v-expansion-panel-content>
      <v-expansion-panel-content v-if="status === 'init'">
        <p>Bitte führen Sie zuerst eine Suche aus!</p>
      </v-expansion-panel-content>
    </v-expansion-panel>
    -->
    <v-expansion-panel>
      <v-expansion-panel-header class="justify-self-start">
        <div>
          <v-icon>mdi-compare-horizontal</v-icon
          ><span style="margin-left:10px"
            >SUCHVERLAUF: Vorangeganenen Suchen vergleichen &amp;
            verfeinern</span
          >
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content v-if="status === 'success'">
        <v-list>
          <v-list-group
            v-for="item in items"
            :key="item.title"
            v-model="item.active"
            :prepend-icon="item.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item v-for="child in item.items" :key="child.title">
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-expansion-panel-content>
      <v-expansion-panel-content v-if="status === 'init'">
        <p>Bitte führen Sie zuerst eine Suche aus!</p>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: "DataGrid",
  data: () => {
    return {
      name: "world",

      gradient: ["#f72047", "#ffd200", "#1feaea"],
      gradientDirection: "top",
      type: "trend",

      expanded: [],
      selected: [],
      search: "",
      headers: [
        { text: "Wortform", value: "w" },
        { text: "Lemma", value: "l" },
        { text: "POS-Tag", value: "p" },
        { text: "Erfasst (Tage)", value: "d" },
        { text: "Erfasst (%-Tage)", value: "dRel" },
        { text: "Summe", value: "s" },
        { text: "Summe (rel.)", value: "sRel" },
        { text: "Frequenzkurve", value: "spark" },
        { text: "Frequenzkurve (rel.)", value: "sparkNorm" },
      ],
    };
  },
  computed: {
    items: function() {
      try {
        return this.$store === null ||
          this.$store.state === null ||
          this.$store.state.currentGrid === null
          ? []
          : this.$store.state.currentGrid;
      } catch (error) {
        return [];
      }
    },
    status: {
      get() {
        return this.$store.state.status;
      },
    },
  },
  watch: {
    data_items: function() {
      this.$data.selected = this.$store.state.currentGrid;
    },
    selected: function() {
      this.$store.state.currentGridSelect = [];
      for (var i in this.$data.selected)
        this.$store.state.currentGridSelect.push(this.$data.selected[i].key);
      console.log(this.$store.state.currentGridSelect);
    },
  },
};
</script>
