<template>
  <div>
    <el-form ref="form" :model="form" statu-icon :rules="rules">
      <el-form-item
        v-for="item in config"
        :key="item.prop"
        :label="item.label"
        :prop="item.prop"
        :required="item.required || false"
        inline
        label-position="right"
        :label-width="labelWidth"
      >
        <el-input
          type="text"
          :placeholder="`请输入${item.label}`"
          v-model="form[item.prop]"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      form: {},
      labelWidth: '100px'
    };
  },
  computed: {
    // 校验规则
    rules() {
      const rules = {};
      this.config.forEach((item) => {
        rules[item.prop] = [
          {
            required: item.required,
            message: `请输入${item.label}`,
            trigger: "blur",
          },
        ];
      });
      return rules;
    },
  },
  methods: {
    /**
     *@Description: 校验规则
     *@return {Boolean} isValid - 是否通过验证
    */
    submit() {
      let isValid = false;
      this.$refs.form.validate((valid) => {
        // 提交验证
        isValid = valid
      });
      return isValid
    },
    setDefaultValue() {
      this.config.forEach(item => {
        this.$set(this.form, item.prop, item.defaultValue || '')
      })
    }
  },
};
</script>

<style lang="scss" scoped></style>
