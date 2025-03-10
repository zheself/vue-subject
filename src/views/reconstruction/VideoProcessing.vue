<script setup>
import { ref } from 'vue';
import progreesing from '@/views/component/progress.vue';

// 定义一个响应式变量，用于控制 progreesing 组件的显示
const isProcessing = ref(false);

// 开始处理的方法，点击按钮时调用
const startProcessing = () => {
  isProcessing.value = true;
};

// 这里可以添加其他方法，如 startTraining、viewPointCloud、cancel 等
const startTraining = () => {
  // 处理开始训练的逻辑
};

const viewPointCloud = () => {
  // 处理查看点云结构的逻辑
};

const cancel = () => {
  // 处理取消的逻辑
};

// 模拟日志信息
const log = ref('');
</script>

<template>
  <div class="container">
    <!-- 视频上传区域 -->
    <div class="video-upload">
      <!-- 根据 isProcessing 的值决定是否显示进度条及提示文字 -->
      <div v-if="isProcessing" class="progress-container">
        <p class="processing-tip">正在处理视频，请稍后</p>
        <progreesing />
      </div>
    </div>

    <!-- 操作按钮区域 -->
    <div class="sidebar">
      <el-upload
        class="upload-box"
        action="#"
        drag
        :show-file-list="false"
      >
        <el-button size="small" type="primary" icon="el-icon-upload">选择文件</el-button>
      </el-upload>
      <el-button class="sidebar-btn" type="primary" @click="startProcessing" icon="el-icon-play">开始处理</el-button>

      <!-- 数据处理信息 -->
      <div class="processing-info">
        <p class="processing-title">数据处理信息</p>
        <div class="log-box">
          <pre>{{ log }}</pre>
        </div>
      </div>

      <!-- 其他操作按钮 -->
      <div class="sidebar-btn-container">
        <el-button class="sidebar-btn" type="success" @click="startTraining" icon="el-icon-data-analysis">开始训练</el-button>
        <el-button class="sidebar-btn"  style="margin-left: 0;" type="info" @click="viewPointCloud" icon="el-icon-s-platform">查看点云结构</el-button>
        <el-button class="sidebar-btn"  style="margin-left: 0" type="danger" @click="cancel" icon="el-icon-close">取消</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 容器布局 */
.container {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa; /* 主体背景色 */
}

/* 视频上传区域 */
.video-upload {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #e0e0e0;
  background: #f0f4fa;
  text-align: center;
  border-radius: 8px; /* 圆角处理 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin: 10px; /* 与边界保持距离 */
}

.video-upload-text {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  padding: 20px;
}

/* 进度条容器样式 */
.progress-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 处理提示文字样式 */
.processing-tip {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

/* 侧边栏区域 */
.sidebar {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-left: 1px solid #e0e0e0;
  background: #ffffff;
  border-radius: 8px; /* 圆角处理 */
  margin: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 上传按钮样式 */
.upload-box {
  margin-bottom: 20px;
  background: #f9f9f9;
  border-radius: 8px; /* 圆角 */
  padding: 15px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.upload-box .el-button {
  font-size: 14px;
}

/* 按钮容器样式 */
/* 按钮容器样式 */
.sidebar-btn-container {
  display: flex;
  flex-direction: column; /* 垂直排列按钮 */
  align-items: stretch; /* 使按钮的宽度一致 */
  width: 100%; /* 确保容器宽度占满 */
}

/* 按钮样式 */
.sidebar-btn {
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  width: 100%; /* 使按钮宽度占满父容器 */
  margin-bottom: 15px;
}

.sidebar-btn .el-icon {
  margin-right: 5px; /* 图标与文字的间距 */
}

/* 数据处理信息样式 */
.processing-info {
  margin: 20px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.processing-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

/* 日志框样式 */
.log-box {
  height: 150px;
  overflow-y: auto;
  background: #f0f0f0;
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  padding: 10px;
  font-family: monospace;
}

.log-box pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 14px;
  color: #555;
}
</style>