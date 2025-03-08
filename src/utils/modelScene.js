import * as THREE from 'three'

import { CameraController } from './cameraController'
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"


export class ModelScene {
    canvas
    renderer
    camera
    width
    height
    gui

    constructor(el, initialFullScreen, cameraPresets = []) {
        if (!el) {
            throw new Error('Canvas element is required.');
        }
        this.cameraPresets = cameraPresets; // 新增相机参数
        this.canvas = el
        this.currentCameraIndex = 0;
        this.isFullScreen = false
        this.gui = null
        this.stats = null;
        this.init()
    }

    init() {
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.initGUI()
        this.createController()
        this.animate()
        this.resize()
    }

    // 创建场景
    setScene() {
        this.scene = new THREE.Scene()
    }
    // 添加场景
    addScene(viewer) {
        this.scene.add(viewer)
    }

    // 设置摄像机
    setCamera() {
        const preset = this.cameraPresets[this.currentCameraIndex];
        // 如果没有 preset，使用默认值
        const width = preset ? preset.width : this.canvas.clientWidth;
        const height = preset ? preset.height : this.canvas.clientHeight;
        const fov = preset ? this.#calculateFOV(preset.fy, height) : 75; // 默认 FOV 为 75 度
        console.log(fov)
        this.camera = new THREE.PerspectiveCamera(
            fov,
            width / height,
            0.01,
            1000
        )
        // 应用初始相机参数
        if (preset) {
            this.#applyCameraPreset(this.currentCameraIndex);
        } else {
            // 默认相机位置
            this.camera.position.set(0, 0, 10);
            this.camera.lookAt(0, 0, 0);
        }

        this.scene.add(this.camera)
    }



    // 相机参数应用方法
    #applyCameraPreset(cameraIndex) {
        const preset = this.cameraPresets[cameraIndex];
        if (!preset) return;

        // 坐标系转换：COLMAP (X右,Y下,Z前) → Three.js (X右,Y上,Z后)
        const adjustMatrix = new THREE.Matrix4().makeRotationFromEuler(
            new THREE.Euler(Math.PI, 0, 0) // 翻转Y轴和Z轴
        );
        // 提取四元数
        const adjustQuaternion = new THREE.Quaternion();
        adjustMatrix.extractRotation(adjustMatrix).decompose(
            new THREE.Vector3(), // 不需要位置
            adjustQuaternion,    // 提取四元数
            new THREE.Vector3()  // 不需要缩放
        );

        // 创建相机四元数
        const quaternion = new THREE.Quaternion(
            preset.quaternion[1], // x
            preset.quaternion[2], // y
            preset.quaternion[3], // z
            preset.quaternion[0]  // w
        );

