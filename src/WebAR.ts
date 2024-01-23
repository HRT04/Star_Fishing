// import * as THREE from "three";
// import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
// import type { ARScene } from "./scene";
// import useLogger from "./logger";
// import { ref } from "vue";
// import { line, videosetup, capture } from "./Line_camera";
// import { Color_process, Color_divide, dspResult } from "./color";

// const log = useLogger();

// export interface WebARDelegate {
//   onRender?(renderer: THREE.Renderer): void;
//   onPlaneFound?(pose: THREE.Matrix4): void;
//   onARButton?(): void;
// }

// //振り上げた時の値計算
// export function handleMotion(event: any) {
//   // 加速度データの取得
//   const acceleration = event.accelerationIncludingGravity;
//   // 加速度の強さを計算
//   const accelerationStrength = Math.sqrt(
//     acceleration.x * acceleration.x +
//       acceleration.y * acceleration.y +
//       acceleration.z * acceleration.z
//   );
//   return accelerationStrength;
// }
// // log.info("webar.ts")

// export const useWebAR = () => {
//   const webar = ref(WebAR.getSingleton());
//   return webar;
// };

// export class WebAR {
//   scene = new THREE.Scene();
//   // // renderer?: THREE.WebGLRenderer;
//   cursorNode = new THREE.Object3D();
//   baseNode?: THREE.Object3D;
//   delegate?: WebARDelegate;

//   findPlane: boolean = true;
//   prevTime: DOMHighResTimeStamp = -1;

//   arScene?: ARScene;
//   color_num?: string;
//   private animationStarted: boolean = false;

//   //シングルトンを作る（インスタンスがアプリケーション内で唯一であることを保証する）
//   private static instance: WebAR | null = null;
//   public static getSingleton(): WebAR {
//     if (!WebAR.instance) {
//       WebAR.instance = new WebAR();
//     }
//     return WebAR.instance;
//   }
//   startAnimationOnClick() {
//     this.animationStarted = true;
//   }

//   constructor() {}

//   placeScene(ar_scene: ARScene, c_n: string) {
//     const nodes = ar_scene.makeObjectTree(c_n);

//     if (this.baseNode) {
//       this.scene.remove(this.baseNode);
//     }
//     this.baseNode = new THREE.Object3D();
//     this.cursorNode.matrix.decompose(
//       this.baseNode.position,
//       this.baseNode.quaternion,
//       this.baseNode.scale
//     );
//     this.baseNode.add(nodes);
//     this.scene.add(this.baseNode!);

//     this.arScene = ar_scene;
//   }

//   changeScene(ar_scene: ARScene, c_n: string) {
//     this.baseNode?.clear();
//     this.baseNode?.add(ar_scene.makeObjectTree(c_n));
//     this.arScene = ar_scene;
//   }

//   start(overlay_dom: string) {
//     window.addEventListener("deviceorientation", handleMotion);

//     /* Container */
//     const container = document.getElementById("threejs");
//     if (!container) {
//       console.log("sorry cannot get three-container");
//       return;
//     }

//     /* Scene */
//     const scene = this.scene; //new THREE.Scene();
//     scene.background = null; //new THREE.Color(0x00ff00);

//     /* Light */
//     const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
//     light.position.set(0.5, 1, 0.25);
//     scene.add(light);

//     /* line */
//     const line_canvas: any = document.createElement("canvas");
//     line_canvas.width = window.innerWidth;
//     line_canvas.height = window.innerHeight;
//     const lineCtx: any = line_canvas.getContext("2d");
//     line(line_canvas, lineCtx);

//     /* ビデオ用canvas */
//     const videoCanvas = document.createElement("canvas");
//     videoCanvas.width = window.innerWidth;
//     videoCanvas.height = window.innerHeight;
//     const linevideo: CanvasRenderingContext2D | null =
//       videoCanvas.getContext("2d");

//     // ビデオ要素を作成
//     const video = document.createElement("video");
//     video.width = window.innerWidth;
//     video.height = window.innerHeight;
//     video.autoplay = true;
//     video.playsInline = true;

