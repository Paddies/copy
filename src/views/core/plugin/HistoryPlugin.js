import { ref } from 'vue';
import { useRefHistory } from '@vueuse/core';

class HistoryPlugin {
  constructor(canvas) {
    this.canvas = canvas;
    this.history = null
    this._init();
  }

  _init() {
    this.history = useRefHistory(ref(), {
      capacity: 50,
    });
    
    this.canvas.on({
      'object:added': (event) => this._save(event),
      'object:modified': (event) => this._save(event),
      'selection:updated': (event) => this._save(event),
    });
  }

  getHistory() {
    return this.history;
  }
  _save(event) {
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    if (!workspace) {
      return;
    }
    if (this.history.isTracking.value) {
      this.history.source.value = this.editor.getJson();
    }

    console.log('this.history', this.history);
  }

  undo() {
    if (this.history.canUndo.value) {
      this.renderCanvas();
      this.history.undo();
    }
  }

  redo() {
    this.history.redo();
    this.renderCanvas();
  }

  renderCanvas = () => {
    this.history.pause();
    this.canvas.clear();
    this.canvas.loadFromJSON(this.history.source.value, () => {
      this.canvas.renderAll();
      this.history.resume();
    });
  };
}


export default HistoryPlugin;


