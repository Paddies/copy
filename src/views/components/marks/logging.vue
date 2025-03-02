<template>
  <div>
    <el-form :mode="form">
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- <el-form-item label="题目录入"> -->
          <p class="title">题目录入</p>
          <div class="drops" v-if="!disabled">
            <el-popover placement="bottom" trigger="click">
              <p>运算符 Binary operations</p>
              <div class="symbol" @click="insetSymbol">
                <span
                  v-katex="' \\ll '"
                  @click="insetSymbol('\\ll', 'topicQuestion')"
                ></span>
                <span
                  v-katex="' \\lim '"
                  @click="insetSymbol('\\lim', 'topicQuestion')"
                ></span>
                <span
                  v-katex="' \\lim_{x \\to \\infty} '"
                  @click="
                    insetSymbol('\\lim_{x \\to \\infty}', 'topicQuestion')
                  "
                ></span>
                <span
                  v-katex="' \\sqrt[y]{x} '"
                  @click="insetSymbol('\\sqrt[y]{x}', 'topicQuestion')"
                ></span>
                <span
                  v-katex="'  {\\textstyle \\sum_{a}^{b}} '"
                  @click="
                    insetSymbol('{\\textstyle \\sum_{a}^{b}}', 'topicQuestion')
                  "
                ></span>
              </div>
              <el-button size="mini" slot="reference">运算符</el-button>
            </el-popover>
            <el-popover placement="bottom" trigger="hover">
              <p>插入XML标签</p>
              <div class="symbol" @click="insetSymbol">
                <span @click="insetTag('quiz', 'topicQuestion')">quiz</span>
                <span @click="insetTag('ans', 'topicQuestion')">ans</span>
                <span @click="insetTag('span', 'topicQuestion')">span</span>
                <span @click="insetTag('latex', 'topicQuestion')">latex</span>
              </div>
              <el-button size="mini" slot="reference">插入XML标签</el-button>
            </el-popover>
            <!-- <el-button size="mini" :loading="latexLoading.topicQuestion" @click="printscreen('topicQuestion')" :disabled="printscreenDisabled">截图</el-button> -->
          </div>
          <el-input
            id="topicQuestion"
            type="textarea"
            rows="10"
            v-model="form.topicQuestion"
            data-type="topicQuestion"
            placeholder="请录入题目"
            :spellcheck="false"
            :disabled="disabled"
            @focus="focus"
            @change="changeTopic"
          ></el-input>
          <!-- </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <p>LaTex预览</p>
          <div
            v-katex="form.topicQuestion"
            readonly
            ref="katex_question"
            style="max-width: 360px; margin-top: 50px; overflow: auto"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <p class="title">答案录入</p>
          <div class="drops" v-if="!disabled">
            <el-popover placement="bottom" trigger="click">
              <p>运算符 Binary operations</p>
              <div class="symbol" @click="insetSymbol">
                <span
                  v-katex="' \\ll '"
                  @click="insetSymbol('\\ll', 'topicAnswer')"
                ></span>
                <span
                  v-katex="' \\lim '"
                  @click="insetSymbol('\\lim', 'topicAnswer')"
                ></span>
                <span
                  v-katex="' \\lim_{x \\to \\infty} '"
                  @click="insetSymbol('\\lim_{x \\to \\infty}', 'topicAnswer')"
                ></span>
                <span
                  v-katex="' \\sqrt[y]{x} '"
                  @click="insetSymbol('\\sqrt[y]{x}', 'topicAnswer')"
                ></span>
                <span
                  v-katex="'  {\\textstyle \\sum_{a}^{b}} '"
                  @click="
                    insetSymbol('{\\textstyle \\sum_{a}^{b}}', 'topicAnswer')
                  "
                ></span>
              </div>
              <el-button size="mini" slot="reference">运算符</el-button>
            </el-popover>
            <el-popover placement="bottom" trigger="hover">
              <p>插入XML标签</p>
              <div class="symbol" @click="insetSymbol">
                <span @click="insetTag('quiz', 'topicAnswer')">quiz</span>
                <span @click="insetTag('ans', 'topicAnswer')">ans</span>
                <span @click="insetTag('span', 'topicAnswer')">span</span>
                <span @click="insetTag('latex', 'topicAnswer')">latex</span>
              </div>
              <el-button size="mini" slot="reference">插入XML标签</el-button>
            </el-popover>
          </div>
          <!-- <el-form-item label="答案录入"> -->
          <el-input
            id="topicAnswer"
            type="textarea"
            rows="10"
            v-model="form.topicAnswer"
            data-type="topicAnswer"
            :disabled="disabled"
            placeholder="请录入题目答案"
            :spellcheck="false"
            @focus="focus"
            @change="changeAnswer"
          ></el-input>
          <!-- </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <p>LaTex预览</p>
          <div
            v-katex="form.topicAnswer"
            readonly
            ref="katex_answer"
            style="max-width: 360px; margin-top: 50px; overflow: auto"
          />
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <!-- <el-form-item label="解析录入"> -->
          <p class="title">解析录入</p>
          <div class="drops" v-if="!disabled">
            <el-popover placement="bottom" trigger="click">
              <p>运算符 Binary operations</p>
              <div class="symbol">
                <span
                  v-katex="' \\ll '"
                  @click="insetSymbol('\\ll', 'topicAnalysis')"
                ></span>
                <span
                  v-katex="' \\lim '"
                  @click="insetSymbol('\\lim', 'topicAnalysis')"
                ></span>
                <span
                  v-katex="' \\lim_{x \\to \\infty} '"
                  @click="
                    insetSymbol('\\lim_{x \\to \\infty}', 'topicAnalysis')
                  "
                ></span>
                <span
                  v-katex="' \\sqrt[y]{x} '"
                  @click="insetSymbol('\\sqrt[y]{x}', 'topicAnalysis')"
                ></span>
                <span
                  v-katex="'  {\\textstyle \\sum_{a}^{b}} '"
                  @click="
                    insetSymbol('{\\textstyle \\sum_{a}^{b}}', 'topicAnalysis')
                  "
                ></span>
              </div>
              <el-button size="mini" slot="reference">运算符</el-button>
            </el-popover>
            <el-popover placement="bottom" trigger="hover">
              <p>插入XML标签</p>
              <div class="symbol" @click="insetSymbol">
                <span @click="insetTag('quiz', 'topicAnalysis')">quiz</span>
                <span @click="insetTag('ans', 'topicAnalysis')">ans</span>
                <span @click="insetTag('span', 'topicAnalysis')">span</span>
                <span @click="insetTag('latex', 'topicAnalysis')">latex</span>
              </div>
              <el-button size="mini" slot="reference">插入XML标签</el-button>
            </el-popover>
          </div>
          <el-input
            id="topicAnalysis"
            type="textarea"
            rows="10"
            v-model="form.topicAnalysis"
            data-type="topicAnalysis"
            placeholder="请录入题目解析"
            :spellcheck="false"
            :disabled="disabled"
            @focus="focus"
            @change="changeAnalysis"
          ></el-input>
          <!-- </el-form-item> -->
        </el-col>
        <el-col :span="12">
          <p>LaTex预览</p>
          <div
            v-katex="form.topicAnalysis"
            readonly
            ref="katex_analysis"
            style="max-width: 360px; margin-top: 50px; overflow: auto"
          />
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import katex from "katex";
import "katex/dist/katex.min.css";
import { latexImage } from "@/api/tool/gen";
export default {
  props: {
    disabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      form: {
        topicQuestion: "",
        topicAnswer: "",
        topicAnalysis: "",
      },
      latexLoading: {
        topicQuestion: false,
        topicAnswer: false,
        topicAnalysis: false,
      },
      printscreenDisabled: false, // 是否可点击截屏按钮
    };
  },
  mounted() {},
  methods: {
    /**
     * description{聚焦}
     *
     **/
    focus(e) {
      this.$emit("showDialog", {
        show: true,
        type: e.target.dataset.type,
      });
    },
    changeTopic() {
      this.$emit("change", this.form);
      katex.render(this.form.topicQuestion, this.$refs.katex_question, {
        throwOnError: false,
      });
    },
    changeAnswer() {
      this.$emit("change", this.form);
      katex.render(this.form.topicAnswer, this.$refs.katex_answer, {
        throwOnError: false,
      });
    },
    changeAnalysis() {
      this.$emit("change", this.form);
      katex.render(this.form.topicAnalysis, this.$refs.katex_analysis, {
        throwOnError: false,
      });
    },
    /**
     *@Description: 插入数学公式
     *@param {类型} e - 插入的公式,
     *@param {类型} type - 类型,
     *@return {undefined} - 返回值描述
     */
    insetSymbol(e, type) {
      if (type === "topicQuestion") {
        this.form.topicQuestion += e;
        this.changeTopic();
      } else if (type === "topicAnswer") {
        this.form.topicAnswer += e;
        this.changeAnswer();
      } else if (type === "topicAnalysis") {
        this.form.topicAnalysis += e;
        this.changeAnalysis();
      }
    },
    /**
     *@Description: 插入标签
     *@param {类型} tag - 标签名,
     *@param {类型} type - 类型,
     *@return {undefined} - 返回值描述
     */
    insetTag(tag, type) {
      const _dom = document.getElementById(type);
      // 字符串截取
      const str = this.form[type].slice(_dom.selectionStart, _dom.selectionEnd);
      this.form[type] = `${this.form[type].slice(
        0,
        _dom.selectionStart
      )}<${tag}>${str}</${tag}>${this.form[type].slice(
        _dom.selectionEnd,
        this.form[type].length
      )}`;
      if (type === "topicQuestion") {
        this.changeTopic();
      } else if (type === "topicAnswer") {
        this.changeAnswer();
      } else if (type === "topicAnalysis") {
        this.changeAnalysis();
      }
    },
    // 截图
    printscreen(type) {
      this.latexLoading[type] = true;
      this.$emit("printscreen", type);
      // latexImage().then(res => {
      //   console.log(res)
      // })
    },
    /**
     *@Description: 上传图片至服务端解析成字符串回显，并解析数学符号
     *@params {string} url - 上传服务器的地址,
     *@params {string} type - topicQuestion、topicAnalysis、topicAnswer,
     *@return {undefined} - 返回值描述
     */
    getLatexString(id, type) {
      // console.log(url, type)
      latexImage({ fileId: id }).then((res) => {
        this.latexLoading[type] = false;
        this.$modal.closeLoading();
        if (res.code === 200) {
          const obj = {
            topicQuestion: "katex_question",
            topicAnalysis: "katex_analysis",
            topicAnswer: "katex_answer",
          };
          this.form[type] = res.data.data;
          this.$emit("change", this.form);
          katex.render(this.form[type], this.$refs[obj[type]], {
            throwOnError: false,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  text-align: left;
  margin: 0;
}
.drops {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin: 10px 0;
}
.symbol {
  display: flex;
  align-items: center;
  gap: 10px;
  > span {
    min-width: 26px;
    height: 26px;
    line-height: 26px;
    display: block;
    cursor: pointer;
    text-align: center;
    background-color: #f4f4f4;
  }
}
</style>
