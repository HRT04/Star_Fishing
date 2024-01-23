import THREE from "./scene";
import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

const init = () => {
  let hitTestSource: XRHitTestSource | null = null;
  let hitTestSourceRequested = false;

  /* Container */
  const container = document.getElementById("threejs");
  if (!container) {
    console.log("sorry cannot get three-container");
    return;
  }

  /* SCENE,CAMERA */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    20
  );

  /* Light */
  const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
  light.position.set(0.5, 1, 0.25);
  scene.add(light);

  /* RENDERER */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.xr.enabled = true;
  container.appendChild(renderer.domElement);

  /* ARButton */
  document.body.appendChild(
    ARButton.createButton(renderer, { requiredFeatures: ["hit-test"] })
  );

  /* Geometry */
  const reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, 0.2, 32).rotateX(-Math.PI / 2),
    new THREE.MeshBasicMaterial()
  );
  reticle.matrixAutoUpdate = false;
  reticle.visible = false;
  scene.add(reticle);

  const geometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32).translate(
    0,
    0.1,
    0
  );

  /* Controller */
  const controller = renderer.xr.getController(0);
  controller.addEventListener("select", onSelect);
  scene.add(controller);

  function onSelect() {
    if (reticle.visible) {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff * Math.random(),
      });
      const mesh = new THREE.Mesh(geometry, material);
      reticle.matrix.decompose(mesh.position, mesh.quaternion, mesh.scale);
      mesh.scale.y = Math.random() * 2 + 1;
      scene.add(mesh);
    }
  }

  /* ウィンドウリサイズ対応 */
  window.addEventListener("resize", onWindowResize);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // フレームごとに実行されるアニメーション
  animate();

  function animate() {
    renderer.setAnimationLoop(render);
  }

  function render(timestamp: number, frame: XRFrame) {
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

      if (hitTestSourceRequested === false) {
        session.requestReferenceSpace("viewer").then((referenceSpace) => {
          session.requestHitTestSource!({ space: referenceSpace })!.then(
            function (source) {
              hitTestSource = source;
            }
          );
        });

        session.addEventListener("end", function () {
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
          reticle.matrix.fromArray(
            hit.getPose(referenceSpace)!.transform.matrix
          );
        } else {
          reticle.visible = false;
        }
      }
    }

    renderer.render(scene, camera);
  }
};

init();
export function test_webxr() {
  // init();
}
