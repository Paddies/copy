var vue_1 = require("vue");
var core_1 = require("@vueuse/core");
// import { v4 as uuid } from 'uuid';
var HistoryPlugin = /** @class */ (function () {
  function HistoryPlugin(canvas) {
    var _this = this;
    // this.hotkeys = ['ctrl+z'];
    this.renderCanvas = function () {
      _this.history.pause();
      _this.canvas.clear();
      _this.canvas.loadFromJSON(_this.history.source.value, function () {
        _this.canvas.renderAll();
        _this.history.resume();
      });
    };
    this.canvas = canvas;
    this._init();
  }
  HistoryPlugin.prototype._init = function () {
    var _this = this;
    this.history = (0, core_1.useRefHistory)((0, vue_1.ref)(), {
      capacity: 50,
    });
    this.canvas.on({
      "object:added": function (event) {
        return _this._save(event);
      },
      "object:modified": function (event) {
        return _this._save(event);
      },
      "selection:updated": function (event) {
        return _this._save(event);
      },
    });
  };
  HistoryPlugin.prototype.getHistory = function () {
    return this.history;
  };
  HistoryPlugin.prototype._save = function (event) {
    // 过滤选择元素事件
    var isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    var workspace = this.canvas.getObjects().find(function (item) {
      return item.id === "workspace";
    });
    if (!workspace) {
      return;
    }
    if (this.history.isTracking.value) {
      let value = this.canvas.toJSON([
        "id",
        "gradientAngle",
        "selectable",
        "hasControls",
      ]);

      this.history.source.value = value;
    }
  };
  HistoryPlugin.prototype.undo = function () {
    if (this.history.canUndo.value) {
      this.renderCanvas();
      this.history.undo();
    }
  };
  HistoryPlugin.prototype.redo = function () {
    this.history.redo();
    this.renderCanvas();
  };
  // 快捷键扩展回调
  HistoryPlugin.prototype.hotkeyEvent = function (eventName, e) {
    if (eventName === "ctrl+z" && e.type === "keydown") {
      this.undo();
    }
  };
  HistoryPlugin.prototype.destroy = function () {
    console.log("pluginDestroy");
  };
  HistoryPlugin.pluginName = "HistoryPlugin";
  HistoryPlugin.apis = ["undo", "redo", "getHistory"];
  HistoryPlugin.events = ["historyInitSuccess"];
  return HistoryPlugin;
})();
exports.default = HistoryPlugin;
