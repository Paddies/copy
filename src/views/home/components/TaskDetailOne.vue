<template>
  <div class="layout-container">
        <div class="box">
          <div class="tab_wrap">
            <a v-for="(item, index) in tabList" :key="index" :class="{ active: selectedIndex === index }"
              @click="selectItem(index)" :href="item.href">{{ item.name }}</a>
            <!-- <a    href="#section1">任务说明</a>
            <a href="#tab2">任务要求</a>
            <a href="#tab3">结算标准</a> -->
          </div>
          <div class="cont_wrap">
            <div class="task_title">
              <span class="line"></span>
              <span id="section1">任务说明</span>
            </div>
            <div class="task_cont">
              <p>目前题型可分为6种</p>
              <p>
                1.选择题（无需解释）
              </p>
              <p>2.判断题（无需解释）</p>
              <p>
                3.填空题（无需解释）
              </p>
              <p>
                4.解答题<br>
                <small>解答题包括数学的解答题，中文的论述题，简答题，问答题，名词解释,分析题等等题型</small>
              </p>
              <p>
                5.作图题<br>
                <small>顾名思义，作图题就是提出要求需要你画图的题型就是作图题</small>
              </p>
              <p>
                6.其他题<br>
                <small>其他题包括写作题，修改病句，修改错字等等题型</small>
              </p>
            </div>
          </div>
          <div class="cont_wrap">
            <div class="task_title">
              <span class="line"></span>
              <span id="section2">任务要求</span>
            </div>
            <div class="task_cont">
              <h3>一.题目页码以及题目编号</h3>
              <p>
                1.题目页码<br>
                <small> 题目页码填写PDF部分的页码部分</small><br>
                <small class="text-color"> 例如下题为PDF中35页中的第7页，则题目页码为7</small>

              </p>
              <el-image :src="src"></el-image>
              <p>
                2.题目编号<br>
                <small> 题目编号格式为（大题编号.小题编号）</small><br>
                <small class="text-color"> 例如下题为第二大题选择题的第二小题，则题目编号为：二.2</small>

              </p>
              <el-image :src="src2"></el-image>
            </div>
            <div class="task_cont">
              <h3>二.图片切分</h3>
              <p>
                1.分类<br>
                <small> 标注题型分为大题和小题两种，大题是指一个问题有多个单独的问题</small><br>
                <small>第一种：大题</small><br>
                <small class="text-color"> 例如下面这种应用题，判断题公用一个题干，则为大题（包含英文阅读理解，完形填空等)</small>
              </p>
              <el-image :src="src3"></el-image>
              <el-image :src="src4"></el-image>
              <el-image :src="src5"></el-image>
              <el-image :src="src6"></el-image>
              <p> <small class="text-color"> 注：大题中的每个小题都需要借助题干才能解答</small></p>
              <p>
                第二种：小题<br>
                <small class="text-color">例如下面这种选择题，判断题，论述题，简答题，名词解释，论述都是独立 分开的题干，则是小题</small>
              </p>
              <el-image :src="src7"></el-image>
              <p><small class="text-color">上图中为 4 个小题，4 个小题分别都是拥有单个题干</small></p>
              <el-image :src="src8"></el-image>
              <p><small class="text-color">上图中为 8 个小题 8 个小题分别都是拥有单个题干</small></p>
              <el-image :src="src9"></el-image>
              <p><small class="text-color">上图中为 5 个小题 5 个小题分别都是拥有单个题干</small></p>
              <el-image :src="src10"></el-image>
              <p><small class="text-color">图中为 1 个小题 单独拥有 1 个题干</small></p>
              <el-image :src="src11"></el-image>
              <p><small class="text-color">注：每个小题单独拥有自己的题干部分， 自己单独可解答</small></p>
              <p>
                2.题目图片切分<br>
                <span>题目图片分为 2 个部分<span class="text-color"> 题目截图，大题中的子题单独截图</span></span><br>
                <small>（注：答案和解析不需要截图）</small><br>
              </p>
              <p>第一种：大题<br>
                <span>例：下图中的解答题为大题，一个题干中包含多个子题目，这时候我们 需要
                  切分的顺序为：题目一选图为整个题目截图，然后添加小题卡片，子 题一单
                  独截图放在一小题卡片中，子题二单独截图放在二小题卡片中，以此类推,答
                  <span class="text-color">如果题目没有答案和解析，则需要删除答案和解析卡片</span>
                </span>
              </p>
              <el-image :src="src12"></el-image><br>
              <el-image :src="src13"></el-image><br>
              <el-image :src="src14"></el-image>
              <p>第二种：小题<br>
                <span>例：下图的解答题为小题，一个题干中只有一个子题，这时我们需要切分的数
                  据截图只需要整个题目的截图即可，也就是只需要一个题目一的卡片。
                  <span class="text-color">如果题目没有答案和解析，则需要删除答案和解析卡片</span>
                </span>
              </p>
              <el-image :src="src15"></el-image>
              <p>注：<span class="text-color">切图时如果遇到一个题目出现在两页，则有几页就截几页的图，不需要额外 拼接成一张</span></p>
              <el-image :src="src16"></el-image>
              <el-image :src="src17"></el-image>
              <p class="text-color">截图需要保证像素清楚，没有黑边黑框，没有切边，不能包含任何非本题数据</p>
            </div>
            <div class="task_cont">
              <h3>三．题目文本转写</h3>
              <p>
                题目的转写要求：<br>
                <small> 题目的转写要求：</small><br>
                <small>1. 不能漏字错字，不能漏标点错标点，转写时检查清楚文本标点是否与试卷图 上一致</small><br>
                <small>2.出现试卷明显有部分缺失的需要及时和组长质检进行截图报备，如下图选择题 因为有部分数据缺失，需要及时向上截图报备。</small>
              </p>
              <el-image :src="src18"></el-image>
              <p><small>3.遇到一些奇奇怪怪的符号的时候可以在输入法中寻找，都是可以找出来的</small>
              </p>
              <el-image :src="src19"></el-image>
              <p><small>4.遇到一些无法在输入法中打出的符号，需要用到双&lt;latex&gt;&lt;标签</small><br>
                <small class="text-color">在转写时遇到其他奇怪的符号时，再截图提问。</small><br>
                <small>例如：文字下划线：\underline{文字部分}</small>
              </p>
              <el-image :src="src20"></el-image>
              <p>根号：\sqrt{公式部分}</p>
              <el-image :src="src21"></el-image>
              <p>分数：\frac{分子}{分母}</p>
              <el-image :src="src22"></el-image>
              <p>在转写数学公式部分时需要用到大量公式：可以去公式编辑器网站查找 https://www.latexlive.com/home##</p>
              <el-image :src="src23"></el-image>
              <p class="text-color">
                所有键盘打不出的符号需要用到反斜杠公式的，都需要在公式前后加上双&lt;latex&gt;&lt;/latex&gt; 标签。
              </p>
              <p class="text-color">
                注意： latex 预览仅用来预览带了双&lt;latex&gt;&lt;/latex&gt;标签的公式部分，文字部分全部以文本框为主
              </p>
              <p></p>
            </div>
            <div class="task_cont">
              <h3>四．卡片部分标注流程</h3>
              <p>
                卡片部分标注流程<br>
                <span class="text-color">题目 1（整体截图+主题干转写）—— 小题 1（子题 1 单独截图+子题 1 转写）— — 小题 2（子题 2 单独截图+子题 2 转写） · · · · ·
                  ·</span>
              </p>
              <p>
                在有答案和解析时，题目转写的卡片顺序为<br>
                <span class="text-color">题目 1（整体截图+主题干转写）—— 小题 1（子题 1 单独截图+子题 1 转写）— — 小题 2（子题 2 单独截图+子题 2 转写）——答案 1（答案 1
                  转写）——答案 2 （答案 2 转写）——解析 1（解析 1 转写）——解析 2（解析 2 转写）
                  答案和解析不需要上传截图，没有答案和解析时，答案和解析卡片需要删除</span>
              </p>
              <p>整张数据遇到做不了的请舍弃，并且在 json 定制数据填写原因。就算有一张可 以做都不能舍弃，把可以做的那张完成</p>
              <p>例如：横屏试卷，模糊试卷，内容字体被截断试卷。</p>
            </div>
            </div>
            <div class="cont_wrap">
              <div class="task_title">
                <span class="line"></span>
                <span id="section3">结算标准</span>
              </div>
              <div class="task_cont">
                <p>框准合格率需达到95%或以上</p>
              </div>
            </div>
          </div>
    </div>
