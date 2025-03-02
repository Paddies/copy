var fabric_1 = require('fabric');
var lodash_es_1 = require('lodash-es');
var WorkspacePlugin = /** @class */ (function () {
  function WorkspacePlugin(canvas) {
    this.canvas = canvas;
    // this.editor = editor;
    this.init({
      width: 900,
      height: 2000,
    });
  }
  WorkspacePlugin.prototype.init = function (option) {
    var workspaceEl = document.querySelector('#workspace');
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._bindWheel();
  };
  // hookImportBefore() {
  //   return new Promise((resolve, reject) => {
  //     resolve();
  //   });
  // }
  WorkspacePlugin.prototype.hookImportAfter = function () {
    var _this = this;
    return new Promise(function (resolve) {
      var workspace = _this.canvas.getObjects().find(function (item) {
        return item.id === 'workspace';
      });
      if (workspace) {
        workspace.set('selectable', false);
        workspace.set('hasControls', false);
        _this.setSize(workspace.width, workspace.height);
        // _this.editor.emit('sizeChange', workspace.width, workspace.height);
      }
      resolve();
    });
  };
  WorkspacePlugin.prototype.hookSaveAfter = function () {
    var _this = this;
    return new Promise(function (resolve) {
      _this.auto();
      resolve(true);
    });
  };
  // 初始化背景
  WorkspacePlugin.prototype._initBackground = function () {
    this.canvas.backgroundImage = '';
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  };
  // 初始化画布
  WorkspacePlugin.prototype._initWorkspace = function () {
    var _a = this.option,
      width = _a.width,
      height = _a.height;
    var workspace = new fabric_1.fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width: width,
      height: height,
      id: 'workspace',
    });
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    this.canvas.renderAll();
    this.workspace = workspace;
    this.auto();
  };
  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  WorkspacePlugin.prototype.setCenterFromObject = function (obj) {
    var canvas = this.canvas;
    var objCenter = obj.getCenterPoint();
    var viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  };
  // 初始化监听器
  WorkspacePlugin.prototype._initResizeObserve = function () {
    var _this = this;
    var resizeObserver = new ResizeObserver(
      (0, lodash_es_1.throttle)(function () {
        _this.auto();
      }, 50)
    );
    resizeObserver.observe(this.workspaceEl);
  };
  WorkspacePlugin.prototype.setSize = function (width, height) {
    this._initBackground();
    this.option.width = width;
    this.option.height = height;
    // 重新设置workspace
    this.workspace = this.canvas.getObjects().find(function (item) {
      return item.id === 'workspace';
    });
    this.workspace.set('width', width);
    this.workspace.set('height', height);
    this.auto();
  };
  WorkspacePlugin.prototype.setZoomAuto = function (scale, cb) {
    var _this = this;
    var workspaceEl = this.workspaceEl;
    var width = workspaceEl.offsetWidth;
    var height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    var center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric_1.fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    // 超出画布不展示
    this.workspace.clone(function (cloned) {
      _this.canvas.clipPath = cloned;
      _this.canvas.requestRenderAll();
    });
    if (cb) cb(this.workspace.left, this.workspace.top);
  };
  WorkspacePlugin.prototype._getScale = function () {
    var viewPortWidth = this.workspaceEl.offsetWidth;
    var viewPortHeight = this.workspaceEl.offsetHeight;
    // 按照宽度
    if (viewPortWidth / viewPortHeight < this.option.width / this.option.height) {
      return viewPortWidth / this.option.width;
    } // 按照宽度缩放
    return viewPortHeight / this.option.height;
  };
  // 放大
  WorkspacePlugin.prototype.big = function () {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), zoomRatio);
  };
  // 缩小
  WorkspacePlugin.prototype.small = function () {
    var zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    var center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric_1.fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    );
  };
  // 自动缩放
  WorkspacePlugin.prototype.auto = function () {
    var scale = this._getScale();
    this.setZoomAuto(scale - 0.08);
  };
  // 1:1 放大
  WorkspacePlugin.prototype.one = function () {
    this.setZoomAuto(0.8 - 0.08);
    this.canvas.requestRenderAll();
  };
  WorkspacePlugin.prototype._bindWheel = function () {
    this.canvas.on('mouse:wheel', function (opt) {
      var delta = opt.e.deltaY;
      var zoom = this.getZoom();
      zoom *= Math.pow(0.999, delta);
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      var center = this.getCenter();
      this.zoomToPoint(new fabric_1.fabric.Point(center.left, center.top), zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };
  WorkspacePlugin.prototype.destroy = function () {
    console.log('pluginDestroy');
  };
  WorkspacePlugin.pluginName = 'WorkspacePlugin';
  WorkspacePlugin.events = ['sizeChange'];
  WorkspacePlugin.apis = ['big', 'small', 'auto', 'one', 'setSize'];
  return WorkspacePlugin;
})();

exports.default = WorkspacePlugin;
