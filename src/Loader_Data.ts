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
    model.position.copy(position);
    model.scale.set(scl, scl, scl);
    scene.add(model);
  });
  return;
}

export function loadModel_seiza(
  gltfLoader: GLTFLoader,
  position: THREE.Vector3,
  glb_path: string,
  scl: number
) {
  return new Promise<THREE.Object3D>((resolve, reject) => {
    gltfLoader.load(
      glb_path,
      function (gltf) {
        const model: THREE.Object3D = gltf.scene;
        model.scale.set(scl, scl, scl);
        model.position.copy(position);
        resolve(model);
      },
      undefined,
      reject
    );
  });
}

//////////////////////////////////
// 色データ
//////////////////////////////////

export const Colors = {
  // ロケット作成に使用
  darkGrey: 0x4d4b54, //number
  windowBlue: 0xaabbe3,
  windowDarkBlue: 0x4a6e8a,
  thrusterOrange: 0xfea036,
  deepblue: 0x003366,
  rocket: 0xc8c8c8,

  // 色識別に使用
  White: 0xffffff,
  Red: 0xf03d3d,
  Orange: 0xff9e3d,
  Yellow: 0xf8f877,
  Green: 0x35ac35,
  Blue: 0x4e4ef4,
  Purple: 0xba79fc,
  Black: 0x404040,
};

/////////////////////////////////
// glbファイルパスデータ
/////////////////////////////////
export const glb_path = {
  spring: {
    //紫, 赤
    usikai: "./glb/Ushikai-za.glb",
    otome: "./glb/Otome-za.glb",
    kani: "./glb/Kani-za.glb",
    sisi: "./glb/Shishi-za.glb",
    ryoken: "./glb/Ryouken-za.glb",
    oguma: "./glb/Ooguma-za.glb",
  },
  summer: {
    // 緑, 青, 赤
    ite: "./glb/Ite-za.glb",
    iruka: "./glb/Iruka-za.glb",
    sasori: "./glb/Sasori-za.glb",
    tate: "./glb/Tate-za.glb",
    tenbin: "./glb/Tenbin-za.glb",
    ya: "./glb/Ya-za.glb",
    ryu: "./glb/Ryuu-za.glb",
    wasi: "./glb/Wasi-za.glb",
  },
  autumn: {
    // 黄色, 赤
    andro: "./glb/Andromeda-za.glb",
    uo: "./glb/Uo-za.glb",
    ohituzi: "./glb/Ohituji-za.glb",
    yagi: "./glb/Yagi-za.glb",
    mizugame: "./glb/Mizugame-za.glb",
    pegasasu: "./glb/Pegasasu-za.glb",
  },
  winter: {
    // 白, 赤
    usagi: "./glb/Usagi-za.glb",
    orion: "./glb/Orion-za.glb",
    yamaneko: "./glb/Yamaneko-za.glb",
    hutago: "./glb/hutago-za.glb",
    kirin: "./glb/Kirin-za.glb",
    ousi: "./glb/Oushi-za.glb",
  },
  south: {
    // 黒, 赤
    ho_ou: "./glb/Houou-za.glb",
    kameleon: "./glb/Kameleon-za.glb",
    okami: "./glb/Ookami-za.glb",
    minamizyuzi: "./glb/Minami-juzi-za.glb",
  },
};
