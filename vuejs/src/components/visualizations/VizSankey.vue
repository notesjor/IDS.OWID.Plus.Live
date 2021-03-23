<template>
<panzoom>
  <div
    id="sankey"
    v-bind:style="
      'min-width:' +
        (this.$store.state.vizViewportWidth * 0.95)+
        'px; min-height:' +
        this.$store.state.vizViewportHeight +
        'px; height: auto'
    "
  ></div>
</panzoom>
</template>

<script>
import * as echarts from 'echarts';
import * as panzoom from 'panzoom';

export default {
  name: "VizSankey",
  theme: { dark: false },
  data() {
    return {
      component: null,
    };
  },
  created() {
    this.$store.watch(
      () => {
        return this.$store.state.version;
      },
      () => {
        if (this.$store.state.vizData === null) return;

        var component = document.getElementById("sankey");
        if (component != null && this.$data.component === null) {
          try {
            this.$data.component = echarts.init(component, "shine", {
              renderer: "svg",
            });            
          } catch {
            // ignore
          }
        }

        panzoom(component);

        var tnodes = new Set();
        var links = [];

        for (const key in this.$store.state.vizData) {
          if (key === "ALLE") continue;
          const data = this.$store.state.vizData[key];

          Object.keys(data.items).forEach((key2) => {
            var sum = 0;
            Object.keys(data.items[key2].data).forEach((key3) => {
              sum += data.items[key2].data[key3].value;
            });

            var tokens = data.items[key2].name.split(" ");
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
        nodes.push({ name: "", id: "0>>>" });
        Array.from(tnodes).forEach((nt) => {
          nodes.push({ name: nt.substring(1), id: nt });
        });

        var unit = this.$store.state.vizOptionRelative ? " (pro Mio. Token)" : " (Token)";

        var sankeyOptions = {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title: "Speichern \xa0 \xa0 \xa0 \xa0 \xa0",
                name: "OWIDplusLIVE"
              }
            },
          },
          animation: false,
          tooltip: {
            trigger: "item",
            triggerOn: "mousemove",
            formatter: function(params) {
              return (
                (params.data.source === "0>>>"
                  ? ""
                  : params.data.source.substring(1)) +
                " --" + params.data.value.toString().replace(",", "'").replace(".", ",")  + unit+ "-> " +
                params.data.target.substring(1)
              );
            },
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
                formatter: function(params) {
                  return params.data.name;
                },
              },
            },
          ],
        };
        this.$data.component.setOption(sankeyOptions);
      },
      {
        deep: true,
      }
    );

    this.$store.commit("calculate");
  },
};
</script>
