<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElContainer, ElMessage } from 'element-plus'
import { UploadFilled, Close, Picture, EditPen, Delete, Download, Upload } from '@element-plus/icons-vue'
import { CanvasManager } from '../utils/canvasManger'
import ImageListDialog from './component/ImageListDialog.vue'
import { } from 'canvas-image-utils';

// 响应式状态
// 抽屉
const drawerVisible = ref(false)
// 背景图
const bgImageUrl = ref(null)
// 产品图
const productImageUrl = ref(null)

// 提示文本
const promptText = ref('')
// 结果图
const resultImageUrl = ref(null)
// 刷子默认大小
const brushSize = ref(20)
// 是否生成结果图
const canGenerate = ref(false)

// 画布创建
const canvasWrapper = ref(null)
let canvasManager = null

const imageListVisible = ref(null)

// 打开图片库
const openImageList = (text) => {

    imageListVisible.value.openDialog(text)
}

// 图库选择传递
const handleSelect = (data) => {

    const {url, type} = data
    console.log(type)
    if (type == 'bg') {
        bgImageUrl.value = url
    } else if (type == 'product') {
        productImageUrl.value =url
    } else {
        console.error(-1)
    }
   
}


// 初始化画布
const initCanvas = async () => {
    if (!bgImageUrl.value) return

    // 等待图片加载完成获取尺寸
    const img = new Image()
    img.crossOrigin = "anonymous";
    img.src = bgImageUrl.value
    await new Promise(resolve => img.onload = resolve)


    // 获取容器宽度
    const containerWidth = canvasWrapper.value.offsetWidth
    // 计算等比高度
    const aspectRatio = img.height / img.width
    const canvasHeight = containerWidth * aspectRatio
    const displayScale = containerWidth / img.width

    // 创建画布
    const canvasEl = document.createElement('canvas')
    canvasWrapper.value.innerHTML = ''
    canvasWrapper.value.appendChild(canvasEl)

    // 初始化画布管理器
    canvasManager = new CanvasManager(canvasEl, bgImageUrl.value, {
        displayWidth: containerWidth,
        displayHeight: canvasHeight,
        originalWidth: img.width,
        originalHeight: img.height,
        displayScale: displayScale
    })
}

// 清除画布
const clearMask = () => {
    canvasManager?.clearCanvas()
    initCanvas()
    brushSize.value = 20 // 默认笔刷大小
}

// 监听背景图变化
watch(bgImageUrl, (newVal) => {
    if (newVal != null) {
        initCanvas()
    }
})



