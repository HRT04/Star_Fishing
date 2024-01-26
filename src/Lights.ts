// import { scene } from "./scene";
import THREE from "./scene";
import { Colors } from "./Loader_Data";

export let hemisphereLight: THREE.HemisphereLight,
  ambientLight: THREE.AmbientLight,
  shadowLight: THREE.DirectionalLight,
  burnerLight: THREE.DirectionalLight;

export const createLights = (scene: THREE.Scene) => {
  // 半球光はグラデーションの色光である;
  // 最初のパラメータは空の色で、2番目のパラメータは地色
  // 3番目のパラメーターは光の強さ
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  // 周囲の光がシーンの全体的な色を変え、影を柔らかくする。
  ambientLight = new THREE.AmbientLight(0xccb8b4, 0.6);
  scene.add(ambientLight);

  // 指向性光は特定の方向から射出される。
  // それは太陽のように働き、つまり、生成されたすべての光線が平行であることを意味する。
  shadowLight = new THREE.DirectionalLight(0xffffff, 0.8);

  // 光の方向を設定する。
  shadowLight.position.set(150, 150, 0);
  shadowLight.castShadow = true;

  // 投影された影の可視領域を定義する
  shadowLight.shadow.camera.left = -800;
  shadowLight.shadow.camera.right = 800;
  shadowLight.shadow.camera.top = 800;
  shadowLight.shadow.camera.bottom = -800;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1200;

  // 影の解像度
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  burnerLight = new THREE.DirectionalLight(Colors.thrusterOrange, 1.0);

  burnerLight.position.set(0, -5, 0);

  //影の有無
  burnerLight.castShadow = true;

  // burnerLight
  burnerLight.shadow.camera.left = -100;
  burnerLight.shadow.camera.right = 100;
  shadowLight.shadow.camera.top = 100;
  burnerLight.shadow.camera.bottom = -100;
  burnerLight.shadow.camera.near = 1;
  burnerLight.shadow.camera.far = 1000;

  burnerLight.shadow.mapSize.width = 2048;
  burnerLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
  scene.add(burnerLight);
  scene.add(ambientLight);
};

export function RocketcreateLights(
  x: number,
  y: number,
  z: number,
  m: THREE.Object3D
) {
  let firingLight: THREE.PointLight;
  firingLight = new THREE.PointLight(0xffff00, 1.0);
  firingLight.position.set(x, y, z);
  firingLight.castShadow = true;

  firingLight.shadow.mapSize.width = 1024;
  firingLight.shadow.mapSize.height = 1024;
  firingLight.shadow.camera.near = 5;
  firingLight.shadow.camera.far = 4000;
  firingLight.shadow.camera.fov = 90;
  // ロケットに光源を追加
  m.add(firingLight);
}
