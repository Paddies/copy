<template>
  <div class="wrap">
    <div class="title">
      <div class="text" v-show="currentView === 'objects'">对象列表</div>
      <div class="text" v-show="currentView === 'Overruled'">驳回列表</div>
      <!-- <i class="el-icon-close" @click="close"></i> -->
    </div>
    <!-- <div class="handlers">
      <div class="handler">
        <div>
          <span>所有分类类目</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div>
          <span>所有标注结果</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
      <div class="handler">
        <span>所有类目属性</span>
        <i class="el-icon-arrow-down"></i>
      </div>
    </div> -->
    <div class="content" id="objList">
      <div class="list">
        <div>
          <svg-icon icon-class="2d-exclamation" class="icon"></svg-icon>
          <span v-show="currentView === 'objects'">当前共有{{ list.length }}个可导出{{ isCheck ? '质检' : '标注' }}对象</span>
          <span v-show="currentView === 'Overruled'">当前共有{{ list.length }}个可导出驳回对象{{ }}</span>

        </div>
      </div>
      <el-collapse v-model="active" accordion @change="changeCollapse">
        <el-collapse-item v-for="(item, i) in list" :key="item.classId" class="item" :class="active === i ? 'active' : ''"
          :name="i">
          <template slot="title">
            <div class="collapse-title">
              <svg-icon v-if="item.isShowDraw" icon-class="2d-eyeopen" class="icon"
                @click.stop="handleShowDrawObj(item)"></svg-icon>
              <svg-icon v-else icon-class="2d-eyeoff" class="icon" @click.stop="handleShowDrawObj(item)"></svg-icon>
              <div class="item-content">
                <svg-icon :icon-class="`2d-${item.figureCode}`" class="icon" :style="{ color: item.color }"></svg-icon>
                <span>#{{ i + 1 }} - {{ item.tagName }} </span>
                <el-button type="text" size="mini" class="reject" @click.stop="reject(item)"
                  v-show="isCheck && currentView === 'objects'" v-hasPermi="['graph:job:rejectTags']">
                  <div @click.stop="$emit('open', item.id)">
                    <svg-icon icon-class="2d-reject" class="icon"></svg-icon>
                    <span>驳回</span>
                  </div>

                </el-button>
              </div>
            </div>
          </template>
          <div class="form">
            <!-- 动态表单 -->
            <dynamic-form :ref="`form_${i}Ref`" :form_data.sync="list[i]" :isCheck="isCheck" :currentView="currentView"
              :jobCheckLogs="list" :configData="configData"></dynamic-form>
          </div>
        </el-collapse-item>
      </el-collapse>

      <el-empty description="暂无对象列表！" v-if="list.length === 0" v-show="currentView === 'objects'"></el-empty>
      <el-empty description="暂无驳回列表！" v-if="list.length === 0" v-show="currentView === 'Overruled'"></el-empty>


    </div>
  </div>
</template>

<script>
import DynamicForm from "./dynamicForm";
export default {
  components: {
    DynamicForm,
  },
  props: {
    isCheck: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: [],
    },
    configData: {
      type: Object,
      default() {
        return {}
      }
    },

    currentView: String,
  },
  data() {
    return {
      active: null,
    };
  },
  methods: {
    close() {
      this.$emit("close");
    },
    // 选择对应的标注对象
    changeCollapse(i) {
      if (typeof i !== "number") return;
      this.active = i;
      this.$emit("choose", this.list[i]);
    },
    // 驳回
    handlereject(obj) {
      this.$emit("reject", obj);
      console.log(obj, "obj");
    },
    // 隐藏框
    handleShowDrawObj(item) {
      item.isShowDraw = !item.isShowDraw
      this.$emit("showDraw", item);
    },
    async scrollToBottom() {
      await this.$nextTick();
      const _dom = document.getElementById('objList')
      _dom.scrollTop = 99999;
    },
    /** 获取表单结果 */
    getFormReslut() {

      let result = this.list.map((item, index) => {
        let bol = this.$refs[`form_${index}Ref`][0].handlevalidate()
        if (bol) {
          return bol
        }
      })
      let isTrue = result.every(item => item === true)
      console.log('👴2024-01-13 00:25:06 objectlist.vue line:126', isTrue)

      if (isTrue) {

        return ''
      } else {
        let bolRes = result.map((item, index) => { if (!item) return index + 1 }).filter(item => item !== undefined)
        return bolRes.join(',')
      }

    },
    openDialog(item) {
      const itemId = item.id // 获取当前点击的对象的 id
      // 发送事件给父组件
      this.$emit('open-dialog', itemId);
      console.log("itemId", itemId);
    }


  },
};
</script>

<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -5px 0 5px -4px rgba(0, 0, 0, 0.1);
}

.title {
  display: flex;
  align-items: center;
  padding: 10px;

  gap: 24px;

  .text {
    flex: 1;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
  }

  i {
    font-size: 16px;
  }
}

.handlers {
  color: #4e5969;
  display: flex;
  flex-direction: column;

  .handler {
    flex: 1;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid var(--color-border-2, #e5e6eb);
    box-sizing: border-box;

    >div {
      flex: 1;
      display: flex;
      align-items: center;
      padding: 12px;
    }

    >div:nth-child(1) {
      border-right: 1px solid #e5e6eb;
      box-sizing: border-box;
    }
  }

  .handler:nth-child(2) {
    padding: 12px;
    border-bottom: 1px solid var(--color-border-2, #e5e6eb);
  }
}

.content {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  position: relative;

  .list {
    display: flex;
    align-items: center;
    position: sticky;
    top: 0;
    background-color: #fff;
    // border-bottom: 1px solid var(--color-border-2, #E5E6EB);
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.05);
    z-index: 1;

    >div {
      display: flex;
      align-items: center;
      flex: 1;
      border-radius: 4px;
      font-size: 14px;
      padding: 8px;
      display: flex;
      gap: 8px;
      color: #3382ff;
      background-color: rgba(51, 130, 255, 0.1);
    }

    .icon {
      font-size: 18px;
    }
  }

  .item {
    width: 100%;
    // display: flex;
    // padding: 12px 12px 12px 24px;
    // gap: 24px;
    // align-items: center;
    font-size: 16px;
    border-bottom: 1px solid var(--color-border-1, #f2f3f5);
    box-sizing: border-box;
    position: relative;
    cursor: pointer;

    .round {
      width: 8px;
      height: 100%;
      border-radius: 4px;
      position: absolute;
      left: -4px;
      top: 0;
      background: var(--color-primary, #0094ff);
    }

    .item-content {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .icon {
      font-size: 24px;
    }

    .reject {
      font-size: 12px;
      color: #f56c6c;
      line-height: 16px;
      margin-left: auto;

      .icon {
        font-size: 14px;
      }
    }
  }

  .item.active {
    background-color: rgba(51, 130, 255, 0.1);
  }

  .collapse-title {
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 24px;
    gap: 12px;
  }
}
</style>
