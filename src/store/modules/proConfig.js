const state = {
  proToolsData: [],
  proToolsData: [],
};

const mutations = {
  SET_DICT(state, { key, value }) {
    state[key] = value;
  },
  setDic(state, { key, value }) {
    state.dicData[key] = value;
  },
  SET_PRO_FROM_DATA(state, { key, value }) {
    state.proFromData = value;
  },
  SET_PRO_TOOLS_DATA(state, { key, value }) {
    state.proToolsData = value;
  },
};

const actions = {
  async GET_PRO_CONFIG(context, payload) {
    const { key } = payload;
    let dicts = ["project_config", "project_tool_config"];
    Promise.all(
      dicts.map((item) => {
        return context.dispatch("dicts/GET_DIC", { key: item }, { root: true });
      })
    )
      .then(async (reslist) => {
        // 请求成功逻辑
        let proConfigFormData = await Promise.all(
          reslist[0].map(async (item) => {
            let data = await context.dispatch(
              "dicts/GET_DIC",
              {
                key: item.dictValue,
              },
              { root: true }
            );

            let obj = JSON.parse(item.remark);    
            return {
              label: item.dictLabel,
              value: item.dictValue,
              selectType: obj.selectType, // 单选 radio or 多选 checkbox
              project: obj.project,
              dictData: data,
              isShow: true,
            };
          })
        );

        // let tools = reslist[1].filter((item) => item.remark.includes(key));
        let proConfigToolData = await Promise.all(
          reslist[1].map(async (item) => {
            let dictobj = JSON.parse(item.remark);
            let { component, params, projectType } = dictobj;
            return {
              label: item.dictLabel,
              value: item.dictValue,
              component: component,
              params,
              projectType,
              dictData: await context.dispatch(
                "dicts/GET_DIC",
                {
                  key: item.dictValue,
                },
                { root: true }
              ),
            };
          })
        );

        context.commit("SET_PRO_FROM_DATA", { key, value: proConfigFormData });
        context.commit("SET_PRO_TOOLS_DATA", { key, value: proConfigToolData });

        return {
          toolsConfig: proConfigToolData,
          formConfig: proConfigFormData,
        };
      })
      .catch(() => {
        // 失败逻辑
      });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
