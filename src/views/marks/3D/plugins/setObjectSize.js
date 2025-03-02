import * as THREE from "three"
export default class SetObjectSize {
  constructor(camera, target, cubes, container, scene, type, renderer) {
    this.camera = camera;
    this.target = target;
    this.type = type;
    this.container = container;
    this.renderer = renderer;
    this.scene = scene;
    this.scope = null;
    this.viewport = null;
    this.original_parameters = JSON.parse(sessionStorage.getItem('original_parameters')); // 原始尺寸
    this.cubes = cubes;
  }
  init(scope) {
    // this.getCurrentCubeVertices();
    this.update_view_handle();
    this.scope = scope;
  }

  // 显示辅助线
  showLine() {
    const container = this.container;
    const _doms = container.querySelectorAll('.svg-line');
    _doms.forEach(item => {
      item.style.display = 'block';
    })
    const rects = container.querySelectorAll('.svg-rect');
    rects.forEach(item => {
      item.style.display = 'block';
    })
  }

  update_view_handle() {
    // console.log(this.type, this.camera.left, this.camera.right, this.camera.top, this.camera.bottom, this.camera.near, this.camera.far);
    this.viewport = this.container.getBoundingClientRect();
    const obj = this.target;
    const fovWidth = Math.abs(this.camera.right) + Math.abs(this.camera.left);
    const fovHeight = this.camera.top - this.camera.bottom;
    // 摄像机视角宽度/容器宽度 = geometry宽/投影宽度(screenObjWidth)
    // 摄像机视角高度/容器高度 = geometry高/投影高度(screenObjHeight)
    // fovWidth / viewport.width = this.target.geometry.parameters.width / screenObjWidth
    // screenObjWidth = this.target.geometry.parameters.width / (fovWidth / viewport.width);
    // 注：顶视图取obj的长宽 (X, Y)
    // 注：正视图取obj的宽高 (X, Z)
    // 注：左视图取obj的长高（Y, Z）
    const screenObjWidth = {
      top: obj.geometry.parameters.width / (fovWidth / this.viewport.width),
      front: obj.geometry.parameters.width / (fovWidth / this.viewport.width),
      left: obj.geometry.parameters.height / (fovWidth / this.viewport.width),
    };
    // 顶：fovWidth / clientWdith = geometry.width / objWidth
    const screenObjHeight = {
      top: obj.geometry.parameters.height / (fovHeight / this.viewport.height),
      front: obj.geometry.parameters.depth / (fovHeight / this.viewport.height),
      left: obj.geometry.parameters.depth / (fovHeight / this.viewport.height)
    };
    // console.log(screenObjWidth, screenObjHeight, this.type);
    this.set_line_pos(screenObjWidth[this.type], screenObjHeight[this.type], this.viewport);
    // console.log(this.container, this.type);
  }

  /**
   * width: 标注框视图对应在container容器下的宽度px值
   * height: 标注框视图对应在container容器下的高度px值
   */
  set_line_pos(width, height, viewport) {
    // console.log('set line pos');
    const top_lines = this.container.querySelector('.top-line');
    const left_lines = this.container.querySelector('.left-line');
    const right_lines = this.container.querySelector('.right-line');
    const bottom_lines = this.container.querySelector('.bottom-line');
    const top_rect = this.container.querySelector('.top-rect');
    const left_rect = this.container.querySelector('.left-rect');
    const right_rect = this.container.querySelector('.right-rect');
    const bottom_rect = this.container.querySelector('.bottom-rect');
    const center_rect = this.container.querySelector('.svg-rect.center-rect');
    // 辅助线
    const lines = {
      top: top_lines,
      left: left_lines,
      right: right_lines,
      bottom: bottom_lines
    }
    // 代理事件矩形
    const rects = {
      top: top_rect,
      left: left_rect,
      right: right_rect,
      bottom: bottom_rect
    }
    const view_width = viewport.width;
    const view_height = viewport.height;
    // 中心点
    let center_pos = {x: view_width/2, y: view_height/2}
    // const box = '3d box在container下的宽高'
    // const box = {w: height, h: width};
    const x1 = center_pos.x - width/2;
    const y1 = center_pos.y - height/2;
    const x2 = center_pos.x + width/2;
    const y2 = center_pos.y + height/2;
    
    lines.top.setAttribute("x1", "0%");
    lines.top.setAttribute("y1", y1);
    lines.top.setAttribute("x2", "100%");
    lines.top.setAttribute("y2", y1);
    rects.top.setAttribute("y", y1 - 5);

    lines.bottom.setAttribute("x1", "0%");
    lines.bottom.setAttribute("y1", y2);
    lines.bottom.setAttribute("x2", "100%");
    lines.bottom.setAttribute("y2", y2);
    rects.bottom.setAttribute("y", y2 - 5);

    lines.left.setAttribute("x1", x1);
    lines.left.setAttribute("y1", "0%");
    lines.left.setAttribute("x2", x1);
    lines.left.setAttribute("y2", "100%");
    rects.left.setAttribute("x", x1 - 5);

    lines.right.setAttribute("x1", x2);
    lines.right.setAttribute("y1", "0%");
    lines.right.setAttribute("x2", x2);
    lines.right.setAttribute("y2", "100%");
    rects.right.setAttribute("x", x2 - 5);

    this.showLine();
    this.move_lines_handler(rects, lines, center_rect)
  }

