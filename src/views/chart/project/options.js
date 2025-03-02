import * as echarts from "echarts";
export const getOptions1 = () => {
  const colorTemplate1 = [
    [0.6, "#4880ff"],
    [1, "#d1e2fd"],
  ];
  const data1 = [
    {
      name: "公司维度",
      color: "#333",
      value: 85,
    },
  ];

  // 指定图表的配置项和数据
  const option = {
    tooltip: {
      // 本系列特定的 tooltip 设定。
      show: true,
      formatter: "{b}：{c}%",
      backgroundColor: "rgba(50,50,50,0.7)", // 提示框浮层的背景颜色。注意：series.tooltip 仅在 tooltip.trigger 为 'item' 时有效。
      borderColor: "#333", // 提示框浮层的边框颜色。...
      borderWidth: 0, // 提示框浮层的边框宽。...
      padding: 5, // 提示框浮层内边距，单位px，默认各方向内边距为5，接受数组分别设定上右下左边距。...
      textStyle: {
        // 提示框浮层的文本样式。...
        // color ,fontStyle ,fontWeight ,fontFamily ,fontSize ,lineHeight ,.......
      },
    },

    series: [
      {
        legendHoverLink: true,
        name: "单仪表盘示例", // 系列名称,用于tooltip的显示，legend 的图例筛选，在 setOption 更新数据和配置项时用于指定对应的系列。
        type: "gauge", // 系列类型
        radius: "75%", // 参数:number, string。 仪表盘半径,默认 75% ，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
        // center: ['50%', '55%'],	// 仪表盘位置(圆心坐标)
        startAngle: 225, // 仪表盘起始角度,默认 225。圆心 正右手侧为0度，正上方为90度，正左手侧为180度。
        endAngle: -45, // 仪表盘结束角度,默认 -45
        // clockwise: true,		// 仪表盘刻度是否是顺时针增长,默认 true。
        min: 0, // 最小的数据值,默认 0 。映射到 minAngle。
        max: 100, // 最大的数据值,默认 100 。映射到 maxAngle。
        // splitNumber: 10,		// 仪表盘刻度的分割段数,默认 10。
        axisLine: {
          // 仪表盘轴线(轮廓线)相关配置。
          show: true, // 是否显示仪表盘轴线(轮廓线),默认 true。
          lineStyle: {
            distance: -20, // 仪表盘轴线样式。
            color: colorTemplate1, // 仪表盘的轴线可以被分成不同颜色的多段。每段的  结束位置(范围是[0,1]) 和  颜色  可以通过一个数组来表示。默认取值：[[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
            opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
            width: 20, // 轴线宽度,默认 30。
            shadowBlur: 20, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
            shadowColor: "#fff", // 阴影颜色。支持的格式同color。
          },
        },

        splitLine: {
          // 分隔线样式。
          show: true, // 是否显示分隔线,默认 true。
          distance: -30,
          length: -10, // 分隔线线长。支持相对半径的百分比,默认 30。
          lineStyle: {
            // 分隔线样式。
            color: "#4880ff", // 线的颜色,默认 #eee。
            opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
            width: 2, // 线度,默认 2。
            type: "solid", // 线的类型,默认 solid。 此外还有 dashed,dotted
            shadowBlur: 10, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
            shadowColor: "#fff", // 阴影颜色。支持的格式同color。
          },
        },

        axisTick: {
          // 刻度(线)样式。
          show: true, // 是否显示刻度(线),默认 true。
          distance: -35,
          splitNumber: 5, // 分隔线之间分割的刻度数,默认 5。
          length: 5, // 刻度线长。支持相对半径的百分比,默认 8。
          lineStyle: {
            // 刻度线样式。
            color: "#4880ff", // 线的颜色,默认 #eee。
            opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
            width: 1, // 线度,默认 1。
            type: "dotted", // 线的类型,默认 solid。 此外还有 dashed,dotted
            shadowBlur: 10, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
            shadowColor: "#fff", // 阴影颜色。支持的格式同color。
          },
        },

        axisLabel: {
          // 刻度标签。
          show: false, // 是否显示标签,默认 true。
          distance: -20, // 标签与刻度线的距离,默认 5。
          color: "#999", // 文字的颜色,默认 #fff。
          fontSize: 10, // 文字的字体大小,默认 5。
          formatter: "{value}", // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。 示例:// 使用字符串模板，模板变量为刻度默认标签 {value},如:formatter: '{value} kg'; // 使用函数模板，函数参数分别为刻度数值,如formatter: function (value) {return value + 'km/h';}
        },

        pointer: {
          // 仪表盘指针。
          show: false, // 是否显示指针,默认 true。
          length: "70%", // 指针长度，可以是绝对数值，也可以是相对于半径的百分比,默认 80%。
          width: 5, // 指针宽度,默认 8。
        },

        itemStyle: {
          // 仪表盘指针样式。
          color: "auto", // 指针颜色，默认(auto)取数值所在的区间的颜色
          opacity: 1, // 图形透明度。支持从 0 到 1 的数字，为 0 时不绘制该图形。
          borderWidth: 0, // 描边线宽,默认 0。为 0 时无描边。
          borderType: "solid", // 柱条的描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'。
          borderColor: "#000", // 图形的描边颜色,默认 "#000"。支持的颜色格式同 color，不支持回调函数。
          shadowBlur: 20, // (发光效果)图形阴影的模糊大小。该属性配合 shadowColor,shadowOffsetX, shadowOffsetY 一起设置图形的阴影效果。
          shadowColor: "#fff", // 阴影颜色。支持的格式同color。
        },

        emphasis: {
          // 高亮的 仪表盘指针样式
          itemStyle: {
            // 高亮 和正常  两者具有同样的配置项,只是在不同状态下配置项的值不同。
          },
        },

        title: {
          // 仪表盘标题。
          show: true, // 是否显示标题,默认 true。
          offsetCenter: [0, "0%"], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
          color: "#4880ff", // 文字的颜色,默认 #333。
          fontSize: 25, // 文字的字体大小,默认 15。
        },

        detail: {
          // 仪表盘详情，用于显示数据。
          show: false, // 是否显示详情,默认 true。
          offsetCenter: [0, "30%"], // 相对于仪表盘中心的偏移位置，数组第一项是水平方向的偏移，第二项是垂直方向的偏移。可以是绝对的数值，也可以是相对于仪表盘半径的百分比。
          color: "auto", // 文字的颜色,默认 auto。
          fontSize: 25, // 文字的字体大小,默认 15。
          formatter: "{value}%", // 格式化函数或者字符串
        },

        data: data1,
      },
    ],
  };
  return option;
};

