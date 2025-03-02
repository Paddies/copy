import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import dict from "./modules/dict";
import dicts from "./modules/dicts";
import proConfig from "./modules/proConfig";
import localPro from "./modules/localPro";
import user from "./modules/user";
import tagsView from "./modules/tagsView";
import permission from "./modules/permission";
import settings from "./modules/settings";
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    dict,
    localPro,
    proConfig,
    user,
    tagsView,
    permission,
    settings,
    dicts,
  },
  getters,
});

export default store;
