<template>
    <div class="form-wrap">
        <el-form :model="form" ref="formRef" :rules="rules" size="mini" label-width="100px" label-position="left">
            <el-form-item v-for="conf in formConfig" :label="conf.label" :key="conf.key" :prop="conf.key">
                <el-input v-if="conf.type === 'input'" :disabled="conf.disabled || isCheck" v-model="form[conf.key]"
                    :placeholder="conf.placeholder"></el-input>
                <el-input v-if="conf.type === 'textarea'" :disabled="conf.disabled || isCheck" v-model="form[conf.key]"
                    :placeholder="conf.placeholder" :rows="4"></el-input>
                <el-select v-if="conf.type === 'select'" v-model="form[conf.key]" :disabled="isCheck"
                    @change="val => updateForm(val, conf.key)">
                    <el-option v-for="item in conf.options" :key="item.dictValue" :label="item.dictLabel"
                        :value="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="错误类型" v-show="currentView === 'Overruled'">
                <!-- <div v-for="item in jobCheckLogs" :key="item.id"> -->
                <span v-for="err in errTypeList" :key="err">{{ err }} </span>
                <!-- </div> -->
            </el-form-item>
            <el-form-item label="错误理由" v-show="currentView === 'Overruled' && form_data.reason">
                <!-- <div v-for="item in jobCheckLogs" :key="item.id"> -->
                <span>{{ form_data.reason }} </span>
                <!-- </div> -->
            </el-form-item>

        </el-form>
    </div>
</template>

<script>
export default {
    props: {
        form_data: {
            type: Object,
            default: () => ({})
        },
        isCheck: {
            type: Boolean,
            default: false
        },
        jobCheckLogs: {
            type: Array,
            default: [],
        },
        currentView: String,
        // 项目配置信息
        configData: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed: {
        // 回显当前对象配置的属性字段
        toolAttribute() {
            let tools = this.configData.tools
            console.log(tools);
            return tools.find(item => item.id === this.form_data.toolConfigId).toolAttribute
        },
        dictData() {
            return this.$store.state.dicts.dicData
        },
        tooAttrs() {
            return this.dictData['tool_attribute']
        },

        attrConfig() {
            let attrs = this.form_data.toolAttribute
            return this.config.filter(item => attrs?.indexOf(item.dict) > -1)
        },

        ocr_reject_reason() {

            return this.dictData['ocr_reject_reason'] || []
        },

        errTypeList() {
            const { reasonIds } = this.form_data
            const { ocr_reject_reason = [] } = this

            return (reasonIds || '').split(',').map(id => {
                const item = ocr_reject_reason.find(item => item.dictValue === id) || {}
                return item.dictLabel
            })

        }


    },
    mounted() {
        this.form = this.form_data
        this.constructFormConfig()
    },
    data() {
        return {
            form: {},
            formConfig: [],
            // 字段初始化配置
            config: [
                {
                    params: 'tagCover', // 2D遮挡
                    dict: 'graph_cover'
                },
                {
                    params: 'cutLevel', // 截断级别
                    dict: 'cut_level'
                }, {
                    params: 'tagCut', // 2D截断
                    dict: 'graph_cut'
                }, {
                    params: 'identifyLevel', // 辨认度
                    dict: 'identify_level'
                },

            ],
            rules: {
                tagCover: [
                    { required: true, message: '请选择遮挡比例', trigger: 'change' }
                ],
                cutLevel: [
                    { required: true, message: '请选择截断级别', trigger: 'change' }
                ],
                tagCut: [
                    { required: true, message: '请选择截断比例', trigger: 'change' }
                ],
                identifyLevel: [
                    { required: true, message: '请选择辨认度', trigger: 'change' }
                ],
                secondaryCategory: [
                    { required: true, message: '请选择标注属性', trigger: 'change' }
                ],
            }
        }
    },
    methods: {
        updateForm(e, key) {
            this.form_data[key] = e
            this.$emit('update:form_data', this.form)
        },
        // 构建当前动态表单属性
        /*
        * 固定参数：classId, color、coordinates、figureCode、figureName、tagCode、tagName、tagType、topicNum
        * 其中：tagCode、figureCode为表单固定展示内容，且不可修改
        * 动态加入的参数：需要根据字典配置获取
        **/
        async constructFormConfig() {
            // form变量加入动态参数
            //   this.toolAttribute  配置的属性
            let { secondDict, secondList } = this.form_data


            // let filterConfig = this.config?.filter(item => this.toolAttribute?.indexOf(item.dict) > -1)
            let filterConfig =  this.toolAttribute.map(item => {
                return {
                    params: item, // 2D遮挡
                    dict: item // graph_cover
                }
            })
            let params = filterConfig?.map(item => {

                return {
                    key: item.params,
                    type: 'select',
                    label: this.tooAttrs?.find(k => k.dictValue === item.dict).dictLabel,
                    disabled: false,
                    options: this.dictData[item.dict],
                    required: true
                }
            })
            // 添加二级属性
            if (secondDict && secondList.length > 0) {
                params.unshift({
                    key: 'secondaryCategory',
                    type: 'select',
                    label: '标注属性',
                    disabled: false,
                    options: secondList,
                    required: true
                })
            }
            this.formConfig = [
                {
                    key: 'figureName',
                    type: 'input',
                    label: '标注工具',
                    disabled: true,
                    required: false
                },
                {
                    key: 'tagName',
                    type: 'input',
                    label: '标注类型',
                    disabled: true,
                    required: false
                },
                ...params,
                {
                    key: 'otherAttributes',
                    type: 'textarea',
                    label: '其他属性',
                    disabled: false,
                    required: false
                }
            ]



        },
        /** 验证表单 */
        handlevalidate() {
            let bol
            this.$refs['formRef'].validate((valid) => {
                bol = valid
            });
            return bol
        }
    }
}
</script>

<style lang="scss" scoped>
.form-wrap {
    padding: 0 12px;
}

::v-deep .el-form {
    border-bottom: none;
}
</style>
