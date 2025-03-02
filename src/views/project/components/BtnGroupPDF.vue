<template>
    <div style="display: inline-block">
        <el-dropdown size="mini" @command="(command) => handleCommand(command)">
            <el-button size="mini" type="text">...更多</el-button>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item, index) in btns" :key="index" :command="item.command">
                    <el-button type="text" size="mini" :icon="item.svgIcon"
                        v-if=" status !== '3' &&handleStatus(item.status) && checkPermi(item.permission)">{{ item.text }}</el-button>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!-- <span v-for="(item, index) in btns" :key="index">
            <el-button style="margin-left: 5px;" type="text" size="mini"
                v-if="handleStatus(item.status) && checkPermi(item.permission)" :icon="item.svgIcon"
                @click="handleCommand(item.command)">{{ item.text
                }}</el-button>
        </span> -->

        <!-- 标注完成 -->
        <el-dialog :title="title" :visible.sync="okCheckOpen" width="600px" append-to-body>
            <el-form ref="okCheckForm" :model="okCheckForm" :rules="okcheckrules" label-width="80px">
                <el-form-item label="科目" prop="subject">
                    <!-- <el-input size="mini" v-model="okCheckForm.subject" type="text" placeholder="请填入科目"></el-input> -->
                    <el-select v-model="okCheckForm.subject" size="mini" clearable placeholder="请选择科目" style="width: 100%">
                        <el-option v-for="option in subjectsOptions" :key="option.dictValue" :label="option.dictLabel"
                            :value="option.dictValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="语言" prop="language">
                    <el-select v-model="okCheckForm.language" size="mini" clearable placeholder="请选择语言" style="width: 100%">
                        <el-option v-for="option in languagesOptions" :key="option.dictValue" :label="option.dictLabel"
                            :value="option.dictValue"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年份" prop="pubYear">
                    <el-input v-model="okCheckForm.pubYear" type="text" placeholder="请填入年份" size="mini"
                        style="width: 100%"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="mini" type="primary" @click="subOkCheckForm">确 定</el-button>
                    <el-button size="mini" @click="closeDialog">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { checkPermi } from "@/utils/permission"; // 权限判断函数
