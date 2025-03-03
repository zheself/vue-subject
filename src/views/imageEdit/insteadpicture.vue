<template>
  <div class="app-container">
    <!-- 整体容器 -->
    <div class="content-container">
      <!-- 输入图片区域 -->
      <div class="input-section">
        <div class="input-images">
          <div class="input-image">
            <p>Input Image 1</p>
            <div class="image-box">上传图片</div>
          </div>
          <div class="input-image">
            <p>Input Image 2</p>
            <div class="image-box">上传图片</div>
          </div>
        </div>
        <div class="actions">
          <el-button type="primary" size="medium" class="action-button">蒙版框选</el-button>
          <el-button type="success" style="margin-left: 0" size="medium" class="action-button">图像生成</el-button>
        </div>
      </div>

      <!-- 进度条 -->
      <div class="progress-section">
        <p>进度条</p>
        <el-progress :percentage="progress" status="success"></el-progress>
      </div>

      <!-- 输出图片区域 -->
      <div class="output-section">
        <div class="output-image">
          <p>Output Image</p>
          <div class="image-box">生成的图片</div>
        </div>
        <div class="output-actions">
          <el-button type="warning" size="medium" class="action-button">重新选择</el-button>
          <el-button type="success" style="margin-left: 0" size="medium" class="action-button">保存到系统</el-button>
          <el-button type="info" style="margin-left: 0" size="medium" class="action-button">保存到本地</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      progress: 0, // 模拟进度
    };
  },
  mounted() {
    // 模拟进度条加载
    this.simulateProgress();
  },
  methods: {
    simulateProgress() {
      let interval = setInterval(() => {
        if (this.progress < 100) {
          this.progress += 10;
        } else {
          clearInterval(interval);
        }
      }, 500);
    },
  },
};
</script>

<style scoped>
/* 外部容器 */
.app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}

/* 内部内容容器 */
.content-container {
  width: 80%;
  max-width: 1000px; /* 限制最大宽度 */
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 输入图片区域 */
.input-section {
  display: flex;
  justify-content: center; /* 改为居中对齐 */
  align-items: center;
  margin-bottom: 20px;
  gap: 40px; /* 为了在中间增加一些间距 */
}

.input-images {
  display: flex;
  gap: 20px;
}

.input-image,
.output-image {
  text-align: center;
}

.image-box {
  width: 200px;
  height: 200px;
  border: 2px dashed #dcdfe6;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #909399;
  background-color: #f5f7fa;
  margin-top: 10px;
  border-radius: 8px;
}

/* 按钮区域 */
.actions,
.output-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center; /* 按钮也居中 */
}

.action-button {
  width: 120px;
  text-align: center;
}

/* 进度条区域 */
.progress-section {
  margin: 20px 0;
  text-align: center;
}

/* 输出图片区域 */
.output-section {
  display: flex;
  justify-content: center; /* 改为居中对齐 */
  align-items: center;
  margin-top: 20px;
  gap: 40px; /* 为了在中间增加一些间距 */
}
</style>
