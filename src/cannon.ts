// WebAR.ts
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import type { ARScene } from "./scene";
import {
  CSS3DRenderer,
  CSS3DObject,
  GLTFLoader,
  XRButton,
} from "three/examples/jsm/Addons.js";

export interface WebARDelegate {
  onRender?(renderer: THREE.Renderer): void;
  onPlaneFound?(pose: THREE.Matrix4): void;
  onARButton?(): void;
}

export const useWebAR = (): WebAR => {
  return WebAR.getSingleton();
};

export class WebAR {
  scene = new THREE.Scene();
  rocket?: THREE.Object3D;
  tenbin?: THREE.Object3D;
  //tenbin2?: THREE.Object3D;
  passedTime?: number;
  isLaunch?: boolean;
  tween: any;

  // // renderer?: THREE.WebGLRenderer;
  cursorNode = new THREE.Object3D();
  baseNode?: THREE.Object3D;
  dome?: THREE.Object3D;
  delegate?: WebARDelegate;
  findPlane: boolean = true;
  prevTime: DOMHighResTimeStamp = -1;
  arScene?: ARScene;

  // 当たり判定など
  rocketBoundingBox?: THREE.Box3;
  tenbinBoundingBox?: THREE.Box3;

  //シングルトンを作る（インスタンスがアプリケーション内で唯一であることを保証する）
  private static instance: WebAR | null = null;
  public static getSingleton(): WebAR {
    if (!WebAR.instance) {
      WebAR.instance = new WebAR();
    }
    return WebAR.instance;
  }

  private constructor() {}

  makeDome() {
    // domeの画像関連のやつ
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/starrySky3.jpg");

    // 必要なパラメータ
    const domeRadius = 100; // ドームの半径
    const domeSegments = 32; // ドームの分割数

    // 材質
    const material_ = new THREE.MeshPhongMaterial({
      color: 0x87ceeb,
      map: texture,
      side: THREE.DoubleSide,
    });

    // ドームのジオメトリ
    const domeGeometry = new THREE.SphereGeometry(
      domeRadius,
      domeSegments,
      domeSegments,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );
    this.dome = new THREE.Mesh(domeGeometry, material_);

    this.scene.add(this.dome);
  }
  //////////////////////////////////
  checkCollision() {
    if (this.rocketBoundingBox && this.tenbinBoundingBox) {
      if (this.rocketBoundingBox.intersectsBox(this.tenbinBoundingBox)) {
        console.log("ロケットとテンビンが衝突しました！");
        this.handleCollision();
      }
    }
  }

  handleCollision() {
    console.log("ロケットとテンビンが衝突しました！");

    // 1. ロケットとテンビンを非表示にする
    if (this.rocket) {
      this.rocket.visible = false;
      this.scene.remove(this.rocket);
    }
    if (this.tenbin) {
      //this.tenbin.visible = false;
      //this.scene.remove(this.tenbin);
    }

    // 2. 新しいテンビンを同じ位置に再表示する
    // this.addNewTenbin();

    // 3. 新しいテンビンに自由落下アニメーションを適用する
    if (this.tenbin) {
      this.tenbin.position.y = 10; // 初期位置
      this.tenbin.visible = true;
      this.animateNewTenbin();
    }
  }

  // 新しいテンビンに自由落下アニメーションを適用する
  animateNewTenbin() {
    const clock = new THREE.Clock();

    const update = () => {
      const delta = clock.getDelta();

      if (!this.tenbin) {
        console.error("tenbin2オブジェクトが定義されていません");
        return;
      }

      const gravity = new THREE.Vector3(0, -0.01, 0);
      const acceleration = gravity.clone();

      const tenbinVelocity =
        this.tenbin.userData.velocity || new THREE.Vector3();
      tenbinVelocity.addScaledVector(acceleration, delta);
      this.tenbin.userData.velocity = tenbinVelocity;

      // 回転アニメーションを追加
      const rotationSpeed = -0.2;
      this.tenbin.rotateX(rotationSpeed * delta);

      // 速度に応じて位置を直接更新
      this.tenbin.position.y += tenbinVelocity.y * delta;

      if (this.tenbin.position.y <= 0) {
        this.tenbin.position.y = 0;

        // アニメーションの終了処理を追加
        this.scene.remove(this.tenbin);
        this.tenbin = undefined; // 重要: tenbin2 を undefined に設定

        // 新しいtenbinを作成してシーンに追加
        this.addNewTenbinAtGround();

        return;
      }

      requestAnimationFrame(update);
    };

    update();
  }

