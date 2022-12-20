import "./style.scss"
import FileSaver from "file-saver";
class Blackboard {
  // 是否开始写字
  protected isStart: boolean = false;
  constructor(
    public el = document.querySelector<HTMLCanvasElement>('#canvas')!,
    private app = el.getContext('2d')!,
    private width: number = el.width,
    private height: number = el.height,
    private bgColor = '#000',
    private lineColor = '#fff'
  ) {
    this.initCanvas();
    // 键盘事件
    this.bindEvent();
    // 按钮事件
    this.bindBtnEvent();
  }
  initCanvas() {
    this.app.fillStyle = this.bgColor
    this.app.fillRect(0, 0, this.width, this.height)
  }
  bindBtnEvent() {
    this.clearCanvasContent();
    this.saveCanvasContent();
  }
  getEl(container: string) {
    return document.querySelector(container);
  }
  // 保存画布内容
  saveCanvasContent() {
    this.getEl('#save')?.addEventListener('click', () => {
      if (!this.isStart) {
        alert("请先书写、在进行保存");
        return;
      }
      this.el.toBlob((blob) => {
        FileSaver.saveAs(blob!, '签名');
      })
    })
  }
  // 清空画布
  clearCanvasContent() {
    this.getEl("#clear")?.addEventListener("click", () => {
      if (this.isStart) this.isStart = false;
      this.app.fillRect(0, 0, this.width, this.height)
    })
  }
  // 绑定事件
  bindEvent() {
    const callBack = this.drawLine.bind(this);
    this.el.addEventListener('mousedown', () => {
      this.app.beginPath();
      this.app.strokeStyle = this.lineColor;
      this.app.lineWidth = 1
      this.el.addEventListener('mousemove', callBack);
    })
    document.addEventListener("mouseup", () => {
      this.el.removeEventListener("mousemove", callBack);
    })
  }
  drawLine(event: MouseEvent) {
    this.isStart = true;
    this.app.lineTo(event.offsetX, event.offsetY);
    this.app.stroke();
  }
}

new Blackboard();