  move_lines_handler(rects, lines, center_rect) {
    // 当前操作类型(top、left、right、bottom)辅助线
    let type = 'top';
    // 初始位置
    let start_pos = { x: 0, y: 0 }
    // 结束位置
    let end_pos = { x: 0, y: 0 }
    // 开始移动
    let start = false;
    // 中心移动
    let center_start = false;
    const { top, left, right, bottom } = rects
    const top_pos = {
      x: 0,
      y: 0
    }
    const left_pos = {
      x: 0,
      y: 0
    }
    const right_pos = {
      x: 0,
      y: 0
    }
    const bottom_pos = {
      x: 0,
      y: 0
    }
    const center_pos = {
      x: 0,
      y: 0
    }
    this.container.addEventListener('mousedown', (e) => {
      if(center_start) {
        center_pos.x = parseFloat(center_rect.getAttribute('x'))
        center_pos.y = parseFloat(center_rect.getAttribute('y'))
        start_pos = {x: center_pos.x, y: center_pos.y}
      }
    })
    /**
    * 1. 鼠标按下
    * 2. 鼠标移动
    * 3. 鼠标弹起
    */
    // 移动
    this.container.addEventListener('mousemove', (e) => {
      // console.log(e.target === center_rect);
      // 中心移动
      if(center_start) {
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        this.update_svg_box_center(center_rect, {offsetX, offsetY}, type);
      }
      // 边移动
      if(start) {
        const offsetX = e.offsetX;
        const offsetY = e.offsetY;
        const line = lines[type]
        const rect = rects[type]
        this.update_svg_box(line, rect, {offsetX, offsetY}, type);
      }
    })

    // 停止
    this.container.addEventListener('mouseup', (e) => {
      if(!start && !center_start) return;
      // 差值
      let d_value = {
        d_x: 0,
        d_y: 0
      }
      end_pos = { x: e.offsetX, y: e.offsetY }
      start = false;
      if(center_start) {
        center_start = false;
        // +20消除中心可拖动的矩形宽度和高度的一半
        d_value.d_x = start_pos.x - end_pos.x + 20;
        d_value.d_y = start_pos.y - end_pos.y + 20;
        this.reset_box_camera_center(d_value, start_pos, type)
        center_rect.setAttribute('x', this.viewport.width / 2 - 20)
        center_rect.setAttribute('y', this.viewport.height / 2 - 20)
      }
      // 差值计算
      if(start_pos.x !== end_pos.x || start_pos.y !== end_pos.y) {
        d_value.d_x = start_pos.x - end_pos.x;
        d_value.d_y = start_pos.y - end_pos.y;
        // 计算缩放以及相机位置设置
        if(this.type === 'top') {
          this.reset_box_camera_z(d_value, start_pos, type)
        } else if (this.type === 'front') {
          this.reset_box_camera_x(d_value, start_pos, type)
        } else if (this.type === 'left') {
          this.reset_box_camera_y(d_value, start_pos, type)
        }
      }
    })
    
    /** 
    * 1. 上
    * 2. 鼠标移入、按下、放开
    */
    top.onmouseenter = () => {
      this.toggle_line_highlight(lines.top, true);
    }
    top.onmousedown = (e) => {
      start = true;
      type = 'top';
      top_pos.x = parseFloat(lines.top.getAttribute('x1'));
      top_pos.y = parseFloat(lines.top.getAttribute('y1'));
      start_pos = { x: top_pos.x, y: top_pos.y }
    }
    top.onmouseleave = () => {
      this.toggle_line_highlight(lines.top, false);
    }
    
    /** 
    * 1. 下
    * 2. 鼠标移入、按下、放开
    */
    bottom.onmouseenter = () => {
      this.toggle_line_highlight(lines.bottom, true);
    }
    bottom.onmousedown = (e) => {
      start = true;
      type = 'bottom';
      bottom_pos.x = parseFloat(lines[type].getAttribute('x1'));
      bottom_pos.y = parseFloat(lines[type].getAttribute('y1'));
      start_pos = { x: bottom_pos.x, y: bottom_pos.y }
    }
    bottom.onmouseleave = () => {
      this.toggle_line_highlight(lines.bottom, false);
    }

    /** 
    * 1. 左
    * 2. 鼠标移入、按下、放开
    */
    left.onmouseenter = () => {
      this.toggle_line_highlight(lines.left, true);
    }
    left.onmousedown = () => {
      start = true;
      type = 'left';
      left_pos.x = parseFloat(lines[type].getAttribute('x1'));
      left_pos.y = parseFloat(lines[type].getAttribute('y1'));
      start_pos = { x: left_pos.x, y: left_pos.y }
    }
    left.onmouseleave = () => {
      this.toggle_line_highlight(lines.left, false);
    }

    /** 
    * 1. 右
    * 2. 鼠标移入、按下、放开
    */
    right.onmouseenter = () => {
      this.toggle_line_highlight(lines.right, true);
    }
    right.onmousedown = () => {
      start = true;
      type = 'right';
      right_pos.x = parseFloat(lines[type].getAttribute('x1'));
      right_pos.y = parseFloat(lines[type].getAttribute('y1'));
      start_pos = { x: right_pos.x, y: right_pos.y }
    }
    right.onmouseleave = () => {
      this.toggle_line_highlight(lines.right, false);
    }

    /** 
    * 1. 中心点移动
    * 2. 鼠标移入、按下、放开
    */
    center_rect.onmousedown = () => {
      center_start = true;
      type = 'center';
    }
  }