import { jobPerBtn, checkPerBtn, waitCheckPDFBtn, waitJobPDFBtn } from "../config/btnpdf.js";
import { receiveJob, receiveCheck } from "@/api/project/job.js"
import { bus } from "@/main";
import {
    groupOkJob,
    pdfJobCheckTask,
    groupDiscardJob,
    groupOpen,
    groupClose,
    groupRelease,
    groupCheckOpen,
    getGroupContentList,
} from "@/api/project/group";
export default {
    name: "BtnGroupPDF",
    props: {
        tabName: {
            type: String,
            default: "",
        },
        row: {
            type: Object,
            default: () => { },
        },
        status: {
            type: String,
            default: "",
        },
    },
    computed: {
        btns() {
            switch (this.tabName) {
                case "task":
                    return this.jobPerBtn;
                case "check":
                    return this.checkPerBtn;
                case "jobWaitTask":
                    return this.waitJobPDFBtn;
                case "CheckWaitTask":
                    return this.waitCheckPDFBtn;
            }
        },
    },
    data() {
        return {
            title: "",
            jobPerBtn,
            checkPerBtn,
            waitCheckPDFBtn,
            waitJobPDFBtn,
            okCheckOpen: false,
            okCheckRow: null,
            okCheckForm: {
                subject: "",
                language: "",
                pubYear: "",
            },

            // 标注完成表单验证
            okcheckrules: {
                subject: [{ required: true, message: "科目不能为空", trigger: "blur" }],
                language: [
                    { required: true, message: "语言不能为空", trigger: "blur" },
                ],
            },
            command: "",
            subjectsOptions: [],
            languagesOptions: [],
        };
    },
    watch: {
        okCheckOpen: {
            handler: function (val) {
                if (val) {
                    if (
                        this.subjectsOptions.length === 0 ||
                        this.languagesOptions.length === 0
                    ) {
                        this.getLabels();
                    }
                }
            },
        },
    },
    methods: {
        checkPermi,
        // 获取字典数据
        getLabels() {
            // 字典-科目
            this.getDicts("group_subject").then((res) => {
                this.subjectsOptions = res.data;
            });
            // 字典-语言
            this.getDicts("group_language").then((res) => {
                this.languagesOptions = res.data;
            });
        },
        // 按钮显隐
        handleStatus(statusArr) {
            let bol = statusArr.some((item) => {
                return item == this.row.groupStatus;
            });
            return bol;
        },
        // 按钮点击
        handleCommand(command) {
            // console.log('command', command);
            this.command = command;
            switch (command) {
                // 标注-标注完成
                case "completeJob":
                    this.okCheckOpen = true;

                    break;
                // 标注-无效任务
                case "discardJob":
                    this.handleDiscardJob();
                    break;
                // 标注-任务清单
                case "jobTaskList":
                    this.toTaskList();
                    break;
                // 标注-参数配置
                case "queryParamsJob":
                    this.toQueryParamsJob();
                    break;
                // 标注-开启分组
                case "openGroup":
                    this.handleOpenGroup();
                    break;
                // 质检完成
                case "completeCheck":
                    this.okCheckOpen = true;
                    this.handleOkForm();
                    break;
                // 质检-任务清单
                case "checkTaskList":
                    this.toTaskList();
                    break;
                // 质检-参数配置
                case "queryParamsCheck":
                    this.toQueryParamsJob();
                    break;
                // 标注-释放
                case "openJob":
                    this.handleGroupRelease();
                    break;
                // 质检-关闭分组
                case "closeCheckGroup":
                    this.okCheckOpen = true;
                    this.handleOkForm();
                    break;
                // 质检-开启分组
                case "openCheckGroup":
                    this.handleOpenCheckGroup();
                    break;
                // 转移
                case "transferJob":
                    this.$emit("transfer", "job");
                    break;
                case "transferCheck":
                    this.$emit("transfer", "check");
                    break;

                case 'receiveCheck':
                    this.receiveCheck();
                    break;
                case 'receiveJob':
                    this.receiveJOb();
                    break;
            }

        },
        receiveCheck() {
            const projectId = this.$route.query.id;
            receiveCheck({ id: this.row.id, projectId: projectId }).then((res) => {
                this.$message.success('领取成功！')
            });
        },
        receiveJOb() {
            receiveJob({ id: this.row.id, groupStatus: 1 }).then((res) => {
                this.$message.success('领取成功！')
            });
        },
        /** 打开三大件弹框 */
        handleOpenDialog() {
            this.okCheckOpen = true;
            this.resetForm("okCheckForm");
        },
        /** 回显三大件 */
        handleOkForm() {
            // 获取回显值
            getGroupContentList({ groupId: this.row.id }).then((res) => {
                this.okCheckForm.subject = res.subject;
                this.okCheckForm.language = res.language;
                this.okCheckForm.pubYear = res.pubYear;
            });
        },

        /** 输入三大件弹框确认事件 */
        subOkCheckForm() {
            this.$refs["okCheckForm"].validate((valid) => {
                if (valid) {
                    let api;
                    switch (this.command) {
                        /** 完成标注 */
                        case "completeJob":
                            api = groupOkJob;
                            break;
                        /** 完成质检 */
                        case "completeCheck":
                            api = pdfJobCheckTask;
                            break;
                        /** 关闭质检分组 */
                        case "closeCheckGroup":
                            api = groupClose;
                            break;
                    }

                    api({
                        id: this.row.id,
                        ...this.okCheckForm,
                    }).then((res) => {
                        this.handleSuccessCallBack();
                    });
                }
            });
        },
        /** 标注-开启任务 */
        handleGroupOpen() {
            groupOpen({ id: this.row.id }).then((res) => {
                this.handleSuccessCallBack();
            });
        },
        /** 无效任务 */
        handleDiscardJob() {
            this.$prompt("请输入无效理由", "理由", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
            }).then(({ value }) => {
                let { id, groupStatus } = this.row;
                groupDiscardJob({ id, groupStatus, reasonDiscard: value }).then(
                    (response) => {
                        this.$message.success("修改成功");
                        this.open = false;
                        bus.$emit("refreshList");
                    }
                );
            });
        },
        /** 跳转任务列表 */
        toTaskList() {
            this.$router.push({
                name: "JobList",
                query: {
                    groupId: this.row.id,
                },
            });
        },
        /** 参数配置 */
        toQueryParamsJob() {
            this.$router.push({
                name: "Content",
                query: {
                    groupId: this.row.id,
                },
            });
        },
        /** 标注-开启分组 */
        handleOpenGroup() {
            groupOpen({ id: this.row.id }).then((res) => {
                this.handleSuccessCallBack();
            });
        },
        /** 质检-关闭分组 */
        handleOpenCheckGroup() {
            groupCheckOpen({ id: this.row.id }).then((res) => {
                this.handleSuccessCallBack();
            });
        },
        /** 释放 */
        handleGroupRelease() {
            groupRelease({ id: this.row.id }).then((res) => {
                this.handleSuccessCallBack();
            });
        },
        /** 关闭弹框 */
        closeDialog() {
            this.resetForm("okCheckForm");
            this.okCheckOpen = false;
        },
        /** 成功之后的回调 */
        handleSuccessCallBack() {
            this.$message.success("操作成功");
            this.resetForm("okCheckForm");
            this.okCheckOpen = false;
            setTimeout(function () {
                bus.$emit("refreshList");
            }, 1000);
        },
    },
};
</script>

<style lang="scss" scoped></style>
