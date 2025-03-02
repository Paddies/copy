<template>
  <div class="wrap">
    <el-row class="header">
      <el-col :span="3" class="logo-wrap">
        <svg-icon class="logo" icon-class="3d-logo"></svg-icon>
      </el-col>
      <el-col :span="21" class="tools-wrap">
        <!-- <div :span="2" class="block">
          <span class="tool">
            <svg-icon icon-class="3d-cancel"></svg-icon>
            <span>撤销</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-redo"></svg-icon>
            <span>重做</span>
          </span>
        </div>
        <div :span="4" class="block">
          <span class="tool">
            <svg-icon icon-class="3d-copy"></svg-icon>
            <span>复制</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-delete"></svg-icon>
            <span>删除</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-empty"></svg-icon>
            <span>清空</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-save"></svg-icon>
            <span>保存</span>
          </span>
        </div>
        <div :span="1" class="block">
          <span class="tool">
            <svg-icon icon-class="3d-census"></svg-icon>
            <span>统计</span>
          </span>
        </div>
        <div :span="2" class="block">
          <span class="tool">
            <svg-icon icon-class="3d-help"></svg-icon>
            <span>帮助</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-settings"></svg-icon>
            <span>设置</span>
          </span>
        </div>
        <div :span="3" class="block">
          <span class="tool">倒计时 20:00</span>
          <span class="line"></span>
          <span class="tool">已完成 223</span>
          <span class="line"></span>
          <span class="tool">已进行 123</span>
        </div> -->
        <div :span="4" class="block right">
          <!-- <span class="tool">
            <svg-icon icon-class="3d-records"></svg-icon>
            <span>审核记录</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-collect"></svg-icon>
            <span>收藏</span>
          </span>
          <span class="line"></span>
          <span class="tool">
            <svg-icon icon-class="3d-full_screen"></svg-icon>
            <span>全屏</span>
          </span> -->
          <span class="tool return" @click="goBack">
            <svg-icon icon-class="3d-return"></svg-icon>
            <span>退出</span>
          </span>
        </div>
      </el-col>
    </el-row>
    <el-row span="24" style="display: flex;gap: 4px;">
      <el-col :span="1">
        <div class="icons">
          <svg-icon class="icon" :icon-class="active === 1 ? '3d-arrow_active' : '3d-arrow'"
            @click.stop="active = 1"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 2 ? '3d-transform_active' : '3d-transform'"
            @click.stop="active = 2"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 3 ? '3d-scale_active' : '3d-scale'"
            @click.stop="active = 3"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 4 ? '3d-rotation_active' : '3d-rotation'"
            @click.stop="active = 4"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 5 ? '3d-rules_active' : '3d-rules'"
            @click.stop="active = 5"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 6 ? '3d-roop_active' : '3d-roop'"
            @click.stop="active = 6"></svg-icon>
          <svg-icon class="icon" :icon-class="active === 7 ? '3d-ai_active' : '3d-ai'"
            @click.stop="active = 7"></svg-icon>
        </div>
      </el-col>
      <!-- 主界面 -->
      <el-col :span="18" class="three">
        <el-row :gutter="4" class="three-main">
          <el-col :span="18">
            <div class="views">
              <!-- <el-button size="mini" @click.stop="controlOrbits()">轨道控制：{{ forbiddenOrbit? '开' : '关' }}</el-button> -->
              <div class="title"><span>主视图</span></div>
              <div id="three">
                <!-- 弹出模块，设置属性及其它信息 -->
                <attribute-modal v-if="show" :show.sync="show" :target.sync="target"
                  @delete="deleteObject"></attribute-modal>
              </div>
            </div>
          </el-col>
          <!-- 三视图 -->
          <el-col :span="6" class="sideviews">
            <div class="views">
              <div class="title">顶视图</div>
              <div id="top">
                <div class="view-svg" id="top_view" style="width: 100%; height: 100%;">
                  <svg style="width: 100%; height: 100%;" id="top_svg" v-show="show">
                    <!-- 左 -->
                    <line x1="50" y1="0%" x2="50" y2="100%" class="svg-line left-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="50" y="0%" width="10" height="100%" class="svg-rect left-rect" style="fill: transparent;" />
                    <!-- 右 -->
                    <line :x1="`${viewBox_w - 50}`" y1="0%" :x2="`${viewBox_w - 50}`" y2="100%"
                      class="svg-line right-line" stroke-dasharray="5,3" id="line-right"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect :x="`${viewBox_w - 50}`" y="0%" width="10" height="100%" class="svg-rect right-rect"
                      style="fill: transparent;" />
                    <!-- 上 -->
                    <line x1="0%" y1="20" :x2="`${viewBox_w}`" y2="20" class="svg-line top-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" y="20" width="100%" height="10" class="svg-rect top-rect" style="fill: transparent;" />
                    <!-- 下 -->
                    <line x1="0%" :y1="`${viewBox_h - 20}`" :x2="`${viewBox_w}`" :y2="`${viewBox_h - 20}`"
                      class="svg-line bottom-line" stroke-dasharray="5,3" id="line-left"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" :y="`${viewBox_h - 20}`" width="100%" height="10" class="svg-rect bottom-rect"
                      style="fill: transparent;" />
                    <!-- 平移 -->
                    <rect :x="`${viewBox_w / 2 - 20}`" :y="`${viewBox_h / 2 - 20}`" width="40" height="40"
                      class="svg-rect center-rect" style="fill: transparent;cursor: move;" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="views">
              <div class="title">正视图</div>
              <div id="right">
                <div class="view-svg" id="front_view" style="width: 100%; height: 100%;">
                  <svg style="width: 100%; height: 100%;" id="front_svg" v-show="show">
                    <!-- 左 -->
                    <line x1="50" y1="0%" x2="50" y2="100%" class="svg-line left-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="50" y="0%" width="10" height="100%" class="svg-rect left-rect" style="fill: transparent;" />
                    <!-- 右 -->
                    <line :x1="`${viewBox_w - 50}`" y1="0%" :x2="`${viewBox_w - 50}`" y2="100%"
                      class="svg-line right-line" stroke-dasharray="5,3" id="line-right"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect :x="`${viewBox_w - 50}`" y="0%" width="10" height="100%" class="svg-rect right-rect"
                      style="fill: transparent;" />
                    <!-- 上 -->
                    <line x1="0%" y1="20" :x2="`${viewBox_w}`" y2="20" class="svg-line top-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" y="20" width="100%" height="10" class="svg-rect top-rect" style="fill: transparent;" />
                    <!-- 下 -->
                    <line x1="0%" :y1="`${viewBox_h - 20}`" :x2="`${viewBox_w}`" :y2="`${viewBox_h - 20}`"
                      class="svg-line bottom-line" stroke-dasharray="5,3" id="line-left"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" :y="`${viewBox_h - 20}`" width="100%" height="10" class="svg-rect bottom-rect"
                      style="fill: transparent;" />
                    <!-- 平移 -->
                    <rect :x="`${viewBox_w / 2 - 20}`" :y="`${viewBox_h / 2 - 20}`" width="40" height="40"
                      class="svg-rect center-rect" style="fill: transparent;cursor: move;" />
                  </svg>
                </div>
              </div>
            </div>
            <div class="views">
              <div class="title">左视图</div>
              <div id="left">
                <div class="view-svg" id="left_view" style="width: 100%; height: 100%;">
                  <svg style="width: 100%; height: 100%;" v-show="show">
                    <!-- 左 -->
                    <line x1="50" y1="0%" x2="50" y2="100%" class="svg-line left-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="50" y="0%" width="10" height="100%" class="svg-rect left-rect" style="fill: transparent;" />
                    <!-- 右 -->
                    <line :x1="`${viewBox_w - 50}`" y1="0%" :x2="`${viewBox_w - 50}`" y2="100%"
                      class="svg-line right-line" stroke-dasharray="5,3" id="line-right"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect :x="`${viewBox_w - 50}`" y="0%" width="10" height="100%" class="svg-rect right-rect"
                      style="fill: transparent;" />
                    <!-- 上 -->
                    <line x1="0%" y1="20" :x2="`${viewBox_w}`" y2="20" class="svg-line top-line" stroke-dasharray="5,3"
                      id="line-left" style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" y="20" width="100%" height="10" class="svg-rect top-rect" style="fill: transparent;" />
                    <!-- 下 -->
                    <line x1="0%" :y1="`${viewBox_h - 20}`" :x2="`${viewBox_w}`" :y2="`${viewBox_h - 20}`"
                      class="svg-line bottom-line" stroke-dasharray="5,3" id="line-left"
                      style="stroke: rgba(247, 235, 4, .5);"></line>
                    <rect x="0%" :y="`${viewBox_h - 20}`" width="100%" height="10" class="svg-rect bottom-rect"
                      style="fill: transparent;" />
                    <!-- 平移 -->
                    <rect :x="`${viewBox_w / 2 - 20}`" :y="`${viewBox_h / 2 - 20}`" width="40" height="40"
                      class="svg-rect center-rect" style="fill: transparent;cursor: move;" />
                  </svg>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <!-- 底部工具栏 -->
        <el-row class="three-tools">
          <el-col :span="24" class="bottomTools">
            <span style="color: #C9CDD4">当前帧：{{ activeFrame + 1 }}</span>
            <!-- <span class="controls">
              <svg-icon icon-class="3d-prevx3"></svg-icon>
              <svg-icon icon-class="3d-prevx2"></svg-icon>
              <svg-icon icon-class="3d-prevx1"></svg-icon>
              <svg-icon icon-class="3d-prev"></svg-icon>
              <svg-icon icon-class="3d-next"></svg-icon>
              <svg-icon icon-class="3d-nextx1"></svg-icon>
              <svg-icon icon-class="3d-nextx2"></svg-icon>
              <svg-icon icon-class="3d-nextx3"></svg-icon>
            </span> -->
            <span class="btn">
              <span @click="showNoMark = true" v-hasPermi="['point:cloud:invalidJob']">单帧无效</span>
              <span @click="showAllFram = true" v-hasPermi="['point:cloud:invalidGroup']">所有帧无效</span>
            </span>
          </el-col>
          <el-col :span="24">
            <div class="keyframes">
              <span v-for="(item, index) in pcdList" :key="index" class="keyframe"
                :style="{ background: getItemColor(item.jobStatus), }"
                :class="{ active: index === activeFrame ? 'active' : '' }" @click="setActiveKey(index)">
                <svg-icon icon-class="3D-pass" class="icon" v-if="item.jobStatus === '2'"></svg-icon>
                {{ index + 1 }}</span>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <!-- 右侧对象区域 -->
      <el-col :span="5" class="objects">
        <div class="object">
          <p class="object_title">
            <i class="el-icon-d-arrow-left"></i><span>标注方案</span>
          </p>
          <el-tabs v-model="activeTab" stretch @tab-click="handleTabClick">
            <el-tab-pane label="对象列表" name="objects">
              <div class="panel">
                <div class="labels" v-for="(item, index) in cubes" :key="index">
                  <span><svg-icon icon-class="3d-tool_07"></svg-icon></span>
                  <span><svg-icon icon-class="3d-tool_color_07"></svg-icon></span>
                  <span class="shortcut">1</span>
                  <span>属性{{ index + 1 }}</span>
                </div>
                <Empty :text="'对象'" v-if="cubes.length === 0"></Empty>>
              </div>

            </el-tab-pane>
            <!-- <el-tab-pane label="驳回框列表" name="rejects"></el-tab-pane> -->
            <el-tab-pane label="驳回记录" name="rejectlist">
              <RejectLogs :list="jobCheckLogs"></RejectLogs>
              <Empty :text="'驳回记录'" v-if="jobCheckLogs.length === 0"></Empty>
            </el-tab-pane>
          </el-tabs>
          <!-- <el-tabs v-model="activeTab" stretch @tab-click="handleTabClick">
            <el-tab-pane label="个体分类" name="unit">
              <div class="labels">
                <span>工具</span>
                <span>颜色</span>
                <span>快捷键</span>
                <span>个体分类类目</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_01"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_01"></svg-icon></span>
                <span class="shortcut">CTRL + 1</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_02"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_02"></svg-icon></span>
                <span class="shortcut">CTRL + 2</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_03"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_03"></svg-icon></span>
                <span class="shortcut">CTRL + 3</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_04"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_04"></svg-icon></span>
                <span class="shortcut">CTRL + 4</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_05"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_05"></svg-icon></span>
                <span class="shortcut">CTRL + 5</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_06"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_06"></svg-icon></span>
                <span class="shortcut">CTRL + 6</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_07"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_07"></svg-icon></span>
                <span class="shortcut">CTRL + 7</span>
                <span>驾驶员在前框左侧</span>
              </div>
              <div class="labels">
                <span><svg-icon icon-class="3d-tool_08"></svg-icon></span>
                <span><svg-icon icon-class="3d-tool_color_08"></svg-icon></span>
                <span class="shortcut">CTRL + 8</span>
                <span>驾驶员在前框左侧</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="属性列表" name="global">属性列表</el-tab-pane>
            <el-tab-pane label="快捷键列表" name="history">快捷键列表</el-tab-pane>
          </el-tabs> -->
        </div>
        <div class="submit">
          <el-button type="primary" size="medium" class="saveBtn" @click="submit3DBox"
            v-hasPermi="['point:cloud:saveGraphTags']" :disabled="jobStatus === '-1' && isEnd">保存并继续</el-button>
          <!-- <span class="submitBtn">
            <svg-icon icon-class="3d-subcheck"></svg-icon>
            <span>提交</span>
          </span> -->
          <el-button type="primary" size="medium" @click="markComplete()" v-hasPermi="['point:cloud:completeJob']">
            <svg-icon icon-class="3d-subcheck"></svg-icon>
            <span style="margin-left: 5px">完成标注</span>
          </el-button>
        </div>
      </el-col>
    </el-row>
    <!-- 单帧无效弹框 -->
    <el-dialog :visible.sync="showNoMark" width="600px">
      <el-form :model="noMarkForm" :rules="noMarkRules" ref="noMarkForm" label-width="100px">
        <el-form-item label="无效理由：" prop="reason">
          <el-input v-model="noMarkForm.reason" type="textarea" placeholder="请输入无效理由" />
        </el-form-item>
        <el-form-item align="end">
          <el-button type="primary" @click="confirmNoMark">作废</el-button>
          <el-button @click="showNoMark = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--所有帧无效弹框 -->
    <el-dialog :visible.sync="showAllFram" width="600px">
      <el-form :model="AllFramForm" :rules="AllFramRules" ref="AllFramForm" label-width="100px">
        <el-form-item label="无效理由：" prop="reason">
          <el-input v-model="AllFramForm.reason" type="textarea" placeholder="请输入无效理由" />
        </el-form-item>
        <el-form-item align="end">
          <el-button type="primary" @click="invalidFrame">作废</el-button>
          <el-button @click="showAllFram = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import RejectLogs from "./components/rejectLogs";
