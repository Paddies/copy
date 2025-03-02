<template>
  <div>
    <el-dialog title="项目配置选项" :visible.sync="openCardDialog" :before-close="cancel" width="90%">
      <p class="conTitle" v-if="projectType !== '2'">基础配置</p>
      <el-form :model="proConfigForm" ref="proConfigRef" size="mini" label-width="120px" label-position="right">
        <el-form-item label="选择属性" v-if="projectType !== '2'">
          <!-- 表格的表单 -->
          <el-form :ref="`editableForm`" :model="editRow" :rules="preRules">
            <el-table v-if="tableData" :data="tableData" size="mini" style="width: 100%" border
              :cell-class-name="cellClassName" @cell-mouse-enter="handleCellEnter" @cell-mouse-leave="handleCellLeave"
              v-loading="loading">
              <el-table-column v-for="tool in configData" :key="tool.label" :prop="tool.params"
                :width="tool.component === 'color' ? 55 : ''" :label="tool.label">
                <template slot-scope="scope">

                  <el-form-item :prop="tool.params">
                    <!-- 下拉单选 -->
                    <el-select v-if="tool.component === 'select' && tool.params !== 'shortcutKeys'"
                      v-model="scope.row[tool.params]" clearable placeholder="请选择"
                      @change="handleSelect($event, scope.row, tool)"
                      :class="scope.row[tool.params] === '' ? 'error' : ''">
                      <el-option v-for="dict in tool.dictData" :key="dict.dictValue" :label="dict.dictLabel"
                        :value="dict.dictValue" :disabled="dict.disabled">
                      </el-option>
                    </el-select>
                    <!-- 下拉单选快捷键 -->
                    <el-select v-if="tool.component === 'select' && tool.params === 'shortcutKeys'"
                      v-model="scope.row[tool.params]" clearable placeholder="请选择"
                      @change="handleSelect($event, scope.row, tool)"
                      :class="scope.row[tool.params] === '' ? 'error' : ''">
                      <el-option v-for="dict in shortcutOptions" :key="dict.dictValue" :label="dict.dictLabel"
                        :value="dict.dictValue" :disabled="dict.disabled">
                      </el-option>
                    </el-select>
                    <!-- 下拉多选 -->
                    <el-select v-if="tool.component === 'cascader'" multiple v-model="scope.row[tool.params]" clearable
                      placeholder="请选择">
                      <el-option v-for="dict in tool.dictData" :key="dict.dictValue" :label="dict.dictLabel"
                        :value="dict.dictValue">
                      </el-option>
                    </el-select>
                    <!-- 颜色选择器 -->
                    <el-color-picker v-if="tool.component === 'color'" v-model="scope.row[tool.params]"
                      :class="scope.row[tool.params] === '' ? 'error' : ''" style="margin-top: 8px;"></el-color-picker>
                  </el-form-item>

                </template>
              </el-table-column>
              <el-table-column label="操作" width="70">
                <template slot-scope="scope">
                  <el-popconfirm title="确定删除该条配置项吗？" @confirm="handleDelete(scope.$index)">
                    <el-button slot="reference" size="mini" type="text" icon="el-icon-delete"
                      v-if="scope.row.isDel">删除</el-button>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <!-- 表格的表单 -->


          <!-- 新增业务配置 -->
          <p class="addBtn" @click="handleAdd">
            <i class="el-icon-plus"></i>
            <span>新增业务配置</span>
          </p>
        </el-form-item>
        <p class="conTitle">系统配置</p>

        <div v-if="proConfigForm">
          <el-form-item v-for="(item, index) in configForm" :key="index" :label="item.label" v-show="item.isShow">
            <!-- 单选框 -->
            <el-radio-group v-if="item.selectType === 'radio'" v-model="proConfigForm[item.value]"
              @change="handleRadioChange($event, item)">
              <el-radio v-for="radio in item.dictData" :key="radio.dictLabel" :label="radio.dictValue">{{ radio.dictLabel
              }}</el-radio>
            </el-radio-group>
            <!-- 多选框 -->
            <el-checkbox-group v-if="item.selectType === 'checkbox'" v-model="proConfigForm[item.value]">
              <el-checkbox v-for="(checkbox) in item.dictData" :key="checkbox.dictLabel" :label="checkbox.dictValue">{{
                checkbox.dictLabel }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button size="small" type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
    <!-- 属性设置弹框 -->
  </div>
</template>
<script>
import { baseConfig, tables2D, tablsOCR, tables3D } from "./config";
import _ from 'lodash'

export default {
  name: "ProDialogconfig",
  props: {
    // table下拉配置项
    config: {
      type: Object,
      default: () => ({}),
    },
    // 项目类型
    projectType: {
      type: String,
      default: "",
    },
    // 弹框显隐
    visible: {
      type: Boolean,
      default: false,
    },
    // 已选择回显
    checkData: {
      type: Object,
      default: () => ({}),
    },
    // 项目配置回显
    proDetail: {
      type: Object,
      default: () => ({}),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      baseConfig,
      tables2D,
      tables3D,
      tablsOCR,
      // 整体的多选框遍历数据
      proConfigData: [],
      // 已选类型的提交数据
      proConfigForm: {},
      // 表单验证规则
      preRules: {
        tool: [
          { required: true, message: '请选择工具', trigger: 'change' }
        ],
        shortcutKeys: [
          { required: true, message: '请选择快捷键', trigger: 'change' }
        ],
        toolColour: [
          { required: true, message: '请选择颜色', trigger: 'change' }
        ],
        toolTag: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ],
        toolCategory: [
          { required: true, message: '请选择类目', trigger: 'change' }
        ],
        toolAttribute: [
          { required: true, message: '请选择属性', trigger: 'change' }
        ],
      },
      initNum: 0,
      tableData: [],
      configData: [],
      configForm: [],
      // 快捷键下拉列表
      shortcutOptions: [],
      updateForm: {},
      // 当前编辑行
      editRow: {},
      initDataObj: [],
      initNum: 0
    };
  },
  computed: {
    openCardDialog: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val); // openCardDialog改变的时候通知父组件
      },
    },
    isEdit() {
      return Boolean(this.$route.query.id);
    },
    dictData() {
      return this.$store.state.dicts.dicData
    }
  },
  watch: {
    visible: {
      handler: function (val) {
        console.log('val', val);
        if (val) {
          this.initData();
        } else {
          this.tableData = []
        }
      },
    },
    'config.toolsConfig': {
      handler: function (val) {
        if (val) {
          this.configData = val
        }
      },
    },
    'config.formConfig': {
      handler: function (val) {
        if (val) {
          val.forEach(k => {
            k.isShow = k.project.includes(this.projectType)
          })
          this.configForm = val
        }
      },
    }
  },
  mounted() {
    this.configData = this.config.toolsConfig
    this.configForm = this.config.formConfig

  },
  methods: {
    initData() {
      this.initNum++

      if (this.isEdit && this.proDetail.tools.length > 0) {

        let detailData = _.cloneDeep(this.proDetail)
        let formData = JSON.stringify(this.updateForm) !== '{}' ? this.updateForm : detailData;
        let { auto_save, job_extends, job_mode, extends_content, tools, pdf_config, mark_title_type } =
          formData;
        this.tableData = tools;
        this.proConfigForm = {
          auto_save: auto_save[0] ? auto_save[0] : this.baseConfig.auto_save,
          job_extends: job_extends[0]
            ? job_extends[0]
            : this.baseConfig[job_extends],
          job_mode: job_mode[0] ? job_mode[0] : this.baseConfig.job_mode[0],
          extends_content: extends_content
            ? extends_content
            : this.baseConfig[extends_content],
          pdf_config: pdf_config ? pdf_config : this.baseConfig.pdf_config,
          mark_title_type: mark_title_type && mark_title_type[0] ? mark_title_type[0] : this.baseConfig.mark_title_type
        };
      } else {
        // 初始化默认数据
        this.tableData = this.projectType === '5' ? this.tables3D : this.tables2D
        this.tableData.forEach(item => {
          item.isDel = false
        })
        this.proConfigForm = this.baseConfig;
      }

    },
    /** 校验表格数据 */
    validateTable() {
      let obj = this.projectType === '1' ? this.tablsOCR[0] : this.tables2D[0]
      let cloumns = Object.keys(obj)

      let bol = this.tableData.every(item => {
        return cloumns.every(k => item[k] !== '')
      })

      return bol
    },
    // 配置确认事件
    confirm() {
      let { auto_save, job_extends, job_mode, extends_content, pdf_config, mark_title_type } = this.proConfigForm;
      let paramsObj = {
        auto_save: [auto_save],
        job_extends: [job_extends],
        job_mode: [job_mode],
        mark_title_type: [mark_title_type],
        extends_content,
        pdf_config,
      }
      // 确定表头
      if (this.tableData.length === 0) {
        this.updateForm = {
          ...paramsObj,
          tools: []
        }
        this.openCardDialog = false;
        this.$emit("confirm", this.updateForm);
      } else {
        // 配置了表格工具
        // 没有配置表格工具
        let valid = this.validateTable()
        if (valid) {
          this.openCardDialog = false;
          // 这个是操作的弹框的值
          this.updateForm = {
            ...paramsObj,
            tools: this.tableData,
          }
          this.$emit("confirm", this.updateForm);

        } else {
          this.$message.warning('请完善属性配置信息！')
          return false
        }

      }


    },
    resetUpdateForm() {
      this.updateForm = {}
    },
    cancel() {
      this.openCardDialog = false;

    },
    /** 给行列索引赋值 */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      row.index = rowIndex;
      column.index = columnIndex;
    },

    /** 鼠标移入cell */
    handleCellEnter(row) {
      // 快捷键验证
      let codes = this.dictData['shortcut_keys']
      let tableCodes = this.tableData.map(item => item.shortcutKeys)
      this.shortcutOptions = codes.filter(item => tableCodes.indexOf(item.dictValue) === -1)

      // 处理下标问题
      row.isEdit = true;
    },
    /** 鼠标移出cell */
    handleCellLeave(row, column, cell, event) {
      row.isEdit = false;
    },
    /** 设置属性 */
    handleCommand(e) {
      if (e === "edit") {
        // 打开弹框
      }
    },
    /** 表格行删除 */
    handleDelete(index) {

      this.tableData.splice(index, 1);
    },
    /** 表格行添加 */
    handleAdd() {
      this.tableData.push({
        tool: "",
        toolColour: "",
        shortcutKeys: "",
        toolCategory: "",
        toolAttribute: "",
        isDel: true
      });
    },
    handleSelect(event, row, tool) {
      let codes = this.tableData.map((item) => item.shortcutKeys);
      console.log(codes, event, tool.dictData);
      if (tool.params === "shortcutKeys") {
        console.log('shortcutKeys');
      }

      console.log(event, tool);
    },
    /** 单选切换 */
    handleRadioChange(event, item) {
      console.log(item);
      if (item.value === 'job_extends') {
        this.configForm.forEach(o => {
          if (o.value === 'extends_content') {
            this.$nextTick(() => {
              if (event === '2') {
                o.isShow = false
              } else {
                o.isShow = true
              }
            })
          }
        })
      }

    }
  }
};
</script>
<style lang="scss" scoped>
.conTitle {
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
}

.addBtn {
  margin: 0;
  text-align: center;
  display: flex;
  padding: 13px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 0px 0px 4px 4px;
  border-right: 1px solid var(--light-line-2, #e5e6eb);
  border-bottom: 1px solid var(--light-line-2, #e5e6eb);
  border-left: 1px solid var(--light-line-2, #e5e6eb);
  background: var(--light-fill-2, #f2f3f5);
  cursor: pointer;
}

.item {
  width: 100px;

  /* 调整elementUI中样式 如果不需要调整请忽略 */
  .el-input__inner {
    height: 24px !important;
  }
}

.txt {
  line-height: 24px;
  padding: 0 9px;
  box-sizing: border-box;
}

.error {
  border: 1px solid #F56C6C;
  border-radius: 5px;
}

.icon {
  font-size: 20px;
}

.popTitle {
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  margin-left: 20px;
}

.checkStyle {
  margin-left: 60px;

  .el-checkbox {
    display: block;
    margin-bottom: 10px;
  }
}

::v-deep .el-cascader__search-input {
  background: #f2f3f5 !important;
}

.selectItem {
  width: 90%;
  text-align: center;
  line-height: 2;
  cursor: pointer;
}
</style>