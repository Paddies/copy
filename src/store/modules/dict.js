const state = {
  dict: new Array(),
};
const mutations = {
  GET_DICT: (state, { key }) => {
    if (key !== null && key !== "") {
      let valus = state.find((item) => item.key === value).value;
      return valus;
    }
  },
  SET_DICT: (state, { key, value }) => {
    if (key !== null && key !== "") {
      state.dict.push({
        key: key,
        value: value,
      });
    }
  },
  REMOVE_DICT: (state, key) => {
    try {
      for (let i = 0; i < state.dict.length; i++) {
        if (state.dict[i].key == key) {
          state.dict.splice(i, i);
          return true;
        }
      }
    } catch (e) {}
  },
  CLEAN_DICT: (state) => {
    state.dict = new Array();
  },
};

const actions = {
  // 读取字典
  getDict({ commit }, data) {
    commit("GET_DICT", data);
  },
  // 设置字典
  setDict({ commit }, data) {
    commit("SET_DICT", data);
  },
  // 删除字典
  removeDict({ commit }, key) {
    commit("REMOVE_DICT", key);
  },
  // 清空字典
  cleanDict({ commit }) {
    commit("CLEAN_DICT");
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
