<template>
  <div
    id="ecalendar"
    v-bind:style="
      'margin-left: -20px; min-width:' +
        this.$store.state.vizViewportWidth +
        'px; min-height:' +
        this.$store.state.vizViewportHeight +
        'px'
    "
  ></div>
</template>

<script>
import * as echarts from "echarts";

var monthMap = {
  nameMap: null,
};

var dayMap = {
  firstDay: 1,
  nameMap: null,
};

export default {
  name: "VizCalendar",
  theme: { dark: false },
  data() {
    return {
      component: null,
    };
  },
  created() {
    monthMap.nameMap = [
      this.$t("lbl_month_short_january"),
      this.$t("lbl_month_short_february"),
      this.$t("lbl_month_short_march"),
      this.$t("lbl_month_short_april"),
      this.$t("lbl_month_short_may"),
      this.$t("lbl_month_short_june"),
      this.$t("lbl_month_short_july"),
      this.$t("lbl_month_short_august"),
      this.$t("lbl_month_short_september"),
      this.$t("lbl_month_short_october"),
      this.$t("lbl_month_short_november"),
      this.$t("lbl_month_short_december"),
    ];
    dayMap.nameMap = [
      this.$t("lbl_weekday_short_monday"),
      this.$t("lbl_weekday_short_tuesday"),
      this.$t("lbl_weekday_short_wednesday"),
      this.$t("lbl_weekday_short_thursday"),
      this.$t("lbl_weekday_short_friday"),
      this.$t("lbl_weekday_short_saturday"),
      this.$t("lbl_weekday_short_sunday"),
    ];
    dayMap.firstDay = parseInt(this.$t("lbl_weekday_firstIndex"));

    this.$store.watch(
      () => {
        return this.$store.state.version;
      },
      () => {
        if (this.$store.state.vizData === null) return;

        var component = document.getElementById("ecalendar");
        if (component != null && this.$data.component === null) {
          try {
            this.$data.component = echarts.init(component, null, {
              renderer: "canvas",
            });
          } catch {
            // ignore
          }
        }

        var tmp = {};
        Object.keys(this.$store.state.vizData).forEach((sK) => {
          Object.keys(this.$store.state.vizData[sK].data).forEach((d) => {
            this.$store.state.vizData[sK].data[d].dates.forEach((i) => {
              if (i in tmp) tmp[i] += parseFloat(this.$store.state.vizData[sK].data[d].value);
              else tmp[i] = parseFloat(this.$store.state.vizData[sK].data[d].value);
            });
          });
        });

        var res = [];
        Object.keys(tmp).forEach((k) => {
          res.push([k, tmp[k]]);
        });

        var unit = this.$store.state.vizOptionRelative ? this.$t("lbl_unit_tokenPPM") : this.$t("lbl_unit_token");

        var calendars = [];
        var top = 35;
        this.$store.state.owid.AvailableYears.forEach((year) => {
          calendars.push({
            range: year,
            cellSize: ["auto", 20],
            dayLabel: dayMap,
            monthLabel: monthMap,
            top: top,
          });
          top += 175;
        });

        let myCalendarOption = {
          toolbox: {
            show: true,
            feature: {
              saveAsImage: {
                title: this.$t("lbl_save") + " \xa0 \xa0 \xa0 \xa0 \xa0",
                name: this.$t("lbl_export_fileName"),
              },
            },
          },
          tooltip: {
            position: "top",
            formatter: function(params) {
              return (
                params.value[0] +
                ": " +
                params.value[1]
                  .toFixed(3)
                  .replace(",", "'")
                  .replace(".", ",") +
                unit
              );
            },
          },
          visualMap: {
            min: Math.min(...res.map((o) => o[1]), 0),
            max: Math.max(...res.map((o) => o[1]), 0),
            calculable: true,
            orient: "horizontal",
            left: "center",
            top: "bottom",
            inRange: {
              color: ["#1feaea", "#ffd200", "#f72047"],
            },
          },
          calendar: calendars,
          series: [
            {
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 0,
              data: res,
            },
            {
              type: "heatmap",
              coordinateSystem: "calendar",
              calendarIndex: 1,
              data: res,
            },
          ],
        };
        this.$data.component.clear();
        this.$data.component.setOption(myCalendarOption);
      },
      {
        deep: true,
      }
    );

    this.$store.commit("calculate");
  },
};
</script>
