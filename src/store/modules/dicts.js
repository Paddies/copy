import { getDicts } from "@/api/system/dict/data";
const state = {
  dicData: {},
};

const mutations = {
  SET_DICT(state, { key, value }) {
    state[key] = value;
  },
  setDic(state, { key, value }) {
    state.dicData[key] = value;
  },
};

const actions = {
  async GET_DIC(context, payload) {
    const { key } = payload;
    if (context.state.dicData[key]) {
      return context.state.dicData[key];
    } else {
      const data = (await getDicts(key)).data;
      context.commit("setDic", { key, value: data });
      return data;
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
