<template>
  <div class="container">
    <div class="login">
      <div class="login-content">
        <div class="blur-div">
          <img src="@/assets/images/login_view.png" class="login-view">
          <h1 class="login-title">数据综合平台</h1>
          <img src="@/assets/images/login_icon.png" class="login-icon">
          <div class="el-login-footer">
            <span>Copyright © 2018-{{ year }} weiwo.com All Rights Reserved.</span>
          </div>

        </div>
        <div>
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
            <h3 class="title">账号登陆</h3>
            <el-form-item prop="username">
              <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入您的账号">
                <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入您的密码"
                @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input v-model="loginForm.code" auto-complete="off" placeholder="请输入验证码" style="width: 63%"
                @keyup.enter.native="handleLogin">
                <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img" />
              </div>
            </el-form-item>

            <el-form-item style="width:100%;">
              <el-button :loading="loading" size="medium" type="primary"
                style="width:100%; background: var(--unnamed, linear-gradient(90deg, #3382FF 1.75%, #1BADFF 100%));color: aliceblue;"
                @click.native.prevent="handleLogin">
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <div style="float: right;" v-if="register">
                <router-link class="link-type" :to="'/register'">立即注册</router-link>
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
          </el-form>
        </div>
      </div>


    </div>
    <div class="footer">
      <a href="https://beian.miit.gov.cn/" target="_blank">湘ICP备2023027613号-2</a>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'

export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      year: '',
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    this.getCookie();

    let myDate = new Date();
    this.year = myDate.getFullYear()
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove('rememberMe');
          }
          this.$store.dispatch("Login", this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || "/" }).catch(() => { });
          }).catch(() => {
            this.loading = false;
            if (this.captchaEnabled) {
              this.getCode();
            }
          });
        }
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.container {
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  display: flex;
  justify-content: center;
  align-items: center;

  background-size: cover;
}

.footer {

  position: fixed;
  left: 0;
  right: 0;
  bottom: 20px;
  text-align: center;
  color: #fff;

}

.login-content {
  display: flex;

  .blur-div {
    display: flex;
    width: 450px;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    align-self: stretch;
    border-radius: 16px 0px 0px 16px;
    background: linear-gradient(90deg, rgba(51, 130, 255, 0.70) 1.75%, rgba(27, 173, 255, 0.70) 100%);
    backdrop-filter: blur(20px);
    padding-top: 20px;

    .login-view {
      width: 100px;
    }

    .login-title {
      color: #FFF;
      text-align: center;
      font-family: PingFang SC;
      font-size: 28px;
    }

    .login-icon {
      width: 180px;
    }
  }
}

.title {
  margin: 0px auto 30px auto;
  // text-align: center;
  color: #707070;
  color: var(--color-text-2, #4E5969);
  font-family: PingFang SC;
  font-size: 21px;
  font-weight: 600;
}


.login-form {
  border-radius: 0 6px 6px 0;
  background: #ffffff;
  width: 400px;
  padding: 35px 20px 35px 40px;

  .el-input {
    height: 38px;
    border-radius: 4px;
  }

  .el-input__inner {
    height: 38px;

  }


  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 38px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 38px;
  border-radius: 8px;
}
</style>