        // 旋转矩阵
        const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion);
        const inverseRotation = rotationMatrix.clone().transpose()
        const cameraPosition = new THREE.Vector3()
            .fromArray(preset.translation)
            .applyMatrix4(inverseRotation)
            .multiplyScalar(-1);

        // 计算FOV
        const fov = this.#calculateFOV(preset.fy, preset.height);
        // 更新相机投影参数
        this.camera.fov = fov;
        this.camera.aspect = preset.width / preset.height;
        this.camera.position.copy(cameraPosition)
        this.camera.quaternion.copy(quaternion)
        this.camera.updateProjectionMatrix();

    }
    // 计算摄像机视野
    #calculateFOV(focalLength, imageHeight) {
        return THREE.MathUtils.radToDeg(
            2 * Math.atan((imageHeight * 0.5) / focalLength)
        );
    }

    // 更新画布尺寸
    updateCanvasSize(originalWidth, originalHeight) {
        const container = this.canvas.parentElement;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        // 如果没有传入原始尺寸，使用 canvas 的尺寸
        const width = originalWidth || this.canvas.clientWidth;
        const height = originalHeight || this.canvas.clientHeight;

        // 计算保持原始比例的最大尺寸
        const aspect = width / height;
        let renderWidth, renderHeight;

        if (containerWidth / containerHeight > aspect) {
            renderHeight = containerHeight;
            renderWidth = renderHeight * aspect;
        } else {
            renderWidth = containerWidth;
            renderHeight = renderWidth / aspect;
        }

        // 设置画布 CSS 尺寸
        this.canvas.style.width = `${renderWidth}px`;
        this.canvas.style.height = `${renderHeight}px`;
        this.canvas.style.marginLeft = `${(containerWidth - renderWidth) / 2}px`;
        this.canvas.style.marginTop = `${(containerHeight - renderHeight) / 2}px`;

        // 设置渲染器分辨率（考虑设备像素比）
        const pixelRatio = window.devicePixelRatio;
        this.renderer.setSize(renderWidth * pixelRatio, renderHeight * pixelRatio, false);

        // 更新相机参数
        this.camera.aspect = aspect;
        this.camera.updateProjectionMatrix();
    }

    // 初始化GUI界面
    initGUI() {
        this.stats = new Stats()
        // 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
        this.stats.setMode(0)
        // 设置监视器位置
        this.stats.domElement.style.position = 'absolute'
        this.stats.domElement.style.left = '0px'
        this.stats.domElement.style.top = '0px'
        document.body.appendChild(this.stats.dom);


        if (this.gui) this.gui.destroy();
        this.gui = new GUI()

        let fullFcreenObject = {
            Fullscreen: () => {
                this.#toggleFullScreen()
            }
        }
        this.gui.add(fullFcreenObject, "Fullscreen").name("全屏进入自由模式")
        let cameraFolder = this.gui.addFolder("摄像机工具")
        let imageFolder = this.gui.addFolder("图片管理工具")

        let cameraController = {
            prev: () => this.switchCamera(-1),
            next: () => this.switchCamera(1),

            fov: this.camera.fov, // 绑定相机的 fov 属性
            reset: () => this.#resetCamera()
        }
        let imageController = {
            download: () => {
                // 下载图片

            },
            save: () => {
                // 保存图片到背景库
            }
        }

        cameraFolder.add(cameraController, 'prev').name('- Previous')
        cameraFolder.add(cameraController, 'next').name('+ Next')
        cameraFolder.add(cameraController, 'reset').name('复位')
        cameraFolder.add(this.camera, 'fov').min(10).max(89).name("fov").onChange((value) => {
            this.camera.fov = value
            this.camera.updateProjectionMatrix(); // 更新投影矩阵
        })
        imageFolder.add(imageController, 'save').name('保存新视角')
        imageFolder.add(imageController, 'download').name('下载新视角')

    }
    // 相机切换方法
    switchCamera(step) {
        this.currentCameraIndex = (this.currentCameraIndex + step + this.cameraPresets.length) % this.cameraPresets.length;
        this.#applyCameraPreset(this.currentCameraIndex);
    }


    setRenderer() {
        // 创建渲染器
        const preset = this.cameraPresets[this.currentCameraIndex]
        this.renderer = new THREE.WebGLRenderer({ antialias: false, canvas: this.canvas, powerPreference: 'high-performance' })
        this.updateCanvasSize(preset.width, preset.height)

    }

    // 新增控制器销毁方法
    disposeController() {
        if (this.control) {
            this.control.dispose()
            this.control = null
        }
    }
    // 更新控制器创建逻辑
    createController() {
        this.disposeController() // 先销毁控制器

        const DomElement = this.renderer.domElement
        // 根据全屏状态选择控制器
        if (document.fullscreenElement) {
            this.gui.hide()
            console.log(222)
            this.control = new CameraController(this.camera, DomElement);

        } else {
            console.log(111)
            this.gui.show()
            this.control = new OrbitControls(this.camera, DomElement)
        }
    }


    animate = () => {
        this.stats.update()
        this.renderer.render(this.scene, this.camera)
        if (this.control) {
            // 根据控制器类型执行更新
            this.control.update()
        }
        requestAnimationFrame(this.animate)
    }

    resize() {
        const onResize = () => {
            const preset = this.cameraPresets[this.currentCameraIndex];
            if (preset) {
                // 如果有 preset，使用原始图像的分辨率
                this.updateCanvasSize(preset.width, preset.height);
            } else {
                // 如果没有 preset，使用 canvas 的尺寸
                this.updateCanvasSize();
            }
            this.createController();
        }
        window.addEventListener('resize', onResize)

    }



    // 进入全屏的方法
    #enterFullscreen() {
        const elem = this.renderer.domElement
        elem.requestPointerLock();// 页面指针锁定
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { // Chrome, Safari and Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { // IE/Edge
            elem.msRequestFullscreen();
        }
    }

    // 退出全屏的方法
    #exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            document.exitPointerLock()
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    // 全屏切换方法
    #toggleFullScreen() {
        if (!document.fullscreenElement) {
            this.#enterFullscreen();
            this.isFullScreen = true
        } else {
            this.#exitFullscreen();
        }
        //更新控制器
        this.createController();
        //更新画布
        const preset = this.cameraPresets[this.currentCameraIndex];
        if (preset) {
            this.updateCanvasSize(preset.width, preset.height);
        } else {
            this.updateCanvasSize();
        }
    }

    #resetCamera() {
        // 默认第一个视角
        const preset = this.cameraPresets[0];
        if (preset) {
            // 如果有预设，重置为预设状态
            this.#applyCameraPreset(0);
        } else {
            // 如果没有预设，重置为默认状态
            this.camera.position.set(0, 0, 10);
            this.camera.quaternion.set(0, 0, 0, 1);
            this.camera.lookAt(0, 0, 0);
        }
        if (this.gui) {
         this.gui.reset()
        }
    }

    // 销毁
    dispose() {
        // 销毁 GUI
        if (this.gui) {
            this.gui.destroy();
            this.gui = null;
        }

        // 销毁 Stats
        if (this.stats) {
            document.body.removeChild(this.stats.dom);
            this.stats = null;
        }

        // 销毁渲染器
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }

        // 销毁场景中的对象
        if (this.scene) {
            while (this.scene.children.length > 0) {
                const object = this.scene.children[0];
                this.scene.remove(object);
                if (object.dispose) {
                    object.dispose();
                }
            }
            this.scene = null;
        }

        // 销毁控制器
        if (this.control) {
            this.control.dispose();
            this.control = null;
        }
    }
}