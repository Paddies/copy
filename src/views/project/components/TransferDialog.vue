<template>
    <div>
        <el-dialog title="任务转移列表" :visible.sync="openCardDialog">
            <el-row>
                <el-form :model="transferParams" ref="searchForm" inline>
                    <el-col :span="8">
                        <el-form-item prop="nickName" label="用户名">
                            <el-input v-model="transferParams.nickName" placeholder="输入用户名搜索" size="mini"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16" align="right">
                        <el-form-item>
                            <el-button type="primary" size="mini" @click="handleSearch" icon="el-icon-search">搜索</el-button>
                            <el-button type="default" size="mini" @click="resetSearch" icon="el-icon-refresh">重置</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <el-table ref="selectionTable" v-loading="loading" :data="data" header-cell-class-name="all-select"
                height="500">
                <el-table-column type="selection" width="55" fixed>
                    <template slot-scope="scope">
                        <el-radio v-model="userId" :label="scope.row.userId" @change="handleRowChange(scope.row)">{{ ""
                        }}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户编号"></el-table-column>
                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="nickName" label="用户昵称"></el-table-column>
                <el-table-column prop="deptId" label="部门"></el-table-column>
                <el-table-column prop="phonenumber" label="手机号码"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
            </el-table>
            <p></p>
            <el-row>
                <el-col align="right">
                    <el-pagination @size-change="handleTransferSizeChange" @current-change="handleTransferCurrentChange"
                        :current-page="transferParams.pageNum" :page-sizes="[5, 10, 20, 50]"
                        :page-size="transferParams.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="transferParams.total">
                    </el-pagination>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="openCardDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'TransferDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        loading: {
            type: Boolean,
            default: false
        },
        // table  data
        data: {
            type: Array,
            default: () => []
        },
        // 已选择回显
        total: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            userId: null,
            taskNum: 0,
            transferParams: {
                nickName: '',
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
        }
    },
    computed: {
        openCardDialog: {
            get() {
                return this.visible
            },
            set(val) {
                this.$emit('update:visible', val) // openCardDialog改变的时候通知父组件
            }
        }
    },
    watch: {
       
        total(val) {
            this.transferParams.total = val
        }
    },
    methods: {
        handleSearch() {
            this.$emit('list', this.transferParams)
        },
        /** 任务转移弹框重置 */
        resetSearch() {
            this.transferParams.nickName = ''
            this.userId = null
            this.transferParams.pageNum = 1
            this.$emit('list', this.transferParams)
        },
        /** 任务转移弹框分页 pageNum*/
        handleTransferSizeChange(val) {
            this.transferParams.pageNum = val
            this.$emit('list', this.transferParams)
        },
        /** 任务转移弹框分页 pageSize*/
        handleTransferCurrentChange(val) {
            this.transferParams.pageSize = val
            this.$emit('list', this.transferParams)
        },
        /** 选择转移 */
        handleRowChange(row) {
            this.$emit('row', row)
        },
        /** 弹框确认 */
        confirm() {
            this.$emit('confirm')
        }
    }
}
</script>
