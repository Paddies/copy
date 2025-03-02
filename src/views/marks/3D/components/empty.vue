<template>
    <div class="center">
        <img src="@/assets/images/empty3D.png" alt="" />
        <span class="txt">暂无{{ text }}</span>
    </div>
</template>

<script>
export default {
    name: 'empty',
    props: {
        text: {
            type: String,
            default: '对象'
        }
    },
    data() {
        return {

        }
    }
}
</script>

<style lang="scss" scoped>
.center {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .txt {
        color: #86909C;
        font-size: 14px;
    }
}
</style>