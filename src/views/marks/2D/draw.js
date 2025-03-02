import { fabric } from "fabric";
let lodash_es = require("lodash-es");

import { ref } from "@vue/composition-api";
import { useRefHistory } from "@vueuse/core";

export default {
  ox: null,
  oy: null,
  panning: false,
  strokeWidth: 1,
  strokeColor: "red",
  cornerColor: "red",
  isctrl: false, // 快捷键 ctrl 是否被按下
  isDragging: false, // 鼠标是否被按下
  isMiddleMouse: false, // 鼠标中键是否被按下
  currType: null,
  currentPolygon: null,
  currentPolyline: null,
  canvas: null,
  lineObj: null,
  width: null,
  height: null,
  workspaceEl: null,
  workspace: null,
  option: {},
  downPoint: null,
  upPoint: null,
  // 复制的对象
  _clipboard: null,
  // 克隆的对象
  clonedObj: null,
  // 粘贴次数，一次复制只能粘贴一次
  paseNum: 0,
  // 线条
  lines: [],
  // 多边形点
  circles: [],
  // 多边形的坐标
  polygonPoints: {},
  // 折线坐标
  polygonLinePoints: {},
  // 默认选择
  currentType: "select",
  // 颜色对象
  color: {
    rect: "red",
    polygon: "yellow",
  },
  // 整图
  wholeImg: null,
  // 当前选中对象
  selction: null,
  // 所有矩形及多边形对象坐标
  coordinates: {},
  // 最小宽高
  minWidth: 30,
  init: function (dom, w, h, picture, callback) {
    // 缩小或放大,创建画布使图片完整展示，容器宽度为el-card宽度-40
    // let drawCard = document.getElementById("draw-card");
    // 容器与图片原始宽度比例
    // let ratio = 1;
    const _dom = document.getElementById(dom);
    _dom.style.width = w + "px";
    _dom.style.height = h + "px";
    this.workspaceEl = _dom;
    this.width = w;
    this.height = h;
    this.option = {
      width: w,
      height: h,
    };
    this.currentType = "select"; // 初始化多边形
    this.createCanvas(_dom, picture, callback);
  },
  createCanvas: function (parent, picture, callback) {
    const oldCanvas = parent.querySelector('#canvas');
    if (oldCanvas) {
        parent.removeChild(oldCanvas);
    }
    const _canvas = document.createElement("canvas");
    _canvas.id = "canvas";
    parent.appendChild(_canvas);
    // 使用 fabric 绑定画布
    this.canvas = new fabric.Canvas(_canvas, {
      // 图形缩放为中心缩放
      // centeredScaling: true,
      width: this.width,
      height: this.height,
    });
   
    this.backgroundImage = picture;
    this._initBackground();

    this._initBackgroundImage();

    this._initResizeObserve();

    this._bindWheel();

    this.canvas.on("mouse:down", this.canvasMouseDown.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:up", this.canvasMouseUp.bind(this)); // 鼠标在画布上松开

    setTimeout(() => {
      callback();
    }, 0);
  },

  /** 初始化背景 */
  _initBackground() {
    this.canvas.backgroundImage = "";
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  },
  /** 初始化背景图 */
  _initBackgroundImage() {
    // // 画底图, 动态导入

    fabric.Image.fromURL(
      this.backgroundImage,
      (img) => {
        // console.log(this.canvas.width, this.canvas.height);
        // console.log(img.width, img.height);

        this.wholeImg = img;
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas),
          {
            scaleX: 1,
            scaleY: 1,
            left: 0,
            top: 0,
          }
        );
        // 配置画布区域，超出画布隐藏
        this._initWorkspace(img.width * 1, img.height * 1);
        // this.canvas.requestRenderAll();
      },
      {
        crossOrigin: "anonymous",
      }
    );
  },
  // 初始化画布事件
  _initCanvasEvent() {
    this.canvas.on("selection:created", this.handleSelectedCallBack.bind(this)); // 选中对象
    this.canvas.on("mouse:over", this.canvasMouseEnter.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:out", this.canvasMouseOut.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:move", this.canvasMouseMove.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:dblclick", this.canvasMouseDblclick.bind(this)); // 鼠标在画布上双击
    // this.canvas.on("mouse:wheel", this.canvasMouseWheel.bind(this)); // 滚轮

    this.canvas.on("object:moving", this.handleTransferCallBack.bind(this)); // 对象移动
    // this.canvas.on("object:scaling", this.handleTransferCallBack.bind(this)); // 对象移动
    this.canvas.on("object:modified", this.modifiedHandler.bind(this)); // 对象移动
  },
  // 初始化画布
  _initWorkspace: function (width, height) {
    var workspace = new fabric.Rect({
      fill: "transparent",
      width: width,
      height: height,
      selectable: false,
      id: "workspace",
    });

    workspace.set("selectable", false);
    workspace.set("hasControls", false);
    workspace.hoverCursor = "default";

    this.canvas.add(workspace);
    this.canvas.renderAll();
    this.workspace = workspace;
    workspace.moveTo(0);
    workspace.selectable = false;
    this.auto();
    // 初始化历史记录
    this._initHistory();
  },
  /* 自动缩放 */
  auto() {
    var scale = this._getScale();
    this.setZoomAuto(scale);
  },
  setZoomAuto: function (scale, cb) {
    var _this = this;
    var workspaceEl = this.workspaceEl;
    var width = workspaceEl.offsetWidth;
    var height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    var center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    // 超出画布不展示
    this.workspace.clone(function (cloned) {
      _this.canvas.clipPath = cloned;
      _this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  },
  // 放大
  canvasScalebig: function () {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio
    );
  },
  // 缩小
  canvasScalesmall: function () {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    );
  },
  _getScale: function () {
    var viewPortWidth = this.workspaceEl.offsetWidth;
    var viewPortHeight = this.workspaceEl.offsetHeight;
    // 按照宽度
    if (
      viewPortWidth / viewPortHeight <
      this.option.width / this.option.height
    ) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  },
  setCenterFromObject: function (obj) {
    var canvas = this.canvas;
    var objCenter = obj.getCenterPoint();
    var viewportTransform = canvas.viewportTransform;
    if (
      canvas.width === undefined ||
      canvas.height === undefined ||
      !viewportTransform
    )
      return;
    viewportTransform[4] =
      canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] =
      canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  },
  // 初始化监听器
  _initResizeObserve: function () {
    var _this = this;
    var resizeObserver = new ResizeObserver(
      (0, lodash_es.throttle)(function () {
        _this.auto();
      }, 50)
    );
    resizeObserver.observe(this.workspaceEl);
  },
  // 滚动
  _bindWheel: function () {
    this.canvas.on("mouse:wheel", function (opt) {
      var delta = opt.e.deltaY;
      var zoom = this.getZoom();
      zoom *= Math.pow(0.999, delta);
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      var center = this.getCenter();
      this.zoomToPoint(new fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  },
  /** 获取画布json */
  handleJson() {
    console.log(this.canvas.getObjects());
    let objs = this.canvas.toJSON(["classId", "id", "selectable"]).objects;
    return objs.filter((item) => item.id !== "workspace");
  },
  /** 回显画布 */
  loadFromJSON(obj) {
    console.log(obj);
    obj.objects.forEach((item) => {
      if (item.id === "workspace") {
        item.selectable = false;
      }
    });
    this.canvas.loadFromJSON(obj);

    // var target = this.canvas
    //   .getObjects()
    //   .find((item) => item.id === "workspace");
    //   console.log(target);
    // target.moveTo(0);
    // target.selectable = false;
  },
  canvasMouseDown: function (e) {
    // 判断是否在背景图内点击
    let point = new fabric.Point(e.e.offsetX, e.e.offsetY);
    let bol = this.workspace.containsPoint(point);
    if (!bol) return;

    const enableDrager = sessionStorage.getItem("enableDrager"); // 页面是否开启了拖拽模式 0位开启，1开启
    if (enableDrager && enableDrager === "0") {
      this.isCtrl = false;
    }
    if (enableDrager && enableDrager === "1") {
      this.isCtrl = true;
    }
    this.isDragging = true;
    if (e.e.ctrlKey) {
      this.isCtrl = true;
    }

    if (this.isCtrl) {
      this.currentType = "select";
    }
    // 右侧菜单列表
    switch (this.currentType) {
      // 选取
      case "select":
        this.handleSelect(true);
        this.canvas.selection = true; // 允许框选
        this.canvas.selectionColor = "rgba(100, 100, 255, 0.3)"; // 选框填充色：半透明的蓝色
        this.canvas.selectionBorderColor = "rgba(255, 255, 255, 0.3)"; // 选框边框颜色：半透明灰色
        this.canvas.skipTargetFind = false; // 允许选中

        let currObj = this.canvas.getActiveObject();
        if (currObj) {
          document.dispatchEvent(
            new CustomEvent("selectObject", {
              detail: currObj,
            })
          );
        }

        break;
      // 多边形
      case "polygon":
        this.handleSelect(false);
        if (this.currentPolygon === null) {
          this.createPolygon(e);
        } else {
          this.changeCurrentPolygon(e);
        }
        break;
      case "rect":
        this.handleSelect(false);
        break;
      case "polyline":
        this.handleSelect(false);
        if (this.currentPolyline === null) {
          this.createPolyline(e);
        } else {
          this.changeCurrentPolyline(e);
        }
        break;
      // this.canvas.selection = false; // 允许框选
      // case "delObject":
      // deleteObject();
      // this.
      default:
    }

    // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
    this.downPoint = e.absolutePointer;

    this._initCanvasEvent();
  },
  /** 鼠标移入 */
  canvasMouseEnter: function (e) {
    // console.log(e);
  },
  canvasMouseOut: function (e) {
    // console.log(e);
  },
  // 鼠标在画布上移动
  canvasMouseMove: function (e) {
    // console.log(e);
    // 定义变量记录最后一次的偏移量和缩放比例
    const relationship = { x: 0, y: 0, zoom: 1 };
    // ctrl + 单击 可以拖动画布
    // this.isMiddleMouse  鼠标中建拖动画布
    if (((this.isCtrl && this.isDragging) || this.isMiddleMouse) && e && e.e) {
      // padding 表示是否允许拖动画布
      const delta = new fabric.Point(e.e.movementX, e.e.movementY);
      this.canvas.relativePan(delta);
      //累计每一次移动时候的偏移量
      relationship.x += e.e.movementX / relationship.zoom;
      relationship.y += e.e.movementY / relationship.zoom;
    }
    // console.log(relationship);
    if (this.currentType === "polygon" && this.currentPolygon) {
      this.changePolygonBelt(e);
    }

    // 多线段移动
    if (this.currentType === "polyline" && this.currentPolyline) {
      this.changePolylineBelt(e);
    }

    // 辅助线

    // var loc = this.lineObj.windowToCanvas(
    //   this.canvas,
    //   e.e.clientX,
    //   e.e.clientY
    // );
    // console.log("loc", loc);
    // this.lineObj.drawGuidelines(loc.x, loc.y);
  },

  // 鼠标在画布上松开
  canvasMouseUp: function (e) {

    // 判断是否在背景图内点击
    let point = new fabric.Point(e.e.offsetX, e.e.offsetY);
    let bol = this.workspace.containsPoint(point);
    if (!bol) return;

    this.isCtrl = false;
    this.isMiddleMouse = false;
    this.isDragging = false;
    this.upPoint = e.absolutePointer;
    if (this.currentType === "rect") {
      // 松开鼠标左键时，将当前坐标 赋值给 upPoint

      this.canvas.skipTargetFind = true; // 禁止选中
      // 调用 创建矩形 的方法
      console.log("调用 创建矩形 的方法");
      this.createRect();
    }
    if (this.currentType === "keyPoints") {
      this.canvas.skipTargetFind = true; // 禁止选中
      // 调用 圆形 的方法
      console.log("调用 圆形 的方法");
      this.createKeyPoint();
    }
  },
  // 鼠标在画布上双击
  canvasMouseDblclick: function (e) {
    // 判断是否在背景图内点击
    let point = new fabric.Point(e.e.offsetX, e.e.offsetY);
    let bol = this.workspace.containsPoint(point);
    if (!bol) return;

    this.handleFinishDraw(e);
  },

  // 滚轮
  canvasMouseWheel: function (opt) {
    // 判断是否在背景图内点击
    let point = new fabric.Point(opt.e.offsetX, opt.e.offsetY);
    let bol = this.workspace.containsPoint(point);
    if (!bol) return;

    // const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    // let zoom = this.canvas.getZoom(); // 获取画布当前缩放值
    // zoom *= 0.999 ** delta;
    // if (zoom > 20) zoom = 20;
    // if (zoom < 0.01) zoom = 0.01;

    // // 以左上角为原点
    // // this.canvas.setZoom(zoom)

    // // 以鼠标所在位置为原点缩放
    // this.canvas.zoomToPoint(
    //   {
    //     // 关键点
    //     x: opt.e.offsetX,
    //     y: opt.e.offsetY,
    //   },
    //   zoom
    // );
    // opt.e.preventDefault();
    // opt.e.stopPropagation();
  },
  // 通过点击按钮缩放大小
  canvasScaleByBtn() {
    const delta = 0.1; // 点击一次缩放量
    let zoom = this.canvas.getZoom(); // 获取画布当前缩放值
    zoom += delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.zoomToPoint(
      {
        // 关键点
        x: 0,
        y: 0,
      },
      zoom
    );
  },
  /*************** 新建  ************************************ */
  // 创建矩形
  createRect: async function () {
    // 如果点击和松开鼠标，都是在同一个坐标点，不会生成矩形
    if (
      !this.downPoint &&
      !this.upPoint &&
      JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)
    ) {
      return;
    }
    console.log(this.downPoint, this.upPoint);
    // 创建矩形
    // 矩形参数计算（前面总结的4条公式）
    let top = Math.min(this.downPoint?.y, this.upPoint?.y);
    let left = Math.min(this.downPoint?.x, this.upPoint?.x);
    let width = Math.abs(this.downPoint?.x - this.upPoint?.x);
    let height = Math.abs(this.downPoint?.y - this.upPoint?.y);
    // 自定义id
    const classId = new Date().getTime();

    if (width < this.minWidth && height < this.minWidth) {
      return;
    }
    // 矩形对象
    const rect = new fabric.Rect({
      classId,
      type: "rect",
      // 创建矩形所需常规数据
      top,
      left,
      width,
      height,
      selectable: false,
      fill: "transparent", // 填充色：透明
      stroke: this.strokeColor, // 边框颜色：黑色
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true, //元素在缩放后，边框会恢复成最初设置的大小
    });
    rect.selectable = false;

    // 将矩形添加到画布上
    this.canvas.add(rect);
    // this.canvas.setActiveObject(rect);
    // 因为添加矩形对象为异步方法，所以添加延迟处理
    setTimeout(() => {
      // 添加矩形对像到coordinates
      this.coordinates[classId] = [
        { x: rect.left, y: rect.top },
        { x: rect.left + width, y: rect.top },
        { x: rect.left, y: rect.top + height },
        { x: rect.left + width, y: rect.top + height },
      ];
    }, 100);

    // 创建完矩形，清空 this.downPoint 和 this.upPoint。当然，你也可以不做这步。
    this.downPoint = null;
    this.upPoint = null;

    // 显示标签选项
    document.dispatchEvent(
      new CustomEvent("createObject", {
        detail: {
          // 显示dialog
          showDialog: true,
          isShowDraw: true,
          classId,
          tagType: "rect",
          coordinates: [
            { x: rect.left, y: rect.top },
            { x: rect.left + width, y: rect.top },
            { x: rect.left, y: rect.top + height },
            { x: rect.left + width, y: rect.top + height },
          ],
        },
      })
    );
  },

  // 创建圆形
  async createKeyPoint() {
      // 如果点击和松开鼠标，都是在同一个坐标点，不会生成圆形
      if (
          this.downPoint &&
          this.upPoint &&
          JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)
      ) {
          return;
      }
      console.log(this.downPoint, this.upPoint);
      // 计算圆心坐标
      const centerX = (this.downPoint?.x + this.upPoint?.x) / 2;
      const centerY = (this.downPoint?.y + this.upPoint?.y) / 2;
      // 计算半径
      const radius = Math.sqrt(
          Math.pow(this.upPoint?.x - this.downPoint?.x, 2) +
          Math.pow(this.upPoint?.y - this.downPoint?.y, 2)
      ) / 2;

      // 自定义id
      const classId = new Date().getTime();

      if (radius < this.minWidth / 2) {
          return;
      }
      // 圆形对象
      const circle = new fabric.Circle({
          classId,
          type: "circle",
          left: centerX - radius,
          top: centerY - radius,
          radius: radius,
          selectable: false,
          fill: "transparent",
          stroke: this.strokeColor,
          cornerColor: this.cornerColor,
          strokeWidth: this.strokeWidth,
          strokeUniform: true,
      });
      circle.selectable = false;

      // 将圆形添加到画布上
      this.canvas.add(circle).on('added', () => {
          // 添加圆形对像到coordinates
          this.coordinates[classId] = [
              { x: centerX - radius, y: centerY - radius },
              { x: centerX + radius, y: centerY - radius },
              { x: centerX - radius, y: centerY + radius },
              { x: centerX + radius, y: centerY + radius },
          ];

          // 创建完圆形，清空 this.downPoint 和 this.upPoint
          this.downPoint = null;
          this.upPoint = null;

          // 显示标签选项
          document.dispatchEvent(
              new CustomEvent("createObject", {
                  detail: {
                      showDialog: true,
                      isShowDraw: true,
                      classId,
                      tagType: "circle",
                      coordinates: [
                          { x: centerX - radius, y: centerY - radius },
                          { x: centerX + radius, y: centerY - radius },
                          { x: centerX - radius, y: centerY + radius },
                          { x: centerX + radius, y: centerY + radius },
                      ],
                  },
              })
          );
      });
  },

  // 创建多线
  createPolyline: async function (e) {
    console.log("createPolyline", e);
    const currentPoint = e.absolutePointer;
    let currentPolyline = new fabric.Polyline(
      [
        { x: currentPoint.x, y: currentPoint.y },
        { x: currentPoint.x, y: currentPoint.y },
      ],
      {
        fill: "transparent",
        type: "polyline",
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth, // 边框粗细
        objectCaching: false,
        strokeUniform: true,
        selectable: false,
      }
    );

    currentPolyline.selectable = false;
    this.currentPolyline = currentPolyline;
    this.canvas.add(currentPolyline);
  },

  // 选中
  handleSelectedCallBack: function (e) {
    document.dispatchEvent(
      new CustomEvent("selectObject", {
        detail: e,
      })
    );
  },
  // 设置是否可选
  handleSelect(bol) {
    var objects = this.canvas
      .getObjects()
      .filter((item) => item.id !== "workspace");
    for (var i in objects) {
      objects[i].selectable = bol;
    }
    this.canvas.renderAll();
  },
  // 当前操作对象移动变化操作事件
  modifiedHandler: function (evt) {
    var modifiedObject = evt.target;
    let arr = [];
    this.canvas.getObjects().forEach((item) => {
      // console.log("矩形", item.points);
      if (item.classId === modifiedObject.classId) {
        arr.push({
          classId: item.classId,
          data:
            item.type === "rect"
              ? modifiedObject.aCoords
              : modifiedObject.points,
        });

        let data = arr.map((item) => Object.values(item.data));
        // 传值给父页面
        document.dispatchEvent(
          new CustomEvent("externalTransformChanged", {
            detail: {
              id: modifiedObject.classId,
              data,
            },
          })
        );
      }
    });
  },

  // 移动、缩放通信
  handleTransferCallBack: function (e) {},

  // 创建封闭多边形
  createPolygon: function (e) {
    const currentPoint = e.absolutePointer;
    this.currentPolygon = new fabric.Polygon(
      [
        { x: currentPoint.x, y: currentPoint.y },
        { x: currentPoint.x, y: currentPoint.y },
      ],
      {
        fill: "transparent",
        type: "polygon",
        stroke: this.strokeColor, // 边框黑色
        strokeWidth: this.strokeWidth, // 边框粗细
        objectCaching: false, // 当“true”时，对象缓存在另一个画布上。当“false”时，除非必要(clipPath)默认为 true，否则不缓存对象。默认是true
        evented: false, // 当设置为“false”时，对象不能成为事件的目标。所有事件都会通过它传播。
      }
    );
    this.currentPolygon.selectable = false;
    this.canvas.add(this.currentPolygon);
  },
  // esc按键取消未完成的多边形
  cancelPylon() {
    if (this.currentPolygon) {
      this.canvas.remove(this.currentPolygon);
      this.currentPolygon = null;
    } else if (this.currentPolyline) {
      this.canvas.remove(this.currentPolyline);
      this.currentPolyline = null;
    }
    this.canvas.renderAll();
  },
  // 删除未保存标签的元素图形
  handleRemove(classId) {
    const target = this.canvas._objects.find(
      (item) => item.classId === classId
    );
    this.canvas.remove(target);
    this.canvas.renderAll();
  },
  // 修改当前正在创建的多边形
  changeCurrentPolygon(e) {
    const currentPoint = e.absolutePointer;

    let points = this.currentPolygon.points;

    points.push({
      x: currentPoint.x,
      y: currentPoint.y,
    });
    this.canvas.requestRenderAll();
  },
  // 多边形橡皮带
  changePolygonBelt(e) {
    const currentPoint = e.absolutePointer;
    this.polygonPoints = e.absolutePointer;
    let points = this.currentPolygon.points;

    points[points.length - 1].x = currentPoint.x;
    points[points.length - 1].y = currentPoint.y;

    this.canvas.requestRenderAll();
  },
  // 完成多边形绘制
  finishPolygon(e) {
    let currentPolygon = this.currentPolygon;
    if (currentPolygon && currentPolygon.points.length > 3) {
      // 传值e为双击，不传e为空格完成
      const currentPoint = e ? e.absolutePointer : this.polygonPoints;
      let points = this.currentPolygon.points;
      points[points.length - 1].x = currentPoint.x;
      points[points.length - 1].y = currentPoint.y;
      points.pop();
      // points.pop();
      // if (e) {
      //   points.pop();
      //   points.pop();
      // }
      console.log("points", points);
      this.canvas.remove(this.currentPolygon);
      // 自定义id
      const classId = new Date().getTime();
      if (points.length > 3) {
        let polygon = new fabric.Polygon(points, {
          classId,
          type: "polygon",
          stroke: this.strokeColor,
          strokeWidth: this.strokeWidth,
          fill: "transparent",
          selectable: false,
          strokeUniform: true,
        });
        polygon.selectable = false;
        // // 禁止横向缩放
        // polygon.lockScalingX = true;
        // // 禁止竖向缩放

        // polygon.lockScalingY = true;
        // // 禁止旋转
        // polygon.lockRotation = true;

        // let circleList = this.handleCircleList(points);

        this.canvas.add(polygon);

        this.currentPolygon = null;
        this.canvas.requestRenderAll();
        // 变更状态为选取
        // this.currentType = "select"; // 显示标签选项
        document.dispatchEvent(
          new CustomEvent("createObject", {
            detail: {
              // 显示dialog
              isShowDraw: true,
              tagType: "polygon",
              showDialog: true,
              classId,
              coordinates: points,
            },
          })
        );
      }
    } else {
      this.cancelPylon();
    }
  },
  // 修改当前正在创建的折线
  changeCurrentPolyline(e) {
    console.log("changeCurrentPolyline", e);
    const currentPoint = e.absolutePointer;

    let points = this.currentPolyline.points;

    points.push({
      x: currentPoint.x,
      y: currentPoint.y,
    });
    this.canvas.requestRenderAll();
  },
  // 折线橡皮带
  changePolylineBelt(e) {
    const currentPoint = e.absolutePointer;
    this.polygonLinePoints = e.absolutePointer;
    let points = this.currentPolyline.points;

    points[points.length - 1].x = currentPoint.x;
    points[points.length - 1].y = currentPoint.y;

    this.canvas.requestRenderAll();
  },
  // 完成折线绘制
  finishPolyline(e) {
    let currentPolyline = this.currentPolyline;
    if (currentPolyline && currentPolyline.points.length > 3) {
      // 传值e为双击，不传e为空格完成
      const currentPoint = e ? e.absolutePointer : this.polygonLinePoints;
      let points = this.currentPolyline.points;
      points[points.length - 1].x = currentPoint.x;
      points[points.length - 1].y = currentPoint.y;
      points.pop();
      // if (e) {
      //   points.pop();
      //   // points.pop();
      // }

      this.canvas.remove(this.currentPolyline);
      let classId = new Date().getTime();
      let polyline = new fabric.Polyline(points, {
        classId,
        type: "polyline",
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        selectable: false,
        fill: "transparent",
      });
      polyline.selectable = false;
      this.canvas.add(polyline);

      this.currentPolyline = null;

      this.canvas.requestRenderAll();

      // 新增树状列表
      document.dispatchEvent(
        new CustomEvent("createObject", {
          detail: {
            // 显示dialog
            isShowDraw: true,
            tagType: "polyline",
            showDialog: true,
            classId,
            coordinates: points,
          },
        })
      );
    } else {
      this.cancelPylon();
    }
  },
  // 完成绘制
  handleFinishDraw(e) {
    if (this.currentType === "polygon") {
      this.finishPolygon(e);
    } else if (this.currentType === "polyline") {
      this.finishPolyline(e);
    }
  },
  // 取消绘制
  handleCancleDraw() {
    if (this.currentPolygon) {
      this.canvas.remove(this.currentPolygon);
      this.currentPolygon = null;
    } else if (this.currentPolyline) {
      this.canvas.remove(this.currentPolyline);
      this.currentPolyline = null;
    }
    this.canvas.renderAll();
  },
  //撤回绘制
  rejectDraw() {
    // 撤销多边形
    if (this.currentPolygon && this.currentPolygon.length === 1) {
      this.cancelPylon();
    } else {
      this.currentPolygon.points.pop();
      this.canvas.requestRenderAll();
    }
    // 撤销多线段
    if (this.currentPolyline && this.currentPolyline.length === 1) {
      this.cancelPylon();
    } else {
      this.currentPolyline.points.pop();
      this.canvas.requestRenderAll();
    }
  },
  /***************  回显  ************************************ */
  // 根据传入坐标创建矩形
  createRectByPoints(obj) {
    let {
      points,
      classId,
      color,
      fillColor,
      isReject,
      tagWidth,
      tagHeight,
      tagLeft,
      tagTop,
      tagScaleX,
      tagScaleY,
    } = obj;
    const [left, top, width, height] = [
      points[0].x,
      points[0].y,
      points[1].x - points[0].x,
      points[2].y - points[0].y,
    ];
    let newObj =
      tagScaleX && tagScaleY
        ? {
            scaleX: tagScaleX,
            scaleY: tagScaleY,
          }
        : {};
    // 矩形对象
    const rect = new fabric.Rect({
      classId,
      type: "rect",
      isReject,
      top: tagTop ? tagTop : top,
      left: tagLeft ? tagLeft : left,
      width: tagWidth ? tagWidth : width,
      height: tagHeight ? tagHeight : height,
      ...newObj,
      fill: fillColor || "transparent", // 填充色：透明
      stroke: color || this.strokeColor, // 边框颜色：黑色
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true,
    });
    rect.selectable = false;
    // 将矩形添加到画布上
    this.canvas.add(rect);
    this.canvas.requestRenderAll();
  },
  // 根据传入坐标创建多边形
  createPolygonByPoints(obj) {
    let {
      points,
      classId,
      color,
      fillColor,
      isReject,
      tagWidth,
      tagHeight,
      tagLeft,
      tagTop,
      tagScaleX,
      tagScaleY,
    } = obj;
    let newObj = tagWidth
      ? {
          top: tagTop,
          left: tagLeft,
          width: tagWidth,
          height: tagHeight,
          scaleX: tagScaleX,
          scaleY: tagScaleY,
        }
      : {};
    const polygon = new fabric.Polygon(points, {
      classId,
      isReject,
      ...newObj,
      type: "polygon",
      fill: fillColor || "transparent",
      stroke: color || this.strokeColor,
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true,
    });

    polygon.selectable = false;
    // 添加多变形到画布
    this.canvas.add(polygon);
    this.canvas.requestRenderAll();
  },
  // 根据传入坐标创建折线
  createPolylineByPoints(obj) {
    let {
      points,
      classId,
      color,
      fillColor,
      isReject,
      tagWidth,
      tagHeight,
      tagLeft,
      tagTop,
      tagScaleX,
      tagScaleY,
    } = obj;
    let newObj = tagWidth
      ? {
          top: tagTop,
          left: tagLeft,
          width: tagWidth,
          height: tagHeight,
          scaleX: tagScaleX,
          scaleY: tagScaleY,
        }
      : {};
    console.log("createPolylineByPoints", obj);
    const polyline = new fabric.Polyline(points, {
      classId,
      isReject,
      type: "polyline",
      ...newObj,

      fill: fillColor || "transparent",
      stroke: color || this.strokeColor,
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true,
    });
    polyline.selectable = false;
    // 添加多变形到画布
    this.canvas.add(polyline);
    this.canvas.requestRenderAll();
  },
  /** 设置宽高 */
  resizeCanvas(width, height) {
    if (this.canvas) {
      this.canvas.setHeight(height);
      this.canvas.setWidth(width);
      this.canvas.renderAll();
    }
  },
  // 重新设置边框颜色
  resetObjectBorderColor(id, color) {
    const target = this.canvas._objects.find(
      (item) => Number(item.classId) === Number(id)
    );

    if (target) {
      // 使用set方法更改边框颜色属性
      target.set({ stroke: color });
      target.selectable = false;
      // 更新画布
      this.canvas.renderAll();
    }
  },
  // 删除元素
  handleDelete() {
    let targets = this.canvas.getActiveObjects();
    if (targets.length === 0) {
      return;
    }

    let ids = targets
      .filter((item) => item.id !== "workspace")
      .map((item) => item.classId);

    document.dispatchEvent(
      new CustomEvent("delObject", {
        detail: ids,
      })
    );
    // console.log("删除元素", targets, ids);
    // 删除画布元素
    targets.forEach((target) => {
      console.log(target);
      this.canvas.remove(target);
    });

    this.canvas.requestRenderAll();
  },
  /*************** 历史记录  ************************************ */
  _initHistory() {
    this.history = useRefHistory(ref(), {
      capacity: 50,
    });
    console.log("this.history", this.history);
    this.canvas.on({
      "object:added": (event) => this._save(event),
      "object:modified": (event) => this._save(event),
      "selection:updated": (event) => this._save(event),
    });
  },

  getHistory() {
    return this.history;
  },
  _save(event) {
    // console.log("save 过滤选择元素事件", event);
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    const workspace = this.canvas
      .getObjects()
      .find((item) => item.id === "workspace");
    if (!workspace) {
      return;
    }
    // console.log(workspace);
    if (this.history.isTracking.value) {
      let value = this.canvas.toJSON([
        "classId",
        "gradientAngle",
        "selectable",
        "hasControls",
      ]);

      this.history.source.value = value;
    }
  },

  undo() {
    // console.log("undo", this.history.canUndo.value);
    // 撤销多边形
    // if (this.currentPolygon && this.currentPolygon.points.length === 1) {
    //   this.cancelPylon();
    // } else {
    //   this.currentPolygon.oldPoints = this.currentPolygon.points;
    //   this.currentPolygon.points.pop();
    //   this.canvas.requestRenderAll();
    //   return;
    // }
    // if (this.currentPolyline && this.currentPolyline.points.length === 1) {
    //   this.cancelPylon();
    // } else {
    //   this.currentPolyline.points.pop();
    //   this.canvas.requestRenderAll();
    //   return;
    // }
    if (this.history.canUndo.value) {
      this.renderCanvas();
      this.history.undo();
    }
  },

  redo() {
    // 恢复多边形和多线段

    this.history.redo();
    this.renderCanvas();
  },

  renderCanvas() {
    this.history.pause();
    this.canvas.clear();
    this.canvas.loadFromJSON(this.history.source.value, () => {
      this.canvas.renderAll();
      this.history.resume();
    });
  },
};
