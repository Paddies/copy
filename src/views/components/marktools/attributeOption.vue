<template>
    <div class="wrap" :style="{top: attr.y + 'px', left: attr.x + 'px'}">
        <!-- <span>attribute option {{ attr.x, attr.y }}</span> -->
    </div>
</template>

<script>
export default {
    props: {
        attr: {
            type: Object,
            default: () => {
                return {
                    x: 0,
                    y: 0,
                }
            }
        },
        // 是否可操作
        disabled: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    position: absolute;
    top: 0;
}</style>