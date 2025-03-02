<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
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
        <el-form-item label="工会标志" prop="desc">
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
    </el-form>
</template>
<script>
export default {
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
};
</script>
  
<style  lang="scss" scoped>
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
</style>