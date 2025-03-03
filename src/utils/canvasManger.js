import { fabric } from 'fabric'

export class CanvasManager {
    constructor(canvasEl, imageUrl, displaySize) {
        this.originalWidth = displaySize.originalWidth;
        this.originalHeight = displaySize.originalHeight;
        this.displayScale = displaySize.displayScal;

        this.canvas = new fabric.Canvas(canvasEl, {
            isDrawingMode: true,
            selection: false,
            width: displaySize.displayWidth,
            height: displaySize.displayHeight
        })
        this.initCanvas(imageUrl, displaySize)
    }

    async initCanvas(imageUrl, displaySize) {
        this.canvas.clear()

        // 加载背景图片
        fabric.Image.fromURL(imageUrl, (img) => {
            const scale = displaySize.displayWidth / img.width
            img.scale(scale)
            this.canvas.add(img)
        }, {
            crossOrigin: 'anonymous'
        })

        this.canvas.freeDrawingBrush.color = 'white'
        this.canvas.freeDrawingBrush.width = 5

    }


    setBrushSize(size) {
        this.canvas.freeDrawingBrush.width = size
    }

    clearCanvas() {
        this.canvas.clear()
    }

    getCanavas() {
        console.log
        this.canvas.toDataURL({ format: 'png' })
    }

    async getMaskData() {
        return new Promise((resolve, reject) => {
            try {
                // 创建高分辨率临时画布
                const tempCanvas = new fabric.StaticCanvas(document.createElement('canvas'), {
                    width: this.canvas.width,
                    height: this.canvas.height,
                    enableRetinaScaling: false
                });

                // 设置黑色背景
                tempCanvas.setBackgroundColor('#000000', () => {
                    const objects = this.canvas.getObjects()
                    .filter(obj => obj instanceof fabric.Path || obj instanceof fabric.PencilBrush)

                    tempCanvas.add(...objects);
                    tempCanvas.renderAll.bind(tempCanvas);

                    console.log('临时画布尺寸:', tempCanvas.width, tempCanvas.height);
                    console.log('路径数量:', objects.length);
                    objects.forEach((obj, i) => {
                        console.log(`路径${i}位置:`, obj.left, obj.top, '尺寸:', obj.width, obj.height);
                    });
                 

                    // 生成高质量遮罩PNG
                    const dataURL = tempCanvas.toDataURL({
                        format: 'png',
                        multiplier: 1, // 保持原始分辨率
                        quality: 1,
                        enableRetinaScaling: false
                    });
            
                    tempCanvas.dispose();
                    resolve(dataURL);
                });



            } catch (error) {
                reject(error);
            }
        });
    }

 

}