export const getLineChartOption1 = (data = [], colors) => {
  return {
    legend: {
      y: "bottom",
      x: "center",
      itemWidth: 12,
      itemGap: 16,
      textStyle: {
        color: "#4880ff",
        fontSize: 12,
        padding: [0, 0, 0, 5],
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        label: {
          show: true,
          backgroundColor: "#fff",
          color: "#556677",
          borderColor: "rgba(0,0,0,0)",
          shadowColor: "rgba(0,0,0,0)",
          shadowOffsetY: 0,
        },
        lineStyle: {
          width: 0,
        },
      },
      backgroundColor: "#fff",
      textStyle: {
        color: "#5c6c7c",
      },
      padding: [10, 10],
      extraCssText: "box-shadow: 1px 0 2px 0 rgba(163,163,163,0.5)",
    },
    grid: {
      top: "15%",
    },
    xAxis: [
      {
        type: "category",
        data: ["2023", "2024", "2025", "2026", "2027", "2028", "2029"],
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          interval: 0,
          textStyle: {
            color: "#ced7e4",
          },
          // 默认x轴字体大小
          fontSize: 10,
          // margin:文字到x轴的距离
          margin: 15,
        },
        axisPointer: {
          label: {
            // padding: [11, 5, 7],
            padding: [0, 0, 10, 0],

            margin: 15,
            // 移入时的字体大小
            fontSize: 10,
            backgroundColor: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#fff", // 0% 处的颜色
                },
                {
                  offset: 0.86,

                  color: "#fff", // 0% 处的颜色
                },
                {
                  offset: 0.86,
                  color: "#33c0cd", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#33c0cd", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        boundaryGap: false,
      },
    ],
    yAxis: [
      {
        type: "value",
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisLabel: {
          textStyle: {
            color: "#ced7e4",
          },
          // 默认x轴字体大小
          fontSize: 8,
          // margin:文字到x轴的距离
          margin: 15,
        },
        splitLine: {
          show: true,
          width: 0.5,
          color: "#707070",
        },
      },
    ],
    series: data?.map((item, index) => ({
      name: item.name,
      type: "line",
      stack: "all",
      data: item.data,
      symbolSize: 1,
      symbol: "circle",
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 2,
        color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
          {
            offset: 0,
            color: colors[index],
          },
          {
            offset: 1,
            color: colors[index],
          },
        ]),
      },
      areaStyle: {
        opacity: 0.7,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: colors[index],
          },
          {
            offset: 0.8,
            color: "rgba(255,255,255,0)",
          },
          {
            offset: 1,
            color: "rgba(255,255,255,0)",
          },
        ]),
      },
      itemStyle: {
        opacity: "0",
      },
    })),
  };
};

