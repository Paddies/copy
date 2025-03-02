class DrawLinePlugin {
  constructor(canvas, toolType) {
    console.log(canvas, toolType);
    // 初始化画布
    this.canvas = canvas;
    // 当前绘制工具
    this.toolType = toolType;

    this.drawingObject = {
      type: "",
      background: "",
      border: "",
    };
    this.mouseFrom = {};
    this.roofPoints = [];
    this.lines = [];
    this.lines1 = [];
    this.lines2 = [];
    this.lineCounter = 0;
    this.roof = null;
    this.firstx = "";
    this.firsty = "";
    this.flag1 = null;
    this.flag2 = false;
    this.flag3 = false;
    this.strokeWidth = 1;
    this.strokeColor = "red";
  }

  init() {
    const { canvas } = this;
    const drawIng = this.toolType === "polygon" || this.toolType === "polyline";

    if (!drawIng) {
      return;
    }

    canvas.on("mouse:down", (e) => {
      const currentPoint = e.absolutePointer;
      if (this.drawIng) {
        this.lines2 = [];
        this.mouseFrom.x = currentPoint.x;
        this.mouseFrom.y = currentPoint.y;
        if (!this.lineCounter) {
          this.firstx = currentPoint.x;
          this.firsty = currentPoint.y;
        }
        let a = {};
        a["x"] = this.mouseFrom.x;
        a["y"] = this.mouseFrom.y;
        this.roofPoints.push(a);
        var points = [a.x, a.y, a.x, a.y];
        var points1 = [this.firstx, this.firsty, a.x, a.y];

        this.lines.push(
          new fabric.Line(points, {
            strokeWidth: this.strokeWidth,
            selectable: false,
            stroke: this.strokeColor,
          })
        );

        this.lines1.push(
          new fabric.Line(points1, {
            strokeWidth: this.strokeWidth,
            selectable: false,
            stroke: "yellow",
          })
        );
        this.lines2.push(
          new fabric.Line(points1, {
            strokeWidth: this.strokeWidth,
            selectable: false,
            stroke: "yellow",
          })
        );
        if (this.lineCounter > 1) {
          var num = this.lines.length - 2;
          // console.log(this.lines);
          // console.log(this.lines[num]);
          this.flag1 = this.lines.some((v) => {
            return this.isIntersect(v, this.lines[num]);
          });
          this.flag3 = this.lines.some((v) => {
            return this.isIntersect(v, this.lines2[0]);
          });
          if (this.flag1 || this.flag3) {
            // this.canvas.off("mouse:dblclick");
            this.lineCounter--;
            this.flag1 = false;
            this.roofPoints.splice(this.roofPoints.length - 1, 1);
            this.canvas.remove(this.lines[num]);

            this.lines.splice(num, 2);
            var point2 = [
              this.lines[this.lines.length - 1].x2,
              this.lines[this.lines.length - 1].y2,
              this.lines[this.lines.length - 1].x2,
              this.lines[this.lines.length - 1].y2,
            ];
            this.lines.push(
              new fabric.Line(point2, {
                strokeWidth: this.strokeWidth,
                selectable: false,
                stroke: this.strokeColor,
              })
            );
            this.lines1[0].set({
              x2: this.lines[this.lines.length - 1].x2,
              y2: this.lines[this.lines.length - 1].y2,
            });
          } else {
            // this.canvas.on("mouse:dblclick");
          }
          let ret = this.lines1.splice(0, 1);
          this.lines1 = [];
          this.lines1.push(...ret);

          this.canvas.add(this.lines[this.lineCounter]);
        } else {
          if (this.lineCounter != 1) {
            this.canvas.add(
              this.lines[this.lineCounter],
              this.lines1[this.lineCounter]
            );
          } else {
            this.canvas.add(this.lines[this.lineCounter]);
          }
        }

        this.lineCounter++;
      }
    });

    canvas.on("mouse:move", (e) => {
      const currentPoint = e.absolutePointer;

      if (
        this.lines[0] !== null &&
        this.lines[0] !== undefined &&
        this.drawIng
      ) {
        this.x = currentPoint.x;
        this.y = currentPoint.y;
        this.lines[this.lineCounter - 1].set({
          x2: this.x,
          y2: this.y,
        });

        this.lines1[0].set({
          x2: this.x,
          y2: this.y,
        });
        this.canvas.renderAll();
      }
    });

    canvas.on("mouse:dblclick", (e) => {
      this.handleFinishDraw();
    });
  }
  // 绘制完成
  handleFinishDraw() {
    this.lines.forEach((item) => this.canvas.remove(item));
    this.lines1.forEach((item) => this.canvas.remove(item));
    this.makeRoof();
    this.canvas.add(this.roof);
    this.canvas.renderAll();

    this.roofPoints = [];
    this.lines = [];
    this.lines1 = [];
    this.lineCounter = 0;
  }
  // 生成对象
  makeRoof() {
    let left = this.findLeftPaddingForRoof(this.roofPoints);
    let top = this.findTopPaddingForRoof(this.roofPoints);
    let a = {};
    a["x"] = this.roofPoints[0].x;
    a["y"] = this.roofPoints[0].y;
    this.roofPoints.push(a);
    this.roofPoints.some((v, index) => {
      if (this.lines[this.lines.length - 1].aCoords.bl.x == v.x) {
        this.roofPoints.splice(index, 1);
      }
    });
    console.log(this.toolType);
    this.roof = new fabric.Polyline(this.roofPoints, {
      fill: "rgba(0,0,0,1)",
      strokeWidth: this.strokeWidth,
      stroke: this.strokeColor,
      left: left,
      top: top,
    });
  }
  findTopPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var f = 0; f < this.lineCounter; f++) {
      if (roofPoints[f].y < result) {
        result = roofPoints[f].y;
      }
    }
    return Math.abs(result);
  }
  findLeftPaddingForRoof(roofPoints) {
    var result = 999999;
    for (var i = 0; i < this.lineCounter; i++) {
      if (roofPoints[i].x < result) {
        result = roofPoints[i].x;
      }
    }
    return Math.abs(result);
  }
  isIntersect(line1, line2) {
    // 转换成一般式: Ax+By = C
    var a1 = line1.y2 - line1.y1;
    var b1 = line1.x1 - line1.x2;
    var c1 = a1 * line1.x1 + b1 * line1.y1;

    //转换成一般式: Ax+By = C
    var a2 = line2.y2 - line2.y1;
    var b2 = line2.x1 - line2.x2;
    var c2 = a2 * line2.x1 + b2 * line2.y1;

    // 计算交点
    var d = a1 * b2 - a2 * b1;
    // 当d==0时，两线平行
    if (d == 0) {
      return false;
    } else {
      var x = (b2 * c1 - b1 * c2) / d;
      var y = (a1 * c2 - a2 * c1) / d;

      // 检测交点是否在两条线段上
      if (
        (this.isInBetween(line1.x1, x, line1.x2) ||
          this.isInBetween(line1.y1, y, line1.y2)) &&
        (this.isInBetween(line2.x1, x, line2.x2) ||
          this.isInBetween(line2.y1, y, line2.y2))
      ) {
        return true;
      }
    }

    return false;
  }
  //如果b在a和c之间，返回true
  //当a==b或者b==c时排除结果，返回false
  isInBetween(a, b, c) {
    // 如果b几乎等于a或c，返回false.为了避免浮点运行时两值几乎相等，但存在相差0.00000...0001的这种情况出现使用下面方式进行避免
    if (Math.abs(a - b) < 0.000001 || Math.abs(b - c) < 0.000001) {
      return false;
    }

    return (a < b && b < c) || (c < b && b < a);
  }
}

export default DrawLinePlugin;