</template>

<script>
import VueScrollTo from 'vue-scrollto'
export default {
  name: 'TaskDetailOne',
  data() {
    return {
      src: require("@/assets/detail/1.png"),
      src2: require("@/assets/detail/2.png"),
      src3: require("@/assets/detail/3.png"),
      src4: require("@/assets/detail/4.png"),
      src5: require("@/assets/detail/5.png"),
      src6: require("@/assets/detail/6.png"),
      src7: require("@/assets/detail/7.png"),
      src8: require("@/assets/detail/8.png"),
      src9: require("@/assets/detail/9.png"),
      src10: require("@/assets/detail/10.png"),
      src11: require("@/assets/detail/11.png"),
      src12: require("@/assets/detail/12.png"),
      src13: require("@/assets/detail/13.png"),
      src14: require("@/assets/detail/14.png"),
      src15: require("@/assets/detail/15.png"),
      src16: require("@/assets/detail/16.png"),
      src17: require("@/assets/detail/17.png"),
      src18: require("@/assets/detail/18.png"),
      src19: require("@/assets/detail/19.png"),
      src20: require("@/assets/detail/20.png"),
      src21: require("@/assets/detail/21.png"),
      src22: require("@/assets/detail/22.png"),
      src23: require("@/assets/detail/23.png"),
      tabList: [{
        id: 1, name: '任务说明', href: "#section1"
      }, {
        id: 2, name: '任务要求', href: "#section2"
      }, {
        id: 3, name: '结算标准', href: "#section3"
      },],
      selectedIndex: 0
    };
  },
  methods: {
    scrollToSection() {
      VueScrollTo.scrollTo('#section1', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
      VueScrollTo.scrollTo('#section2', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
      VueScrollTo.scrollTo('#section3', 500, { easing: 'ease-in' }) // 滚动到指定的目标位置，可以设置滚动时间和缓动效果
    },
    selectItem(index) {
      this.selectedIndex = index; // 更新选中的索引
    }
  },
  mounted() {
  },
};
</script>

<style lang="scss" scoped>
.layout-container {
  width: 100%;
  // height: 100vh;
  background-color: #f7f8fa;

  

    .box {
      box-sizing: border-box;
      padding: 48px;
      border-radius: 8px;
      background: var(--color-text-5, #fff);
    }

   

    .tab_wrap {
      width: 480px;
      height: 80px;
      line-height: 80px;
      background-color: #f7f8fa;

      a {
        float: left;
        display: block;
        /* 将 span 元素变成块级元素 */
        width: 150px;
        height: 60px;
        font-size: 20px;
        color: #4e5969;
        margin: 10px 5px;
        text-align: center;
        line-height: 60px;
        cursor: pointer;
      }

      a.active {
        color: #1d2129;
        background: var(--color-text-5, #fff);

      }
    }

    .cont_wrap {
      margin-top: 48px;

      .task_title {
        font-size: 24px;
        color: #1d2129;

        span {
          vertical-align: middle;
        }

        span:last-child {
          margin-left: 16px;
        }

        .line {
          display: inline-block;
          width: 3px;
          height: 26px;
          background: #3382ff;
        }
      }
      .task_cont {
        font-size: 20px;
        color: #4e5969;

        .small {
          font-size: 12px;
        }

        .text-color {
          color: red;
        }
      }
    }
  }

</style>