//     //videosetup
//     videosetup(linevideo, video);
//     video.style.position = "absolute";
//     video.style.left = "0";
//     video.style.top = "0";
//     video.style.zIndex = "9";

//     // 作成した video エレメントを DOM に追加
//     document.body.appendChild(video);

//     /* RENDERER */
//     const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
//     renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.xr.enabled = true;
//     container.appendChild(renderer.domElement);
//     line_canvas.style.position = "absolute";
//     line_canvas.style.left = "0";
//     line_canvas.style.top = "0";
//     line_canvas.style.zIndex = "10";

//     //枠線を描画したキャンバスを追加
//     document.body.appendChild(line_canvas);

//     const overray_element = document.getElementById(overlay_dom);

//     /* ARButton */
//     const arbutton = ARButton.createButton(renderer, {
//       requiredFeatures: ["hit-test"],
//       domOverlay: { root: overray_element! },
//     });
//     arbutton.addEventListener("click", () => {
//       let img: any, hsv_value: any;
//       scene.background = null;
//       this.delegate?.onARButton?.(); // XR起動
//       img = capture(videoCanvas); // 画像キャプチャ
//       hsv_value = Color_process(img); // 画像処理
//       // カーラコード取得
//       this.color_num =
//         "0x" +
//         Color_divide(
//           hsv_value.modeHue,
//           hsv_value.modeSatu,
//           hsv_value.modeValue
//         );
//       dspResult(this.color_num);
//     });
//     document.body.appendChild(arbutton);

//     /* Geometry */
//     // グラデーションのテクスチャを作成
//     const canvas = document.createElement("canvas");
//     const ctx: any = canvas.getContext("2d");
//     canvas.width = 256;
//     canvas.height = 256;

//     const gradient = ctx.createRadialGradient(
//       canvas.width / 2,
//       canvas.height / 2,
//       0,
//       canvas.width / 2,
//       canvas.height / 2,
//       canvas.width / 2
//     );
//     gradient.addColorStop(0, "rgba(100, 0, 0, 1)");
//     gradient.addColorStop(1, "rgba(0, 0, 255, 1)");

//     ctx.fillStyle = gradient;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);

//     // テクスチャを作成
//     const texture = new THREE.CanvasTexture(canvas);
//     const reticle = new THREE.Mesh(
//       new THREE.RingGeometry(0.075, 0.1, 6).rotateX(-Math.PI / 2),

//       new THREE.MeshBasicMaterial({
//         transparent: true,
//         opacity: 0.3,
//         map: texture,
//       })
//     );

//     reticle.matrixAutoUpdate = false;
//     reticle.visible = false;
//     scene.add(reticle);

//     this.cursorNode = reticle;

//     // const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(
//     //     0,
//     //     0.1,
//     //     0
//     // );

//     // const material = new THREE.MeshPhongMaterial({
//     //     color: 0xffffff * Math.random(),
//     // });

//     // this.baseNode.add(new THREE.Mesh(geometry, material));

//     /* Camera */
//     const camera = new THREE.PerspectiveCamera( //ダミーカメラ。webxrが制御するため使われない
//       70,
//       window.innerWidth / window.innerHeight,
//       0.01,
//       20
//     );

//     // const onSelect = () => {
//     //     if (reticle.visible) {
//     //         const mesh = new THREE.Mesh(geometry, material);
//     //         reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
//     //         mesh.scale.y = Math.random() * 2 + 1;
//     //         scene.add(mesh);
//     //     }
//     // }
//     // /* Controller */
//     // const controller = renderer.xr.getController(0);
//     // controller.addEventListener("select", onSelect);
//     // scene.add(controller);

//     const onWindowResize = () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();

//       renderer.setSize(window.innerWidth, window.innerHeight);
//     };
//     /* ウィンドウリサイズ対応 */
//     window.addEventListener("resize", onWindowResize);

//     let hitTestSource: XRHitTestSource | null = null;
//     let hitTestSourceRequested = false;

