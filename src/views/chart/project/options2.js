import * as echarts from "echarts";
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
            bottom: "0%",
            top: "10%",
            containLabel: true,
        },
        //   yAxis: {
        //     type: 'value',
        //     max: 100,
        //     min: 0,
        //     interval:20,
        // },
        yAxis: {
            type: "category",
            data: cols,
            axisLabel: {
                width: 150,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            // max: 100,
            min: 0,
            interval: 20,
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
        data.value = data.data.value;
    }
    const object = {};
    if (data && data.value && Array.isArray(data.value)) {
        data.value = data.value.map(
            (item) => Number(item) + getRandomNumber(count)
        );
        return data;
    }

    console.log("data>>>", data);

    Object.keys(data).forEach((k) => {
        if (!isNaN(Number(data[k]))) {
            object[k] = Number(data[k]) + getRandomNumber(count);
        } else if (data[k].split(",").length > 0) {
            const itemCountList = data[k].split(",");
            // 将类似于这种数据（10,20）的每一个元素。加上固定的数值后，再拼接回去
            object[k] = itemCountList
                .map((item) => Number(item.trim()) + getRandomNumber(count))
                .join(",");
        }
    });
    return object;
};

export const getOps3 = () => {
    return {
        backgroundColor: "#fff",
        color: ["#3469FF", "#64FFEC", "#FF7D00", "#722ED1", "#00B42A"],
        // legend: {
        //   top: "10%",
        // },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
            },
        },
        grid: {
            top: "4%",
            left: "4%",
            right: "4%",
            bottom: "4%",
            containLabel: true,
        },
        xAxis: [
            {
                type: "category",
                boundaryGap: false,
                axisLabel: {
                    //   formatter: "{value}月",
                    textStyle: {
                        color: "#333",
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: "#D9D9D9",
                    },
                },
                data: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"],
            },
        ],
        yAxis: [
            {
                type: "value",
                // name: "单位：万",
                axisLabel: {
                    textStyle: {
                        color: "#666",
                    },
                },
                nameTextStyle: {
                    color: "#666",
                    fontSize: 12,
                    lineHeight: 40,
                },
                splitLine: {
                    lineStyle: {
                        type: "dashed",
                        color: "#E9E9E9",
                    },
                },
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
            },
        ],
        series: [
            {
                name: "第1类",
                type: "line",
                smooth: true,
                // showSymbol: false,/
                symbolSize: 0,
                zlevel: 3,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(100, 162, 255, 0.12)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(52, 105, 255, 0.00)",
                                },
                            ],
                            false
                        ),
                        shadowColor: "#64A2FF",
                        shadowBlur: 10,
                    },
                },
                data: [50, 438, 30, 473, 48, 450, 480, 430],
            },
            {
                name: "第2类",
                type: "line",
                smooth: true,
                // showSymbol: false,
                symbolSize: 0,
                zlevel: 3,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(100, 255, 236, 0.12)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(52, 255, 243, 0.00)",
                                },
                            ],
                            false
                        ),
                        shadowColor: "#64FFEC",
                        shadowBlur: 10,
                    },
                },
                data: [233, 233, 200, 180, 199, 233, 210, 180],
            },
            {
                name: "第3类",
                type: "line",
                smooth: true,
                // showSymbol: false,
                symbolSize: 0,
                zlevel: 3,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(255, 211, 100, 0.12) ",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(255, 235, 52, 0.00)",
                                },
                            ],
                            false
                        ),
                        shadowColor: "#FF7D00",
                        shadowBlur: 10,
                    },
                },
                data: [400, 300, 250, 140, 289, 13, 320, 180],
            },
            {
                name: "第4类",
                type: "line",
                smooth: true,
                // showSymbol: false,
                symbolSize: 0,
                zlevel: 3,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(131, 100, 255, 0.12)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(80, 52, 255, 0.00)",
                                },
                            ],
                            false
                        ),
                        shadowColor: "#8364FF",
                        shadowBlur: 10,
                    },
                },
                data: [20, 525, 241, 321, 58, 122, 75, 243],
            },
            {
                name: "第5类",
                type: "line",
                smooth: true,
                // showSymbol: false,
                symbolSize: 0,
                zlevel: 3,
                areaStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [
                                {
                                    offset: 0,
                                    color: "rgba(0, 180, 42, 0.20)",
                                },
                                {
                                    offset: 1,
                                    color: "rgba(0, 180, 42, 0.00)",
                                },
                            ],
                            false
                        ),
                        shadowColor: "#00B42A",
                        shadowBlur: 10,
                    },
                },
                data: [100, 125, 141, 121, 168, 182, 175, 183],
            },
        ],
    };
};

export const getBarChartOps = () => {
    return {
        grid: {
            top: "2%",
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
            data: [3, 4, 5, 6, 7, 8],
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
                    // fontWeight: 800,s
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
                barWidth: '25px',
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
                data: [5, 3, 6, 5, 4, 3],
            },
        ],
    };
};

