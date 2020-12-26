<template>
  <div
    id="sankey"
    v-bind:style="
      'min-width:' +
        this.$store.state.vizViewportWidth +
        'px; min-height:' +
        this.$store.state.vizViewportHeight +
        'px'
    "
  >
    {{ update }}
  </div>
</template>

<script>
import * as echarts from "echarts";
var sankey;

export default {
  name: "VizSankey",
  theme: { dark: false },
  computed: {
    update: {
      get() {
        if (this.$store.state.vizData === null) return;
        var component = document.getElementById("sankey");
        if (component === null) return;
        try {
          sankey = echarts.init(component);
        } catch {
          // ignore
        }

        var tnodes = new Set();
        var links = [];

        for (const key in this.$store.state.vizData) {
          if (key === "ALLE") continue;
          const data = this.$store.state.vizData[key];

          Object.keys(data.items).forEach((key2) => {
            var sum = 0;
            Object.keys(data.items[key2].data).forEach((key3) => {
              sum += data.items[key2].data[key3].value;
              console.log(data.items[key2]);
            });

            var tokens = key2.split(" ");
            var last = "0>>>";
            var n = 1;
            tokens.forEach((t) => {
              var ntk = n + t;
              tnodes.add(ntk);
              n++;

              if (last != null)
                links.push({ source: last, target: ntk, value: sum });

              last = ntk;
            });
          });
        }

        var nodes = [];
        nodes.push({name: "", id: "0>>>"});
        Array.from(tnodes).forEach((nt) => {
          nodes.push({ name: nt.substring(1), id: nt });
        });

        console.log(nodes);
        console.log(links);

        var sankeyOptions = {
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            formatter: function(payload){
              return (payload.data.source === "0>>>" ? "" : payload.data.source.substring(1)) + " > "+ payload.data.target.substring(1);
            }
          },
          series: [
            {
              type: "sankey",
              data: nodes,
              links: links,
              emphasis: {
                focus: "adjacency",
              },
              lineStyle: {
                curveness: 0.5,
              },
              label: {
                    formatter: function(payload){
                      return payload.data.name;
                    }
                },
            },
          ],
        };
        sankey.setOption(sankeyOptions);
        return "";
      },
    },
  },
};
</script>
