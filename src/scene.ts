import * as THREE from "three";
export default THREE;
import useLogger from "./logger";
import { Rocket } from "./Rocket";
import { loadModel_terminal } from "./Loader";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { createLights } from "./Lights";
import {
  flyParticle,
  particleArray,
  dropParticle,
  Particle,
  launchsmoke,
} from "./Particle";

const log = useLogger();
let num: number;
function Num(n: number, p: any) {
  if (p < 0.25) {
    n = 0.0006;
  } else if (p < 0.28) {
    n = 0.0009;
  } else if (p < 0.33) {
    n = 0.002;
  } else if (p < 0.5) {
    n = 0.01;
  } else if (p < 20) {
    n = 0.02;
  } else if (20 <= p) {
    n = 0;
  }
  return n;
}
export interface ARScene {
  makeObjectTree(): THREE.Object3D;

  animate(): void;

  name(): string;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}

export class TestScene implements ARScene {
  rocket?: Rocket;
  rocketBase?: THREE.Object3D;
  scene?: THREE.Scene;

  name() {
    return "test";
  }
  makeObjectTree(): THREE.Object3D {
    // log.info("make object tree", this.name())
    // const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1).translate(0, 0.05, 0);

    // const material = new THREE.MeshPhongMaterial({
    //   color: 0xffffff * Math.random(),
    // });
    const scene: THREE.Scene = new THREE.Scene();
    this.scene = scene;

    // ロケット
    const rocket = new Rocket();
    this.rocket = rocket;
    this.rocket.mesh.scale.set(0.0005, 0.0005, 0.0005);
    this.rocket.mesh.position.set(0, 0.2, 0);
    this.scene.add(this.rocket.mesh);

    // 発射台
    const grnd: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    loadModel_terminal(scene, new GLTFLoader(), grnd, "./terminal.glb", 0.035);
    createLights(this.scene);

    return this.scene;
  }
  private updateListeners: ((event: any) => void)[] = [];

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void {
    if (type === "update" && typeof listener === "function") {
      this.updateListeners.push(listener as (event: any) => void);
    }
  }

  animate(): void {
    if (!this.rocket) return;
    if (!this.scene) return;

    num = Num(num, this.rocket.mesh.position.y);

    // 立方体を回転させるアニメーション
    // this.rocket.mesh.rotation.y += 0.1 * sec;
    this.rocket.mesh.position.y += num;
    // this.rocket.mesh.position.x = Math.random() * Math.PI * 0.5;
    this.rocket.mesh.rotation.x = Math.random() * Math.sin(1) * 0.03;
    this.rocket.mesh.rotation.z = Math.random() * Math.sin(1) * 0.03;
    // this.rocket.mesh.position.z = Math.random() * Math.PI * 0.005;

    let p = getParticle(this.rocket, this.scene);
    setTimeout(() => {
      if (!this.scene) return;
      create_Smoke(p, this.rocket, this.scene);
      createFlyingParticles(p, this.rocket, this.scene);
    }, 2000);
    create_launchSmoke(p, this.rocket, this.scene);
  }
}
const getParticle = (rocket: any, scene: THREE.Scene) => {
  let p: any;
  if (particleArray.length > 0) {
    p = particleArray.pop();
  } else {
    p = new Particle(rocket, scene);
  }
  return p;
};
const create_Smoke = (p: any, rocket: any, scene: THREE.Scene) => {
  dropParticle(p, rocket, scene);
};
const createFlyingParticles = (p: any, rocket: any, scene: THREE.Scene) => {
  flyParticle(p, scene);
};

const create_launchSmoke = (p: any, rocket: any, scene: THREE.Scene) => {
  launchsmoke(p, rocket, scene);
  launchsmoke(p, rocket, scene);
};
