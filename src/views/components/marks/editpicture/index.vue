<template>
  <div class="draw-container" @click.stop="show = false">
    <div
      id="draw-card"
      style="
        overflow: auto;
        width: 100%;
        height: calc(100vh - 20px);
        background-color: #000;
      "
    >
      <div id="draw"></div>
    </div>
    <div
      v-show="show"
      id="customContextMenu"
      style="
        position: absolute;
        left: 0;
        top: 0;
        transition: opacity 0.3s linear;
      "
    >
      <p @click.stop="handlerClick('select')">
        <b class="el-icon-thumb"></b><span>选取(快捷键：E)</span>
      </p>
      <p @click.stop="handlerClick('rect')">
        <b class="el-icon-full-screen"></b><span>矩形(快捷键：Q)</span>
      </p>
      <p @click.stop="handlerClick('polygon')">
        <b class="el-icon-share"></b><span>多边形(快捷键：W)</span>
      </p>
      <!-- <p v-if="labelType.value" @click.stop="switchTags">
        <b class="el-icon-finished"></b><span>选择标签</span>
      </p> -->
      <!-- <p @click.stop="handlerClick('del')">
        <b class="el-icon-delete"></b><span>删除(快捷键：D)</span>
      </p> -->
      <!-- <p @click.stop="complete"><b class="el-icon-magic-stick"></b><span>完成标注</span></p> -->
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      width="50%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="提示：请选择对应标签类型"
    >
      <el-form :mode="labelType">
        <el-form-item prop="titleType">
          <el-radio-group
            v-model="labelType.value"
            size="mini"
            style="margin-top: 20px"
          >
            <el-radio
              v-for="item in labList"
              :key="item.dictCode"
              :label="item.dictLabel"
              :name="item.dictLabel"
              style="margin-right: 40px; margin-bottom: 20px"
              :style="{ color: item.remark }"
              :fill="item.remark"
              :text-color="item.remark"
            ></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="mini" @click="confirm">确认</el-button>
        <el-button @click="cancel" size="mini">取 消</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script></script>