import MainView from "./plugins/mainview.js";
import AttributeModal from "./components/attributeModal.vue";
import Empty from "./components/empty.vue";
import {
  submitJob,
  getGroupItem,
  getCubesItem,
  deleteCubeItem,
  completeJob,
  invalidJob,
  invalidGroup
} from "@/api/project/3d"
export default {
  name: "Index",
  components: {
    AttributeModal,
    RejectLogs,
    Empty

  },
  computed: {
    isEnd() {
      return this.activeFrame + 1 === this.pageLength
    }
  },
  data() {
    return {
      pageSize: 20,//每页参数
      jobCheckLogs: [],  // 驳回记录
      noMarkForm: {
        reason: "",
      },
      noMarkRules: {
        reason: [
          { required: true, message: "请输入无效理由", trigger: "blur" },
        ],
      },
      AllFramForm: {
        reason: "",
      },
      AllFramRules: {
        reason: [
          { required: true, message: "请输入无效理由", trigger: "blur" },
        ],
      },
      showNoMark: false, // 单帧无效弹框
      showAllFram: false, // 所有帧无效弹框
      pageLength: 0,//帧数
      groupId: "",//分组id
      job_mode: "",//发题模式
      jobStatus: "",//当前帧任务状态
      active: 1,
      activeFrame: 0, // 选中的帧
      activeTab: "objects",
      x: 1,
      y: 1,
      z: 5,
      threePlus: null, // 主视图
      topPlus: null, // 顶部视图
      leftPlus: null, // 左视图
      rightPlus: null, // 正视图
      w: null,
      h: null,
      tabData: [
        {
          tool: "#3382FF",
          color: "#3382FF",
          shortcut: "Ctrl+1",
          unitclass: "驾驶员在前框左侧",
        },
      ],
      pcdList: [],
      // 禁用轨道器
      forbiddenOrbit: true,
      viewBox_w: 0,
      viewBox_h: 0,
      // 提交loading状态
      subloading: false,
      // 分组id
      group_id: 0,
      // jobId
      jobId: 0,
      // 标注框
      cubes: [],
      // 属性框显隐
      show: false,
      // 属性对象
      target: null,
    };
  },
  async mounted() {
    this.group_id = this.$route.query.groupId;
    this.jobId = this.$route.query.id;
    await this.getGroupItem();
    await this.getCubesItem();
    this.setWidthHeight();
    // three对象工厂函数
    this.threeFactory();
    if (this.pcdList.length > 0) {
      this.threePlus.init(process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + this.pcdList[0].fileId);
    }
    // 键盘事件监听
    document.onkeydown = (event) => {
      if (event.key === '1') {
        // 标注模式
        this.threePlus.bindMouseEvent()
        this.threePlus.controler.enabled = false;
        // this.threePlus.enableDraw = true;
      } else if (event.key === '2') {
        // rayCaster选中模式
        this.threePlus.bindRayCaster()
        this.threePlus.controler.enabled = true;
      } else if (event.key === 'Escape') {
        // 结束活动状态
        this.threePlus.clickEvents.off();
        this.threePlus.mousemoveEvents.off();
      }
    };
    // 监听resize事件
    window.addEventListener('resize', () => {
      const three = document.getElementById('three');
      this.threePlus.rerender(three.clientWidth, three.clientHeight);
    });
    // 监听框选中事件-- 接收框的信息
    document.addEventListener('boxSelect', (e) => {
      this.show = e.detail.show;
      this.target = e.detail.target;
    });
  },
  methods: {
    threeFactory() {
      if (this.threePlus) return;
      const _three = document.getElementById("three");
      // 主操作窗口
      this.threePlus = new MainView(_three, {
        x: 0,
        y: 0,
        z: 50,
      },
        this.cubes || []
      );
      console.log(this.cubes, 'this.cubes');
    },
    setWidthHeight() {
      const svg = document.querySelector('.view-svg');
      this.viewBox_w = svg.clientWidth;
      this.viewBox_h = svg.clientHeight;
    },
    save() {
      // 更新camera坐标
      this.threePlus.updateProjectionMatrix(this.x, this.y, this.z);
    },
    async setActiveKey(i) {
      this.show = false;
      this.$modal.loading("加载中...");
      this.threeFactory();
      this.activeFrame = i;
      this.jobId = this.pcdList[i].id;
      await this.getCubesItem();
      this.threePlus.cubes = this.cubes;
      this.threePlus.init(process.env.VUE_APP_BASE_API + "/tools/view?fileId=" + this.pcdList[i].fileId);
      this.$modal.closeLoading();
    },
    handleTabClick(tab) {
      this.activeTab = tab.name;
    },
    controlOrbits() {
      // this.forbiddenOrbit = !this.forbiddenOrbit;
      this.threePlus.controlOrbitControls(this.forbiddenOrbit);
    },
    deleteObject() {
      this.threePlus.deleteObject(this.deleteCubeItem());
      this.show = false;
    },
    // 获取分组详情
    getGroupItem() {
      this.$modal.loading("加载中...");
      let params = this.jobId ? { jobId: this.jobId, pageSize: 20 } : { groupId: this.group_id, pageSize: 20 };
      return getGroupItem(params).then(res => {
        if (res.code === 200) {
          this.pcdList = res.data.page;
          this.job_mode = res.data.configs.job_mode[0];
          this.pageLength = res.data.page.length;
          this.groupId = res.data.page[0].groupId;
        }
      }).finally(() => {
        this.$modal.closeLoading();
      })
    },
    // 获取当前帧下的标注框
    getCubesItem() {
      let params = this.jobId ? { jobId: this.jobId } : { jobId: this.pcdList[0].id };
      return getCubesItem(params).then(res => {
        if (res.code === 200) {
          let { checkLog, page, jobStatus } = res.data
          this.jobCheckLogs = checkLog;
          this.jobStatus = jobStatus
          this.jobCheckLogs = checkLog;
          // console.log("jobCheckLogs", this.jobCheckLogs);
          this.cubes = page.map(item => {
            return {
              name: `cube_${item.id}`,
              position: eval("(" + item.boxPosition + ")"),
              parameters: eval("(" + item.materialQuality + ")")
            }
          });
        }
      }).catch(err => {
        this.cubes = []
      });
    },
    // 删除标注框
    deleteCubeItem() {
      this.threePlus.deleteObject((target) => {
        const id = target.name.replace(/^cube_/, '');
        deleteCubeItem({
          tagId: id
        }).then(res => {
          console.log(res);
        })
      });
    },
    // 保存并继续
    submit3DBox() {
      const jobStatus = this.pcdList[this.activeFrame].jobStatus
      const data = this.threePlus.getCubes();
      const list = data.map(item => {
        return {
          boxName: item.name,
          boxTarget: "car",
          boxPosition: JSON.stringify(item.position),
          materialQuality: JSON.stringify(item.geometry.parameters),
          // rotation: 0
        }
      })

      if (list.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先标注'
        })
      } else {
        submitJob({
          tags: list,
          jobId: this.jobId
        }).then(res => {
          this.subloading = false;
          if (res.code === 200) {
            this.getGroupItem();
            this.$message({
              type: 'success',
              message: '提交成功'
            });
            const i = this.activeFrame + 1;
            console.log("i", i)
            if (this.pageLength === i) {

            } else {
              this.setActiveKey(i);
            }
          }

        })
      }
    },
    // 完成标注
    markComplete() {
      completeJob({
        groupId: this.groupId,
        jobMode: this.job_mode,
      }).then((res) => {
        if (res.code === 200) {
          let { nextJobId } = res.data
          this.$message.success("标注完成");
          if (this.job_mode === "1") {
            this.$confirm('已是最后一题, 是否继续标注?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(async () => {
              if (nextJobId === '-1') {
                this.$router.back();
                this.$message.success("已无标注任务");
              } else {
                this.activeFrame = 0;
                this.jobId = nextJobId;
                this.cubes = [];
                await this.getGroupItem();
                await this.getCubesItem();
                this.setActiveKey(0)
              }
            }).catch(() => {
              this.$router.back();
            });

          } else if (this.job_mode === "2") {
            this.$router.back();

          }
        }
      });
    },
    // 单帧无效
    confirmNoMark() {
      this.$refs.noMarkForm.validate((valid) => {
        if (valid) {
          invalidJob({
            jobId: this.jobId,
            cancelDes: this.noMarkForm.reason,
          }).then((res) => {
            if (res.code === 200) {
              this.showNoMark = false;
              this.getGroupItem();
              this.$message.success("单帧无效成功");
              this.resetForm('noMarkForm')
            }
          });
        }
      });

    },
    //所有帧无效
    invalidFrame() {
      this.$refs.AllFramForm.validate((valid) => {
        if (valid) {
          invalidGroup({
            groupId: this.groupId,
            cancelDes: this.AllFramForm.reason,
          }).then((res) => {
            if (res.code === 200) {
              this.$router.back();
              this.showAllFram = false;
              this.getGroupItem();
              this.$message.success("所有帧无效成功");
              this.resetForm('AllFramForm')
            }
          });
        }
      });
    },
    //返回
    goBack() {
      this.$router.back();
    },
    getItemColor(jobStatus) {
      if (jobStatus === "4") {
        return "#00B42A";
      } else if (jobStatus === "-1") {
        return "#FF7D00";
      } else if (jobStatus === "9") {
        return "#F53F3F";
      }
    }
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}

