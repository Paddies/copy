<template>
    <div class="app-container common-buttom">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
            <el-form-item label="参数" prop="param">
                <el-input v-model="queryParams.param" placeholder="请输入参数" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="日志级别" prop="infoLog">
                <el-input v-model="queryParams.infoLog" placeholder="请输入日志级别" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="标签" prop="tags">
                <el-input v-model="queryParams.tags" placeholder="请输入标签" clearable @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-table v-if="refreshTable" v-loading="loading" :data="listData">
            <el-table-column type="index" label="序列" ></el-table-column>
            <el-table-column prop="id" label="日志ID" ></el-table-column>
            <el-table-column prop="param" label="参数" ></el-table-column>
            <el-table-column prop="infoLog" label="日志级别" ></el-table-column>
            <el-table-column prop="tags" label="标签"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="cTime" >
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.cTime) }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
            @pagination="getList" />
        </el-dialog>
    </div>
</template>
  
<script>
import { page } from "@/api/system/businessLog";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import "@/assets/scss/commonButtom.scss"; //  css

export default {
    name: "Dept",
    dicts: ['sys_normal_disable'],
    components: { Treeselect },
    data() {
        return {
            // 遮罩层
            loading: true,
            // 显示搜索条件
            showSearch: true,
            // 表格树数据
            listData: [],
            // 部门树选项
            deptOptions: [],
            // 弹出层标题
            title: "",
            total: 0,
            // 是否显示弹出层
            open: false,
            // 是否展开，默认全部展开
            isExpandAll: true,
            // 重新渲染表格状态
            refreshTable: true,
            // 查询参数
            queryParams: {
                deptName: undefined,
                status: undefined
            },
            // 表单参数
            form: {},
        };
    },
    created() {
        this.getList();
    },
    methods: {
        /** 查询部门列表 */
        getList() {
            this.loading = true;
            page(this.queryParams).then(response => {
                this.listData = response.data.content
                this.total = response.data.allNum
                this.loading = false
            });
        },
      
        // 表单重置
        reset() {
            this.form = {
                deptId: undefined,
                parentId: undefined,
                deptName: undefined,
                orderNum: undefined,
                leader: undefined,
                phone: undefined,
                email: undefined,
                status: "0"
            };
            this.resetForm("form");
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.resetForm("queryForm");
            this.handleQuery();
        }
    }
};
</script>
  