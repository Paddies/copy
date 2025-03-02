<template>
  <div>
    <div ref="waveformRef"></div>
    <div ref="waveTimelineRef"></div>
    <!-- 播放 / 暂停按钮 -->
    <el-button type="primary" @click="playPause()">
      <i class="el-icon-video-play" />
      播放 / 暂停
    </el-button>
    <!-- 重放按钮 -->
    <!-- <el-button type="primary" @click="rebroadcast">重放</el-button> -->
    <!-- 停止按钮 -->
    <!-- <el-button type="primary" @click="handleStop">停止</el-button> -->
    <!-- 打印区域列表按钮 -->
    <!-- <el-button @click="getRegions">打印区域</el-button> -->
  </div>
</template>

<script>
import WaveSurfer from "wavesurfer.js";
import Region from "wavesurfer.js/dist/plugin/wavesurfer.regions";
import Cursor from "wavesurfer.js/dist/plugin/wavesurfer.cursor";
import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline";

export default {
  name: "VoicePlayer",
  props: ["voiceSrc"],
  data() {
    return {
      wavesurfer: null,
      start: null,
      end: null,
      lastRegion: null, // 最后一个区域的实例
      isPlay: false // 是否正在播放
    };
  },
  mounted() {
    this.init();
  },
  watch: {

    voiceSrc: {
      handler() {
        this.loadSrc()
      },
      deep: true
    }

  },
  // 在组件销毁前，销毁音频波形实例
  beforeDestroy() {
    this.wavesurfer && this.wavesurfer.destroy();
    this.wavesurfer = null;
  },
  methods: {

    // 点击播放或者暂停

    playPause() {
      // 如果有最后一个区域，则执行区域的播放
      if (this.lastRegion) {
        if (this.isPlay) {
          // this.lastRegion.pause()
          this.wavesurfer.playPause()
        } else {
          this.lastRegion.play()
        }
        this.isPlay = !this.isPlay

        return
      }
      this.wavesurfer.playPause()
    },


    // 初始化语音标注
    init() {
      // 获取容器元素
      const container = this.$refs.waveformRef;
      // 点击容器时清除循环播放
      container.addEventListener("click", () => {
        console.log("点击容器");
        this.clearLoop();
      });
      // 创建WaveSurfer实例
      this.wavesurfer = WaveSurfer.create({
        container, // 波形容器，必需参数
        cursorColor: "pink", // 光标颜色
        waveColor: "rgba(24, 144, 255,.3)", // 波形颜色
        progressColor: "rgba(24, 144, 255,1)", // 已完成播放的波形颜色
        backend: "MediaElement", // 媒体元素后端
        autoCenter: false, // 不自动居中波形
        plugins: [
          Region.create({
            regions: [
              // { start: 1, end: 3, color: 'hsla(400, 100%, 30%, 0.5)' },
            ],
            dragSelection: true,
          }),
          Cursor.create({
            showTime: true,
            opacity: 1,
            customShowTimeStyle: {
              "background-color": "pink",
              color: "#fb7299",
              padding: "2px 4pX",
              "font-size": "10px",
            },
          }),
          Timeline.create({
            container: this.$refs.waveTimelineRef,
            height: 20,
            timeInterval: 0.5,
            primaryLabelInterval: 5,
            style: {
              fontSize: "10px",
              color: "#6A3274",
            },
          }),
        ],
      });
      this.loadSrc()


      // 点击区域
      this.wavesurfer.on("region-click", (region) => {
        const timer = setTimeout(() => {
          console.log("定时器");
          region.playLoop();
        });
        this.$once("hook:beforeDestroy", () => {
          clearTimeout(timer);
        });
      });

      // 完成拖动或者完成大小调整时触发
      this.wavesurfer.on("region-update-end", (region) => {
        // console.log('egion-update-end',regionList)
        // const regionList = Object.values(this.wavesurfer.regions.list)
        // 清除之前的所有区域
        this.wavesurfer.clearRegions();

        this.$emit("");

        // 保留最后一个区域
        const _region = this.wavesurfer.addRegion({
          start: region.start,
          end: region.end,
          color: "rgba(86, 156, 214,.1)", // 设置颜色，根据需要替换
          dragSelection: true,
          handlesWidth: 2,
          handlesColor: "blue",
          handlesOpacity: 0.8,
        });
        this.$emit("regionUpdate", _region);
        // console.log('VoicePlayer',_region)
        _region.playLoop(); // 循环播放选中区域
        this.createDeleteButton(_region);
        this.lastRegion = _region
        this.isPlay = true
      });

      this.wavesurfer.on("ready", () => {
        // 为每个区域追加一个删除按钮
        const regionList = Object.values(this.wavesurfer.regions.list);
        for (const region of regionList) {
          this.createDeleteButton(region);
        }
      });
    },

    loadSrc() {
      if (this.voiceSrc) {
        this.wavesurfer.load(this.voiceSrc); // 加载音频URL
      }
    },
    clear() {
      console.log('clear');
      this.wavesurfer.clearRegions();
    },
    // todo 给音频添加一个段落 ，供父组件调用 , 传入开始时间和结束时间
    addRegion({ start = 0, end = 0 }) {
      this.wavesurfer.clearRegions();
      // 保留最后一个区域
      const _region = this.wavesurfer.addRegion({
        start: start,
        end: end,
        color: "rgba(86, 156, 214,.1)", // 设置颜色，根据需要替换
        dragSelection: true,
        handlesWidth: 2,
        handlesColor: "blue",
        handlesOpacity: 0.8,
      });
      _region.playLoop(); // 循环播放选中区域
      this.createDeleteButton(_region);
      this.$emit("regionUpdate", _region);
      this.lastRegion = _region
    },

    // 格式化时间
    formatTime(seconds) {
      seconds = Number(seconds);
      const minutes = Math.floor(seconds / 60);
      seconds = seconds % 60;
      let secondsStr = Math.round(seconds).toString();
      secondsStr = seconds.toFixed(2);
      if (minutes > 0) {
        return `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + secondsStr : secondsStr
          }`;
      }
      return `00:${seconds < 10 ? "0" + secondsStr : secondsStr}`;
    },
    // 为区域创建删除按钮
    createDeleteButton(region) {
      if (!region.hasDeleteButton) {
        const deleteButton = region.element.appendChild(
          document.createElement("button")
        );
        deleteButton.innerText = "删除";
        // 点击删除按钮确认删除
        deleteButton.addEventListener("click", (e) => {
          e.stopPropagation();
          this.$confirm("确认删除此区域吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              region.remove();
              this.lastRegion = null
              this.playPause();
              this.$emit('eventName');
            })
            .catch(() => { });
        });
        const css = {
          padding: "2px 4px",
          float: "right",
          position: "relative",
          cursor: "pointer",
          color: "#dfe6ec",
          background: "#4eaaff",
          border: "none",
        };
        region.style(deleteButton, css);
        region.hasDeleteButton = true;
      }
    },
    // 获取区域列表
    getRegions() {
      const regionList = Object.values(this.wavesurfer.regions.list);
      console.log(regionList);
    },
    // 重放
    rebroadcast() {
      this.clearLoop();
      this.wavesurfer.play(0);
    },
    // 停止
    handleStop() {
      this.clearLoop();
      this.wavesurfer.stop();
    },
    // 设置每个区域的loop为false
    clearLoop() {
      const regionList = Object.values(this.wavesurfer.regions.list);
      for (const item of regionList) item.loop = false;
    },
  },
};
</script>
<style >
timeline {
  margin-bottom: 20px !important;
}
</style>