export const getOps5 = () => {
    return {
        title: {
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
            bottom: "0%",
            top: "10%",
            containLabel: true,
        },
        //   yAxis: {
        //     type: 'value',
        //     max: 100,
        //     min: 0,
        //     interval:20,
        // },
        yAxis: {
            type: "category",
            data: ['业务接入总量', '已完成数量', '未完成数量'],
            axisLabel: {
                width: 150,
            },
            axisLine: {
                show: false,
            },
            splitLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            // max: 100,
            min: 0,
            interval: 20,
        },
        series: [
            {
                // name: '2011',
                type: "bar",
                data: [300, 600, 800],
                barWidth: "20px", // 设置柱状图宽度，可以是像素或百分比
                itemStyle: {
                    normal: {
                        //柱形图圆角，初始化效果
                        barBorderRadius: [1, 3, 3, 1],
                        color: "#4086FF",
                    },
                },
            },
        ],
    };
};

export const getOps6 = () => {
    const option = {
        graphic: [
            {
                type: "group",
                left: "44%",
                top: "50%",
                children: [
                    {
                        type: "text",
                        style: {
                            fill: "#1D2129",
                            text: "项目类型",
                        },

                    },
                ],
            },
        ],
        legend: {
            show: true,
            icon: 'circle',
            right: '3%',
            left: 'center',
            bottom: '1%',
            itemWidth: 10,
            itemStyle: {
                borderColor: 'none',
            },

            textStyle: {
                rich: {
                    name: {
                        color: '#606266',
                        fontSize: 14,
                    },
                    percentage: {
                        color: '#606266',
                        fontSize: 16,
                        padding: [0, 0, 0, 30],
                        align: 'right',
                    },
                },
            },
        },
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
                            data: { percent },
                        } = e;
                        return percent;
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
                data: [
                    {
                        name: '文本',
                        value: 228.22,
                        percent: '22%'
                    },
                    {
                        name: '3D',
                        value: 269.34,
                        percent: '26%'
                    },
                    {
                        name: '2D',
                        value: 44.4,
                        percent: '4%'
                    },
                    {
                        name: '视频',
                        value: 448.58,
                        percent: '26%'
                    },
                    {
                        name: '语音',
                        value: 50.35,
                        percent: '6%'
                    }
                ],
                sum: {
                    // name: ['总金额(元)'],
                    number: 0
                }
            }
        ],
    };

    return option;
};

export const getOps7 = () => {
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

                data: ["23d融合", "3D目标", "2D人脸", "OCR识别", "长沙话", "AL文本识别"],
            },
        ],
        yAxis: [
            {
                type: "value",
                //   name: "人数",
                axisLabel: {
                    formatter: "{value}",
                },
            },
        ],

        series: [

            {
                barWidth: 20,
                color: [
                    "#0E42D2",],
                name: "23d融合",
                type: "bar",
                data: [20, 12, 31, 34, 31, 22],
            },
            {
                color: [
                    "#21CCFF",
                ],
                name: "3D目标检测",
                type: "bar",
                data: [10, 20, 8, 15, 13, 12],
            },
            {
                color: [
                    "#3381FF",
                ],
                name: "2D人脸检测",
                type: "bar",
                data: [30, 30, 30, 32, 28, 12],
            },
            {
                color: [
                    "#846BCE",
                ],
                name: "OCR识别",
                type: "bar",
                data: [23, 12, 23, 21, 20.5, 32],
            },
            {
                color: ["#86DF6C",
                ],
                name: "长沙话转普通话",
                type: "bar",
                data: [28, 18, 12, 13, 11, 32],
            },
        ],
    };
};


export const getOps8 = () => {
    const option = {
        graphic: [
            {
                type: "group",
                left: "44%",
                top: "50%",
                children: [
                    {
                        type: "text",
                        style: {
                            fill: "#1D2129",
                            text: "项目进度",
                        },

                    },
                ],
            },
        ],
        legend: {
            show: true,
            icon: 'circle',
            right: '3%',
            left: 'center',
            bottom: '1%',
            itemWidth: 10,
            itemStyle: {
                borderColor: 'none',
            },

            textStyle: {
                rich: {
                    name: {
                        color: '#606266',
                        fontSize: 14,
                    },
                    percentage: {
                        color: '#606266',
                        fontSize: 16,
                        padding: [0, 0, 0, 30],
                        align: 'right',
                    },
                },
            },
        },
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
                            data: { percent },
                        } = e;
                        return percent;
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
                data: [
                    {
                        name: '任务总数',
                        value: 228.22,
                        percent: '22%'
                    },
                    {
                        name: '返工验收',
                        value: 269.34,
                        percent: '26%'
                    },
                    {
                        name: '返工质检',
                        value: 44.4,
                        percent: '4%'
                    },
                    {
                        name: '返工标注',
                        value: 448.58,
                        percent: '26%'
                    },
                    {
                        name: '返工统计',
                        value: 50.35,
                        percent: '6%'
                    }
                ],
                sum: {
                    // name: ['总金额(元)'],
                    number: 0
                }
            }
        ],
    };

    return option;
};