span {
  text-align: center;
}

.wrap {
  width: 100vw;
  height: 100vh;
  background-color: #151617;
}

.main {
  width: 100%;
  height: calc(100vh - 92px - 140px);
  overflow: hidden;
}

.three {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 92px);
  justify-content: space-between;
}

path:hover {
  stroke: #3382FF;
}

#three {
  width: 100%;
  /* 计算方式：100vh - 顶部操作栏 - 底部操作栏 - 小标题 */
  height: calc(100vh - 92px - 140px - 32px);
  position: relative;
}

#top,
#left,
#right {
  height: calc((100vh - 92px - 140px - 32px - 8px - (32px * 3) + 4px) / 3);
  border-top: 1px solid #303234;
  box-sizing: border-box;
  position: relative;
}

.return {
  cursor: pointer;
}

.return:hover {
  background: #434343;
}


.bottomTools {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.icons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-radius: 4px;
  background: #303234;
}

.icon {
  font-size: 36px;
  cursor: pointer;
}

.logo-wrap {
  height: 68px;
  position: relative;
  padding: 0 50px;
}

.logo {
  display: block;
  font-size: 120px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.header {
  overflow: hidden;
  margin-bottom: 6px;
  padding-top: 6px;
  padding-right: 12px;
}

.block {
  display: flex;
  align-items: center;
  color: #c9cdd4;
  border-radius: 4px;
  background: #303234;
}

.tools-wrap {
  display: flex;
  gap: 12px;
}

.tool {
  padding: 0 12px;
  height: 68px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  box-sizing: border-box;
}

.line {
  width: 1px;
  height: 26px;
  background-color: #18191c;
  display: block;
}

.block.right {
  margin-left: auto;
}

.title {
  width: 80px;
  height: 32px;
  color: #86909c;
  border-radius: 4px;
  border: 1px solid #434547;
  background: #2a2c2e;
  margin-left: auto;
  margin-top: 5px;
  margin-bottom: 5px;
  box-sizing: border-box;
  line-height: 32px;
  transform: translateX(-5px);
  text-align: center;
}

.views {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 2px solid #434547;
  overflow: hidden;
  box-sizing: border-box;
}

.sideviews {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sideviews>.views {
  flex: 1;
}

.three-main {
  height: calc(100vh - 92px - 140px);
}

.three-tools {
  height: 120px;
  border-radius: 4px;
  background: #303234;
  padding: 0 10px;
  box-sizing: border-box;
}

.controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn {
  margin-left: auto;
  display: flex;
  gap: 10px;
}

.btn>span {
  cursor: pointer;
  border-radius: 4px;
  background: #242527;
  color: #c9cdd4;
  padding: 5px 15px;
}

.btn>span:hover {
  background: #434343;
}

.keyframes {
  align-items: center;
  padding-bottom: 2px;
  height: 60px;
  display: flex;
  padding: 2px;
  background: #1f2123;
  gap: 2px;
  padding-bottom: 2px;

  .icon {
    position: absolute;
    bottom: 0;
    right: 0;
  }
}

.keyframe {
  box-sizing: border-box;
  padding: 17px 17px;
  position: relative;
  flex: 1;
  border-radius: 2px;
  background: #303234;
  transition: all 0.2s linear;
  cursor: pointer;
  color: #86909c;
}

.keyframe.active {
  background: #3382ff;
  color: #fff;
  font-weight: 500;
}

.objects {
  height: calc(100vh - 92px);
}

.object {
  height: calc(100vh - 92px - 71px);
  border-radius: 4px 0px 0px 4px;
  background: #303234;
}

.submit {
  margin-top: 6px;
  height: 65px;
  display: flex;
  gap: 12px;
  background-color: #303234;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
}

.el-button {
  border: none;
  cursor: pointer;
  flex: 1;
  // line-height: calc(65px - 24px);
  border-radius: 4px;
}

.saveBtn {
  background: #242527;
  color: #fff;
  font-size: 12px;
}

.submit>span:hover {
  background: #434343;
}

.submit .submitBtn {
  background-color: #3382ff;
}

.object_title {
  color: #fff;
  text-align: left;
  padding: 12px;
}

.object_title>span {
  margin-left: 10px;
}

.labels {
  display: flex;
  padding: 5px 0;
}

.labels>span {
  line-height: 24px;
  width: 15%;
  color: #fff;
  font-size: 12px;
}

.labels>.shortcut {
  border-radius: 4px;
  border: 1px solid #151617;
  background: #242527;
  line-height: 24px;
}

.labels:nth-child(even) {
  background: #282a2d;
}

.labels>span:nth-last-child(1) {
  width: 40%;
}

.labels>span:nth-last-child(2) {
  width: 30%;
}

::v-deep .el-tabs__item {
  color: #c9cdd4;
}

.view-svg {
  position: absolute;
  top: 0;
  left: 0;

  .svg-line,
  .svg-rect {
    display: none;
  }

  .svg-rect.left-rect,
  .svg-rect.right-rect {
    cursor: ew-resize;
  }

  .svg-rect.top-rect,
  .svg-rect.bottom-rect {
    cursor: ns-resize;
  }
}

::v-deep .el-dialog {
  border-radius: 8px;
  background: #151617;
}

.object {
  .panel {
    height: calc(100vh - 300px) !important;
    overflow-y: auto !important;
  }
}
</style>
