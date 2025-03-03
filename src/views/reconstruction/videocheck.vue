<template>
  <div class="app-container">
    <!-- 主显示区域 -->

    <div class="main-display">
      <img src="../assets/example.png" alt="Example Image" class="image-display">
      <div class="circle"></div>
    </div>


    <!-- 工具栏 -->
    <div class="tools-container">
      <div class="tools-panel">
        <div class="tools-header">工具栏</div>

        <!-- 视角类型选择 -->
        <div class="tool-item">
          <label for="view-type">视角类型</label>
          <select id="view-type" class="tool-select">
            <option value="type1">类型1</option>
            <option value="type2">类型2</option>
          </select>
        </div>

        <!-- 角度选择控件 -->
        <div class="tool-item">
          <label for="zeta-angle" class="tool-label">角度 Zeta</label>
          <div class="zeta-container">
            <input
              id="zeta-angle"
              type="number"
              class="zeta-input"
              placeholder="输入角度"
            />
            <span class="zeta-unit">°</span>
          </div>
        </div>

        <!-- 放大缩小按钮 -->
        <div class="tool-item">
          <button @click="zoomOut" class="tool-btn">-</button>
          <button @click="zoomIn" class="tool-btn">+</button>
        </div>

        <!-- 按钮区域 -->
        <div class="tool-item">
          <button @click="resetImage" class="tool-btn">重置图像</button>
          <button @click="saveImage" class="tool-btn">保存图像</button>
        </div>
      </div>

      <!-- 训练信息输出区域 -->
      <div class="training-info">
        <h3>训练输出信息</h3>
        <div class="info-content">
          <p>正在训练模型，请稍等...</p>
          <p>训练进度：50%</p>
          <p>当前损失：0.23</p>
          <p>准确率：95.8%</p>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="control-buttons">
        <button @click="stopTraining" class="tool-btn">停止训练</button>
        <button @click="startTraining" class="tool-btn">模型下载</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomInterface",
  methods: {
    zoomIn() {
      console.log("放大");
    },
    zoomOut() {
      console.log("缩小");
    },
    resetImage() {
      console.log("重置图像");
    },
    saveImage() {
      console.log("保存图像");
    },
    stopTraining() {
      console.log("停止训练");
    },
    startTraining() {
      console.log("模型下载");
    },
  },
};
</script>

<style scoped>
.app-container {
  display: flex;
  height: 100vh;
  background-color: #f4f7fc; /* 背景颜色 */
}

.main-display {
  flex: 3;
  border: 1px solid #dfe1e6;
  border-radius: 10px;
  background-color: #ffffff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.shape {
  width: 50%;
  height: 50%;
  background-color: #f5a623; /* 亮橙色 */
  clip-path: polygon(0 100%, 50% 0, 100% 100%, 70% 100%, 50% 60%, 30% 100%);
  transition: transform 0.3s ease;
}

.circle {
  width: 40px;
  height: 40px;
  background-color: #4a90e2; /* 蓝色 */
  border-radius: 50%;
  position: absolute;
  top: 20%;
  right: 20%;
  transition: transform 0.3s ease;
}

.circle:hover {
  transform: scale(1.2);
}

.tools-container {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tools-panel {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.tools-header {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #333;
  margin-bottom: 15px;
}

.tool-item {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 内部元素的间距 */
  margin-bottom: 15px; /* 每个工具项之间的间距统一为 15px */
}

.tool-item:last-child {
  margin-bottom: 0; /* 最后一个组件无需额外间距 */
}

.tool-item label {
  font-size: 14px;
  color: #666;
}

.tool-select,
.tool-item button {
  font-size: 14px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #dfe1e6;
}

.tool-select {
  height: 40px; /* 调高选择框 */
  font-size: 14px;
  padding: 5px;
  border: 1px solid #dfe1e6;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.tool-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tool-btn:hover {
  background-color: #357ab7;
}

.tool-btn:active {
  background-color: #2c5f88;
}

.tool-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px; /* 增加与上方的间距 */
  position: relative;
  top: 5px; /* 向下移动文字 */
}
/* Zeta 容器样式 */
.zeta-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
}

/* 输入框样式 */
.zeta-input {
  height: 40px;
  width: 100%;
  font-size: 14px;
  padding: 5px 10px;
  padding-right: 30px; /* 为单位留出空间 */
  border: 1px solid #dfe1e6;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-sizing: border-box;
}

/* 单位符号样式 */
.zeta-unit {
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #666;
}

.training-info {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.training-info h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.info-content {
  font-size: 14px;
  color: #666;
}

.control-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.control-buttons button {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-buttons button:first-child {
  background-color: #e74c3c; /* 红色 - 停止训练 */
  color: white;
}

.control-buttons button:first-child:hover {
  background-color: #c0392b;
}

.control-buttons button:first-child:active {
  background-color: #992d22;
}

.control-buttons button:last-child {
  background-color: #2ecc71; /* 绿色 - 继续下一个 */
  color: white;
}

.control-buttons button:last-child:hover {
  background-color: #27ae60;
}

.control-buttons button:last-child:active {
  background-color: #1e8449;
}


.image-display {
  width: 100%; /* 使图片宽度适应容器 */
  height: auto; /* 保持图片比例 */
}

</style>