export const getOption3 = (arrayTab = []) => {
  console.log(arrayTab);
  const option = {
    legend: { show: false },
    series: [
      {
        center: ["50%", "50%"],
        type: "pie",
        radius: ["35%", "55%"],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: "#fff", borderWidth: 2 },
        color: ["#0e42d2", "#4086ff", "#846bce", "#21ccff", "#86df6c"],
        label: {
          // alignTo: 'labelLine', // ! 文字对齐方式
          formatter: function (e) {
            let {
              data: { name, percent },
            } = e;
            return `{a|${name}}\n{c|${percent}}`;
          },
          minMargin: 5,
          lineHeight: 15,
          rich: {
            a: { fontSize: 10, color: "inherit", padding: [10, 0, 0, 0] },
            c: {
              fontSize: 15,
              align: "left",
              color: "#666666",
              padding: [8, 0, 0, 8],
            },
          },
        },
        data: arrayTab.map((item) => ({
          value: item.data,
          name: item.name,
          percent: item.data + "%",
        })),
      },
    ],
  };

  return option;
};

export const getBarChartOps = ({ cols = [], value = [] } = {}) => {
  return {
    grid: {
      top: "20%",
      left: "2%",
      right: "2%",
      bottom: "8%",
      containLabel: true,
    },

    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(1, 13, 19, 0.5)",
      borderWidth: 1,
      formatter: (params) => {
        return params[0].name + " : " + params[0].value;
      },

      textStyle: {
        color: "rgba(212, 232, 254, 1)",
        // fontSize: fontChart(0.24),
      },
      extraCssText: "z-index:2",
    },
    xAxis: {
      data: cols,
      axisLine: {
        show: true,
        lineStyle: {
          color: "#eeeeee",
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: "#393939",
        fontSize: 10,
        // rotate: "10"
      },
    },
    yAxis: [
      {
        type: "value",
        nameTextStyle: {
          color: "#000",
          fontFamily: "Alibaba PuHuiTi",
          fontSize: 12,
          // fontWeight: 600,
          padding: [0, 0, 0, 30],
        },
        // nameGap: 30,  // 表现为上下位置

        axisLine: {
          show: true,
          lineStyle: {
            color: "#eeeeee",
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: "#393939",
          fontSize: 12,
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: "#eeeeee",
          },
        },
      },
    ],
    series: [
      {
        type: "bar",
        barWidth: 15,
        zlevel: 2,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: "#01B1FF",
                },
                {
                  offset: 1,
                  color: "#246eff",
                },
              ],
              false
            ),
          },
        },
        data: value,
      },
    ],
  };
};

export const getBarChartOps2 = (arrayTab = []) => {
  return {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "30px",
      left: "30px",
      icon: "circle", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none

      itemWidth: 8, // 设置宽度

      itemHeight: 10, // 设置高度

      itemGap: 3, // 设置间距
    },
    color: ["#0e42d2", "#4086ff", "#846bce", "#21ccff", "#86df6c"],
    series: [
      {
        name: " 数据统计",
        type: "pie",
        center: ["50%", "50%"],
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
        },
        emphasis: {
          label: {
            show: true,
            fontSize: "8",
          },
        },
        labelLine: {
          show: false,
        },
        data: arrayTab.map((item) => ({ value: item.data, name: item.name })),
        // data: [
        //   { value: 1017, name: "1" },
        //   { value: 583, name: "2" },
        //   { value: 873, name: "3" },
        //   { value: 432, name: "4" },
        //   { value: 332, name: "5" },
        // ],
      },
    ],
  };
};