//     const render = (timestamp: number, frame: XRFrame) => {
//       if (frame) {
//         const referenceSpace = renderer.xr.getReferenceSpace();
//         if (!referenceSpace) {
//           console.log("sorry cannot get renderer referenceSpace");
//           return;
//         }

//         const session = renderer.xr.getSession();
//         if (!session) {
//           console.log("sorry cannot get renderer session");
//           return;
//         }

//         if (this.findPlane) {
//           if (hitTestSourceRequested === false) {
//             session.requestReferenceSpace("viewer").then((referenceSpace) => {
//               session.requestHitTestSource!({ space: referenceSpace })!.then(
//                 (source) => {
//                   hitTestSource = source;
//                 }
//               );
//             });

//             session.addEventListener("end", () => {
//               hitTestSourceRequested = false;
//               hitTestSource = null;
//             });

//             hitTestSourceRequested = true;
//           }

//           if (hitTestSource) {
//             const hitTestResults = frame.getHitTestResults(hitTestSource);

//             if (hitTestResults.length) {
//               const hit = hitTestResults[0];

//               reticle.visible = true;
//               const pose_matrix_array =
//                 hit.getPose(referenceSpace)!.transform.matrix;
//               const pose_matrix = new THREE.Matrix4();
//               pose_matrix.fromArray(pose_matrix_array);
//               reticle.matrix = pose_matrix;
//               // this.baseNode.matrix = pose_matrix;

//               this.delegate?.onPlaneFound?.(pose_matrix);
//             } else {
//               reticle.visible = false;
//             }
//           }
//         }
//       }
//       let duration: DOMHighResTimeStamp = 1;
//       if (this.prevTime > 0) {
//         duration = timestamp - this.prevTime;
//       }
//       this.prevTime = timestamp;
//       if (this.animationStarted) {
//         this.arScene?.animate();
//       }
//       this.delegate?.onRender?.(renderer);
//       renderer.render(scene, camera);
//     };
//     // フレームごとに実行されるアニメーション
//     renderer.setAnimationLoop(render);
//     return this.color_num;
//   }
// }

////////////////////////
import * as THREE from "three";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";
import type { ARScene } from "./scene";
import useLogger from "./logger";
import { line, videosetup, capture } from "./Line_camera";
import { Color_process, Color_divide, dspResult } from "./color";
import { burnerLight } from "./Lights";

const log = useLogger();

export interface WebARDelegate {
  onRender?(renderer: THREE.Renderer): void;
  onPlaneFound?(pose: THREE.Matrix4): void;
  onARButton?(): void;
}

//振り上げた時の値計算
export function handleMotion(event: any) {
  // 加速度データの取得
  const acceleration = event.accelerationIncludingGravity;
  // 加速度の強さを計算
  const accelerationStrength = Math.sqrt(
    acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
  );
  return accelerationStrength;
}
// log.info("webar.ts")

export const useWebAR = () => {
  return WebAR.getSingleton();
};

export class WebAR {
  scene = new THREE.Scene();
  // // renderer?: THREE.WebGLRenderer;
  cursorNode = new THREE.Object3D();
  baseNode?: THREE.Object3D;
  delegate?: WebARDelegate;

  findPlane: boolean = true;
  prevTime: DOMHighResTimeStamp = -1;

  arScene?: ARScene;
  color_num?: string;
  private animationStarted: boolean = false;

  //シングルトンを作る（インスタンスがアプリケーション内で唯一であることを保証する）
  private static instance: WebAR | null = null;
  public static getSingleton(): WebAR {
    if (!WebAR.instance) {
      WebAR.instance = new WebAR();
    }
    return WebAR.instance;
  }
  startAnimationOnClick() {
    this.animationStarted = true;
  }

  constructor() {}

  placeScene(ar_scene: ARScene) {
    const nodes = ar_scene.makeObjectTree();

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
    this.baseNode?.add(ar_scene.makeObjectTree());
    this.arScene = ar_scene;
  }

