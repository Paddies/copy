import * as THREE from "three";
// 引入PCD加载器
import { PCDLoader } from "three/examples/jsm/loaders/PCDLoader.js";
// 引入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import ThreeView from "./threeview.js";
// 事件管理器（方便处理大量鼠标点击、移动事件的增加与移除）
import Events from "./events";
export default class MainView {
  constructor(element, { x, y, z, vertices }, cubes) {
    this.htmlElement = element;
    this.w = this.htmlElement.clientWidth;
    this.h = this.htmlElement.clientHeight;
    // 场景
    this.scene = new THREE.Scene();
    // 摄像机，参数（视角、宽高、近裁面、远裁面）
    this.camera = new THREE.PerspectiveCamera(30, this.w / this.h, 0.1, 1000);
    this.camera.position.x = x || 0;
    this.camera.position.y = y || 0;
    this.camera.position.z = z || 0;
    // 只可绕z轴旋转视角 ！！！
    this.camera.up = new THREE.Vector3(0, 0, 1);
    // 相机助手
    // this.cameraHelper = new THREE.CameraHelper(this.camera);
    // 渲染器
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.htmlElement.appendChild(this.renderer.domElement);
    // 鼠标事件管理器
    this.clickEvents = null          // 鼠标点击事件管理器
    this.mousemoveEvents = null      // 鼠标移动事件管理器
    // 光线投射器
    this.rayCasterEvents = null
    /*
     * 鼠标绘制对象相关变量
     */
    this.drawingState = 0; // 0: 未绘制矩形, 1: 绘制矩形, 2: 设置高度
    // 绘制完成后的矩形
    this.rectangle = null;
    // 绘制后的立方体顶点数据
    this.vertices = vertices || [];
    // 鼠标
    this.mouse = new THREE.Vector2();
    // 光线
    this.rayCaster = new THREE.Raycaster();
    // 位置、高度(立方体的三个顶点)
    this.startPosition = null;
    this.endPosition = null;
    this.zPosition = null;

    // 选中状态的target
    this.target = null;

    // 所有标注框
    this.cubes = cubes;

    // 当前场景可操作状态
    this.enableDraw = false;

    // 三视图
    this._topView = null;
    this._frontView = null;
    this._leftView = null;

    // PCD模型加载
    this.pcdLoader = new PCDLoader(); // 加载器
  }
  async init(path) {
    // 假设 this.scene 是你的 Three.Scene 实例
    this.scene.children.length = 0; // 这将移除场景中的所有对象
    // 加载PCD模型
    this.pcdLoader.load(path, (geometry) => {
      // 延z轴旋转90度, 初始化PCD高度、位置等
      // geometry.geometry.rotateZ(0.5 * Math.PI);//旋转模型，可调
      const middle = new THREE.Vector3();
      geometry.material.color = new THREE.Color(0xf9f9f9); // 模型颜色
      geometry.position.set(0, 0, 2);
      geometry.geometry.computeBoundingBox();
      geometry.geometry.boundingBox.getCenter(middle);
      const material = new THREE.PointsMaterial({
        color: 0xffffff,  // 点的颜色
        size: 0.5,          // 点的大小
        sizeAttenuation: false,  // 点的大小是否受相机远近影响
        vertexColors: THREE.VertexColors,  // 使用几何体定义的颜色
      });
      geometry.material = material;
      this.scene.add(geometry);
    });

    // 渲染保存的框
    this.cubes.forEach(cube => {
      this.renderCube(cube);
    })

    // 9.添加辅助坐标系
    // 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴 -- R G B
    // AxesHelper( size : Number ) size -- (可选的) 表示代表轴的线段长度. 默认为 1.
    const axesHelper = new THREE.AxesHelper(1);
    this.scene.add(axesHelper);

    if(this.controler) return;
    // 添加轨道控制器
    this.controler = new OrbitControls(this.camera, this.renderer.domElement);
    this.controler.enableDamping = true;  // 平滑控制
    this.controler.dampingFactor = 0.1;
    this.controler.enabled = true;
    this.animation();

    // 监听相机是否有变化，如果有变化需要禁止光线投射
    // this.controler.addEventListener('change', function () {
    //   this.rayCasterEvents.off();
    //   // 某种条件需要再次打开射线投射拾取
    //   // setTimeout(() => {
    //   //   if(this.rayCasterEvents) {
    //   //     // 开启射线投射拾取
    //   //     this.rayCasterEvents.on(this.handlerRayCast.bind(this));
    //   //   }
    //   // }, 0);
    // }.bind(this));

    // 鼠标事件添加
    this.initMouseEvent();
    // 添加光线投射
    this.initRayCaster();
    
  }
  // resize事件触发重绘
  rerender(w, h) {
    this.w = w;
    this.h = h;
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.w, this.h);
    if(this.z_view_handle && this._frontView && this._leftView) {
      this.z_view_handle.rerender(this);
      this._frontView.rerender(this);
      this._leftView.rerender(this);
    }
  }
  // 监听器，监听enableDraw，判断场景操作类型
  enableDrawObserve() {
    if(this.enableDraw === 0) {
      this.controler.enabled = true;
    } else {
      this.controler.enabled = false;
    }
  }
  // 如果有顶点数据，调用此方法渲染几何体
  renderCube({name, position, parameters}) {
    // 创建一个立方体 vertices.length=72, parameters: boxGeometry.parameters,包含了此立方体的长宽高
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    if(!parameters) return;
    // 创建立方体几何体
    const geometry = new THREE.BoxGeometry(Math.abs(parameters.width), Math.abs(parameters.height), Math.abs(parameters.depth));
    geometry.parameters = Object.assign({}, parameters)
    if(!name) return;
    if(!position) return;
    // 创建材质和网格对象
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.3, transparent: true });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z)
    mesh.name = name
    // 添加边缘高亮线条
    const edges = new THREE.EdgesGeometry(geometry); // 创建立方体边缘几何体
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // 创建边缘材质
    const edgesLines = new THREE.LineSegments(edges, edgesMaterial); // 创建边缘高亮线条对象
    mesh.add(edgesLines); // 将边缘高亮线条添加到立方体上
    this.scene.add(mesh)
    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }
  animation() {
    requestAnimationFrame(() => {
      this.animation();
    });
    this.controler.update();
    this.renderer.render(this.scene, this.camera);
  }
  // 更新摄像机位置
  updateProjectionMatrix(x, y, z) {
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
    this.camera.updateProjectionMatrix();
  }
  // 是否可操作轨道器
  controlOrbitControls(boolean) {
    this.controler.enabled = boolean;
    this.controler.update();
  }
  // 初始化鼠标事件
  initMouseEvent() {
    console.log('init event');
    this.clickEvents = new Events(this.htmlElement, 'click');
    this.mousemoveEvents = new Events(this.htmlElement,'mousemove');
  }
  // bindRayCaster 绑定射线投射器
  initRayCaster() {
    this.rayCasterEvents = new Events(this.htmlElement, 'mouseup');
  }
  // 开启选取
  bindRayCaster() {
    // 关闭标注模式
    this.clickEvents.off();
    this.mousemoveEvents.off();
    // 开启射线投射拾取
    this.rayCasterEvents.on(this.handlerRayCast.bind(this));
  }
  // 绑定鼠标事件
  bindMouseEvent() {
    // 关闭射线拾取
    this.rayCasterEvents.off();
      // 开启标注模式
      this.clickEvents.on(this.handlerClickEvent.bind(this));
      this.mousemoveEvents.on(this.handlerMoveEvent.bind(this));
  }
  // 完成绘制
  drawDone() {
    // console.log('移除事件');
    // this.clickEvents.off();
    // this.mousemoveEvents.off();
    // 恢复初始位置
    this.startPosition = null;
    this.endPosition = null;
    // 关闭标注模式
    this.clickEvents.destroy();
    this.clickEvents = null;
    this.clickEvents = new Events(this.htmlElement, 'click');
    this.drawingState = 0;
    this.rayCasterEvents.on(this.handlerRayCast.bind(this));
    /* 获取顶点数据 */
    setTimeout(() => {
      const cubes = this.getCubes();
      // 最新的标注框
      const cube = cubes.slice(-1)[0]
      // 偏移量
      const position = cube.position;
      // 保存属性Mesh：name、position、rotation、scale、geometry、material
      const geometry = cube.geometry;
      const positionAttribute = geometry.getAttribute('position');
      // 获取顶点坐标
      const vertices = [];
      for (let i = 0; i < positionAttribute.count; i++) {
          // 从属性中获取每个顶点的坐标
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);
          // 存储顶点坐标
          vertices.push({ x, y, z });
      }
      // 保证长宽高为正，简化三视图的计算情况
      cube.geometry.parameters.width = Math.abs(cube.geometry.parameters.width);
      cube.geometry.parameters.hegiht = Math.abs(cube.geometry.parameters.height);
      cube.geometry.parameters.depth = Math.abs(cube.geometry.parameters.depth);
      cube.tagsValue = {
        tag: null,
        cover: null,
        remark: null
      }
      // 创建当前mesh对象保存在本地缓存
      this.cubes.push({
        name: cube.name,
        position,
        parameters: cube.geometry.parameters,
        // 属性标签
        tagsValue: {
          tag: null,
          cover: null,
          remark: null
        }
      })
      this.controler.enabled = true; // 允许场景操作
      console.log(this.cubes);
      // localStorage.setItem('cubes', JSON.stringify(this.cubes))

      // localStorage.setItem('savedGeometry', JSON.stringify(vertices));
      // localStorage.setItem('position', JSON.stringify(position));
      // localStorage.setItem('name', cube.name);
    }, 0);
  }
  handlerClickEvent() {
    if(!this.clickEvents._event) return;
    const event = this.clickEvents._event;
    if (this.drawingState === 0) {
      // 开始绘制矩形中
      console.log("开始绘制矩形");
      this.drawingState = 1;
      this.drawCube(event, "stage1");
    } else if (this.drawingState === 1) {
      // 绘制矩形结束，开始设置立方体高度
      console.log("绘制平面矩形完成");
      // this.drawingState = 2;
      this.drawingState = 0;
      this.drawDone()
      // this.drawCube(event, "stage3");
    } else {
      // 设置立方体高度
      console.log("设置高度完成，绘制完成");
      this.drawingState = 0;
      this.drawCube(event, "stage5");
    }
  }
  handlerMoveEvent() {
    // 继续执行主要逻辑
    if(!this.mousemoveEvents._event) return;
    const event = this.mousemoveEvents._event;
    if (this.drawingState === 1) {
      // 正在绘制矩形
      console.log("绘制平面矩形");
      this.drawCube(event, "stage2");
    } else if (this.drawingState === 2) {
      // 设置立方体高度
      console.log("设置立方体高度");
      this.drawCube(event, "stage4");
    } else {
      // 无效移动
      console.log("无效移动");
    }
  }
  // 通过鼠标事件画出立方体，绘制过程drawingState应该是 click => mousemove => click => mousemove => click
  drawCube(event, stage) {
    if (stage === "stage1") {
      this.controler.enabled = false; // 禁止场景操作
      this.startPosition = this.getWorldPosition(event);
    } else if (stage === "stage2" || stage === "stage3") {
      // 鼠标再次点击，完成矩形创建，开始变换为立方体
      this.endPosition = this.getWorldPosition(event);
      this.redraw();
    } else if (stage === "stage4" || stage === "stage5") {
      // 鼠标移动，计算z值大小，动态设置立方体高度
      this.zPosition = this.getWorldPosition(event);
      // 以endPosition跟zPosition的Y值差为立方体高度
      this.redraw(this.zPosition);
      if (stage === "stage5") {
        // 绘制完成，移除鼠标事件
        setTimeout(() => {
          this.startPosition = null;
          this.drawDone();
        }, 0);
      }
    }
  }
  // 通过传入鼠标事件，获取世界坐标
  getWorldPosition(event) {
    // 鼠标事件的clientX和clientY属性返回鼠标相对于浏览器窗口的坐标
    // 而我们需要的是相对于canvas的坐标
    // 所以需要将clientX和clientY转换为相对于canvas的坐标
    // 我们可以通过canvas的getBoundingClientRect()方法来获取canvas相对于浏览器窗口的坐标
    const mouse = new THREE.Vector2();
    const boundingBox = this.htmlElement.getBoundingClientRect();
    // 鼠标点击位置
    // 计算鼠标点击位置，（归一化坐标系，其值在[-1, 1]之间）
    mouse.x = ((event.clientX - boundingBox.left) / boundingBox.width) * 2 - 1;
    mouse.y = -((event.clientY - boundingBox.top) / boundingBox.height) * 2 + 1;
    // 屏幕坐标转换为三维坐标
    const screenPosition = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    const worldPosition = new THREE.Vector3(); // 世界坐标
    screenPosition.unproject(this.camera); // 将屏幕坐标反投影到世界坐标
    screenPosition.sub(this.camera.position).normalize(); // 获取方向向量
    const distance = -this.camera.position.z / screenPosition.z; // 计算距离
    worldPosition.copy(this.camera.position).add(screenPosition.multiplyScalar(distance)); // 计算世界坐标
    return worldPosition.clone()
  }
  // 重绘
  redraw(zPosition) {
    let z = 1;
    // if(zPosition) {
    //   // 计算z值，保证z不能出现负数，否则将渲染在场景的下方
    //   z = this.zPosition.y > this.endPosition.y ? this.zPosition.y - this.endPosition.y : 0;
    // }
    const k_x = (this.startPosition.x - this.endPosition.x)/2;  // 标注框长
    const k_y = (this.startPosition.y - this.endPosition.y)/2;  // 标注框宽
    const k_z = z || 0;
    // 判断cubes内是否this.rectangle存在(！！！必要步骤，否则会清除掉上次的标注框)
    // console.log(this.cubes, this.rectangle);
    if(!this.cubes.some(cube => cube?.name === this.rectangle?.name)) {
      this.scene.remove(this.rectangle);
    }
    const geometry_k = new THREE.BoxGeometry(k_x, k_y, k_z);
    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      opacity: 0.3,
      transparent: true,
    });
    this.rectangle = new THREE.Mesh(geometry_k, material); // 防止重复创建rectangle对象
    this.rectangle.position.x = this.startPosition.x - k_x/2; // x轴偏移
    this.rectangle.position.y = this.startPosition.y - k_y/2; // y轴偏移
    this.rectangle.position.z = this.startPosition.z + k_z/2; // z轴偏移
    this.rectangle.name = `cube_${new Date().getTime()}`;
    const edges = new THREE.EdgesGeometry(geometry_k); // 创建立方体边缘几何体
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 }); // 创建边缘材质
    const edgesLines = new THREE.LineSegments(edges, edgesMaterial); // 创建边缘高亮线条对象
    this.rectangle.add(edgesLines); // 将边缘高亮线条添加到立方体上
    this.scene.add(this.rectangle);
    this.renderer.render(this.scene, this.camera);
  }
  // 获取场景中的cube对象
  getCubes() {
    return this.scene.children.filter(child => child.name.startsWith('cube_'));
  }
  // rayCaster判定选中的对象
  async handlerRayCast(event) {
    if(!event) return;
    if(event.target.tagName.toLowerCase() !== 'canvas') {
      return;
    }
    const mouse = new THREE.Vector2();
    const boundingBox = this.htmlElement.getBoundingClientRect();
    // 鼠标点击位置
    // 计算鼠标点击位置，（归一化坐标系，其值在[-1, 1]之间）
    mouse.x = ((event.clientX - boundingBox.left) / boundingBox.width) * 2 - 1;
    mouse.y = -((event.clientY - boundingBox.top) / boundingBox.height) * 2 + 1;
    // 设置射线的起点和方向
    this.rayCaster.setFromCamera(mouse, this.camera);
    // 获取射线和场景中物体的交点，初始化边框颜色
    const objects = this.scene.children.filter(child => child.name.startsWith('cube_'));
    objects.forEach(obj => {
      // 恢复初始边框颜色
      obj.children[0].material.color.set(0x00ff00)
    })
    // 无选中，隐藏三视图
    // const doms = document.querySelectorAll('.view-svg')
    // doms.forEach(item => item.style.display = 'none')
    const intersects = this.rayCaster.intersectObjects(objects, true);
    // 检查交点并处理选中的物体
    if (intersects.length > 0) {
      let selectedObject = null;  // 选中的物体
      let flag = false;   // 是否显示属性框，默认不显示
      for ( let i = 0; i < intersects.length; i ++ ) {
        // 高亮
        if(intersects[i].object.name) {
          intersects[i].object.children[0].material.color.set(0x3382FF);
          selectedObject = intersects[i].object
          this.target = selectedObject
          flag = true;
        }
      }
      await new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
      // 选中需渲染三视图，关键点：
      // 1、俯视图相机定位obj的x:obj.x, y: obj.y, z: obj.z + distance;
      // 2、camera.lookAt(obj.position);
      // 3、正视图相机定位obj的x:obj.x, y: -obj.y - distance, z: obj.z / 2;
      // 4、camera.lookAt(obj.position);
      // 5、左视图相机定位obj的x:obj.x - distance, y: obj.y, z: obj.z;
      // 6、camera.lookAt(obj.position);
      // 注：上述位置可能存在偏差，需要根据实际情况调整，distance取值需自行调整，表示相机与物体的距离
      if(flag) {
        this.toggleProperties(
          true,
          selectedObject
        );
      }
      // console.log(selectedObject);
      // 防止创建多个webgl,需要加判断，不可重复创建
      // 俯视
      const _top = document.getElementById("top");
      const original_parameters = Object.assign({}, selectedObject.geometry.parameters);
      sessionStorage.setItem('original_parameters', JSON.stringify(original_parameters))
      if(!this.z_view_handle) {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.height);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.height * asp / (3/4);
          th = selectedObject.geometry.parameters.height / (3/4)
        } else {
          tw = selectedObject.geometry.parameters.width / (3/4)
          th = selectedObject.geometry.parameters.width / asp / (3/4)
        }
        this.z_view_handle = new ThreeView(_top, 'top', this.scene, selectedObject, this.cubes, {
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.depth,
          far: selectedObject.geometry.parameters.depth,
        });
      } else {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.height);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.height * asp / (3/4);
          th = selectedObject.geometry.parameters.height / (3/4)
        } else {
          tw = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
          th = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
        }
        this.z_view_handle.updateCameraParameters({
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.depth,
          far: selectedObject.geometry.parameters.depth,
          target: selectedObject
        })
      }
      this.z_view_handle.init(this, original_parameters);
      this.z_view_handle.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      // 正视
      const _front = document.getElementById("right");
      if(!this._frontView) {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.depth);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.depth * asp / (3/4);
          th = selectedObject.geometry.parameters.depth / (3/4)
        } else {
          tw = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
          th = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
        }
        this._frontView = new ThreeView(_front, 'front', this.scene, selectedObject, this.cubes,{
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.height,
          far: selectedObject.geometry.parameters.height
        });
      } else {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.width / this.target.geometry.parameters.depth);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.depth * asp / (3/4);
          th = selectedObject.geometry.parameters.depth / (3/4)
        } else {
          tw = Math.abs(selectedObject.geometry.parameters.width) / (3/4)
          th = Math.abs(selectedObject.geometry.parameters.width) / asp / (3/4)
        }
        this._frontView.updateCameraParameters({
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.height,
          far: selectedObject.geometry.parameters.height,
          target: selectedObject
        })
      }
      this._frontView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      this._frontView.init(this, original_parameters);
      // 左视
      const _left = document.getElementById("left");
      if (!this._leftView) {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.height / this.target.geometry.parameters.depth);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.depth * asp / (3/4);
          th = selectedObject.geometry.parameters.depth / (3/4)
        } else {
          tw = Math.abs(selectedObject.geometry.parameters.hegiht) / (3/4)
          th = Math.abs(selectedObject.geometry.parameters.height) / asp / (3/4)
        }
        this._leftView = new ThreeView(_left, 'left', this.scene, selectedObject, this.cubes,{
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.width,
          far: selectedObject.geometry.parameters.width,
        });
      } else {
        // 相机缩放比例
        const asp = _top.clientWidth / _top.clientHeight;
        const objAsp = Math.abs(this.target.geometry.parameters.height / this.target.geometry.parameters.depth);
        let tw, th;
        if(asp > objAsp) {
          tw = selectedObject.geometry.parameters.depth * asp / (3/4);
          th = selectedObject.geometry.parameters.depth / (3/4)
        } else {
          tw = Math.abs(selectedObject.geometry.parameters.hegiht) / (3/4)
          th = Math.abs(selectedObject.geometry.parameters.height) / asp / (3/4)
        }
        this._leftView.updateCameraParameters({
          left: -tw / 2,
          right: tw / 2,
          top: th / 2,
          bottom: -th / 2,
          near: -selectedObject.geometry.parameters.width,
          far: selectedObject.geometry.parameters.width,
          target: selectedObject
        })
      }
      this._leftView.updateProjectionMatrix(selectedObject.position.x, selectedObject.position.y, selectedObject.position.z);
      this._leftView.init(this, original_parameters);
    } else {
      console.log('未选中！');
      // 隐藏属性框
      this.toggleProperties(false);
      // this.rayCasterEvents.off();
    }
  }

  // 关闭属性框
  closeAttributes() {
    this.toggleProperties(false);
  }
  // 删除框
  deleteObject(callback) {
    if(!this.target) return;
    this.scene.remove(this.target)
    const cubes = this.cubes;
    this.cubes = cubes.filter(item => item.name !== this.target.name);
    const target = Object.assign({}, this.target)
    callback(target);
    this.target = null;
  }
  // 属性框显隐
  toggleProperties(show, selectedObject) {
    // 是否禁用缩放、拖拽
    // this.controler.enabled = !show;
    if(show) {
      // 创建一个带有数据的自定义事件
      const customEventWithData = new CustomEvent('boxSelect', {
        detail: {
          show: true,
          target: selectedObject
        }
      });
      // 派发事件到 document
      document.dispatchEvent(customEventWithData);
      // 屏幕坐标转换
      // let screenPosition = this.worldToScreen(position.x, position.y, position.z);
      // _properties.style.display = 'block';
      // _properties.style.left = `${screenPosition.x + 40}px`;
      // _properties.style.top = `${screenPosition.y}px`;
      // const content = document.getElementById('modal_setting_content');
      // content.innerHTML = `<p>x: ${position.x}</p><p>y: ${position.y}</p><p>z: ${position.z}</p><p>长度: ${boxAttributes.height}</p><p>宽度: ${boxAttributes.width}</p><p>高度: ${boxAttributes.depth}</p>`
    } else {
      // 创建一个带有数据的自定义事件
      const customEventWithData = new CustomEvent('boxSelect', {
        detail: {
          show: false
        }
      });
      // 派发事件到 document
      document.dispatchEvent(customEventWithData);
    }
  }
  // 世界坐标转屏幕坐标
  worldToScreen(x, y, z) {
    const point3D = new THREE.Vector3(x, y, z);
    // 使用project方法将3D坐标转换为屏幕坐标
    point3D.project(this.camera);
    // 屏幕坐标范围是从-1到1，将其转换为屏幕像素坐标
    const widthHalf = this.renderer.domElement.width / 2;
    const heightHalf = this.renderer.domElement.height / 2;
    const projectedX = (point3D.x * widthHalf) + widthHalf;
    const projectedY = -(point3D.y * heightHalf) + heightHalf;
    // 屏幕坐标
    return { x: projectedX, y: projectedY }
  }
}