<script>
import draw from "./draw";
export default {
  name: "editPicture",
  props: {
    coordinates: {
      type: Array,
      default() {
        return [];
      },
    },
    labList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      show: false,
      classId: null,
      dialogVisible: false,
      tagType: "rect",
      labelType: {
        value: "",
      },
      currentPosAttribute: {},
    };
  },
  async mounted() {
    // 监听自定义事件 拉框新建对象
    document.addEventListener("createObject", (event) => {
      if (!this.labelType.value) {
        this.dialogVisible = event.detail.showDialog;
        this.classId = event.detail.classId;
        this.tagType = event.detail.tagType;
        this.currentPosAttribute = {
          ...event.detail,
        };
      } else {
        this.$nextTick(() => {
          this.classId = event.detail.classId;
          this.tagType = event.detail.tagType;
          this.currentPosAttribute = {
            ...event.detail,
          };
          this.confirm();
        });
      }
    });

    // 监听自定义选中事件 获取当前选中的对象
    document.addEventListener("selectObject", (event) => {
      this.classId = event.detail.classId;
    });
    // 监听自定义移动、缩放对象，主要是位置坐标的变化
    document.addEventListener("externalTransformChanged", (event) => {
      let { id, data } = event;
      this.currentPosAttribute.coordinates = data;
      this.currentPosAttribute.classId = id;

      this.$emit("tagValueChange", event.detail);
    });

    // 监听自定义事件删除
    document.addEventListener("delObject", (event) => {
      this.$emit("del", event.detail);
    });

    // 添加右键点击事件监听器
    var targetElement = document.getElementById("draw-card"); // 替换为你的目标元素
    targetElement.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault(); // 阻止默认的浏览器上下文菜单
        this.showContextMenu(e); // 显示自定义菜单
      }.bind(this),
      false
    );

    // 自定义右键菜单也需要阻止右键在上面点击
    var c_dom = document.getElementById("customContextMenu");
    c_dom.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    // 添加鼠标中键监听器
    targetElement.addEventListener("mousedown", function (e) {
      e.preventDefault();
      console.log("mousedown", e.button);
      if (e.button === 1) {
        draw.isMiddleMouse = true;
      }
    }); 

    targetElement.addEventListener("mouseup", function (e) {
      e.preventDefault();
      console.log("mouseup", e.button);
      draw.isMiddleMouse = false;
    });
    // resize
    window.addEventListener(
      "resize",
      () => {
        let width = targetElement.getBoundingClientRect().width;
        let height = targetElement.getBoundingClientRect().height;
        draw.resizeCanvas(width, height);
      },
      false
    );

    this.drawLine();
  },
  methods: {
    drawLine() {
      var drawBox = document.getElementById("draw");
      var ox = document.createElement("div");
      var oy = document.createElement("div");
      ox.style.width = "100%";
      ox.style.height = "1px";
      ox.style.backgroundColor = "pink";
      ox.style.position = "absolute";
      ox.style.left = 0;
      ox.style.zIndex = 99999;
      drawBox.appendChild(ox);
      oy.style.height = "100%";
      oy.style.width = "1px";
      oy.style.backgroundColor = "pink";
      oy.style.position = "absolute";
      oy.style.zIndex = 99999;
      oy.style.top = 0;
      drawBox.appendChild(oy);
      // 鼠标移动
      drawBox.onmousemove = function (e) {
        var e = e || event;
        var x = e.pageX - 8;
        var y = e.pageY - 35 - 8;
        ox.style.top = y + "px";
        oy.style.left = x + "px";
      };
      // 鼠标移入
      drawBox.onmouseover = function () {
        ox.style.display = "block";
        oy.style.display = "block";
      };
      //鼠标移出事件
      drawBox.onmouseout = function () {
        ox.style.display = "none";
        oy.style.display = "none";
      };
    },
    // 切换标签
    switchTags(tag) {
      this.dialogVisible = true;
      this.classId = null;
    },
    cancelPylon() {
      draw.cancelPylon();
    },
    finishPylon() {
      draw.finishPolygon();
    },
    // 点击菜单
    handlerClick(type) {
      this.show = false;
      draw.currentType = type;
      this.tagType = type;
    },
    // 点击标签
    handleTag(args) {
      draw.handleTag(args);
    },
    /** 接收当前选择的标签类型 */
    handleTagType(type) {
      this.labelType.value = type;
    },
    // 显示自定义菜单的函数
    showContextMenu(e) {
      // 获取菜单元素和需要添加右键菜单的目标元素
      const customContextMenu = document.getElementById("customContextMenu");
      this.show = true;
      customContextMenu.style.left = e.pageX + "px";
      customContextMenu.style.top = e.pageY + "px";
      customContextMenu.style.opacity = 1;
    },
    // 获取fabric画板对象
    async getFabricData() {
      await this.$nextTick();
      // console.log(draw.canvas);
      // 根据是否有points属性来判断是什么形状（后面新增标注方式可能需要修改此判断）
      if (draw.canvas._objects && draw.canvas._objects?.length > 0) {
        const coordinates = draw.canvas._objects.reduce((prv, curr) => {
          // 矩形坐标
          if (!curr?.points) {
            prv.push([
              { x: curr.left, y: curr.top },
              { x: curr.left + curr.width, y: curr.top },
              { x: curr.left, y: curr.top + curr.height },
              { x: curr.left + curr.width, y: curr.top + curr.height },
            ]);
          } else {
            // 多边形坐标
            prv.push(curr.points);
          }
          return prv;
        }, []);
        console.log(coordinates);
        this.$emit("get", coordinates);
      } else {
        this.$message.warning("画板没有标注对象！");
        this.$emit("get", []);
      }
    },
    // 点击完成标注
    complete() {
      this.show = false;
      this.getFabricData();
    },
    // 根据传入的坐标创建矩形
    createRectByPoints(points, classId, color) {
      draw.createRectByPoints(points, classId, color);
    },
    // 根据传入的坐标创建多边形
    createPolygonByPoints(points, classId, color) {
      draw.createPolygonByPoints(points, classId, color);
    },
    // 确认选择标签
    confirm() {
      if (this.labelType.value === "") {
        this.$message.warning("请选择标签");
        return;
      }
      this.dialogVisible = false;
      let color = this.labList.find(
        (item) => item.dictLabel === this.labelType.value
      ).remark;

      let { coordinates, classId } = this.currentPosAttribute;
      if (classId) {
        this.$emit("createTag", {
          labelType: this.labelType.value, // 标签类型
          tagType: this.tagType, // 标注类型（矩形、多边形）
          id: classId,
          coordinates: coordinates,
          contentText: "",
          color: color,
        });
      } else {
        // 修改继承标签弹框
        this.$emit("tagSelectedChange", this.labelType.value);
      }
      // this.labelType.value = "";
    },
    // 取消
    cancel() {
      this.dialogVisible = false;
      draw.handleRemove(this.classId);
    },
    // 打开弹框
    open(data) {
      // 编辑当前的框
      this.currentPosAttribute.coordinates = data.coordinates;
      this.currentPosAttribute.classId = data.id;
      this.tagType = data.tagType;

      this.classId = data.id;
      this.labelType.value = data.labelType;
      this.dialogVisible = true;
    },
    // 删除标签
    handleDelTag(data) {
      console.log(data);
    },
  },
};
</script>

<style lang="scss" scoped>
.draw-container {
  padding: 10px 0 10px 10px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  // display: flex;
  // height: 100vh;
  ::v-deep .el-card {
    height: 100%;
    background-color: #000;
    display: flex;
    align-items: center;
  }
}

#draw {
  position: relative;
}

#customContextMenu {
  background-color: #fff;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0px 10px 10px 0px rgba(0, 0, 0, 0.1);
  background-color: #e8f4ff;

  p {
    b {
      font-size: 18px;
      margin: 0 5px 0 0;
    }

    width: 200px;
    line-height: 24px;
    cursor: pointer;
    font-size: 14px;
    padding: 5px 10px;
    margin: 0;
    color: #1890ff;
    transition: all 0.1s linear;
  }

  p:hover {
    background-color: #1890ff;
    color: #fff;
  }
}

// .tags {
//   display: flex;
//   justify-content: flex-start;
//   flex-wrap: wrap;
//   gap: 10px;
//   ::v-deep .el-tag {
//     cursor: pointer;
//   }
// }
</style>