  // 辅助线高亮
  toggle_line_highlight(line, active) {
    line.style.stroke = active ? 'green' : 'rgba(247, 235, 4, .5)';
  }

  // 更新辅助框位置
  update_svg_box(line, rect, pos, type) {
    if(type === 'top') {
      line.setAttribute("x1", "0%");
      line.setAttribute("y1", pos.offsetY);
      line.setAttribute("x2", "100%");
      line.setAttribute("y2", pos.offsetY);
      rect.setAttribute("y", pos.offsetY - 5);
    } else if (type === 'left') {
      line.setAttribute("x1", pos.offsetX);
      line.setAttribute("y1", "0%");
      line.setAttribute("x2", pos.offsetX);
      line.setAttribute("y2", "100%");
      rect.setAttribute("x", pos.offsetX - 5);
    } else if (type === 'right') {
      line.setAttribute("x1", pos.offsetX);
      line.setAttribute("y1", "0%");
      line.setAttribute("x2", pos.offsetX);
      line.setAttribute("y2", "100%");
      rect.setAttribute("x", pos.offsetX - 5);
    } else if (type === 'bottom') {
      line.setAttribute("x1", "0%");
      line.setAttribute("y1", pos.offsetY);
      line.setAttribute("x2", "100%");
      line.setAttribute("y2", pos.offsetY);
      rect.setAttribute("y", pos.offsetY - 5);
    }
  }

