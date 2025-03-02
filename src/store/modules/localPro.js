import { getProjectConfig } from "@/api/project/project";

const state = {
  proData: {},
  default2DConfig: {},
  defaultOCRConfig: {},
};

const mutations = {
  SET_DICT(state, { key, value }) {
    state[key] = value;
  },
  SET_PRO_DATA(state, { key, value }) {
    state.proData[key] = value;
    localStorage.setItem("pro_data", JSON.stringify(state.proData));
  },
};

const actions = {
  SET_PRO(context, payload) {
    const { id, md5, configs } = payload;
    console.log(payload);
    context.commit("setDic", {
      key: id,
      value: {
        id,
        md5,
        configs,
      },
    });
  },
  // 配置中没有变化，直接拿
  async GET_PRO(context, payload) {
    console.log("GET_PRO payload", payload);
    const { projectId } = payload;

    // 先调接口，判断是否为最新
    // 判断缓存中是否存在
    // let localData = localStorage.getItem("pro_data");
    // let configData;
    // if (localData) {
    //   configData = JSON.parse(localData)[projectId];
    // }
    // if (configData) {
    //   return configData;
    // } else if (context.state.proData[projectId]) {
    //   // 判断store是否存在
    //   return context.state.proData[projectId];
    // } else {
    //   // 拿配置接口
    //   const { data } = await getProjectConfig({ projectId });
    //   if (data.tools.length > 0) {
    //     context.commit("SET_PRO_DATA", { key: projectId, value: data });
    //   }
    //   return data;
    // }

    const { data } = await getProjectConfig({ projectId });
    if (data.tools.length > 0) {
      context.commit("SET_PRO_DATA", { key: projectId, value: data });
    }
    return data;
  },
  UPDATE_PRO(context, payload) {
    let { projectId, data } = payload;
    // console.log(projectId, data);
    context.commit("SET_PRO_DATA", { key: projectId, value: data });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
