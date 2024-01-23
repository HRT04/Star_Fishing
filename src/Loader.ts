import THREE from "./scene";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export function loadModel_terminal(
  scene: THREE.Scene,
  gltfLoader: GLTFLoader,
  position: THREE.Vector3,
  glb_path: string,
  scl: number
) {
  gltfLoader.load(glb_path, function (gltf) {
    const model: THREE.Object3D = gltf.scene;
    model.scale.set(scl, scl, scl);
    model.position.copy(position);
    scene.add(model);
  });
  return;
}