  // 更新中心点
  update_svg_box_center(center_rect, {offsetX, offsetY}, type) {
    if(type === 'center') {
      center_rect.setAttribute("x", offsetX - 20);
      center_rect.setAttribute("y", offsetY - 20);
    }
  }

  // 俯视图恢复辅助框位置，并重新更新相机位置
  // 1. 通过差值更新3d对象属性
  // 2. 更新3d几何体
  // 3. 更新camera参数
  // 4. 更新视图
  // 5. 重绘，调用update_view_handle，使边框贴合
  // top、bottom控制长，left、right控制宽
  reset_box_camera_z(d_value, start_pos, type) {
    // console.log('reset', type, this.type, this.container);
    const geometry = this.target.geometry;
    const fovWidth = this.camera.right - this.camera.left;
    const fovHeight = this.camera.top - this.camera.bottom;
    const asp_w = fovWidth / this.viewport.width;
    const asp_h = fovHeight / this.viewport.height;
    const real_d_x = d_value.d_x * asp_w;
    const real_d_y = d_value.d_y * asp_h;
    // 框更新
    if(type === 'left') {
      // 宽度控制， 中心点左边所以是加运算
      geometry.parameters.width += real_d_x
      const originalWidth = geometry.parameters.width;
      const scaleX =  originalWidth / this.original_parameters.width;
      this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
      this.target.position.x -= real_d_x / 2;
    } else if(type === 'top') {
      // 长度控制， 中心点上方，所以做加运算
      geometry.parameters.height += real_d_y;
      const originalHeight = geometry.parameters.height;
      const scaleY = originalHeight / this.original_parameters.height;
      this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
      this.target.position.y += real_d_y / 2;
    } else if (type === 'bottom') {
      // 长度控制， 中心点上方，所以做减运算
      geometry.parameters.height -= real_d_y;
      const originalHeight = geometry.parameters.height;
      const scaleY = originalHeight / this.original_parameters.height;
      this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
      this.target.position.y += real_d_y / 2;
    } else if (type === 'right') {
      // 宽度控制， 中心点右边所以是减运算
      geometry.parameters.width -= real_d_x
      const originalWidth = geometry.parameters.width;
      const scaleX =  originalWidth / this.original_parameters.width;
      this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
      this.target.position.x -= real_d_x / 2;
    }
    // 更新相机矩阵
    this.update_orthcamera_paramers();
    // 更新属性框内容展示
    this.update_xyz_orthcamera();
    // 保存框更新
    this.update_cube_attribute();
  }

  // 正视图恢复辅助框位置，并重新更新相机位置
  reset_box_camera_x(d_value, start_pos, type) {
    // console.log('reset', type, this.type, this.container);
    const geometry = this.target.geometry;
    const fovWidth = this.camera.right - this.camera.left;
    const fovHeight = this.camera.top - this.camera.bottom;
    const asp_w = fovWidth / this.viewport.width;
    const asp_h = fovHeight / this.viewport.height;
    const real_d_x = d_value.d_x * asp_w;
    const real_d_y = d_value.d_y * asp_h;
    // 框更新
    if(type === 'left') {
      if(this.target.position.y > 0) {
        geometry.parameters.width += real_d_x
        const originalWidth = geometry.parameters.width;
        const scaleX =  originalWidth / this.original_parameters.width;
        this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
        this.target.position.x += real_d_x / 2;
      } else {
        geometry.parameters.width += real_d_x
        const originalWidth = geometry.parameters.width;
        const scaleX =  originalWidth / this.original_parameters.width;
        this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
        this.target.position.x -= real_d_x / 2;
      }
    } else if(type === 'top') {
      geometry.parameters.depth += real_d_y;
      const originalDepth = geometry.parameters.depth;
      const scaleZ = originalDepth / this.original_parameters.depth;
      this.target.scale.set(this.target.scale.x, this.target.scale.y, scaleZ);
      this.target.position.z += real_d_y / 2;
    } else if (type === 'bottom') {
      geometry.parameters.depth -= real_d_y;
      const originalDepth = geometry.parameters.depth;
      const scaleZ = originalDepth / this.original_parameters.depth;
      this.target.scale.set(this.target.scale.x, this.target.scale.y, scaleZ);
      this.target.position.z += real_d_y / 2; 
    } else if (type === 'right') {
      if(this.target.position.y > 0) {
        geometry.parameters.width -= real_d_x
        const originalWidth = geometry.parameters.width;
        const scaleX =  originalWidth / this.original_parameters.width;
        this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
        this.target.position.x += real_d_x / 2;
      } else {
        geometry.parameters.width -= real_d_x
        const originalWidth = geometry.parameters.width;
        const scaleX =  originalWidth / this.original_parameters.width;
        this.target.scale.set(scaleX, this.target.scale.y, this.target.scale.z)
        this.target.position.x -= real_d_x / 2;
      }
    }
    // 更新相机矩阵
    this.update_orthcamera_paramers();
    // 更新属性框内容展示
    this.update_xyz_orthcamera();
    // 保存框更新
    this.update_cube_attribute();
  }

