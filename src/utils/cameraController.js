import * as THREE from 'three'

export class CameraController {
    constructor(camera, domElement) {
        this.camera = camera
        this.domElement = domElement
        this.moveSpeed = 0.01
        this.rotateSpeed = 0.0006
        this.verticalRotationLimit = Math.PI / 2.5

        // 键盘状态跟踪
        this.keyStates = {
            'KeyW': false, 'KeyS': false,
            'KeyA': false, 'KeyD': false,
            'Space': false, 'ShiftLeft': false
        }

        // 鼠标状态跟踪
        this.mouseState = {
            deltaX: 0,
            deltaY: 0
        };

        // 初始化旋转系统
        this.rotation = new THREE.Euler(0, 0, 0, 'YXZ');
        this.quaternion = new THREE.Quaternion();
        this.savedCameraPosition = camera.position.clone();
        this.initEvents()

    }


    initEvents() {

        // 键盘事件
        window.addEventListener('keydown', this.onKeyDown)
        window.addEventListener('keyup', this.onKeyUp)
        // 鼠标移动事件
        this.domElement.addEventListener('mousemove', this.onMouseMove)

    }
    dispose() {
        this.domElement.removeEventListener('mousemove', this.onMouseMove);

        window.removeEventListener('keydown', this.onKeyDown)
        window.removeEventListener('keyup', this.onKeyUp)
    }

    onKeyDown = (e) => {
        if (e.code in this.keyStates) {
            this.keyStates[e.code] = true
        }
    }

    onKeyUp = (e) => {
        if (e.code in this.keyStates) {
            this.keyStates[e.code] = false
        }

    }


    onMouseMove = (e) => {
        // 计算鼠标移动增量
        this.mouseState.deltaX = e.movementX || 0;
        this.mouseState.deltaY = e.movementY || 0;
    }


    update() {

        // 处理鼠标旋转
        this.#handleRotation();

        // 处理键盘移动
        this.#handleMovement();
    }

    #handleRotation() {

        // 计算旋转增量
        const deltaX = this.mouseState.deltaX * this.rotateSpeed;
        const deltaY = this.mouseState.deltaY * this.rotateSpeed;

        // 创建临时四元数
        const quaternionX = new THREE.Quaternion();
        const quaternionY = new THREE.Quaternion();

        // 绕摄像机局部坐标系的 X 轴旋转（上下）
        quaternionX.setFromAxisAngle(
            new THREE.Vector3(1, 0, 0), // 局部 X 轴
            THREE.MathUtils.clamp(-deltaY, -this.verticalRotationLimit, this.verticalRotationLimit)
        );

        // 绕摄像机局部坐标系的 Y 轴旋转（左右）
        quaternionY.setFromAxisAngle(
            new THREE.Vector3(0, 1, 0), // 局部 Y 轴
            -deltaX
        );

        // 应用旋转
        this.camera.quaternion.multiplyQuaternions(quaternionY, this.camera.quaternion); // 先 Y 轴
        this.camera.quaternion.multiply(quaternionX); // 后 X 轴
        this.camera.quaternion.normalize();

        this.mouseState.deltaX = 0;
        this.mouseState.deltaY = 0;

    }

    #handleMovement() {
        // 基于当前视角坐标系计算移动方向
        const direction = new THREE.Vector3();

        // 获取相机的局部坐标系方向
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);

        // 根据键盘输入计算移动方向
        if (this.keyStates.KeyW) direction.add(forward); // 前
        if (this.keyStates.KeyS) direction.sub(forward); // 后
        if (this.keyStates.KeyA) direction.sub(right);   // 左
        if (this.keyStates.KeyD) direction.add(right);   // 右
        if (this.keyStates.Space) direction.add(up); // 上
        if (this.keyStates.ShiftLeft) direction.sub(up);  // 下

        // 标准化并应用速度
        if (direction.lengthSq() > 0) {
            direction.normalize().multiplyScalar(this.moveSpeed);
            this.camera.position.add(direction);
        }
    }

}

