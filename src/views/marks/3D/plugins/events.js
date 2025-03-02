export default class Events {
  constructor(el, eventName) {
    this.el = el;
    this.name = eventName;
    this.callback = null;
    this.eventHandler = this.eventHandler.bind(this);
    this._event = null;
  }
  on(callback) {
    this.callback = callback;
    this.el.addEventListener(this.name, this.eventHandler);
    this.callback && this.callback();
  }
  off(callback) {
    this.callback = callback;
    this.el.removeEventListener(this.name, this.eventHandler);
    this.callback && this.callback();
  }
  eventHandler(event) {
    event.preventDefault();
    this._event = event;
    this.callback && this.callback(event);
  }
  destroy() {
    // 解绑事件监听器
    this.off();
    // 清理实例属性
    this.el = null;
    this.callback = null;
    this._event = null;
  }
}