  // 左视图恢复辅助框位置，并重新更新相机位置
  reset_box_camera_y(d_value, start_pos, type) {
    // console.log('reset', type, this.type, this.container);
    const geometry = this.target.geometry;
    const fovWidth = this.camera.right - this.camera.left;
    const fovHeight = this.camera.top - this.camera.bottom;
    const asp_w = fovWidth / this.viewport.width;
    const asp_h = fovHeight / this.viewport.height;
    const real_d_x = d_value.d_x * asp_w;
    const real_d_y = d_value.d_y * asp_h;
    // 框更新
    if(type === 'left') {
      // 一、四象限
      if(this.target.position.x > 0) {
        geometry.parameters.height += real_d_x
        const originalHeight = geometry.parameters.height;
        const scaleY =  originalHeight / this.original_parameters.height;
        this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
        this.target.position.y -= real_d_x / 2;
      } else {
        // 二、三象限
        geometry.parameters.height += real_d_x
        const originalHeight = geometry.parameters.height;
        const scaleY =  originalHeight / this.original_parameters.height;
        this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
        this.target.position.y += real_d_x / 2;
      }
    } else if(type === 'top') {
      geometry.parameters.depth += real_d_y;
      const originalDepth = geometry.parameters.depth;
      const scaleZ = originalDepth / this.original_parameters.depth;
      this.target.scale.set(this.target.scale.x, this.target.scale.y, scaleZ);
      this.target.position.z += real_d_y / 2;
    } else if (type === 'bottom') {
      geometry.parameters.depth -= real_d_y;
      const originalDepth = geometry.parameters.depth;
      const scaleZ = originalDepth / this.original_parameters.depth;
      this.target.scale.set(this.target.scale.x, this.target.scale.y, scaleZ);
      this.target.position.z += real_d_y / 2; 
    } else if (type === 'right') {
      if(this.target.position.x > 0) {
        // 一、四象限
        geometry.parameters.height -= real_d_x
        const originalHeight = geometry.parameters.height;
        const scaleY = originalHeight / this.original_parameters.height;
        this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
        this.target.position.y -= real_d_x / 2;
      } else {
        // 二、三象限
        geometry.parameters.height -= real_d_x
        const originalHeight = geometry.parameters.height;
        const scaleY = originalHeight / this.original_parameters.height;
        this.target.scale.set(this.target.scale.x, scaleY, this.target.scale.z);
        this.target.position.y += real_d_x / 2;
      }
    }
    // 更新相机矩阵
    this.update_orthcamera_paramers();
    // 更新属性框内容展示
    this.update_xyz_orthcamera();
    // 保存框更新
    this.update_cube_attribute();
  }

  // 中心点移动，并重新更新相机位置
  reset_box_camera_center(d_value) {
    const fovWidth = this.camera.right - this.camera.left;
    const fovHeight = this.camera.top - this.camera.bottom;
    const asp_w = fovWidth / this.viewport.width;
    const asp_h = fovHeight / this.viewport.height;
    const real_d_x = d_value.d_x * asp_w;
    const real_d_y = d_value.d_y * asp_h;
    if(this.type === 'top') {
      this.target.position.y += real_d_y
      this.target.position.x -= real_d_x
    } else if (this.type === 'front') {
      this.target.position.x -= real_d_x
      this.target.position.z += real_d_y
    } else if (this.type === 'left') {
      this.target.position.y -= real_d_x
      this.target.position.z += real_d_y
    }
    // 更新相机矩阵
    this.update_orthcamera_paramers();
    // 更新属性框内容展示
    this.update_xyz_orthcamera();
    // 保存框更新
    this.update_cube_attribute();
  }
  
