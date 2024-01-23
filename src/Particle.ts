import { gsap } from "gsap";
import THREE from "./scene";

export let particleArray: any[] = [],
  slowMoFactor: number = 1;

export class Particle {
  isFlying: boolean;
  geometry: THREE.SphereGeometry;
  material: THREE.MeshLambertMaterial;
  mesh: THREE.Mesh;
  constructor(rocket: any, scene: THREE.Scene) {
    this.isFlying = false;

    var scale: number = 20 + Math.random() * 20;
    var nLines: number = 3 + Math.floor(Math.random() * 5);
    var nRow: number = 3 + Math.floor(Math.random() * 5);
    this.geometry = new THREE.SphereGeometry(scale, nLines, nRow);

    this.material = new THREE.MeshLambertMaterial({
      color: 0xe3e3e3,
      flatShading: true,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    recycleParticle(this, rocket, scene);
  }
}

export function recycleParticle(p: any, rocket: any, scene: THREE.Scene) {
  p.mesh.position.x = rocket.mesh.position.x;
  p.mesh.position.y = rocket.mesh.position.y - 0.2;
  p.mesh.position.z = rocket.mesh.position.z;
  p.mesh.rotation.x = Math.random() * Math.PI * 2;
  p.mesh.rotation.y = Math.random() * Math.PI * 2;
  p.mesh.rotation.z = Math.random() * Math.PI * 2;
  p.mesh.scale.set(0.1, 0.1, 0.1);
  p.color = 0xe3e3e3;
  p.mesh.material.color.set(p.color);
  gsap.to(p.mesh.material, {
    duration: 0.1 * cloudTargetSpeed * cloudSlowMoFactor,
    opacity: 0, // フェードアウトするアニメーション
    ease: "linear",
  });
  p.material.needUpdate = true;
  scene.add(p.mesh);
  particleArray.push(p);
}

export function flyParticle(p: any, scene: THREE.Scene) {
  var targetPosX: number,
    targetPosY: number,
    targetSpeed: number,
    targetColor: number;
  p.mesh.material.opacity = 0.5;
  p.mesh.position.x = -1000 + Math.random() * 2000;
  p.mesh.position.y = 100 + Math.random() * 2000;
  p.mesh.position.z = -1000 + Math.random() * 1500;

  var s: number = Math.random() * 0.2;
  p.mesh.scale.set(s, s, s);

  targetPosX = 0;
  targetPosY = -p.mesh.position.y - 2500;
  targetSpeed = 1 + Math.random() * 2;
  targetColor = 0xe3e3e3;

  gsap.to(p.mesh.position, {
    duration: 0.7 * targetSpeed * slowMoFactor,
    x: targetPosX,
    y: targetPosY,
    ease: "none",
    onComplete: recycleParticle,
    onCompleteParams: [p, scene],
  });
}

let cloudTargetPosX: any,
  cloudTargetPosY: any,
  cloudTargetPosZ: any,
  cloudTargetSpeed: any,
  cloudTargetColor: any,
  cloudSlowMoFactor: number = 0.65;

export const dropParticle = (p: any, rocket: any, scene: THREE.Scene) => {
  p.mesh.material.opacity = 0.5;
  p.mesh.position.x = rocket.mesh.position.x;
  p.mesh.position.y = rocket.mesh.position.y - 0.2;
  p.mesh.position.z = rocket.mesh.position.z;
  var s: number = Math.random() * 0.1 + 0.35;
  p.mesh.scale.set(0.003 * s, 0.003 * s, 0.003 * s);
  cloudTargetPosX = 0;
  cloudTargetPosY = rocket.mesh.position.y - 50;
  cloudTargetSpeed = 0.8 + Math.random() * 0.6;
  cloudTargetColor = 0xa3a3a3;

  gsap.to(p.mesh.position, {
    duration: 0.5 * cloudTargetSpeed * cloudSlowMoFactor,
    x: cloudTargetPosX,
    y: cloudTargetPosY,
    ease: "none",
    onComplete: recycleParticle,
    onCompleteParams: [p, scene],
  });

  gsap.to(p.mesh.scale, {
    duration: 0.5 * cloudTargetSpeed * cloudSlowMoFactor,
    x: s * 1.8,
    y: s * 1.8,
    z: s * 1.8,
    ease: "linear",
  });
};

export const launchsmoke = (p: any, rocket: any, scene: THREE.Scene) => {
  p.mesh.material.opacity = Math.random() * 0.1 + 0.3;
  p.mesh.position.x = rocket.mesh.position.x;
  p.mesh.position.y = rocket.mesh.position.y - 0.2;
  p.mesh.position.z = rocket.mesh.position.z;
  var s: number = Math.random() * 0.8 + 0.35;
  p.mesh.scale.set(0.0034 * s, 0.0015 * s, 0.0034 * s);
  cloudTargetPosX = (Math.random() - 0.5) * 45;
  cloudTargetPosY = rocket.mesh.position.y - 50;
  cloudTargetPosZ = (Math.random() - 0.5) * 45;
  cloudTargetSpeed = 0.8 + Math.random() * 0.3;
  cloudTargetColor = 0xa3a3a3;

  gsap.to(p.mesh.position, {
    duration: 0.1 * cloudTargetSpeed * cloudSlowMoFactor,
    x: cloudTargetPosX,
    y: cloudTargetPosY,
    z: cloudTargetPosZ,
    ease: "none",
    onComplete: recycleParticle,
    onCompleteParams: [p, scene],
  });

  gsap.to(p.mesh.scale, {
    duration: 0.5 * cloudTargetSpeed * cloudSlowMoFactor,
    x: s * 0.7,
    y: s * 0.7,
    z: s * 0.7,
    ease: "linear",
  });
};

// export function fringSmokeLight(L: THREE.PointLight) {
//   // ロケットが発射された時の煙の光の変化
//   gsap.to(L, {
//     intensity: 1.5, // 光の強度を変化させる
//     duration: 3, // アニメーション時間
//     yoyo: true, // 往復アニメーション
//     repeat: 1, // 繰り返し回数
//     onUpdate: () => {
//       // アニメーション中に光の強度を直接変更する
//       L.intensity = gsap.getProperty(L, "intensity") as number;
//     },
//   });
// }
