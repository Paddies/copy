import * as echarts from "echarts";
export const getOptionsTwo  = (datas =[]) => {
  const series = datas.map((item) => {
    return {
      data: item.data,
      name: item.name,
      type: "bar",
      barWidth: 30,
      itemStyle: {
        color: item.color,
      },
      label: {
        show: true,
        position: "top",
        fontSize: 12,
        color: item.color,
        offset: [0, -5],
        formatter: "{c}",
      },
    };
  });
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
      data: ["合格", "不合格"],
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
    // series: [
    // {
    //   data: [1, 2, 3, 4, 5, 6],
    //   name: "合格",
    //   type: "bar",
    //   barWidth: 30,
    //   itemStyle: {
    //     color: "#57A9FB",
    //   },
    //   label: {
    //     show: true,
    //     position: "top",
    //     fontSize: 12,
    //     color: "#57A9FB",
    //     offset: [0, -5],
    //     formatter: "{c}",
    //   },
    // },
    //   {
    //     data: [1, 2, 3, 4, 5, 6],
    //     name: "不合格",
    //     type: "bar",
    //     barWidth: 30,
    //     itemStyle: {
    //       color: "#F76560",
    //     },
    //     label: {
    //       show: true,
    //       position: "top",
    //       fontSize: 12,
    //       color: "#F76560",
    //       offset: [0, -5],
    //       formatter: "{c}",
    //     },
    //   },
    // ],
    series,
  };
};

// export const getOptionsOne = () => {

//     return {

//         legend: {
//             icon: 'circle',
//             itemWidth: 10,
//             itemHeight: 10,
//             itemGap: 20,
//             textStyle: {
//                 fontSize: 10,
//                 color: '#fff',
//             },
//             data: ["合格", "不合格"],
//             selectedMode: false
//         },
//         grid: {
//             left: "3%",
//             right: "3%",
//             bottom: "3%",
//             containLabel: true,
//         },
//         xAxis: {
//             type: 'category',
//             data: [1, 2, 3, 4, 5, 6],
//             axisPointer: {
//                 type: "shadow",
//             },
//             axisLabel: {
//                 color: 'white',
//                 interval: 0,
//             },
//             axisLine: {
//                 show: true,
//                 color: '#268C8C',
//             },
//             splitLine: {
//                 show: false
//             },
//             axisTick: {
//                 show: false,
//             },
//         },
//         yAxis: {
//             type: 'value',
//             name: "",
//             axisLine: {
//                 show: false
//             },
//             nameTextStyle: {
//                 color: 'white'
//             },
//             min: 0,
//             axisLabel: {
//                 formatter: "{value}"
//             },
//             axisTick: {
//                 show: false
//             },
//             splitLine: {
//                 show: true,
//                 lineStyle: {
//                     width: 1,
//                     color: '#F2F3F5',
//                 }
//             },
//         },
//         series: [
//             {
//                 data: [1, 2, 3, 4, 5, 6],
//                 name: "合格",
//                 type: 'bar',
//                 barWidth: 30,
//                 itemStyle: {
//                     color: '#4880FF'
//                 },
//                 label: {
//                     show: true,
//                     position: 'top',
//                     fontSize: 12,
//                     color: '#4880FF',
//                     offset: [0, -5],
//                     formatter: '{c}'
//                 },
//             },
//             {
//                 data: [1, 2, 3, 4, 5, 6],
//                 name: "不合格",
//                 type: 'bar',
//                 barWidth: 30,
//                 itemStyle: {
//                     color: '#F9C74F'
//                 },
//                 label: {
//                     show: true,
//                     position: 'top',
//                     fontSize: 12,
//                     color: '#F9C74F',
//                     offset: [0, -5],
//                     formatter: '{c}'
//                 },
//             }
//         ]
//     }
// }
export const handleChartData = (response) => {
  const { cols, value } = response.data;

  const object = {};
  cols.forEach((item, index) => {
    object[item] = value[index];
  });

  return object;
};
export const handleChartDatas = (list) => {
  const arr = list.keys(list).map(item=>({
    name:item,
    value:list[item]
}))

  return arr;
};