  /**
  * 更新相机参数，重新聚焦，并调整辅助线框贴合
  */
  update_orthcamera_paramers () {
    const target = this.target;
    const scope = this.scope;
    if(this.type === 'top') {
      // 相机缩放比例
      const asp = this.viewport.width / this.viewport.height;
      const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.height);
      const selectedObject = Object.assign({}, this.target)
      let tw, th;
      if(asp > objAsp) {
        tw = selectedObject.geometry.parameters.height * asp / (3/4);
        th = selectedObject.geometry.parameters.height / (3/4)
      } else {
        tw = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      scope.z_view_handle.updateCameraParameters({
        left: -tw / 2,
        right: tw / 2,
        top: th / 2,
        bottom: -th / 2,
        near: -selectedObject.geometry.parameters.depth,
        far: selectedObject.geometry.parameters.depth,
        target: selectedObject
      })
      scope.z_view_handle.init(scope);
      scope.z_view_handle.updateProjectionMatrix(target.position.x, target.position.y, target.position.z);
    } else if(this.type === 'front') {
      // 相机缩放比例
      const asp = this.viewport.width / this.viewport.height;
      const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.depth);
      const selectedObject = Object.assign({}, this.target)
      let tw, th;
      if(asp > objAsp) {
        tw = selectedObject.geometry.parameters.depth * asp / (3/4);
        th = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      scope._frontView.updateCameraParameters({
        left: -tw / 2,
        right: tw / 2,
        top: th / 2,
        bottom: -th / 2,
        near: -selectedObject.geometry.parameters.height,
        far: selectedObject.geometry.parameters.height,
        target: selectedObject
      })
      scope._frontView.init(scope);
      scope._frontView.updateProjectionMatrix(target.position.x, target.position.y, target.position.z);
    } else if (this.type === 'left') {
      // 相机缩放比例
      const asp = this.viewport.width / this.viewport.height;
      const objAsp = Math.abs(this.target.geometry.parameters.height / this.target.geometry.parameters.depth);
      const selectedObject = Object.assign({}, this.target)
      let tw, th;
      if(asp > objAsp) {
        tw = selectedObject.geometry.parameters.depth * asp / (3/4);
        th = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw = Math.abs(selectedObject.geometry.parameters.height) / (3/4)
        th = Math.abs(selectedObject.geometry.parameters.height) / asp / (3/4)
      }
      scope._leftView.updateCameraParameters({
        left: -tw / 2,
        right: tw / 2,
        top: th / 2,
        bottom: -th / 2,
        near: -selectedObject.geometry.parameters.width,
        far: selectedObject.geometry.parameters.width,
        target: selectedObject
      })
      scope._leftView.init(scope);
      scope._leftView.updateProjectionMatrix(target.position.x, target.position.y, target.position.z);
    }
  }

  /**
  * 更新框内容及属性
  */
 update_cube_attribute() {
  const target = this.cubes.find(item => item.name === this.target.name)
  target.parameters = this.target.geometry.parameters
  target.position = this.target.position
   // 创建一个带有数据的自定义事件
   const customEventWithData = new CustomEvent('boxSelect', {
    detail: {
      show: true,
      target: this.target
    }
  });
  // 派发事件到 document
  document.dispatchEvent(customEventWithData);
 }