export const getlineChartTwoOptons = (seriesData) => {
  console.log("seriesData", seriesData);
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: ["23d融合", "3D目标", "2D人脸", "OCR识别", "长沙话"],
      },
    ],
    yAxis: [
      {
        type: "value",
        name: "人数",
        axisLabel: {
          formatter: "{value}",
        },
      },
    ],
    // series: [
    //   {
    //     color: [
    //       "#0e42d2",
    //       "#4086ff",
    //       "#846bce",
    //       "#21ccff",
    //       "#86df6c",
    //       "#86df6c",
    //     ],
    //     name: "23d融合",
    //     type: "bar",
    //     data: [20, 12, 31, 34, 31, 32],
    //   },
    //   {
    //     name: "3D目标检测",
    //     type: "bar",
    //     data: [10, 20, 5, 9, 3, 32],
    //   },
    //   {
    //     name: "2D人脸检测",
    //     type: "bar",
    //     data: [1, 1, 2, 3, 1, 32],
    //   },
    //   {
    //     name: "OCR识别",
    //     type: "bar",
    //     data: [0.1, 2, 3, 1, 0.5, 32],
    //   },
    //   {
    //     name: "长沙话转普通话",
    //     type: "bar",
    //     data: [1, 1, 2, 3, 1, 32],
    //   },
    //   {
    //     name: "AL文本识别",
    //     type: "bar",
    //     data: [0.1, 2, 3, 1, 0.5, 32],
    //   },
    // ],
    series: seriesData,
  };
};
export const getLeftTopOps = ({ cols = [], value = [] } = {}) => {
  return {
    title: {
      text: ["{a|时间范围：}" + "{b|2023.08.23-2023.08.24}"], // 标题文字
      textStyle: {
        rich: {
          a: {
            color: "#4086FF",
            fontSize: 14,
          },
          b: {
            color: "black",
            fontSize: 14,
          },
        },
      },
      padding: 5, // 标题内边距
      x: "left", // 标题水平居中
      y: "top", // 标题位于图表顶部
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      show: false,
    },
    // grid: {},
    xAxis: {
      type: "value",
      boundaryGap: [0, 0.01],
      axisLabel: {
        formatter: function (value) {
          if (value < 1000) {
            return value;
          } else {
            return `${parseInt(value / 1000)}.${(value % 1000) / 100}k`;
          }
        },
      },
    },
    grid: {
      left: "0", // 固定左边刻度宽度
      // right: "4%",
      // bottom: "3%",
      containLabel: true,
    },
    yAxis: {
      type: "category",
      data: cols,
      axisLabel: {
        width: 150,
      },
    },
    series: [
      {
        // name: '2011',
        type: "bar",
        data: value,
        barWidth: "10px", // 设置柱状图宽度，可以是像素或百分比
        itemStyle: {
          normal: {
            //柱形图圆角，初始化效果
            barBorderRadius: [10, 10, 10, 10],
            color: "#4086FF",
          },
        },
      },
    ],
  };
};

export const handleChartData = (response) => {
  const { cols, value } = response.data;

  const object = {};
  cols.forEach((item, index) => {
    object[item] = value[index];
  });

  return object;
};
export const handleChartDatas = (list) => {
  // console.log('handleChartDatas',list);
  const arr = Object.keys(list).map((item) => ({
    name: item,
    data: list[item],
  }));

  return arr;
};



function getRandomNumber(maxNumber) {
  // Math.random() 生成一个介于 0（包括）和 1（不包括）之间的随机小数
  // 乘以 maxNumber，然后取整，最后加1，确保结果在 1 和 maxNumber 之间
  return Math.floor(Math.random() * maxNumber) + 1;
}



// 用于随着定时器增加数据
export const addData = (data, count = 10) => {
  if (data.msg && data.data) {
    data.value = data.data.value
  }
  const object = {};
  if (data && data.value && Array.isArray(data.value)) {
    data.value = data.value.map((item) => Number(item) + getRandomNumber(count))
    return data
  }
  
  console.log('data>>>',data);

  Object.keys(data).forEach((k) => {
    if (!isNaN(Number(data[k]))) {
      object[k] = Number(data[k]) + getRandomNumber(count);
    } else if (data[k].split(",").length > 0) {
      const itemCountList = data[k].split(",");
      // 将类似于这种数据（10,20）的每一个元素。加上固定的数值后，再拼接回去
      object[k] = itemCountList.map((item) => Number(item.trim()) + getRandomNumber(count)).join(',');
    }
  });
  return object;
};
