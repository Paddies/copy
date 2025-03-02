import * as THREE from "three";
// 引入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import SetObjectSize from "./setObjectSize";

export default class ThreeView {
  constructor(container, type, scene, target, cubes, orthAttributes) {
    // console.log(orthAttributes);
    this.container = container; // 容器
    this.w = this.container.clientWidth;
    this.h = this.container.clientHeight;
    this.type = type; // 三视图类型
    this.target = target; // 目标对象
    this.scene = scene; // 主场景与三视图共用场景
    // 渲染器
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.container.appendChild(this.renderer.domElement);
    this.orthAttributes = orthAttributes;
    // 正交相机参数：left, right, top, bottom, near, far
    this.camera = new THREE.OrthographicCamera(
      this.orthAttributes.left,
      this.orthAttributes.right,
      this.orthAttributes.top,
      this.orthAttributes.bottom,
      this.orthAttributes.near,
      this.orthAttributes.far
    );
    if(this.type === 'top') {
      this.camera.up = new THREE.Vector3(0, 1, 0);
    } else if (this.type === 'front') {
      this.camera.up = new THREE.Vector3(0, 0, 1);
    } else if (this.type === 'left') {
      this.camera.up = new THREE.Vector3(0, 0, 1);
    }

    // 光线拾取事件
    this.rayCasterEvents = null;
    // 光线
    this.rayCaster = new THREE.Raycaster();

    // setObjectSize
    this.objectSize = null

    // 添加轨道控制器
    this.controler = new OrbitControls(this.camera, this.renderer.domElement);
    this.controler.enableDamping = true; // 平滑控制
    this.controler.enablePan = true;

    // 所有标注框
    this.cubes = cubes
    
    // 动画更新
    this.animation();
  }
  // 初始化加载（正交相机形式加载，展示2d视图）
  init(scope) {
    if (!this.renderer) return;
    this.renderer.render(this.scene, this.camera);
    if (!this.target) return;
    // console.log('three init', this.type);
    this.objectSize = new SetObjectSize(this.camera, this.target, this.cubes, this.container, this.scene, this.type, this.renderer);
    this.objectSize.init(scope);
    // this.initRayCaster();
  }

  // resize触发重绘
  rerender(scope) {
    this.w = this.container.clientWidth;
    this.h = this.container.clientHeight;
    this.renderer.setSize(this.w, this.h);
    this.objectSize.init(scope);
  }

  // 更新摄像机位置，传入x,y,z为目标的空间坐标位置
  updateProjectionMatrix(x, y, z) {
    // console.log('update camera', this.type);
    if(this.type === 'top') {
        this.camera.position.set(x, y, z);
        this.camera.lookAt(new THREE.Vector3(x, y, -z));
    } else if (this.type === 'front') {
        this.camera.position.set(x, y, z)
        this.camera.lookAt(new THREE.Vector3(x, -y, z));
    } else if (this.type === 'left') {
        this.camera.position.set(x, y, z)
        this.camera.lookAt(new THREE.Vector3(-x, y, z));
    }
    // 更新相机视图矩阵（正交相机视图更新）
    this.camera.updateProjectionMatrix();
  }

  // 修改正交相机参数
  updateCameraParameters({
    left,
    right,
    top,
    bottom,
    near,
    far,
    target
  }) {
    this.target = target;
    this.camera.left = left;
    this.camera.right = right;
    this.camera.top = top;
    this.camera.bottom = bottom;
    this.camera.near = near;
    this.camera.far = far;
    if(this.type === 'top') {
      this.camera.up = new THREE.Vector3(0, 1, 0);
    } else if (this.type === 'front') {
      this.camera.up = new THREE.Vector3(0, 0, 1);
    } else if (this.type === 'left') {
      this.camera.up = new THREE.Vector3(0, 0, 1);
    }
    // 更新相机视图矩阵（正交相机视图更新）
    this.camera.updateProjectionMatrix();
  }

  // initRayCaster() {
  //   this.rayCasterEvents = new Events(this.container, 'mouseup');
  //   this.bindRayCaster();
  // }

  // // 开启选取
  // bindRayCaster() {
  //   // 开启射线投射拾取
  //   this.rayCasterEvents.on(this.handlerRayCast.bind(this));
  // }

  // handlerRayCast(event) {
  //   if(!event) return;
  //   const mouse = new THREE.Vector2();
  //   const boundingBox = this.container.getBoundingClientRect();
  //   console.log(boundingBox);
  //   // 鼠标点击位置
  //   // 计算鼠标点击位置，（归一化坐标系，其值在[-1, 1]之间）
  //   mouse.x = ((event.clientX - boundingBox.left) / boundingBox.width) * 2 - 1;
  //   mouse.y = -((event.clinetY - boundingBox.top) / boundingBox.height) * 2 + 1;
  //   // console.log(mouse.x, mouse.y);
  //   // 设置射线的起点和方向
  //   this.rayCaster.setFromCamera(mouse, this.camera);
  //   // console.log(this.target.children);
  //   const intersects = this.rayCaster.intersectObjects(this.scene.children);
  //   console.log(intersects);
  //   // if (intersects.length > 0) {
  //   //   const target = intersects[0].object;
  //   //   console.log(target);
  //   // }
  // }

  animation() {
    // console.count('animation')
    requestAnimationFrame(() => {
      this.animation();
    });
    // this.controler.update();
    this.renderer.render(this.scene, this.camera);
  }
}
