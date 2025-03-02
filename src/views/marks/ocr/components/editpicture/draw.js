import { fabric } from "fabric";
// 删除按钮图片 base64
const deleteIcon =
  "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
// 创建删除图片元素
let deleteImg = document.createElement("img");
deleteImg.src = deleteIcon;

// 删除按钮控件
fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5,
  y: -0.5,
  offsetY: -16,
  offsetX: 16,
  cursorStyle: "pointer",
  mouseUpHandler: deleteObject,
  render: renderIcon(deleteImg),
  cornerSize: 24,
});

// 渲染元素的icon按钮
function renderIcon(icon) {
  return function (ctx, left, top, styleOverride, fabricObject) {
    var size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(icon, -size / 2, -size / 2, size, size);
    ctx.restore();
  };
}

// 删除对象
function deleteObject(eventData, transform) {
  var target = transform.target;
  var canvas = target.canvas;

  document.dispatchEvent(
    new CustomEvent("delObject", {
      detail: target.classId,
    })
  );

  canvas.remove(target);
  canvas.requestRenderAll();
}

export default {
  panning: false,
  strokeWidth: 1,
  strokeColor: "red",
  cornerColor: "red",
  isMiddleMouse: false, // 鼠标中建 是否被按下
  isctrl: false, // 快捷键 ctrl 是否被按下
  isDragging: false, // 鼠标是否被按下
  isMiddleMouse: false, // 鼠标中键是否被按下
  // 当前选中对象的classId
  currClassId: null,
  // 当前选中对象
  currSelction: null,
  currType: null,
  currentPolygon: null,
  currentPolyline: null,
  canvas: null,
  width: null,
  height: null,
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
  init: function (dom, w, h, picture, callback) {
    // 缩小或放大,创建画布使图片完整展示，容器宽度为el-card宽度-40
    // let drawCard = document.getElementById("draw-card");
    // 容器与图片原始宽度比例
    // let ratio = 1;
    const _dom = document.getElementById(dom);
    _dom.style.width = w + "px";
    _dom.style.height = h + "px";
    this.width = w;
    this.height = h;
    this.currentType = "select"; // 初始化多边形
    this.createCanvas(_dom, picture, callback);
  },
  // 创建画布
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
    // 画底图, 动态导入
    fabric.Image.fromURL(
      picture,
      (img) => {
        this.wholeImg = img;
        this.canvas.setBackgroundImage(
          img,
          this.canvas.renderAll.bind(this.canvas),
          {
            left: 0,
            top: 0,
            originX: "left",
            originY: "top",
            scaleX: 1, // 将背景图像缩放以适应画布宽度
            scaleY: 1, // 将背景图像缩放以适应画布高度
            crossOrigin: "anonymous",
          }
        );
        // 偏移量
        this.canvas.viewportTransform[4] = (this.width - img.width) / 2;
        this.canvas.viewportTransform[5] = (this.height - img.height) / 2;
        // 缩放量
        // this.canvas.setZoom(this.width/img.width)
        this.canvas.requestRenderAll();
      },
      {
        crossOrigin: "anonymous",
      }
    );

    this.canvas.on("selection:created", this.handleSelectedCallBack.bind(this)); // 选中对象
    this.canvas.on("mouse:down", this.canvasMouseDown.bind(this)); // 鼠标在画布上按下
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
  // 单击
  canvasMouseDown: function (e) {
    console.log(this.currentType);
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

  },
  // 鼠标在画布上移动
  canvasMouseMove: function (e) {
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
  },

  // 鼠标在画布上松开
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
  // 鼠标在画布上双击
  canvasMouseDblclick: function (e) {
    this.handleFinishDraw(e);
  },

  // 滚轮
  canvasMouseWheel: function (opt) {
    opt.e.preventDefault();
    opt.e.stopPropagation();
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
  // 禁止移出画布
  handleCanvasStop() {
    let canvasBoundaries = this.canvas.calcViewportBoundaries();

    let obj = ev.target;

    let objBoundingRect = obj.getBoundingRect();

    if (objBoundingRect.left < canvasBoundaries.tl.x) {
      ev.target.left = canvasBoundaries.tl.x;
    }

    if (objBoundingRect.left + objBoundingRect.width > canvasBoundaries.br.x) {
      ev.target.left = canvasBoundaries.br.x - objBoundingRect.width;
    }

    if (objBoundingRect.top < canvasBoundaries.tl.y) {
      ev.target.top = canvasBoundaries.tl.y;
    }

    if (objBoundingRect.top + objBoundingRect.height > canvasBoundaries.br.y) {
      ev.target.top = canvasBoundaries.br.y - objBoundingRect.height;
    }

    this.canvas.renderAll();
  },
  /*************** 事件  ************************************ */
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

  // 创建多线
  createPolyline: async function (e) {
    const currentPoint = e.absolutePointer;
    let currentPolyline = new fabric.Polyline(
      [
        { x: currentPoint.x, y: currentPoint.y },
        { x: currentPoint.x, y: currentPoint.y },
      ],
      {
        fill: "transparent",
        stroke: this.strokeColor,
        objectCaching: false,
      }
    );
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
    var objects = this.canvas.getObjects();
    for (var i in objects) {
      objects[i].selectable = bol;
      console.log(objects[i].selectable);
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

  // 对象移动、缩放通信
  handleTransferCallBack: function (e) {

  },

  // 创建封闭多边形
  createPolygon: function (e) {
    const currentPoint = e.absolutePointer;
    this.currentPolygon = new fabric.Polygon(
      [
        { x: currentPoint.x, y: currentPoint.y },
        { x: currentPoint.x, y: currentPoint.y },
      ],
      {
        selectable: false,
        fill: "transparent",
        stroke: strokeColor, // 边框黑色
        strokeWidth: this.strokeWidth, // 边框粗细
        objectCaching: false, // 当“true”时，对象缓存在另一个画布上。当“false”时，除非必要(clipPath)默认为 true，否则不缓存对象。默认是true
        evented: false, // 当设置为“false”时，对象不能成为事件的目标。所有事件都会通过它传播。
      }
    );
    this.canvas.add(this.currentPolygon);
  },
  // esc按键取消未完成的多边形
  cancelPylon() {
    if (this.currentPolygon) {
      this.canvas.remove(this.currentPolygon);
      this.currentPolygon = null;
      this.canvas.renderAll();
    }
  },
  // 删除未保存标签的元素图形
  handleRemove(classId) {
    const target = this.canvas._objects.find(
      (item) => item.classId === classId
    );
    this.canvas.remove(target);
    this.canvas.renderAll();
  },
  // 复制选中的对象
  handleCopy() {
    console.log("复制对象", this.clipboard);

    if (!this.canvas.getActiveObject()) {
      alert("请先选择元素");
      return;
    }
    let that = this;
    this.canvas.getActiveObject().clone(function (cloned) {
      console.log("复制之前的对象", cloned);
      that._clipboard = cloned;
    });
  },
  // 粘贴对象
  handlePase() {
    this.paseNum++;
    if (!this._clipboard) {
      alert("还没复制过任何内容");
      return;
    }
    if (this.paseNum > 1) {
      return;
    }
    let that = this;
    this._clipboard.clone((clonedObj) => {
      that.canvas.discardActiveObject(); // 取消选择

      // 设置新内容的坐标位置
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
        classId: new Date().getTime(),
      });

      if (clonedObj.type === "activeSelection") {
        // 活动选择需要一个对画布的引用
        that.clonedObj.canvas = canvas;
        that.clonedObj.forEachObject(function (obj) {
          canvas.add(obj);
        });

        clonedObj.setCoords();
      } else {
        that.canvas.add(clonedObj);
      }

      that._clipboard.top += 10;
      that._clipboard.left += 10;
      console.log("复制之后的对象", clonedObj);
      that.canvas.setActiveObject(clonedObj);
      that.canvas.requestRenderAll();

      let coordinates = [];
      if (clonedObj.type === "rect") {
        coordinates = [
          { x: clonedObj.left, y: clonedObj.top },
          { x: clonedObj.left + clonedObj.width, y: clonedObj.top },
          { x: clonedObj.left, y: clonedObj.top + clonedObj.height },
          {
            x: clonedObj.left + clonedObj.width,
            y: clonedObj.top + clonedObj.height,
          },
        ];
      } else {
        coordinates = clonedObj.points;
      }

      // 显示标签选项
      document.dispatchEvent(
        new CustomEvent("createObject", {
          detail: {
            // 显示dialog
            showDialog: true,
            classId: clonedObj.classId,
            tagType: clonedObj.type,
            coordinates: coordinates,
          },
        })
      );
    });
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
    if (!this.currentPolygon) {
      return;
    }
    // 传值e为双击，不传e为空格完成
    const currentPoint = e ? e.absolutePointer : this.polygonPoints;
    let points = this.currentPolygon.points;
    points[points.length - 1].x = currentPoint.x;
    points[points.length - 1].y = currentPoint.y;

    if (e) {
      points.pop();
      points.pop();
    }

    this.canvas.remove(this.currentPolygon);
    // 自定义id
    const classId = new Date().getTime();
    if (points.length > 1) {
      let polygon = new fabric.Polygon(points, {
        classId,
        strokeWidth: this.strokeWidth,
        fill: "transparent",
        selectable: false,
      });
      // // 禁止横向缩放
      // polygon.lockScalingX = true;
      // // 禁止竖向缩放

      // polygon.lockScalingY = true;
      // // 禁止旋转
      // polygon.lockRotation = true;

      // let circleList = this.handleCircleList(points);

      this.canvas.add(polygon);
    }

    this.currentPolygon = null;
    this.canvas.requestRenderAll();
    // 变更状态为选取

    // this.currentType = "select"; // 显示标签选项
    document.dispatchEvent(
      new CustomEvent("createObject", {
        detail: {
          // 显示dialog
          tagType: "polygon",
          showDialog: true,
          classId,
          coordinates: points,
        },
      })
    );
  },
  // 修改当前正在创建的折线
  changeCurrentPolyline(e) {
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
    if (!this.currentPolyline) {
      return;
    }
    // 传值e为双击，不传e为空格完成
    const currentPoint = e ? e.absolutePointer : this.polygonLinePoints;
    let points = this.currentPolyline.points;
    points[points.length - 1].x = currentPoint.x;
    points[points.length - 1].y = currentPoint.y;

    points.pop();
    // points.pop();
    this.canvas.remove(this.currentPolyline);

    if (points.length > 1) {
      let polyline = new fabric.Polyline(points, {
        classId: new Date().getTime(),
        stroke: this.strokeColor,
        strokeWidth: this.strokeWidth,
        fill: "transparent",
        selectable: false,
      });

      this.canvas.add(polyline);
    }
    this.currentPolyline = null;

    this.canvas.requestRenderAll();
    let classId = new Date().getTime();
    // 新增树状列表
    document.dispatchEvent(
      new CustomEvent("createObject", {
        detail: {
          // 显示dialog
          tagType: "polyline",
          showDialog: true,
          classId,
          coordinates: points,
        },
      })
    );
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
    } else if (this.currentPolyline) {
      this.canvas.remove(this.currentPolyline);
    }
    this.currentPolygon = null;
    this.canvas.renderAll();
  },
  /***************  回显  ************************************ */
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
      top,
      left,
      width,
      height,
      fill: "transparent", // 填充色：透明
      stroke: color || "red", // 边框颜色：黑色
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      selectable: false,
    });
    // 将矩形添加到画布上
    this.canvas.add(rect);
    this.canvas.requestRenderAll();
  },
  // 根据传入坐标创建多边形
  createPolygonByPoints(points, classId, color) {
    const polygon = new fabric.Polygon(points, {
      classId,
      fill: "transparent",
      stroke: color || "red",
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      selectable: false,
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
      fill: "transparent",
      stroke: color || "red",
      cornerColor: this.cornerColor,
      strokeWidth: this.strokeWidth,
      selectable: false,
    });
    // 添加多变形到画布
    this.canvas.add(polyline);
    this.canvas.requestRenderAll();
  },
  /**
   *@Description: 根据矩形截图
   *@param {Array} points - 矩形顶点,
   *@param {String} classId - 对应id,
   *@return {undefined} - 返回值描述
   */
  cutRectToStateImg(data) {
    // 计算截图区域
    const target = this.canvas._objects.find(
      (item) => item.classId === data.id
    );
    const [left, top, width, height] = [
      target.left,
      target.top,
      target.width,
      target.height,
    ];
    // 截图
    return this.wholeImg.toDataURL({
      left,
      top,
      width,
      height,
    });
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
    let target = this.canvas.getActiveObject();
    if (target) {
      document.dispatchEvent(
        new CustomEvent("delObject", {
          detail: target.classId,
        })
      );

      this.canvas.remove(target);
      this.canvas.requestRenderAll();
    }
  },
};