  /**
  * 更新所有正交相机
  */
  update_xyz_orthcamera() {
    console.log(this.type);
    const selectedObject = Object.assign({}, this.target);
    const scope = this.scope;
    const asp = this.viewport.width / this.viewport.height;
    const objAsp_top = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.height);
    const objAsp_front = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.depth);
    const objAsp_left = Math.abs(this.target.geometry.parameters.height / this.target.geometry.parameters.depth);
    let tw_top, th_top, tw_front, th_front, tw_left, th_left;
    if(this.type === 'top') {
      // 更新正视、左视图相机
      if(asp > objAsp_front) {
        tw_front = selectedObject.geometry.parameters.depth * asp / (3/4);
        th_front = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw_front = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th_front = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      if(asp > objAsp_left) {
        tw_left = selectedObject.geometry.parameters.depth * asp / (3/4);
        th_left = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw_left = Math.abs(selectedObject.geometry.parameters.height) / (3/4)
        th_left = Math.abs(selectedObject.geometry.parameters.height) / asp / (3/4)
      }
      scope._frontView.updateCameraParameters({
        left: -tw_front / 2,
        right: tw_front / 2,
        top: th_front / 2,
        bottom: -th_front / 2,
        near: -selectedObject.geometry.parameters.height,
        far: selectedObject.geometry.parameters.height,
        target: selectedObject
      })
      scope._leftView.updateCameraParameters({
        left: -tw_left / 2,
        right: tw_left / 2,
        top: th_left / 2,
        bottom: -th_left / 2,
        near: -selectedObject.geometry.parameters.width,
        far: selectedObject.geometry.parameters.width,
        target: selectedObject
      })
      scope._frontView.init(scope);
      scope._leftView.init(scope);
      scope._frontView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      scope._leftView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
    } else if (this.type === 'front') {
      // 更新俯视、左视图相机
      if(asp > objAsp_top) {
        tw_top = selectedObject.geometry.parameters.height * asp / (3/4);
        th_top = selectedObject.geometry.parameters.height / (3/4)
      } else {
        tw_top = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th_top = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      if(asp > objAsp_left) {
        tw_left = selectedObject.geometry.parameters.depth * asp / (3/4);
        th_left = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw_left = Math.abs(selectedObject.geometry.parameters.height) / (3/4)
        th_left = Math.abs(selectedObject.geometry.parameters.height) / asp / (3/4)
      }
      scope.z_view_handle.updateCameraParameters({
        left: -tw_top / 2,
        right: tw_top / 2,
        top: th_top / 2,
        bottom: -th_top / 2,
        near: -selectedObject.geometry.parameters.depth,
        far: selectedObject.geometry.parameters.depth,
        target: selectedObject
      })
      scope._leftView.updateCameraParameters({
        left: -tw_left / 2,
        right: tw_left / 2,
        top: th_left / 2,
        bottom: -th_left / 2,
        near: -selectedObject.geometry.parameters.width,
        far: selectedObject.geometry.parameters.width,
        target: selectedObject
      })
      scope.z_view_handle.init(scope);
      scope._leftView.init(scope);
      scope.z_view_handle.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      scope._leftView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
    } else if (this.type === 'left') {
      // 更新俯视、正视图相机
      if(asp > objAsp_top) {
        tw_top = selectedObject.geometry.parameters.height * asp / (3/4);
        th_top = selectedObject.geometry.parameters.height / (3/4)
      } else {
        tw_top = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th_top = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      if(asp > objAsp_front) {
        tw_front = selectedObject.geometry.parameters.depth * asp / (3/4);
        th_front = selectedObject.geometry.parameters.depth / (3/4)
      } else {
        tw_front = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
        th_front = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
      }
      scope.z_view_handle.updateCameraParameters({
        left: -tw_top / 2,
        right: tw_top / 2,
        top: th_top / 2,
        bottom: -th_top / 2,
        near: -selectedObject.geometry.parameters.depth,
        far: selectedObject.geometry.parameters.depth,
        target: selectedObject
      })
      scope._frontView.updateCameraParameters({
        left: -tw_front / 2,
        right: tw_front / 2,
        top: th_front / 2,
        bottom: -th_front / 2,
        near: -selectedObject.geometry.parameters.height,
        far: selectedObject.geometry.parameters.height,
        target: selectedObject
      })
      scope.z_view_handle.init(scope);
      scope.z_view_handle.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      scope._frontView.init(scope);
      scope._frontView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
    }
  }
}
