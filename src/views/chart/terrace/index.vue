<template>
    <div class="container">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="line"></span>
                <span>用户维度数据统计</span>
            </div>

            <div class="bottom-list">
                <!-- <el-row style="width:100%">
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple">用户总数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">质检员数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple">标注员数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">项目经理</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">开发人员数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">测试人员数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">管理员数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">添加用户角色</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">静态角色数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">静态角色数</div>
                    </el-col>
                    <el-col :xs="8" :sm="6" :md="4" :lg="2" :xl="1">
                        <div class="grid-content bg-purple-light">静态角色数</div>
                    </el-col>
                </el-row> -->
                <div style="background: #f9f9f9; display: flex; justify-content: center">
                    <div class="t-b-1">用户总数</div>
                    <div class="t-b-1">质检员数</div>
                    <div class="t-b-1">标注员数</div>
                    <div class="t-b-1">项目经理</div>
                    <div class="t-b-1">开发人员数</div>
                    <div class="t-b-1">测试人员数</div>
                    <div class="t-b-1">管理员数</div>
                    <div class="t-b-1">添加用户角色</div>
                    <div class="t-b-1">静态角色数</div>
                    <div class="t-b-1">普通用户数</div>
                    <div class="t-b-1">演示用户数</div>
                </div>
                <div style="background: #fff; display: flex; justify-content: center">
                    <div class="t-b-2">$ 2500</div>
                    <div class="t-b-2">$ 1600</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                </div>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="line"></span>
                <span>项目总维度数据统计</span>
            </div>

            <div class="bottom-list">
                <div style="background: #f9f9f9; display: flex; justify-content: center">
                    <div class="t-b-1">项目总数</div>
                    <div class="t-b-1">已完成项目</div>
                    <div class="t-b-1">未完成项目数</div>
                    <div class="t-b-1">未开始项目数</div>
                    <div class="t-b-1">开发人员数</div>
                    <div class="t-b-1">OCR项目</div>
                    <div class="t-b-1">题目录入</div>
                </div>
                <div style="background: #fff; display: flex; justify-content: center">
                    <div class="t-b-2">$ 2500</div>
                    <div class="t-b-2">$ 1600</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                </div>
            </div>
        </el-card>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="line"></span>
                <span>任务维度指标统计表</span>
                <div style="float: right">
                    <el-select v-model="value" placeholder="请选择">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </div>
            </div>

            <div class="bottom-list">
                <div style="background: #f9f9f9; display: flex; justify-content: center">
                    <div class="t-b-1">任务总数</div>
                    <div class="t-b-1">任务已完成数</div>
                    <div class="t-b-1">任务未完成数</div>
                    <div class="t-b-1">进行中总数</div>
                    <div class="t-b-1">标注总数</div>
                    <div class="t-b-1">返工总数</div>
                    <div class="t-b-1">质检总数</div>
                    <div class="t-b-1">验收总数</div>
                    <div class="t-b-1">无效数据总数</div>
                    <div class="t-b-1">项目经理数</div>
                    <div class="t-b-1">标注人数</div>
                    <div class="t-b-1">审核人数</div>
                    <div class="t-b-1">质检人数</div>
                    <div class="t-b-1">验收人数</div>
                </div>
                <div style="background: #fff; display: flex; justify-content: center">
                    <div class="t-b-2">$ 2500</div>
                    <div class="t-b-2">$ 1600</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">$ 2500</div>
                    <div class="t-b-2">$ 1600</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                    <div class="t-b-2">2500</div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: "",
            options: [],
        };
    },
};
</script>

<style lang="scss" scoped>
.bg-purple {
    // background: #d3dce6;
}

.grid-content {
    // padding: 5px 10px;
    border: 1px solid #d3dce6;
}

.container {
    margin: 20px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both;
}

.box-card {
    width: 100%;
    margin-bottom: 20px;

    span {
        display: inline-block;
        vertical-align: middle;
    }

    .line {
        width: 3px;
        height: 16px;
        background: #409eff;
        margin-right: 5px;
    }
}

.bottom-list .t-b-1 {
    border: 1px solid #f0f0f0;
    width: 20%;
    height: 50px;
    font-size: 14px;
    text-align: center;
    line-height: 50px;
}

.bottom-list .t-b-2 {
    border: 1px solid #f0f0f0;
    width: 20%;
    height: 50px;
    text-align: center;
    line-height: 50px;
}
</style>
