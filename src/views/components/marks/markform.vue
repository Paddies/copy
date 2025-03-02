<template>
  <div class="box">
    <el-container>
      <el-form ref="form" :mode="form" size="small" label-width="80px" style="width: 100%">
        <el-form-item v-for="item in conf" :key="item.key">
          <template #label>
            <span style="color: #FFF">{{ item.label }}</span>
          </template>
          <el-input v-if="item.type === 'text'" v-model="form[item.key]"></el-input>
          <el-select v-if="item.type === 'select'" v-model="form[item.key]">
            <el-option
              v-for="option in item.options"
              :key="option.value"
              :label="option.name"
              :value="option.value"
            ></el-option>
          </el-select>
          <el-input-number
            v-if="item.type === 'number'"
            v-model="form[item.key]"
            :precision="2"
            :step="0.1"
            :max="9999"
          ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">保存</el-button>
          <el-button type="default">重置</el-button>
        </el-form-item>
      </el-form>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      conf: [
        {
          label: "名称",
          key: "name",
          type: "text",
          required: true,
        },
        {
          label: "活动区域",
          key: "area",
          type: "select",
          required: true,
          options: [
            {
              name: "左上",
              value: "top-left",
            },
            {
              name: "右上",
              value: "top-right",
            },
            {
              name: "右下",
              value: "bottom-right",
            },
            {
              name: "左下",
              value: "bottom-left",
            },
          ],
        },
        {
          label: "长",
          key: "length",
          type: "number",
          required: true,
        },
        {
          label: "宽",
          key: "width",
          type: "number",
          required: true,
        },
      ],
      form: {},
    };
  },
  mounted() {
    this.conf.forEach((item, index) => {
      this.$set(this.form, item.key, '');
    });
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.box {
  // display: flex;
  // justify-content: flex-start;
  // align-items: center;
  // flex-direction: column;
  // background-color: #c0c4cc;
  // padding: 20px 0;
  & .avatar {
    width: 32px;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
