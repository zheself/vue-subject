<template>
  <div style="display: flex;align-content: center;justify-content: center">
    <div style="width: 500px;height: 100%;">
      <div style="margin-top: 100px;width: 100%;height: 100px">
        <div class="text-container">SMART-<span class="cad-text">ABODE</span></div>
        <div class="input-container">
          <div class="input-wrapper">
            <input type="text" class="input-box" v-model="inputValue" placeholder="Enter text here">
            <button @click="toShow" class="submit-button">Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
      <p>内容由AI生成，无法确保真实准确，仅供参考</p>
    </div>

  <!--      <div style="background: antiquewhite;margin-top: 20px;width: 100%;height: 20px"></div>-->

</template>

<script>
export default {
  name: "show2",
  data() {
    return {
      inputValue: ''
    };
  },
  methods: {
    toShow() {
      this.$router.push('/show')
    },
    populateInput(text) {
      this.inputValue = text;
    }
  }
}
</script>

<style scoped>
.text-container {
  font-size: 2em;
  font-weight: bold;
}

.cad-text {
  background: linear-gradient(to right, #00ff00, #006400);
  /* 从左到右的渐变 */
  background-clip: text;
  /* 将背景裁剪为文本的形状 */
  -webkit-text-fill-color: transparent;
  /* 使文本颜色透明，以便显示背景渐变 */
}


.a {
  font-size: 12px;
  font-family: Consolas;
  margin-top: 7px;
  color: #444444;
}

.input-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  width: 400px;
}

.input-box {
  border: none;
  outline: none;
  padding: 8px;
  margin-bottom: 10px;
  color: #444444;
  /* 将输入框内的文字设置为浅灰色 */
  transition: border-color 0.3s ease;
}

.input-box:focus {
  border-color: rgb(173, 216, 230);
  /* 浅蓝色，使用 rgb 代码 */
  outline: none;
  /* 移除默认的焦点外边框 */
}

.submit-button {
  position: absolute;
  bottom: 10px;
  right: 10px;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(to right, #00ff00, #006400);
  /* 从浅蓝色到深蓝色的渐变 */
  color: #fff;
  cursor: pointer;
  font-size: 0.8em;
  transition: background 0.3s ease;
  /* 过渡效果应用于背景 */
}

.submit-button:hover {
  background: linear-gradient(to right, #0099ff, #002244);
  /* 悬停时的稍微更深的蓝色渐变 */
}

.container-row {
  display: flex;

  width: 500px;
  /* 加长容器行的长度 */
}

.container {
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  margin: 5px;
  cursor: pointer;
  text-align: center;
  font-size: 11px;
  /* 调小容器内字体的大小 */
  font-family: OCR A Tribute Pro Monospaced, monospace;
  transition: background-color 0.3s ease;
  /* 添加过渡效果，使颜色变化更平滑 */
}

.container:hover {
  background-color: #d0e7ff;
  /* 浅蓝色背景 */
}

.container p {
  margin: 0;
}


.footer{
  position: absolute;
  bottom:-5px;
  left: 500px;
  text-align: center; /* 文本居中 */
  font-size: 12px; /* 字体大小 */
  color: #666; /* 字体颜色 */
  padding: 10px 0; /* 上下内边距 */
  border-top: 1px solid #ccc; /* 上边框 */
  margin-top: 10px; /* 页脚与上方内容的间距 */
}
</style>