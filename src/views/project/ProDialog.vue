<template>
    <div>
        <el-dialog title="项目配置选项" :visible.sync="openCardDialog">
            <el-form :model="proConfigForm" ref="proConfigRef" size="mini" label-width="120px" :rules="preRules"
                label-position="right">
                <el-form-item v-for="(item, index) in proConfigData" :key="index" :label="'请选择' + item.label">
                    <el-checkbox-group v-model="item.checks">
                        <el-checkbox v-for="(check) in item.dictData" :key="check.dictValue" :label="check.dictValue">{{
                            check.dictLabel
                        }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="openCardDialog = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    name: 'ProDialog',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        // 如果不为空，则为编辑，反之为新增
        dictTypes: {
            type: Array,
            default: () => []
        },
        // 已选择回显
        checkData: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            // 整体的多选框遍历数据
            proConfigData: [],
            // 已选类型的提交数据
            proConfigForm: {},
            // 表单验证规则
            preRules: {},
            initNum: 0
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
        visible: {
            handler: function (val) {
                if (val) {
                    if (this.initNum === 0) {
                        this.initData()
                    }

                }
            }
        }
    },
    methods: {
        initData() {
            this.initNum++
            this.getDicts("project_config").then(async (response) => {
                let result = [];

                result = await Promise.all(

                    response.data.map(async (item) => {

                        return {
                            label: item.dictLabel,
                            value: item.dictValue,
                            dictData: await this.getDicts(item.dictValue)
                        };
                    })
                );
                console.log(result, this.checkData);

                this.proConfigData = result.map(item => {
                    // this.dictTypes.length === 0  为项目新增回显已选择的项目配置
                    let dictTypes = this.dictTypes.length === 0 ? Object.keys(this.checkData) : this.dictTypes
                    let bol = dictTypes.indexOf(item.value) > -1
                    return {
                        ...item,
                        dictData: item.dictData.data,
                        checks: bol ? this.checkData[item.value] : []
                    }

                })

                this.proConfigForm = this.checkData

            });
        },
        confirm() {
            this.proConfigData.forEach(item => {
                this.proConfigForm[item.value] = item.checks
            })
            this.openCardDialog = false
            this.$emit('confirm', this.proConfigForm)
        }
    }
}
</script>