  start(overlay_dom: string) {
    window.addEventListener("deviceorientation", handleMotion);

    /* Container */
    const container = document.getElementById("threejs");
    if (!container) {
      console.log("sorry cannot get three-container");
      return;
    }

    /* Scene */
    const scene = this.scene; //new THREE.Scene();
    scene.background = new THREE.Color(0x4e4ef4); //new THREE.Color(0x00ff00);

    /* Light */
    const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    light.position.set(0.5, 1, 0.25);
    scene.add(light);

    /* line */
    const line_canvas: any = document.createElement("canvas");
    line_canvas.width = window.innerWidth;
    line_canvas.height = window.innerHeight;
    const lineCtx: any = line_canvas.getContext("2d");
    line(line_canvas, lineCtx);

    /* ビデオ用canvas */
    const videoCanvas = document.createElement("canvas");
    videoCanvas.width = window.innerWidth;
    videoCanvas.height = window.innerHeight;
    const linevideo: CanvasRenderingContext2D | null =
      videoCanvas.getContext("2d");

    // ビデオ要素を作成
    const video = document.createElement("video");
    video.width = window.innerWidth;
    video.height = window.innerHeight;
    video.autoplay = true;
    video.playsInline = true;

    //videosetup
    videosetup(linevideo, video);
    video.style.position = "absolute";
    video.style.left = "0";
    video.style.top = "0";
    video.style.zIndex = "9";

    // 作成した video エレメントを DOM に追加
    document.body.appendChild(video);

    /* RENDERER */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);
    line_canvas.style.position = "absolute";
    line_canvas.style.left = "0";
    line_canvas.style.top = "0";
    line_canvas.style.zIndex = "10";

    //枠線を描画したキャンバスを追加
    document.body.appendChild(line_canvas);

    const overray_element = document.getElementById(overlay_dom);

    /* ARButton */
    const arbutton = ARButton.createButton(renderer, {
      requiredFeatures: ["hit-test"],
      domOverlay: { root: overray_element! },
    });
    arbutton.addEventListener("click", () => {
      let img: any, hsv_value: any;
      scene.background = null;
      this.delegate?.onARButton?.(); // XR起動
      img = capture(videoCanvas); // 画像キャプチャ
      hsv_value = Color_process(img); // 画像処理
      // カーラコード取得
      this.color_num = Color_divide(
        hsv_value.modeHue,
        hsv_value.modeSatu,
        hsv_value.modeValue
      );
      dspResult(this.color_num);
    });
    document.body.appendChild(arbutton);

    /* Geometry */
    // グラデーションのテクスチャを作成
    const canvas = document.createElement("canvas");
    const ctx: any = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 256;

    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    gradient.addColorStop(0, "rgba(100, 0, 0, 1)");
    gradient.addColorStop(1, "rgba(0, 0, 255, 1)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // テクスチャを作成
    const texture = new THREE.CanvasTexture(canvas);
    const reticle = new THREE.Mesh(
      new THREE.RingGeometry(0.075, 0.1, 6).rotateX(-Math.PI / 2),

      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.3,
        map: texture,
      })
    );

    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    this.cursorNode = reticle;

    // const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(
    //     0,
    //     0.1,
    //     0
    // );

    // const material = new THREE.MeshPhongMaterial({
    //     color: 0xffffff * Math.random(),
    // });

    // this.baseNode.add(new THREE.Mesh(geometry, material));

    /* Camera */
    const camera = new THREE.PerspectiveCamera( //ダミーカメラ。webxrが制御するため使われない
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      20
    );

    // const onSelect = () => {
    //     if (reticle.visible) {
    //         const mesh = new THREE.Mesh(geometry, material);
    //         reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
    //         mesh.scale.y = Math.random() * 2 + 1;
    //         scene.add(mesh);
    //     }
    // }
    // /* Controller */
    // const controller = renderer.xr.getController(0);
    // controller.addEventListener("select", onSelect);
    // scene.add(controller);

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
      if (this.animationStarted) {
        this.arScene?.animate();
      }
      this.delegate?.onRender?.(renderer);
      renderer.render(scene, camera);
    };
    // フレームごとに実行されるアニメーション
    renderer.setAnimationLoop(render);
    return this.color_num;
  }
}
