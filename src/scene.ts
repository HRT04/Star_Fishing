import * as THREE from "three";
export default THREE;
import useLogger from "./logger";
import { Rocket } from "./Rocket";
import { loadModel_seiza, loadModel_terminal } from "./Loader_Data";
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { createLights } from "./Lights";
import { useWebAR } from "./WebAR";
import {
  flyParticle,
  particleArray,
  dropParticle,
  Particle,
  launchsmoke,
} from "./Particle";
import { dspResult } from "./color";
import html2canvas from "html2canvas";

const log = useLogger();
let num: number,
  Time: number = 0,
  Gra: number = 0.00098,
  bound: number,
  bound_top: number = 0.5,
  f: number = 0; // 星座アニメーションフラグ
const Tenzyo: number = 180; // 天井位置
function Num(n: number, p: any) {
  if (p < 0.25) {
    n = 0.0006;
  } else if (p < 0.28) {
    n = 0.0009;
  } else if (p < 0.33) {
    n = 0.002;
  } else if (p < 0.5) {
    n = 0.013;
  } else if (p < 5) {
    n = 0.03;
  } else if (p < 9) {
    n = 0.2;
  } else if (p < 13) {
    n = 0.6;
  } else if (p < 18) {
    n = 1.0;
  } else if (p < 20) {
    n = 1.5;
  } else if (p < Tenzyo) {
    n = 60.0;
  } else {
    n = 0;
  }
  return n;
}
export interface ARScene {
  makeObjectTree(): THREE.Object3D;

  animate(): void;
  seizanimate(): void;
  descriptionHtmlAnimate(): void;

  name(): string;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject
  ): void;
}

export class TestScene implements ARScene {
  rocket?: Rocket;
  seiza?: THREE.Object3D;
  rocketBase?: THREE.Object3D;
  scene?: any;
  descriptionHtml?: THREE.Mesh;
  descriptionHtmlMap?: Map<string, THREE.Mesh>;
  glbpath?: string;

  addDescriptionHtml(mesh: THREE.Mesh): void {
    this.descriptionHtml = mesh;
    // this.scene.add(this.descriptionHtml);
  }

  addDescriptionHtmlMap(map: Map<string, THREE.Mesh>): void {
    this.descriptionHtmlMap = map;
  }

  name() {
    return "test";
  }
  makeObjectTree(): THREE.Object3D {
    // ロケットの色取得
    const webARInstance = useWebAR();
    const color_string = webARInstance.get_color_num.cn;
    const glbpath = webARInstance.get_color_num.pth;
    if (glbpath) this.glbpath = glbpath.replace("./glb/", "");
    else alert("glbpath is undefined");

    // scene作成
    const scene: THREE.Scene = new THREE.Scene();
    this.scene = scene;

    // ロケット
    const rocket = new Rocket(color_string);
    this.rocket = rocket;
    this.rocket.mesh.scale.set(0.0005, 0.0005, 0.0005);
    this.rocket.mesh.position.set(0, 0.2, 0);
    this.scene.add(this.rocket.mesh);

    // 概要html
    if (this.descriptionHtmlMap && this.glbpath) {
      const target = this.glbpath;
      this.descriptionHtml = this.descriptionHtmlMap.get(target);
      if (this.descriptionHtml) this.descriptionHtml.visible = false;
    } else {
      alert("cant add!!!");
    }
    if (this.descriptionHtml === undefined) {
      alert("descriptionHtml is undefined");
    }
    const elem = document.getElementById("html2canvas");
    const children = elem?.children;
    if (children)
      for (let child of children) {
        if (child.id !== glbpath) {
          elem?.removeChild(child);
        }
      }
    else alert("child is undefined");
    this.scene.add(this.descriptionHtml);

    const grnd: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const grnd_seiza: THREE.Vector3 = new THREE.Vector3(0, Tenzyo, 0);
    // 発射台読み込み
    loadModel_terminal(
      scene,
      new GLTFLoader(),
      grnd,
      "./glb/terminal.glb",
      0.035
    );

    // seiza読み込み
    if (glbpath) {
      // alert(glbpath);
      loadModel_seiza(new GLTFLoader(), grnd_seiza, glbpath, 0.005).then(
        (loadedModel) => {
          this.seiza = loadedModel;
          this.seiza.visible = false;
          this.seiza.position.y = Tenzyo;
          // this.seiza.position.z = -1.0;
          this.seiza.rotation.x = Math.PI / 2;
          this.seiza.castShadow = false;
          this.seiza.receiveShadow = false;
          // this.seiza.rotation.z = Math.PI;
          this.scene.add(this.seiza);
        }
      );
    }
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

  animate(): boolean | void {
    if (!this.rocket) return;
    if (!this.scene) return;

    num = Num(num, this.rocket.mesh.position.y);

    this.rocket.mesh.position.y += num;
    this.rocket.mesh.rotation.x = Math.random() * Math.sin(1) * 0.03;
    this.rocket.mesh.rotation.z = Math.random() * Math.sin(1) * 0.03;

    let p = getParticle(this.rocket, this.scene);
    setTimeout(() => {
      if (!this.scene) return;
      create_Smoke(p, this.rocket, this.scene);
      createFlyingParticles(p, this.rocket, this.scene);
    }, 2000);
    create_launchSmoke(p, this.rocket, this.scene);
    if (Tenzyo <= this.rocket.mesh.position.y) {
      if (!this.seiza) return;
      this.rocket.mesh.visible = false;
      this.seiza.visible = true;
      return false;
    }
    return true;
  }
  seizanimate(): void {
    if (!this.seiza) return;
    if (this.seiza.position.y < 0.2) {
      bound = 0.022;
      this.seiza.position.y = 0.2;
      if (bound_top <= 0.2001) {
        f = 3;
      } else {
        f = 1;
      }
    }
    if (f == 0) {
      if (22 < this.seiza.position.y) {
        // this.seiza.rotation.y += 0.01;
        Time += 2.0;
      } else {
        Time = 18;
      }
      this.seiza.position.y -= (1 / 2) * Gra * Math.pow(Time, 2);
    } else if (f == 1) {
      this.seiza.position.y += bound;
      if (bound_top / 2 < this.seiza.position.y) {
        bound = bound * 0.98;
      }
      if (bound_top < this.seiza.position.y) {
        f = 2;
        bound_top = (bound_top * 3) / 4;
      }
    } else if (f == 2) {
      this.seiza.position.y -= bound;
      if (bound_top / 2 < this.seiza.position.y) {
        bound = bound * 1.02;
      }
    } else {
      this.seiza.rotation.z += 0.01;
    }
  }
  descriptionHtmlAnimate(): void {
    if (!this.seiza) return;
    if (!this.descriptionHtml) return;

    this.descriptionHtml.visible = true;
    // if (this.seiza?.position.y <= 0.2) {
    // this.descriptionHtml.visible = true;
    // }

    this.descriptionHtml.position.y = this.seiza.position.y;
    this.descriptionHtml.position.x = this.seiza.position.x + 0.2;
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
