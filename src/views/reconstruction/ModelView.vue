<script setup>
import { onMounted, onUnmounted, ref} from 'vue'
import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d'

import { ModelScene } from '/src/utils/modelScene'


let modelScene = null
let viewer
// 使用 ref 获取 canvas 元素
const canvasRef = ref(null);

const plyURL = '/point_cloud.ply'
const isFullScreen = ref(false)

// 模拟相机参数数据
const cameraPresets = ref([]);

// 初始化场景
const initScene = () => {
    const canvas = canvasRef.value;
    if (!canvas) {
        console.error('Canvas element not found!');
        return;
    }
    modelScene = new ModelScene(canvas, isFullScreen, cameraPresets.value)
    viewer = new GaussianSplats3D.DropInViewer({
        'gpuAcceleratedSort': false,
        'sphericalHarmonicsDegree': 2,
        'sharedMemoryForWorkers': false,
        'inMemoryCompressionLevel': 0,
    })
    viewer.addSplatScene(plyURL, {
        'position': [0, 0, 0],
        'showLoadingUI': true,
    })
    modelScene.addScene(viewer)

}


onMounted(async () => {
    try {

        // 读取 output.json 文件,后续从后端接收
        const response = await fetch('/output.json'); //  output.json 在 public 目录下
        if (!response.ok) {
            throw new Error('Failed to load camera presets');
        }

        // 解析 JSON 数据
        const data = await response.json();
        cameraPresets.value = data;
        initScene()
    } catch (error) {
        console.error('error', error);
    }
})

onUnmounted(() => {
  if (modelScene) {
        modelScene.dispose(); // 销毁 ModelScene
        modelScene = null;
    }

})


</script>

<template>
    <canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
    width: 100%;
    height: 100%;
    display: block;
    /* 避免 canvas 下方有空白 */
}
</style>