// 下载遮罩图方法
const downloadMask = async () => {
    try {
        // 获取原始遮罩数据
        const maskData = await canvasManager.getMaskData();

        // 创建临时Image对象
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = maskData;

        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });

        // 创建高分辨率画布
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 设置画布尺寸为原始图片大小
        canvas.width = canvasManager.originalWidth;
        canvas.height = canvasManager.originalHeight;

        // 绘制缩放后的图片
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // 生成高质量PNG
        canvas.toBlob(blob => {
            const url = URL.createObjectURL(blob);

            // 创建下载链接
            const link = document.createElement('a');
            link.href = url;
            link.download = `mask-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();

            // 清理资源
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        }, 'image/png', 1.0);
    } catch (error) {
        console.error('下载失败:', error);
        ElMessage.error(`下载失败: ${error.message}`);
    }
};


const clearImage = (text) => {
    if (text == 'bg') {
        bgImageUrl.value = null
    } else {
        productImageUrl.value = null
    }
}

// 处理背景图上传
const handleBgUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        bgImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file.raw)
}

const handleProductUpload = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        productImageUrl.value = e.target.result
    }
    reader.readAsDataURL(file.raw)
}



// 生成处理（模拟接口调用）
const handleGenerate = async () => {
    try {
        // 此处应调用FastAPI接口
        // const formData = new FormData()
        // formData.append('bg', bgImageUrl.value)
        // formData.apppend(mask)
        // formData.append('product', productImageUrl.value)
        // formData.append('prompt', promptText.value)

        // 模拟生成延迟
        await new Promise(resolve => setTimeout(resolve, 1500))

        // 示例结果（实际应替换为API返回数据）
        resultImageUrl.value = 'https://dummyimage.com/600x400/4a90e2/fff&text=Generated+Image'

        ElMessage.success('生成成功')
    } catch (error) {
        ElMessage.error('生成失败: ' + error.message)
    }
}
</script>


<template>
    <el-drawer v-model="drawerVisible" title="生成记录" size="30%" direction="rtl">

        <el-image v-for="url in urls" :key="url" :src="url" lazy />
        <!--  图片以及时间信息；最后可以提供下载功能 -->
    </el-drawer>
    <div class="header">
        <h1>Flux 图像编辑系统</h1>
        <p>基于Flux模型的图像局部重绘与风格迁移工具</p>
        <el-button type="primary" @click="drawerVisible = true">
            查看生成记录
        </el-button>
    </div>
    <div class="container">
        <!-- 左侧操作区 -->
        <div class="left-panel">
            <div class="upload-main-container">
                <div class="image-card-header">
                    <el-icon>
                        <Picture />
                    </el-icon>
                    <b>图片上传</b>
                </div>
                <!-- 背景图上传 -->
                <div class="upload-section">
                    <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :auto-upload="false" :show-file-list="false" :on-change="handleBgUpload" accept="image/*" drag>
                        <!-- 自定义上传区域 -->
                        <div class="upload-area">
                            <!-- 图片按钮 -->
                            <el-tooltip class="box-item" effect="dark" content="从保存图片库选择" placement="right">
                                <el-button v-show="!bgImageUrl" class="cancel-btn" type="info" :icon="Upload"
                                    @click.stop="openImageList('bg')" circle />
                            </el-tooltip>
                            <!-- 预览图显示 -->
                            <div v-if="bgImageUrl" class="preview-overlay">
                                <el-image :src="bgImageUrl" fit="contain" class="preview-image">
                                    <template #error>
                                        <div class="error-tip">图片加载失败</div>
                                    </template>
                                </el-image>
                                <el-button class="cancel-btn" @click.stop="clearImage('bg')" :icon="Close" circle />
                            </div>
                            <!-- 默认提示 -->
                            <div v-else class="upload-prompt">
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    背景图上传区域（必须） <br>
                                    <em>拖拽 </em> 或 <em>点击上传</em>
                                </div>
                            </div>
                        </div>

                    </el-upload>
                   
                </div>

                <div v-show="bgImageUrl" class="upload-section">
                    <!-- <el-image :src="bgImageUrl" class="canvas-view" fit="contain"></el-image> -->
                    <div style="bottom: 2px">
                        <b>遮罩（必须）</b> <br>
                        <div style="font-size: 12px; /* 字体大小 */  color: #666; /* 字体颜色 */">在图中确定重绘的区域</div>
                    </div>
                    <div ref="canvasWrapper" class="canvas-wrapper">
                        <!-- 画布将在此动态创建 -->
                    </div>
                    <div class="canvas-controls">
                        <el-button @click="clearMask">清除遮罩</el-button>
                        <el-slider v-model="brushSize" :min="1" :max="75"
                            @change="brushSize => canvasManager?.setBrushSize(brushSize)" />
                        <el-button type="primary" :icon="Download" @click="downloadMask" circle />
                    </div>
                </div>

                <!-- 产品图上传 -->
                <div class="upload-section">
                    <el-upload action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                        :auto-upload="false" :show-file-list="false" :on-change="handleProductUpload" accept="image/*"
                        drag>
                        <!-- 图片按钮 -->
                        <el-tooltip class="box-item" effect="dark" content="从产品图片库选择" placement="right">
                            <el-button v-show="!productImageUrl" class="cancel-btn" type="info" :icon="Upload"
                                @click.stop="openImageList('product')" circle />
                        </el-tooltip>
                        <!-- 自定义上传区域 -->
                        <div class="upload-area">
                            <!-- 预览图显示 -->
                            <div v-if="productImageUrl" class="preview-overlay">
                                <el-image :src="productImageUrl" fit="contain" class="preview-image">
                                    <template #error>
                                        <div class="error-tip">图片加载失败</div>
                                    </template>
                                </el-image>
                                <el-button class="cancel-btn" @click.stop="clearImage('product')" :icon="Close"
                                    circle />
                            </div>
                            <!-- 默认提示 -->
                            <div v-else class="upload-prompt">
                                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                                <div class="el-upload__text">
                                    产品图上传区域（可选） <br>
                                    <em>拖拽 </em> 或 <em>点击上传</em>
                                </div>
                            </div>
                        </div>

                    </el-upload>
                </div>
                <ImageListDialog ref="imageListVisible" mode="select" @select="handleSelect" />
            </div>

            <div class="prompt-main-container">
                <div class="prompt-card-header">
                    <el-icon>
                        <EditPen />
                    </el-icon>
                    <b>文字描述</b>
                </div>
                <!-- Prompt输入 -->
                <el-input v-model="promptText" type="textarea" :rows="4" placeholder="请描述你的图片改变风格（如：赛博朋克风格，背景加入霓虹灯效果）"
                    class="prompt-input" />

                <el-button type="success" @click="handleGenerate" :disabled="!canGenerate">
                    生成图像
                </el-button>
            </div>

        </div>



        <!-- 右侧结果展示 -->
        <div class="right-panel">
            <div class="right-header">结果所用时间:30s-1min</div>
            <div v-if="resultImageUrl" class="result-preview">
                <el-image :src="resultImageUrl" fit="contain" :preview-src-list="[resultImageUrl]" />
                <div class="result-actions">
                    <el-button type="primary">下载结果</el-button>
                    <el-button @click="resultImageUrl = null">清除</el-button>
                </div>
            </div>
            <div v-else class="empty-tip">
                <el-icon :size="50">
                    <Picture />
                </el-icon>
                <p>生成结果将在此处显示</p>
                <div>仅供参考</div>
            </div> 
           
        </div>

    </div>
</template>



<style scoped>
.header {
    background: white;
    padding: 20px;
    border-radius: 8px;
    /* margin-bottom: 10px; */
}

.header h1 {
    margin: 0;
    font-size: 24px;
    color: #303133;
}

.header p {
    margin: 8px 0 16px;
    color: #606266;
    font-size: 14px;
}

.container {
    display: flex;
    height: 100vh;
    padding: 20px;
    gap: 30px;
}


.left-panel {
    flex: 0 0 500px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.right-panel {
    flex: 1;
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 20px;
}

.upload-main-container {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow-y: auto;
}


.upload-section {
    border: 1px solid #ebeef5;
    border-radius: 8px;
    padding: 15px;
}


.upload-area {
    position: relative;
    width: 100%;
    height: 200px;

    border: 2px dashed #dcdfe6;
    border-radius: 8px;
}

.preview-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.preview-image {
    width: 100%;
    height: 100%;
    border-radius: 6px;
}

.upload-prompt {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 1;
}

.cancel-btn {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 3;
}

::v-deep(.el-upload-dragger) {
    padding: 0;
    overflow: visible;
}


.canvas-view {
    width: 100%;
    height: auto;
}


.canvas-container {
    position: relative;
    width: 100%;
}

.canvas-wrapper {
    margin: 0 auto;
    max-width: 100%;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
    /* background: #f8f9fa; */
    line-height: 0;
    /* 消除图片下方间隙 */
}

.canvas-controls {
    margin-top: 10px;
    padding: 10px;
    background: #f8f9fa;
    border-radius: 8px;
    display: flex;
    gap: 10px;
    align-items: center;
}

.canvas-controls .el-slider {
    flex: 1;
    max-width: 200px;
}



.prompt-main-container {
    background: white;
    border-radius: 6px;
    padding: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}


.prompt-input {
    margin-top: 20px;
}

.result-preview {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.result-actions {
    margin-top: 20px;
    display: flex;
    gap: 15px;
    justify-content: center;
}

.empty-tip {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #909399;
}
</style>