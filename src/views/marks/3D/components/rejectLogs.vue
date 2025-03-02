<template>
    <div class="card_list">
        <el-card class="box-card" v-for="(item, index) in list" :key="index">
            <p>
                <span>驳回时间：</span>
                <span class="txt">{{ item.cTime }}</span>
            </p>
            <p>
                <span>驳回人员：</span>
                <span class="txt">{{ item.checkNickName }}</span>
            </p>
            <p>
                <span>驳回原因：</span>
                <span class="txt">{{ item.checkNote }}</span>
            </p>
        </el-card>
    </div>
</template>
  
<script>
export default {
    name: 'rejectLogs',
    props: {
        list: {
            type: Array,
            default() {
                return []
            }
        },

    }
}
</script>
  
<style lang="scss" scoped>

  ::v-deep .el-card__body {
    padding: 16px 33px 24px 32px;
    background: #282A2D;
    color: aliceblue;
}

.card_list {
    max-height: calc(100vh - 300px) !important;
    overflow-y: auto !important;
}

.box-card {
    border: 0px;
    margin: 10px   10px;
}


i {
    font-size: 16px;
}
</style>
  