<template>
    <div class="layout-container">
      <HeaderTabtar :current="2"></HeaderTabtar>
      <div class="content">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">工会</el-breadcrumb-item>
          <el-breadcrumb-item><a href="/">创建工会</a></el-breadcrumb-item>
          <el-breadcrumb-item>创建企业工会</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="message">
          <div class="message-top">
            <p>企业工会创建</p>
            <div class="message-center">
              <MessageForm></MessageForm>
            </div>
          </div>
          <div class="message-bottom">
            <p>企业公会所有者信息</p>
            <div class="message-center">
              <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="demo-ruleForm"
              >
                <el-form-item label="企业名称" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="营业执照" prop="name">
                   <div>
                      <!-- <span>上传身份证人像面</span><span>上传身份证国徽面</span> -->
                      <img src="@/assets/images/Frame237.png" alt="">
                   </div>
                </el-form-item>
                <el-form-item label="企业联系人" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop="name">
                  <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="通讯地址" prop="region">
                  <el-col :span="7">
                    <el-select
                      v-model="ruleForm.region"
                      placeholder="请选择所属区域"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      v-model="ruleForm.region"
                      placeholder="请选择所属区域"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="7">
                    <el-select
                      v-model="ruleForm.region"
                      placeholder="请选择所属区域"
                    >
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-col>
                  <el-input
                    v-model="ruleForm.name"
                    placeholder="具体街道地址"
                    style="margin-top: 10px"
                  ></el-input>
                </el-form-item>
              
              </el-form>
            </div>
          </div>
          <div style="float: right;margin-top: 30px;">
              <el-button @click="resetForm('ruleForm')">取消</el-button>
              <el-button type="primary" @click="submitForm('ruleForm')">提交申请</el-button>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  </template>
  <script>
  import HeaderTabtar from "./components/HeaderTabtar.vue";
  import Footer from './components/Footer.vue';
  import MessageForm from './components/MessageForm.vue';

  export default {
    components: {
      HeaderTabtar,
      Footer,
      MessageForm
    },
    data() {
      return {
        ruleForm: {
          name: "",
          region: "",
          date1: "",
          date2: "",
          delivery: false,
          type: [],
          resource: "",
          desc: "",
        },
        imageUrl: "",
        rules: {
          name: [
            { required: true, message: "请输入活动名称", trigger: "blur" },
            { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
          ],
          region: [
            { required: true, message: "请选择活动区域", trigger: "change" },
          ],
          type: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个活动性质",
              trigger: "change",
            },
          ],
          resource: [
            { required: true, message: "请选择活动资源", trigger: "change" },
          ],
          desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }],
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$router.push('/home/union/list/unionExamine')
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
     
    },
  };
  </script>
  
  <style  lang="scss" scoped>
  .layout-container {
    width: 100%;
    background-color: #f7f8fa;
  
    .content {
      width: 1200px;
      margin: 0 auto;
      padding-bottom: 120px;
      margin-top: 20px;
    }
  
    .message {
      width: 1200px;
      height: 1250px;
      border-radius: 8px;
      background: var(--color-text-5, #fff);
      padding: 10px;
      margin-top: 20px;
  
      p {
        color: var(--color-text-1, #1d2129);
  
        /* 16/CN-Medium */
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        /* 150% */
      }
  
      .message-top {
        height: 550px;
        border-bottom: 1px solid var(--color-border-1, #f2f3f5);
      }
  
      .message-bottom {
        height: 550px;
        border-bottom: 1px solid var(--color-border-1, #f2f3f5);
      }
  
      .message-center {
        width: 600px;
        margin: 0 auto;
      }
    }
  
    ::v-deep .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
  
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
  
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 118px;
      height: 118px;
      line-height: 118px;
      text-align: center;
    }
  
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  
    ::v-deep .el-textarea__inner {
      width: 100%;
      height: 130px;
    }
    .el-col {
      margin-right: 20px;
    }
    
     
  }
  </style>