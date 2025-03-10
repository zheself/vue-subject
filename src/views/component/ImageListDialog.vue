<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete, Picture, Download } from '@element-plus/icons-vue'

/*
管理模式下可以删除与下载图像
选择模式下可以下载与选择图像，用来供用户上传图片
*/
const props = defineProps({
  mode: {
    type: String,
    default: 'manage', // 'manage' 或 'select'
    validator: value => ['manage', 'select'].includes(value)
  }
})

// 懒加载配置
const lazyLoadingOptions = ref({
  loading: '/loading.gif', // 加载中的占位图
  error: '/error.png',     // 加载失败的占位图
  threshold: 0.1,         // 触发加载的阈值（视口比例）
  scrollContainer: '.scroll-container' // 滚动容器选择器
})

// 检查图片是否存在的函数
const checkImageExists = (imagePath) => {
  const img = new Image()
  img.src = imagePath
  return new Promise((resolve) => {
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
  })
}

// 生成图片列表
const generateMockImages = async () => {
  const images = []

  // 使用 import.meta.glob 获取图片列表
  const imageModules = import.meta.glob('/src/assets/picture/*.jpg')

  let id = 1
  for (const path in imageModules) {
    const exists = await checkImageExists(path)
    if (exists) {
      const filename = path.split('/').pop()
      images.push({
        id: id++,
        url: path,
        filename: filename,
        createdAt: new Date().toISOString()
      })
    }
  }

  return images
}

const dialogVisible = ref(false)
const images = ref([])
let imageType

// 初始化图片列表
generateMockImages().then((mockImages) => {
  images.value = mockImages
})

// 定义emit事件
const emit = defineEmits(['select'])

const openDialog = (text) => {
  dialogVisible.value = true
  imageType = text
  console.log(imageType)
}

// 图片点击处理
const handleImageClick = (image) => {
  if (props.mode === 'select') {
    emit('select', { url: image.url, type: imageType })
    dialogVisible.value = false
  }
}

// 删除图片（静态操作）
const handleDelete = (id) => {
  ElMessageBox.confirm('确认删除该图片吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    images.value = images.value.filter(img => img.id !== id)
    ElMessage.success('删除成功（静态演示）')
  })
}

// 预览图列表
const previewList = computed(() => {
  return images.value.map(img => img.url)
})

// 时间格式化
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

// 需要暴露给父组件的方法
defineExpose({
  openDialog
})
</script>

<template>
  <div>
    <el-dialog v-model="dialogVisible" title="图片管理" width="80%">
      <!-- 图片列表容器添加scroll-container类 -->
      <div class="image-container scroll-container">
        <div v-for="(image, index) in images" :key="image.id" class="image-item"
             @click="handleImageClick(image)">
          <div class="image-wrapper">
            <div v-if="mode === 'manage'">
              <!-- 添加lazy属性并指定滚动容器 -->
              <el-image v-if="image.url" :src="image.url" :preview-src-list="previewList" class="image" lazy
                        :scroll-container="'.scroll-container'" :loading="lazyLoadingOptions.loading"
                        :error="lazyLoadingOptions.error" :preview-teleported="true" :initial-index=index>
                <!-- 加载占位内容 -->
                <template #placeholder>
                  <div class="image-skeleton">
                    <el-skeleton :rows="0" animated/>
                  </div>
                </template>
                <!-- 错误状态显示 -->
                <template #error>
                  <div class="image-error">
                    <el-icon>
                      <Picture/>
                    </el-icon>
                    <span>加载失败</span>
                  </div>
                </template>
              </el-image>
              <div v-else class="image-error">
                <span>图片待保存</span>
              </div>
              <div class="image-actions">
                <!-- 仅在管理模式下显示操作按钮 -->
                <el-button type="info" :icon="Download" circle size="small" class="download-btn"
                           @click.stop="handleDownload(image.id)"/>
                <el-button type="danger" :icon="Delete" circle size="small" class="delete-btn"
                           @click.stop="handleDelete(image.id)"/>
              </div>
            </div>
            <div v-else>
              <img v-if="image.url" :src="image.url" class="image"/>
              <div v-else class="image-error">
                <span>图片待保存</span>
              </div>
            </div>
          </div>
          <div class="image-info">
            <span>{{ image.filename }}</span>
            <span>{{ formatTime(image.createdAt) }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 添加滚动容器样式 */
.scroll-container {
  max-height: 60vh;
  overflow-y: auto;
}

/* 优化懒加载样式 */
.image-skeleton {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
}

.image-error {
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  background: #f5f7fa;
}

.image-error .el-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.image-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  max-height: 60vh;
  /* 控制容器高度 */
  overflow-y: auto;
  /* 启用垂直滚动 */
  padding: 10px;
}

.image-item {
  width: 200px;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
}

.image-item:hover {
  transform: translateY(-2px);
}

.image-wrapper {
  position: relative;
  height: 200px;
  cursor: pointer;
}

.image {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s;
}

.image:hover {
  opacity: 0.9;
}

.image-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.image-wrapper:hover .image-actions {
  opacity: 1;
}

.delete-btn {
  background-color: rgb(118, 97, 97);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.download-btn {
  background-color: rgb(118, 97, 97);
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.delete-btn:hover {
  background-color: #ff5757;
}

.download-btn:hover {
  background-color: #5d5e5f6a;
}

.image-info {
  padding: 12px;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 1.4;
}

.image-info span:first-child {
  font-weight: 500;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-info span:last-child {
  color: #666;
  font-size: 11px;
}
</style>