import FileSaver from "file-saver";
export default class Blackboard {
  // 是否开始写字
  protected isStart: boolean = false;
  constructor(
    public el: HTMLCanvasElement,
    public imageSrc: string = '',
    private app = el.getContext('2d')!,
    private width: number = el.width,
    private height: number = el.height,
    private bgColor = '#fff',
    private lineColor = '#000'
  ) {
    this.initCanvas();
    this.loadImage();
    this.bindEvent();
  }
  private bgImage: HTMLImageElement | null = null;
  // 加载图片
  loadImage() {
    if (!this.imageSrc) return;
    const img = new Image();
    img.src = this.imageSrc;
    img.onload = () => {
      this.bgImage = img;
      // 加载完成后重绘背景图
      this.redrawBgImage();
    }
  } 

  initCanvas() {
    const rect = this.el.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.el.width = Math.round(rect.width * dpr);
    this.el.height = Math.round(rect.height * dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.app.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.app.fillStyle = this.bgColor
    this.app.fillRect(0, 0, this.width, this.height)
    this.el.style.touchAction = 'none'
  }
  // 保存画布内容
  public saveCanvasContent() {
    if (!this.isStart) {
      alert("请先书写、在进行保存");
      return;
    }
    this.el.toBlob((blob) => {
      FileSaver.saveAs(blob!, '签名');
    })
  }
  // 清空画布
  public clearCanvasContent() {
    if (this.isStart) this.isStart = false;
    // 先清空画布
    this.app.clearRect(0, 0, this.width, this.height);
    // 重绘背景色
    this.app.fillStyle = this.bgColor;
    this.app.fillRect(0, 0, this.width, this.height);
    // 如果有背景图，重绘背景图（只清除笔迹）
    if (this.bgImage) {
      this.redrawBgImage();
    }
  }
  
  private redrawBgImage() {
    if (!this.bgImage) return;

    const canvasW = this.width;
    const canvasH = this.height;
    const imgW = this.bgImage.naturalWidth;
    const imgH = this.bgImage.naturalHeight;

    const scale = Math.min(canvasW / imgW, canvasH / imgH);
    const drawW = imgW * scale;
    const drawH = imgH * scale;
    const dx = (canvasW - drawW) / 2;
    const dy = (canvasH - drawH) / 2;

    this.app.drawImage(this.bgImage, dx, dy, drawW, drawH);
  }


  // 绑定事件
  bindEvent() {
    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = this.getPos(e);
      this.drawLine(x, y);
    };

    this.el.addEventListener('pointerdown', (e: PointerEvent) => {
      e.preventDefault();
      this.app.beginPath();
      this.app.strokeStyle = this.lineColor;
      this.app.lineWidth = 1;
      const { x, y } = this.getPos(e);
      this.app.moveTo(x, y);
      this.el.setPointerCapture?.(e.pointerId);
      this.el.addEventListener('pointermove', onPointerMove);
    });

    document.addEventListener('pointerup', (e: PointerEvent) => {
      this.el.releasePointerCapture?.(e.pointerId);
      this.el.removeEventListener('pointermove', onPointerMove);
      this.app.closePath();
    });
  }
  private getPos(e: PointerEvent) {
    const rect = this.el.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }
  drawLine(x: number, y: number) {
    this.isStart = true;
    this.app.lineTo(x, y);
    this.app.stroke();
  }
}

