export default class setKeyCode {
  constructor() {
    this.shortcuts = new Map(); // 存储快捷键的 Map
    this.handleKeyDown = this.handleKeyDown.bind(this);
    document.addEventListener("keydown", this.handleKeyDown);
  }

  // 绑定单个快捷键
  bindShortcut(key, callback) {
    this.shortcuts.set(key.toLowerCase(), callback);
  }

  // 绑定组合快捷键
  bindCombinationShortcut(keys, callback) {
    const combinationKey = keys
      .map((k) => k.toLowerCase())
      .sort()
      .join("+");
    this.shortcuts.set(combinationKey, callback);
  }

  // 处理按键事件
  handleKeyDown(event) {
    const pressedKeys = [];
    if (event.ctrlKey) pressedKeys.push("ctrl");
    if (event.altKey) pressedKeys.push("alt");
    if (event.shiftKey) pressedKeys.push("shift");
    if (
      event.code !== "Control" &&
      event.code !== "Alt" &&
      event.code !== "Shift"
    ) {
      pressedKeys.push(event.code.toLowerCase());
    }
    const combinationKey = pressedKeys.sort().join("+");
    const callback = this.shortcuts.get(combinationKey);

    if (callback) {
      callback();
    }
  }

  // 销毁实例
  destroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }
}
