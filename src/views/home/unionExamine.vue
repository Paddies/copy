<template>
    <div class="layout-container">
        <HeaderTabtar :current="2"></HeaderTabtar>
        <div class="content">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item :to="{ path: '/' }">工会</el-breadcrumb-item>
                <el-breadcrumb-item><a href="/">创建工会</a></el-breadcrumb-item>
                <el-breadcrumb-item>创建个人工会</el-breadcrumb-item>
                <el-breadcrumb-item>审核状态</el-breadcrumb-item>
            </el-breadcrumb>
            <div class="examine">
                <div class="examine-center">
                    <img src="../../assets/images/Frame244.png" alt="">
                    <p>申请提交成功</p>
                    <span>您的申请已提交，平台会在三个工作日内审核提交</span><br>
                    <el-button type="primary">我知道了</el-button>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script>
import HeaderTabtar from "./components/HeaderTabtar.vue";
import Footer from './components/Footer.vue';
export default {
    components: {
        HeaderTabtar,
        Footer
    },
}
</script>

<style  lang="scss" scoped>
.layout-container {
    width: 100%;
    height: 100vh;
    background-color: #f7f8fa;

    .content {
        width: 1200px;
        margin: 0 auto;
        padding-bottom: 120px;
        margin-top: 20px;
    }

    .examine {
        margin-top: 20px;
        width: 1200px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 700px;
        border-radius: 8px;
        background: var(--color-text-5, #FFF);
    }

    .examine-center {
        width: 500px;
        margin: 100px 100px;
        text-align: center;
        img{
            width: 120px;
            height: 120px;
        }
        button{
            margin-top: 20px;
        }
    }

    p {
        color: var(--unnamed, #3382FF);
        font-family: PingFang SC;
        font-size: 24px;
        font-style: normal;
        font-weight: 400;
        line-height: 32px;
        /* 133.333% */
    }

    span {
        color: var(--color-text-3, #86909C);

        /* 16/CN-Regular */
        font-family: PingFang SC;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        /* 150% */
    }

}
.footer{
position: fixed;
bottom: 0;
left: 0;
right: 0;
}
</style>