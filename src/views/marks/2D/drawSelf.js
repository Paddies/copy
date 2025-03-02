import { fabric } from "fabric";
import { DrawLinePlugin } from "../../../core";
let lodash_es = require("lodash-es");

export default {
  canvas: null,
  classId: new Date().getTime(),
  strokeWidth: 1,
  strokeColor: "red",
  cornerColor: "red",
  isctrl: false, // 快捷键 ctrl 是否被按下
  isDragging: false, // 鼠标是否被按下
  isMiddleMouse: false, // 鼠标中键是否被按下
  currentPolygon: null,
  currentPolyline: null,
  // 画布宽高
  width: null,
  height: null,
  workspaceEl: null,
  workspace: null,
  backgroundImage: "",
  option: {},
  downPoint: null,
  upPoint: null,
  // 多边形的坐标
  polygonPoints: {},
  // 折线坐标
  polygonLinePoints: {},
  // 默认选择
  currentType: "select",
  // 整图
  wholeImg: null,
  // 所有矩形及多边形对象坐标
  coordinates: {},
  // 矩形最小宽高
  minWidth: 30,
  // 是否画线
  drawIng: false,
  drawingObject: {
    type: "roof",
    background: "",
    border: "",
  },
  mouseFrom: {},
  roofPoints: [],
  lines: [],
  lines1: [],
  lines2: [],
  lineCounter: 0,
  roof: null,
  firstx: "",
  firsty: "",
  flag1: null,
  flag2: false,
  flag3: false,
  /************************************ 初始化 ****************************************************** */

  /** 初始化 */
  init: function (dom, w, h, picture, callback) {
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
  /** 创建画布 */
  createCanvas: function (parent, picture, callback) {
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

    this.canvas.on("selection:created", this.handleSelectedCallBack.bind(this)); // 选中对象
    this.canvas.on("mouse:down", this.canvasMouseDown.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:over", this.canvasMouseEnter.bind(this)); // 鼠标在画布上移入
    this.canvas.on("mouse:out", this.canvasMouseOut.bind(this)); // 鼠标在画布上移出
    this.canvas.on("mouse:move", this.canvasMouseMove.bind(this)); // 鼠标在画布上按下
    this.canvas.on("mouse:up", this.canvasMouseUp.bind(this)); // 鼠标在画布上松开
    this.canvas.on("mouse:dblclick", this.canvasMouseDblclick.bind(this)); // 鼠标在画布上双击
    this.canvas.on("mouse:wheel", this.canvasMouseWheel.bind(this)); // 滚轮

    this.canvas.on("object:moving", this.handleTransferCallBack.bind(this)); // 对象移动
    this.canvas.on("object:scaling", this.handleTransferCallBack.bind(this)); // 对象移动
    this.canvas.on("object:modified", this.modifiedHandler.bind(this)); // 对象移动
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
        console.log(this.canvas.width, this.canvas.height);
        console.log(img.width, img.height);

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
  /************************************ 画布操作事件****************************************************** */
  /** 选中 */
  handleSelectedCallBack: function (e) {
    document.dispatchEvent(
      new CustomEvent("selectObject", {
        detail: e,
      })
    );
  },
  /** 画布鼠标按下 */
  canvasMouseDown: function (e) {
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
        this.fabricEventDown(e);
        break;
      case "rect":
        this.handleSelect(false);
        break;
      case "polyline":
        this.handleSelect(false);
        this.fabricEventDown(e);
        break;
      default:
    }

    // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
    this.downPoint = e.absolutePointer;
  },
  /** 鼠标移入 */
  canvasMouseEnter: function (e) {
    // console.log(e);
  },
  /** 鼠标移出 */
  canvasMouseOut: function (e) {
    // console.log(e);
  },
  /**鼠标在画布上移动 */
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

    this.fabricEventMove(e);
  },
  /**鼠标在画布上松开 */
  canvasMouseUp: function (e) {
    this.isCtrl = false;
    this.isMiddleMouse = false;
    this.isDragging = false;
    this.upPoint = e.absolutePointer;
    if (this.currentType === "rect") {
      // 松开鼠标左键时，将当前坐标 赋值给 upPoint

      this.canvas.skipTargetFind = true; // 禁止选中
      // 调用 创建矩形 的方法
      this.createRect();
    }
  },
  /**鼠标在画布上双击 */
  canvasMouseDblclick: function (e) {
    this.handleFinishDraw(e);
  },
  /**画布滚轮 */
  canvasMouseWheel: function (opt) {
    const delta = opt.e.deltaY; // 滚轮，向上滚一下是 -100，向下滚一下是 100
    let zoom = this.canvas.getZoom(); // 获取画布当前缩放值
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;

    // 以左上角为原点
    // this.canvas.setZoom(zoom)

    // 以鼠标所在位置为原点缩放
    this.canvas.zoomToPoint(
      {
        // 关键点
        x: opt.e.offsetX,
        y: opt.e.offsetY,
      },
      zoom
    );
    opt.e.preventDefault();
    opt.e.stopPropagation();
  },
  /**当前操作对象移动变化操作事件 */
  modifiedHandler: function (evt) {},

  /** 当前对象移动、缩放通信 */
  handleTransferCallBack: function (e) {},
  /**通过点击按钮缩放大小 */
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
    console.log("target", target);
    if (target) {
      // 使用set方法更改边框颜色属性
      target.set({ stroke: color });
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
    console.log("删除元素", targets, ids);
    // 删除画布元素
    targets.forEach((target) => {
      console.log(target);
      this.canvas.remove(target);
    });

    this.canvas.requestRenderAll();
  },
  /************************************* 绘制对象  ************************************ */
  // 创建矩形
  createRect: async function () {
    // 如果点击和松开鼠标，都是在同一个坐标点，不会生成矩形
    if (JSON.stringify(this.downPoint) === JSON.stringify(this.upPoint)) {
      return;
    }
    // 创建矩形
    // 矩形参数计算（前面总结的4条公式）
    let top = Math.min(this.downPoint.y, this.upPoint.y);
    let left = Math.min(this.downPoint.x, this.upPoint.x);
    let width = Math.abs(this.downPoint.x - this.upPoint.x);
    let height = Math.abs(this.downPoint.y - this.upPoint.y);
    // 自定义id
    const classId = new Date().getTime();
    // 矩形对象
    const rect = new fabric.Rect({
      classId,
      // 创建矩形所需常规数据
      top,
      left,
      width,
      height,
      fill: "transparent", // 填充色：透明
      stroke: this.strokeColor, // 边框颜色：黑色
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      selectable: false,
      strokeUniform: true, //元素在缩放后，边框会恢复成最初设置的大小
    });

    // 矩形缩放事件
    // rect.on('scaling', this.handleTransferCallBack.bind(this))

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
  // 完成绘制
  handleFinishDraw(e) {
    this.fabricFinishEvent(e);
  },
  // 取消绘制
  handleCancleDraw() {
    this.clearLineObj();
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

  /*************************************  回显  ************************************ */
  // 根据传入坐标创建矩形
  createRectByPoints(points, classId, color) {
    // console.log(points, classId);
    const [left, top, width, height] = [
      points[0].x,
      points[0].y,
      points[1].x - points[0].x,
      points[2].y - points[0].y,
    ];
    // 矩形对象
    const rect = new fabric.Rect({
      classId,
      type: "rect",
      top,
      left,
      width,
      height,
      fill: "transparent", // 填充色：透明
      stroke: color || this.strokeColor, // 边框颜色：黑色
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true,
    });
    // 将矩形添加到画布上
    this.canvas.add(rect);
    this.canvas.requestRenderAll();
  },
  // 根据传入坐标创建多边形
  createPolygonByPoints(points, classId, color) {
    const polygon = new fabric.Polygon(points, {
      classId,
      type: "polygon",
      fill: "transparent",
      stroke: color || this.strokeColor,
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
    });
    // 添加多变形到画布
    this.canvas.add(polygon);
    this.canvas.requestRenderAll();
  },
  // 根据传入坐标创建折线
  createPolylineByPoints(points, classId, color) {
    // console.log("createPolylineByPoints", points, classId, color);
    const polyline = new fabric.Polyline(points, {
      classId,
      type: "polyline",
      fill: "transparent",
      stroke: color || this.strokeColor,
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      strokeUniform: true,
    });
    // 添加多变形到画布
    this.canvas.add(polyline);
    this.canvas.requestRenderAll();
  },
  /*************************************  画线  ************************************ */
  fabricEventDown(e) {
    this.drawIng =
      this.currentType === "polygon" || this.currentType === "polyline";

    const currentPoint = e.absolutePointer;
    this.lines2 = [];
    this.mouseFrom.x = currentPoint.x;
    this.mouseFrom.y = currentPoint.y;
    if (!this.lineCounter) {
      this.firstx = currentPoint.x;
      this.firsty = currentPoint.y;
    }
    let a = {};
    a["x"] = this.mouseFrom.x;
    a["y"] = this.mouseFrom.y;
    this.roofPoints.push(a);
    var points = [a.x, a.y, a.x, a.y];
    var points1 = [this.firstx, this.firsty, a.x, a.y];

    this.lines.push(
      new fabric.Line(points, {
        strokeWidth: this.strokeWidth,
        selectable: false,
        stroke: this.strokeColor,
      })
    );

    this.lines1.push(
      new fabric.Line(points1, {
        strokeWidth: this.strokeWidth,
        selectable: false,
        stroke: this.strokeColor,
      })
    );
    this.lines2.push(
      new fabric.Line(points1, {
        strokeWidth: this.strokeWidth,
        selectable: false,
        stroke: this.strokeColor,
      })
    );
    if (this.lineCounter > 1) {
      var num = this.lines.length - 2;
      // console.log(this.lines);
      // console.log(this.lines[num]);
      this.flag1 = this.lines.some((v) => {
        return this.isIntersect(v, this.lines[num]);
      });
      this.flag3 = this.lines.some((v) => {
        return this.isIntersect(v, this.lines2[0]);
      });
      console.log(this.flag1, this.flag3);
      if (this.flag1 || this.flag3) {
        // this.canvas.off("mouse:dblclick");
        this.lineCounter--;
        this.flag1 = false;
        this.roofPoints.splice(this.roofPoints.length - 1, 1);
        this.canvas.remove(this.lines[num]);

        this.lines.splice(num, 2);
        var point2 = [
          this.lines[this.lines.length - 1].x2,
          this.lines[this.lines.length - 1].y2,
          this.lines[this.lines.length - 1].x2,
          this.lines[this.lines.length - 1].y2,
        ];
        this.lines.push(
          new fabric.Line(point2, {
            strokeWidth: this.strokeWidth,
            selectable: false,
            stroke: this.strokeColor,
          })
        );
        this.lines1[0].set({
          x2: this.lines[this.lines.length - 1].x2,
          y2: this.lines[this.lines.length - 1].y2,
        });
      } else {
        // this.canvas.on("mouse:dblclick");
      }
      let ret = this.lines1.splice(0, 1);
      this.lines1 = [];
      this.lines1.push(...ret);

      this.canvas.add(this.lines[this.lineCounter]);
    } else {
      if (this.lineCounter != 1) {
        this.canvas.add(
          this.lines[this.lineCounter],
          this.lines1[this.lineCounter]
        );
      } else {
        this.canvas.add(this.lines[this.lineCounter]);
      }
    }

    this.lineCounter++;
  },
  fabricEventMove(e) {
    const currentPoint = e.absolutePointer;

    if (this.lines[0] !== null && this.lines[0] !== undefined && this.drawIng) {
      this.x = currentPoint.x;
      this.y = currentPoint.y;
      this.lines[this.lineCounter - 1].set({
        x2: this.x,
        y2: this.y,
      });

      if (this.currentType === "polygon") {
        this.lines1[0].set({
          x2: this.x,
          y2: this.y,
        });
      }

      this.canvas.renderAll();
    }
  },
  fabricFinishEvent(e) {
    this.lines.forEach((item) => this.canvas.remove(item));
    this.lines1.forEach((item) => this.canvas.remove(item));
    this.makeRoof();
    this.canvas.add(this.roof);
    this.canvas.renderAll();

    this.roofPoints = [];
    this.lines = [];
    this.lines1 = [];
    this.lineCounter = 0;
  },
  makeRoof() {
    let left = this.findLeftPaddingForRoof(this.roofPoints);
    let top = this.findTopPaddingForRoof(this.roofPoints);
    if (this.currentType === "polygon") {
      let a = {};
      a["x"] = this.roofPoints[0].x;
      a["y"] = this.roofPoints[0].y;
      this.roofPoints.push(a);
    }
    this.roofPoints.some((v, index) => {
      if (this.lines[this.lines.length - 1].aCoords.bl.x == v.x) {
        this.roofPoints.splice(index, 1);
      }
    });
    console.log(this.classId, this.currentType);
    // 生成图形
    const classId = new Date().getTime();
    let roofObj = {
      classId,
      type: this.currentType,
      stroke: this.strokeColor,
      strokeWidth: this.strokeWidth,
      fill: "transparent",
      left: left,
      top: top,
    };
    if (this.currentType === "polyline") {
      this.roof = new fabric.Polyline(this.roofPoints, roofObj);
    } else if (this.currentType === "polygon") {
      this.roof = new fabric.Polygon(this.roofPoints, roofObj);
    }

    // 通知页面新增数据
    document.dispatchEvent(
      new CustomEvent("createObject", {
        detail: {
          // 显示dialog
          tagType: this.currentType,
          showDialog: true,
          classId,
          coordinates: this.roofPoints,
        },
      })
    );
  },
  findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < this.lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  },
  findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < this.lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  },
  isIntersect(line1, line2) {
    // 转换成一般式: Ax+By = C
    var a1 = line1.y2 - line1.y1;
    var b1 = line1.x1 - line1.x2;
    var c1 = a1 * line1.x1 + b1 * line1.y1;

    //转换成一般式: Ax+By = C
    var a2 = line2.y2 - line2.y1;
    var b2 = line2.x1 - line2.x2;
    var c2 = a2 * line2.x1 + b2 * line2.y1;

    // 计算交点
    var d = a1 * b2 - a2 * b1;
    // 当d==0时，两线平行
    if (d == 0) {
      return false;
    } else {
      var x = (b2 * c1 - b1 * c2) / d;
      var y = (a1 * c2 - a2 * c1) / d;

      // 检测交点是否在两条线段上
      if (
        (this.isInBetween(line1.x1, x, line1.x2) ||
          this.isInBetween(line1.y1, y, line1.y2)) &&
        (this.isInBetween(line2.x1, x, line2.x2) ||
          this.isInBetween(line2.y1, y, line2.y2))
      ) {
        return true;
      }
    }

    return false;
  },
  //如果b在a和c之间，返回true
  //当a==b或者b==c时排除结果，返回false
  isInBetween(a, b, c) {
    // 如果b几乎等于a或c，返回false.为了避免浮点运行时两值几乎相等，但存在相差0.00000...0001的这种情况出现使用下面方式进行避免
    if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
      return false;
    }

    return (a < b && b < c) || (c < b && b < a);
  },
  // 取消绘制,清除所有的线
  clearLineObj() {
    this.lines.forEach((item) => this.canvas.remove(item));
    this.lines1.forEach((item) => this.canvas.remove(item));
    this.roofPoints = [];
    this.lines = [];
    this.lines1 = [];
    this.roof = null;
    this.lineCounter = 0;
  },
};
