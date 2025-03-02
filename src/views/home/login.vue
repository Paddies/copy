<template>
  <div class="layout-container">
    <HeaderTabtar :current="6" :isShowCurr="false"></HeaderTabtar>
    <div class="loginbBody">
      <div
        class="loginDiv"
        :style="{ height: isLogin ? '520px' : '650px' }"
        v-if="showBox"
      >
        <div class="login-main">
          <div @click="toHome()" class="login_text">返回</div>
          <div class="logo">
            <svg-icon
              icon-class="logo"
              style="width: 160px; height: 36px"
              @click="showDemand = !showDemand"
            ></svg-icon>
          </div>

          <h1 class="login-title">{{ isLogin ? "登录" : "注册" }}</h1>
          <!-- 登录表单内容 -->
          <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            v-if="isLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                auto-complete="off"
                placeholder="手机号"
              >
                <i slot="prefix" class="el-icon-mobile-phone" />
              </el-input>
            </el-form-item>
             <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
              @keyup.enter.native="handleLogin">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
            </el-input>
          </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.code"
                placeholder="请输入验证码"
                style="width: 63%"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="validCode"
                  class="el-input__icon input-icon"
                />
              </el-input>
              <el-button
                v-if="!isCountdown"
                type="primary"
                @click="startCountdown"
                style="margin-left: 20px; width: 135px"
                >获取验证码</el-button
              >
              <el-button
                v-else
                type="default"
                style="margin-left: 20px; width: 135px"
                >{{ countdown }}s 后重新获取</el-button
              >
            </el-form-item>
            <el-checkbox
              v-model="loginForm.rememberMe"
              style="margin: 0px 0px 25px 0px"
              >记住密码</el-checkbox
            >
            <el-form-item style="width: 100%">
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width: 100%"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <div>
                <p>
                  还没有注册？<span
                    style="color: #3382ff; cursor: pointer"
                    @click="toggleForm"
                    >立即注册</span
                  >
                </p>
              </div>
            </el-form-item>
          </el-form>
          <!-- 注册表单内容 -->
          <el-form :model="form" ref="form" v-else>
            <el-form-item>
              <el-input v-model="form.phone" placeholder="请输入手机号">
                <i slot="prefix" class="el-icon-mobile-phone"
              /></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="form.password"
                placeholder="请设置密码"
              >
                <i slot="prefix" class="el-icon-lock"
              /></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                type="password"
                v-model="form.confirmPassword"
                placeholder="请再次输入密码"
              >
                <i slot="prefix" class="el-icon-lock" />
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input placeholder="请输入手机号">
                <i slot="prefix" class="el-icon-mobile-phone"
              /></el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="form.code"
                placeholder="请输入验证码"
                style="width: 63%"
              >
                <svg-icon
                  slot="prefix"
                  icon-class="validCode"
                  class="el-input__icon input-icon"
                />
              </el-input>
              <el-button
                v-if="!isCountdown"
                type="primary"
                @click="startCountdown"
                style="margin-left: 20px; width: 135px"
                >获取验证码</el-button
              >
              <el-button
                v-else
                type="default"
                style="margin-left: 20px; width: 135px"
                >{{ countdown }}s 后重新获取</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button
                :loading="loading"
                size="medium"
                type="primary"
                style="width: 100%"
                @click.native.prevent="handleLogin"
              >
                <span v-if="!loading">注册</span>
                <span v-else>注 册 中...</span>
              </el-button>
              <div>
                <p>
                  我已同意并阅读<span
                    style="color: #3382ff; cursor: pointer"
                    @click="toggleForm"
                    >《帷幄科技用户服务协议》</span
                  >
                </p>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";

export default {
  components: {
    HeaderTabtar,
  },
  data() {
    return {
      isLogin: true,
      showBox: true,
      codeUrl: "",
      loginForm: {
        username: "",
         password: "",
        rememberMe: false,
        code: "",
        uuid: "",
      },
      year: "",
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的手机号" },
        ],
          password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }],
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined,
      form: {
        phone: "",
        password: "",
        confirmPassword: "",
        code: "",
      },
      isCountdown: false,
      countdown: 60,
    };
  },
  methods: {
    toggleForm() {
      this.isLogin = !this.isLogin;
    },
    startCountdown() {
      // 获取验证码的逻辑
      console.log("获取验证码");
      this.isCountdown = true;
      let timer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown === 0) {
          clearInterval(timer);
          this.isCountdown = false;
          this.countdown = 60;
        }
      }, 1000);
    },
    submitForm() {
      // 表单提交的逻辑
      console.log("提交表单");
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("表单验证通过，可以提交！");
        } else {
          console.log("表单验证不通过！");
          return false;
        }
      });
    },
    loginFormById(type) {
      if (type == 1) {
        this.isLogin = true;
      } else if (type == 2) {
        this.isLogin = false;
      }
    },
    toHome(){
      this.$router.push("/home");
    }
  },

  //监听参数的变化，如监听路由中id值的变化：
  watch: {
    "$route.query.type": {
      handler(newVal, oldVal) {
        console.log("newVal", newVal);
        this.loginFormById(newVal)
      },
      //判断newVal有没有值监听路由变化
    },
    deep: true,
  },
  mounted() {
    this.loginFormById(this.$route.query.type);
    // console.log(this.$route.query.type);
  },
};
</script >
<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100%;
  // background-color: lightblue;
}

.loginbBody {
  width: 100%;
  height: 100%;
  background-image: url("../../assets/images/login-background.jpg");
  background-size: cover;
  ::v-deep .el-button {
  height: 45px; //高度
  border: 1px solid #94bfff;
}
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -250px;
  width: 500px;
  border-radius: 32px;
  background: #fff;
  backdrop-filter: blur(24px);
  .logo {
    margin-left: 139px;
  }
  p {
    text-align: center;
  }
}

.login-title {
  margin: 20px 0px;
  text-align: center;
}

.login-main {
  padding: 30px;
}
::v-deep .el-input {
  .el-input__inner {
    height: 45px; 
    line-height: 45px; 
    border-radius: 6px;
  }
  i {
    line-height: 45px; 
  }
  svg {
    line-height: 45px; 
  }
}

::v-deep .el-form {
  margin-top: 45px;
}
.login_text{
  cursor: pointer;
  font-size: 15px;
  width: 50px;
  margin: -10px -5px;
}
</style>