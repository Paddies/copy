<template>
  <div id="modal_setting" class="modal_setting">
    <p class="modal_setting_title">
      <span>标签属性</span>
      <span class="close">
        <i class="el-icon-delete" @click.stop="deleteObject"></i>
        <i class="el-icon-close" @click.stop="closeAttributes"></i>
      </span>
    </p>
    <div id="modal_setting_content">
      <div class="static">
        <p>业务配置</p>
        <p class="static_content">
          <span>X，Y，Z轴</span>
          <span>{{ `${target.position.x.toFixed(2)}，${target.position.y.toFixed(2)}，${target.position.z.toFixed(2)}` }}</span>
        </p>
        <p class="static_content">
          <span>长，宽，高</span>
          <span>{{ `${target.geometry.parameters.height.toFixed(2)}，${target.geometry.parameters.width.toFixed(2)}，${target.geometry.parameters.depth.toFixed(2)}`  }}</span>
        </p>
        <!-- <p class="static_content">
          <span>3D框朝向</span>
          <span>1234567890</span>
        </p> -->
      </div>
      <div class="static" v-if="type === 'check'">
        <p>
          <span>整体质检</span>
        </p>
        <p>
          <el-radio-group v-model="form.type">
            <el-radio label="3D框不贴合" value="1"></el-radio>
            <el-radio label="3D标注对象不符" value="2"></el-radio>
            <el-radio label="其它" value="3"></el-radio>
          </el-radio-group>
        </p>
      </div>
      <div class="dynamic">
        <p>属性</p>
        <el-form :model="form" size="small">
            <el-form-item label="标签">
                <el-select v-model="form.tag">
                    <el-option label="驾驶员在前框左侧" value="1"></el-option>
                    <el-option label="其他" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="遮挡">
                <el-select v-model="form.cover" placeholder="请选择遮挡">
                    <el-option label="无遮挡" value="1"></el-option>
                    <el-option label="有遮挡" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
            </el-form-item>
            <el-form-item align="right">
                <el-button type="default" size="small">取消</el-button>
                <!-- <el-button type="danger" size="small">删除</el-button> -->
                <el-button type="primary" size="small" @click="save">确认</el-button>
                <el-button type="primary" size="small" v-if="type === 'check'">驳回</el-button>
            </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'mark',
    },
    target: {
      type: Object,
      default: () => {},
    },
    show: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      form: {
        type: null,
        tag: null,
        cover: null,
        remark: null
      },
    };
  },
  methods: {
    deleteObject() {
      this.$emit("delete", this.target);
    },
    closeAttributes() {
      this.$emit("update:show", false);
    },
    save() {
        const obj = Object.assign({}, this.target);
        obj.tagsValue = this.form;
        this.$emit('update:target', obj)
    }
  },
};
</script>

<style lang="scss" scoped>
p {
    margin: 0;
}
#modal_setting {
  width: 300px;
  /* height: 300px; */
  position: absolute;
  top: 0;
  left: 0;
  background-color: #18191c;
  color: #fff;
  line-height: 24px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .modal_setting_title {
    display: flex;
    justify-content: space-between;
    .close {
      font-size: 12px;
      cursor: pointer;
    }
  }
  #modal_setting_content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: #151617;
    gap: 20px;
    > p {
      margin: 0;
    }
    .static_content {
        display: flex;
        gap: 10px;
        line-height: 24px;
        >span:nth-child(1){
            width: 100px;
        }
    }
  }
}
</style>