  // 新しいtenbinを作成してシーンに追加するメソッド
  addNewTenbinAtGround() {
    const loader = new GLTFLoader();
    loader.load(
      "/ph2.glb",
      (gltf) => {
        this.tenbin = gltf.scene;
        this.tenbin.scale.set(0.04, 0.04, 0.04);
        this.tenbin.position.z = -3;
        this.tenbin.position.y = 0; // 地面の高さに設定
        this.tenbin.rotation.x = Math.PI / 2; // 90度回転
        this.scene.add(this.tenbin);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  updateBoundingBoxes() {
    if (this.rocket && this.tenbin) {
      // ロケットのBoundingBoxを更新
      const rocketBox = new THREE.Box3().setFromObject(this.rocket);
      this.rocketBoundingBox = rocketBox;

      // てんびんのBoundingBoxを更新
      const tenbinBox = new THREE.Box3().setFromObject(this.tenbin);
      this.tenbinBoundingBox = tenbinBox;
    }
  }

  addConstellation() {
    // 一応呼ばれていそう
    const loader = new GLTFLoader();
    loader.load(
      "/ph2.glb",
      (gltf) => {
        this.tenbin = gltf.scene;
        this.tenbin.scale.set(0.05, 0.05, 0.05);
        this.tenbin.position.y = 10;
        this.tenbin.rotation.x = Math.PI; // 180度回転
        this.scene.add(this.tenbin);
      },
      undefined,
      (error) => {
        alert(error);
      }
    );
  }

  // addNewTenbin() {
  //   const loader = new GLTFLoader();
  //   loader.load("/tenbin.glb", (gltf) => {
  //     this.tenbin2 = gltf.scene;
  //     this.tenbin2.scale.set(0.05, 0.05, 0.05);

  //     // ここで初期位置をコピー
  //     this.tenbin2.position.copy(new THREE.Vector3(0, 5, 0));

  //     // const beforTenbinPos = this.tenbin?.position
  //     // if(beforTenbinPos === undefined) throw new Error('tenbinPos is undefined')
  //     // this.tenbin2.position.copy(beforTenbinPos);

  //     this.scene.add(this.tenbin2);
  //   }, undefined, (error) => {
  //     console.error(error);
  //   });
  //}

  addRocket() {
    const loader = new GLTFLoader();
    loader.load("/rocket.gltf", (gltf) => {
      this.rocket = gltf.scene;
      this.rocket.position.y = 0;
      // this.scene.add(rocket);
    });
    this.isLaunch = false;
  }

  launch() {
    this.isLaunch = true;
  }

  rocketAnimate(sec: number): void {
    if (!this.isLaunch) return;
    if (this.passedTime === undefined) {
      this.passedTime = 0;
    }

    if (this.rocket === undefined) throw new Error("rocketがundefinedです〜");
    this.rocket.position.y += this.passedTime ** 2;
    this.passedTime += 0.001;
    this.rocket.rotation.y += 0.01;

    this.checkCollision();
    this.updateBoundingBoxes();
  }
  ////////////////////////////////////
  placeScene(ar_scene: ARScene) {
    const nodes = this.rocket;

    if (!nodes) {
      // this.rocket が undefined の場合は何もせずに終了
      return;
    }

    if (this.baseNode) {
      this.scene.remove(this.baseNode);
    }
    this.baseNode = new THREE.Object3D();
    this.cursorNode.matrix.decompose(
      this.baseNode.position,
      this.baseNode.quaternion,
      this.baseNode.scale
    );
    this.baseNode.add(nodes);
    this.scene.add(this.baseNode!);

    this.arScene = ar_scene;
  }

  changeScene(ar_scene: ARScene) {
    this.baseNode?.clear();
    this.baseNode?.add();
    this.arScene = ar_scene;
  }

  start(overlay_dom: string) {
    /* Container */
    const container = document.getElementById("threejs");
    if (!container) {
      console.log("sorry cannot get three-container");
      return;
    }

    /* Scene */
    const scene = this.scene; //new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    /* Light */
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    this.scene.add(light);

    // スタート時に追加したいならここでscene.addをする
    // this.scene.add(this.dome);
    this.makeDome();
    this.addConstellation();
    this.addRocket();
    // this.tenbinBoundingBox = new THREE.Box3().setFromObject(this.tenbin);
    // this.rocketBoundingBox = new THREE.Box3().setFromObject(this.rocket);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    const overray_element = document.getElementById(overlay_dom);

    /* ARButton */
    const arbutton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      domOverlay: { root: overray_element! },
    });
    arbutton.addEventListener("click", () => {
      scene.background = null;
      this.delegate?.onARButton?.();
    });
    document.body.appendChild(arbutton);

    /* Geometry */
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial()
    );

    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    this.cursorNode = reticle;

    // this.baseNode.add(new THREE.Mesh(geometry, material));

    /* Camera */
    const camera = new THREE.PerspectiveCamera( //ダミーカメラ。webxrが制御するため使われない
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    /* ウィンドウリサイズ対応 */
    window.addEventListener("resize", onWindowResize);

    let hitTestSource: XRHitTestSource | null = null;
    let hitTestSourceRequested = false;

    const render = (timestamp: number, frame: XRFrame) => {
      if (frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        if (!referenceSpace) {
          console.log("sorry cannot get renderer referenceSpace");
          return;
        }

        const session = renderer.xr.getSession();
        if (!session) {
          console.log("sorry cannot get renderer session");
          return;
        }

        if (this.findPlane) {
          if (hitTestSourceRequested === false) {
            session.requestReferenceSpace("viewer").then((referenceSpace) => {
              session.requestHitTestSource!({ space: referenceSpace })!.then(
                (source) => {
                  hitTestSource = source;
                }
              );
            });

            session.addEventListener("end", () => {
              hitTestSourceRequested = false;
              hitTestSource = null;
            });

            hitTestSourceRequested = true;
          }

          if (hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);

            if (hitTestResults.length) {
              const hit = hitTestResults[0];

              reticle.visible = true;
              const pose_matrix_array =
                hit.getPose(referenceSpace)!.transform.matrix;
              const pose_matrix = new THREE.Matrix4();
              pose_matrix.fromArray(pose_matrix_array);
              reticle.matrix = pose_matrix;
              // this.baseNode.matrix = pose_matrix;

              this.delegate?.onPlaneFound?.(pose_matrix);
            } else {
              reticle.visible = false;
            }
          }
        }
      }
      let duration: DOMHighResTimeStamp = 1;
      if (this.prevTime > 0) {
        duration = timestamp - this.prevTime;
      }
      this.prevTime = timestamp;

      // this.arScene?.animate(Number(duration) / 1000);
      this.rocketAnimate(Number(duration) / 1000);
      // createSmoke(this.rocket);

      this.delegate?.onRender?.(renderer);
      renderer.render(scene, camera);
    };
    // フレームごとに実行されるアニメーション
    renderer.setAnimationLoop(render);
  }
}
