<template>
  <div class="container">
    <div class="title">
      <span>需求</span>
      <img src="@/assets/icons/marks/close.png" class="icon" />
    </div>
    <div class="handlers">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="需求文档" name="first" style="flex: 1">
          <div class="documents">
            <div class="back">
              <img src="@/assets/icons/marks/back.png" />
              <span>返回</span>
            </div>
            <a :href="`${url}`" target="blank">新窗口中打开</a>
          </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="second" style="flex: 1">
          <div class="documents">
            <div class="back">
              <img src="@/assets/icons/marks/back.png" />
              <span>返回</span>
            </div>
            <a>新窗口中打开</a>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="pdf_container">
      <p class="pdf_title">实例分割项目文档.PDF</p>
      <div class="tools">
          <img src="@/assets/icons/marks/open.png" alt="">
          <img src="@/assets/icons/marks/search.png" @click.stop="nextPage" alt="">
          <div class="page">
            <div style="width: 50px;height: 20px;">
              <el-input size="small" v-model="pageNum" />
            </div>
            <span style="margin: 0 5px;line-height: 20px;vertical-align: middle;">/</span>
            <span style="line-height: 20px;vertical-align: middle;">{{ pageTotalNum }}</span>
          </div>
          <img src="@/assets/icons/marks/next_page.png" @click.stop="nextPage" alt="">
        </div>
        <!-- pdf预览容器 -->
        <div id="demo"></div>
    </div>
  </div>
</template>

<script>
import Pdfh5 from "pdfh5";
import "pdfh5/css/pdfh5.css";
export default {
  components: {
    // pdf,
  },
  data() {
    return {
      activeName: "first",
      url: "http://storage.xuetangx.com/public_assets/xuetangx/PDF/PlayerAPI_v1.0.6.pdf",
      pageNum: 1,
      pageTotalNum: 1,
      pageRotate: 0,
      // 加载进度
      loadedRatio: 0,
      curPageNum: 0,
    };
  },
  methods: {
    /**
     * 实例化pdfh5
     */
    createPDFView() {
      this.pdfh5 = new Pdfh5("#demo", {
        pdfurl: this.url,
      // cMapUrl:"https://unpkg.com/pdfjs-dist@3.8.162/cmaps/",
      // responseType: "blob" // blob arraybuffer
      });
      //监听完成事件
      this.pdfh5.on("complete", function (status, msg, time) {
      console.log("状态：" + status + "，信息：" + msg + "，耗时：" + time + "毫秒，总页数：" + this.totalNum)
      //禁止手势缩放
      // this.pdfh5.zoomEnable(false);
      })
    },
    handleClick() {},
    // 上一页函数，
    prePage() {
      var page = this.pageNum;
      page = page > 1 ? page - 1 : this.pageTotalNum;
      this.pageNum = page;
    },
    // 下一页函数
    nextPage() {
      var page = this.pageNum;
      page = page < this.pageTotalNum ? page + 1 : 1;
      this.pageNum = page;
    },
    // 页面顺时针翻转90度。
    clock() {
      this.pageRotate += 90;
    },
    // 页面逆时针翻转90度。
    counterClock() {
      this.pageRotate -= 90;
    },
    // 页面加载回调函数，其中e为当前页数
    pageLoaded(e) {
      this.curPageNum = e;
    },
    // 其他的一些回调函数。
    pdfError(error) {
      console.error(error);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .custom-input input[type="number"] {
  /* 去掉上下箭头 */
  -moz-appearance: textfield; /* Firefox */
  appearance: textfield; /* 标准浏览器 */
}
::v-deep .el-tabs__nav {
  width: 100%;
}
::v-deep .el-tabs__item {
  width: 50%;
  text-align: center;
  background-color: transparent;
}
::v-deep .el-input.el-input--small {
  line-height: 20px;
  height: 20px;
  > .el-input__inner {
    line-height: 20px;
    height: 20px;
  }
}
.title,
.handlers {
  background-color: #fff;
}
.container {
  display: flex;
  flex-direction: column;
}
.pdf_container {
  // height: calc(100% - 174px - 94px - 24px);
  // display: flex;
  // flex-direction: columns;
  flex: 1;
  margin: 12px;
  background-color: #e5e6eb;
  display: flex;
  flex-direction: column;
  .pdf_title {
    display: flex;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    align-self: stretch;
    background-color: #fff;
    margin: 0;
  }
  .tools {
    display: flex;
    padding: 12px 24px;
    justify-content: space-between;
    align-items: center;
    background-color: #C9CDD4;
    .page {
      display: flex;
      align-items: center;
    }
  }
}
.title {
  display: flex;
  height: 60px;
  padding: 0px 12px 0px 24px;
  align-items: center;
  gap: 24px;
  .icon {
    margin-left: auto;
  }
  > span {
    font-size: 16px;
    color: #1d2129;
  }
}
.documents {
  display: flex;
  height: 60px;
  padding: 0px 24px;
  align-items: center;
  gap: 24px;
  > a {
    margin-left: auto;
    color: #3382ff;
  }
  .back {
    display: flex;
    align-items: center;
    > span {
      margin-left: 10px;
      cursor: pointer;
    }
  }
}
#demo {
  flex: 1
}
</style>
