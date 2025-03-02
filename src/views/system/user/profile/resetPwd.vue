<template>
  <div class="cur-input">
    <el-form ref="form" :model="user" :rules="rules" label-width="80px" style="height: 188px;">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
    </el-form-item>
  </el-form>
  <div style="height: 60px;" class="button-bar">
    <el-button type="primary" size="mini" @click="submit" class="button-item">保存</el-button>
      <el-button type="danger" size="mini" @click="close" style="background-color: #3382FF;color: aliceblue;" class="button-item">关闭</el-button>
  </div>

  </div>
</template>

<script>
import { updateUserPwd } from "@/api/system/user";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" }
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateUserPwd(this.user.oldPassword, this.user.newPassword).then(response => {
            this.$modal.msgSuccess("修改成功");
          });
        }
      });
    },
    close() {
      this.$tab.closePage();
    }
  }
};
</script>
<style module lang="scss">

</style>
<style scoped lang="scss">
.button-bar {
  display: flex;
  justify-content: space-between;
  .button-item.button-item.button-item {
    margin-right: 10px;
    width: 48%;
    padding: 0;
    height: 48px;
    // padding: 13px 16px;
    align-items: center;
    border-radius: 4px;
    background: var(--light-fill-2, #f2f3f5);
    border: 0px;
    color: #4e5969;
  }
}
</style>

