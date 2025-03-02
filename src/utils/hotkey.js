import hotkeys from "hotkeys-js";

export function handelHotKey(keyName, cb) {
  hotkeys(keyName, { keydown: true }, cb);
}
