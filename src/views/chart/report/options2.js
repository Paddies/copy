import * as echarts from "echarts";
export const getOptionsTwo = () => {
    return {
        legend: {
          icon: "circle",
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 20,
          textStyle: {
            fontSize: 10,
            color: "#fff",
          },
          data: ["A", "B"],
          selectedMode: false,
        },
        grid: {
          left: "3%",
          right: "3%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: [1, 2, 3, 4, 5, 6],
          axisPointer: {
            type: "shadow",
          },
          axisLabel: {
            color: "white",
            interval: 0,
          },
          axisLine: {
            show: true,
            color: "#268C8C",
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: "value",
          name: "",
          axisLine: {
            show: false,
          },
          nameTextStyle: {
            color: "white",
          },
          min: 0,
          axisLabel: {
            formatter: "{value}",
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#F2F3F5",
            },
          },
        },
        series: [
          {
            data: [1, 2, 3, 4, 5, 6],
            name: "A",
            type: "bar",
            barWidth: 30,
            itemStyle: {
              color: "#94BFFF",
            },
            label: {
              show: true,
              position: "top",
              fontSize: 12,
              color: "#94BFFF",
              offset: [0, -5],
              formatter: "{c}",
            },
          },
          {
            data: [1, 2, 3, 4, 5, 6],
            name: "B",
            type: "bar",
            barWidth: 30,
            itemStyle: {
              color: "#3382FF",
            },
            label: {
              show: true,
              position: "top",
              fontSize: 12,
              color: "#3382FF",
              offset: [0, -5],
              formatter: "{c}",
            },
          },
        ],
      };
};

export const getOptionsOne = () => {
  return {
    legend: {
      icon: "circle",
      itemWidth: 10,
      itemHeight: 10,
      itemGap: 20,
      textStyle: {
        fontSize: 10,
        color: "#fff",
      },
      data: ["A", "B"],
      selectedMode: false,
    },
    grid: {
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: [1, 2, 3, 4, 5, 6],
      axisPointer: {
        type: "shadow",
      },
      axisLabel: {
        color: "white",
        interval: 0,
      },
      axisLine: {
        show: true,
        color: "#268C8C",
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      name: "",
      axisLine: {
        show: false,
      },
      nameTextStyle: {
        color: "white",
      },
      min: 0,
      axisLabel: {
        formatter: "{value}",
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: "#F2F3F5",
        },
      },
    },
    series: [
      {
        data: [1, 2, 3, 4, 5, 6],
        name: "A",
        type: "bar",
        barWidth: 30,
        itemStyle: {
          color: "#94BFFF",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 12,
          color: "#94BFFF",
          offset: [0, -5],
          formatter: "{c}",
        },
      },
      {
        data: [1, 2, 3, 4, 5, 6],
        name: "B",
        type: "bar",
        barWidth: 30,
        itemStyle: {
          color: "#3382FF",
        },
        label: {
          show: true,
          position: "top",
          fontSize: 12,
          color: "#3382FF",
          offset: [0, -5],
          formatter: "{c}",
        },
      },
    ],
  };
};
