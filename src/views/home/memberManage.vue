<template>
    <div class="layout-container">
        <HeaderTabtar :current="2"></HeaderTabtar>
        <div class="content">
            <div class="page-wrap">
                <div class="sidebar white-card">
                    <UnionSiderBar />
                </div>
                <div class="right-content">
                    <div class="white-card">
                        <h2 class="h2 flex-between">
                            <div>
                                会员管理
                            </div>
                        </h2>
                        <div class="container">
                            <div class="left"><el-tree :data="data" :props="defaultProps"
                                    @node-click="handleNodeClick"></el-tree></div>
                            <div class="middle"></div>
                            <div class="right"><el-table :data="tableData" style="width: 100%">

                                    <el-table-column prop="name" label="会员名称">
                                    </el-table-column>
                                    <el-table-column prop="date" label="注册日期">
                                    </el-table-column>
                                    <el-table-column prop="date" label="人会日期">
                                    </el-table-column>
                                    <el-table-column prop="chance" label="合格率">
                                    </el-table-column>
                                    <el-table-column prop="controls" label="操作">
                                        <template slot-scope="scope">
                                            <svg-icon icon-class="user-x" class-name="user-x" />
                                            {{ scope.row.controls }}
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination layout="prev, pager, next" :total="50"
                                    style="float: right;margin-top: 10px;">
                                </el-pagination>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterVue />
        <!-- <Footer></Footer> -->
    </div>
</template>
  
<script>
import FooterVue from './components/Footer.vue';
import HeaderTabtar from "./components/HeaderTabtar.vue";
import UnionSiderBar from "./components/UnionSiderBar.vue";


// import Footer from './components/Footer.vue';
export default {
    components: {
        HeaderTabtar,
        UnionSiderBar,
        FooterVue
    },
    data() {
        return {
            data: [{
                label: '3D点云标注组',
                children: [{
                    label: '3D点云标注员',
                }, {
                    label: '3D点云质检员',
                }]
            }, {
                label: '2D标注项目组',
                children: [{
                    label: '人体拉框',
                }, {
                    label: '2D标注组',
                }]
            }, {
                label: '语音转写组',
                children: [{
                    label: '语音转写',

                }, {
                    label: '长沙话转写',

                }, {
                    label: '语义分割',

                }]
            },
            {
                label: '题目标注组',
                children: [{
                    label: '数学题目标注',

                }, {
                    label: '语文题目标注',

                }, {
                    label: '英语题目标注',

                }]
            }],
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },
            {
                date: '2016-05-02',
                name: '王小虎',
                chance: "80%",
                controls: "移除成员"
            },],
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        };
    },
    methods: {
        handleNodeClick(data) {
            console.log(data);
        }
    }

}
</script>
  
<style lang="scss" scoped>
.white-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    height: 630px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.gray-card {
    background: #f7f8fa;
    border-radius: 4px;
    padding: 20px;
}

.h2 {
    font-size: 24px;
    color: #000;
}

.gray {
    color: #86909c;
}

.content {

    // border: 1px solid #000;
    padding: 24px;
    padding-bottom: 50px;
    background-color: #f6f7f9;

    .page-wrap {
        width: 1200px;
        margin: 0 auto;
        // background: #fff;
        min-height: 1000px;
        display: flex;



        .white-card {
            margin-bottom: 24px;
        }
    }

    .sidebar {
        width: 282px;
        min-height: 500px;
    }

    .right-content {
        width: calc(100% - 282px);
        padding-left: 24px;

        .container {
            display: flex;
            height: 500px;
        }

        .left {
            flex-basis: 30%;
            border-radius: 4px;


            .el-tree {
                // margin: 10px;
                background: var(--color-fill-1, #F7F8FA);

            }

            ::v-deep .el-tree-node__label {
                color: var(--color-text-1, #1D2129);
                text-overflow: ellipsis;
                white-space: nowrap;
                /* 14/CN-Regular */
                font-family: PingFang SC;
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
            }

            ::v-deep .el-tree-node__content {

                height: 35px;
            }

            ::v-deep .el-tree-node__expand-icon {
                font-size: 16px
            }
        }

        .middle {
            flex-basis: 5%;
        }

        .right {
            flex-basis: 65%;

            .slot {
                width: 18px;
                height: 18px;
            }
        }
    }

}
</style>
  