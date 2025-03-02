<template>
    <div class="layout-container">
        <HeaderTabtar :current="2"></HeaderTabtar>
        <div class="content">
            <div class="page-wrap">
                <div class="sidebar white-card">
                    <UnionSiderBar />
                </div>
                <div class="right-content">

                    <div class="message-top box-color">
                        <p>企业工会创建</p>
                        <div class="message-center">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                                class="demo-ruleForm">
                                <el-form-item label="工会名称" prop="name">
                                    <el-input v-model="ruleForm.name"></el-input>
                                </el-form-item>
                                <el-form-item label="所属区域" prop="region">
                                    <el-col :span="12">
                                        <el-select v-model="ruleForm.region" placeholder="请选择所属区域">
                                            <el-option label="区域一" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-select v-model="ruleForm.region" placeholder="请选择所属区域">
                                            <el-option label="区域一" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="业务领取" prop="resource">
                                    <el-radio-group v-model="ruleForm.resource">
                                        <el-radio label="外语采集"></el-radio>
                                        <el-radio label="文本采集"></el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="工会介绍" prop="desc">
                                    <el-input type="textarea" v-model="ruleForm.desc"></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="message-bottom box-color">
                        <p>企业公会所有者信息</p>
                        <div class="message-center">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px"
                                class="demo-ruleForm">
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
                                        <el-select v-model="ruleForm.region" placeholder="请选择所属区域">
                                            <el-option label="区域一" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="ruleForm.region" placeholder="请选择所属区域">
                                            <el-option label="区域一" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-col :span="7">
                                        <el-select v-model="ruleForm.region" placeholder="请选择所属区域">
                                            <el-option label="区域一" value="shanghai"></el-option>
                                            <el-option label="区域二" value="beijing"></el-option>
                                        </el-select>
                                    </el-col>
                                    <el-input v-model="ruleForm.name" placeholder="具体街道地址"
                                        style="margin-top: 10px"></el-input>
                                </el-form-item>

                            </el-form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterVue />
        <!-- <Footer></Footer> -->
    </div>
</template>
  
<script>
import FooterVue from './components/Footer.vue';
import HeaderTabtar from "./components/HeaderTabtar.vue";
import UnionSiderBar from "./components/UnionSiderBar.vue";


// import Footer from './components/Footer.vue';
export default {
    components: {
        HeaderTabtar,
        UnionSiderBar,
        FooterVue
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
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === "image/jpeg";
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error("上传头像图片只能是 JPG 格式!");
            }
            if (!isLt2M) {
                this.$message.error("上传头像图片大小不能超过 2MB!");
            }
            return isJPG && isLt2M;
        },
    },

}
</script>
  
<style lang="scss" scoped>
.white-card {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
}

.flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.gray-card {
    background: #f7f8fa;
    border-radius: 4px;
    padding: 20px;
}

.h2 {
    font-size: 24px;
    color: #000;
}

.gray {
    color: #86909c;
}

.content {
    padding: 24px;
    padding-bottom: 50px;
    background-color: #f6f7f9;

    .page-wrap {
        width: 1200px;
        margin: 0 auto;
        // background: #fff;
        min-height: 1000px;
        display: flex;



        .white-card {
            margin-bottom: 24px;
        }
    }

    .sidebar {
        width: 282px;
        min-height: 500px;
    }

    .right-content {
        width: calc(100% - 282px);
        padding-left: 24px;

        ::v-deep .el-form-item__label {
            color: var(--color-text-1, #1D2129);
            font-family: PingFang SC;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
        }
    }

    p {
        color: #000;
        font-family: PingFang SC;
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 0px;
    }

    .box-color {
        //   height: 1250px;
        border-radius: 8px;
        background: var(--color-text-5, #fff);
        padding: 15px;
    }

    .message-top {
        overflow: hidden;
        height: 350px;
        border-bottom: 1px solid var(--color-border-1, #f2f3f5);
    }

    .message-bottom {
        margin-top: 20px;
        height: 600px;
        border-bottom: 1px solid var(--color-border-1, #f2f3f5);

        .el-col {
            margin-right: 20px;
        }
    }

    .message-center {
        width: 600px;
        margin: 0 auto;
    }
}
</style>
  