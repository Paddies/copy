<template>
    <div class="ivu-btn-group">
        <el-button-group>
            <!-- <el-tooltip v-if="!isCheck" class="item" effect="dark" content="撤销" placement="top-start">
                <el-button plain @click="$emit('drawEvents', { type: 'revoke' })">
                    <svg-icon icon-class="2d-revoke" class="icon"></svg-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip v-if="!isCheck" class="item" effect="dark" content="恢复" placement="top-start">

                <el-button plain @click="$emit('drawEvents', { type: 'remake' })">
                    <svg-icon icon-class="2d-remake" class="icon"></svg-icon>
                </el-button>
            </el-tooltip> -->
            <el-tooltip class="item" effect="dark" content="还原" placement="top-start">

                <el-button plain @click="$emit('drawEvents', { type: 'home' })">
                    <svg-icon icon-class="exit-fullscreen" class="icon"></svg-icon>
                </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="放大" placement="top-start">

                <el-button plain @click="$emit('drawEvents', { type: 'scale' })">
                    <svg-icon icon-class="fullscreen" class="icon"></svg-icon>
                </el-button>

            </el-tooltip>
            <!-- 2d-error -->
            <el-tooltip v-if="!isCheck" class="item" effect="dark" content="清空" placement="top-start">

                <el-button plain @click="$emit('drawEvents', { type: 'del' })">
                    <svg-icon icon-class="2d-error" class="icon"></svg-icon>
                </el-button>

            </el-tooltip>
        </el-button-group>
    </div>
</template>

<script>
export default {
    name: 'drawTools',
    props: {
        isCheck: {
            type: Boolean,
            default: false
        }
    }

}
</script>

<style lang="scss" scoped>
.ivu-btn-group {
    position: relative;

    vertical-align: middle;

    .ivu-btn {
        font-size: 20px;
        display: inline-block;
    }
}
</style>