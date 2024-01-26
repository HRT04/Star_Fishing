import * as THREE from "three";
import html2canvas from "html2canvas";

type ConstellationData = {
  [key: string]: {
    name: string;
    description: string;
  };
};

const jsonData: ConstellationData = {
  "aRyuu-za.glb": {
    name: "ある龍座",
    description: "ある龍座の説明",
  },
  "Uo-za.glb": {
    name: "魚座",
    description: "魚座の説明",
  },
  "Tenbin-za.glb": {
    name: "天秤座",
    description: "天秤座の説明",
  },
  "Tate-za.glb": {
    name: "盾座",
    description: "盾座の説明",
  },
  "Ohituji-za.glb": {
    name: "おひつじ座",
    description: "おひつじ座の説明",
  },
  "Andromeda-za.glb": {
    name: "アンドロメダ座",
    description: "アンドロメダ座の説明",
  },
  "Minamei-juzi-za.glb": {
    name: "南十字座",
    description: "南十字座の説明",
  },
  "Iruka-za.glb": {
    name: "イルカ座",
    description: "イルカ座の説明",
  },
  "Ushikai-za.glb": {
    name: "牛飼い座",
    description: "牛飼い座の説明",
  },
  "Wasi-za.glb": {
    name: "ワシ座",
    description: "ワシ座の説明",
  },
  "Ite-za.glb": {
    name: "いて座",
    description: "いて座の説明",
  },
  "Orion-za.glb": {
    name: "オリオン座",
    description: "オリオン座の説明",
  },
  "Kirin-za.glb": {
    name: "麒麟座",
    description: "麒麟座の説明",
  },
  "Pegasasu-za.glb": {
    name: "ペガサス座",
    description: "ペガサス座の説明",
  },
  "Yagi-za.glb": {
    name: "やぎ座",
    description: "やぎ座の説明",
  },
  "Ooguma-za.glb": {
    name: "大熊座",
    description: "大熊座の説明",
  },
  "Sasori-za.glb": {
    name: "さそり座",
    description: "さそり座の説明",
  },
  "Otome-za.glb": {
    name: "おとめ座",
    description: "おとめ座の説明",
  },
  "hutago-za.glb": {
    name: "ふたご座",
    description: "ふたご座の説明",
  },
  "Mizugame-za.glb": {
    name: "みずがめ座",
    description: "みずがめ座の説明",
  },
  "Ookami-za.glb": {
    name: "おおかみ座",
    description: "おおかみ座の説明",
  },
  "Yamaneko-za.glb": {
    name: "やまねこ座",
    description: "やまねこ座の説明",
  },
  "Shishi-za.glb": {
    name: "しし座",
    description: "しし座の説明",
  },
  "Oushi-za.glb": {
    name: "おうし座",
    description: "おうし座の説明",
  },
  "Houou-za.glb": {
    name: "ほうおう座",
    description: "ほうおう座の説明",
  },
  "Kameleon-za.glb": {
    name: "カメレオン座",
    description: "カメレオン座の説明",
  },
  "Kani-za.glb": {
    name: "かに座",
    description: "かに座の説明",
  },
  "Ryouken-za.glb": {
    name: "りょうけん座",
    description: "りょうけん座の説明",
  },
  "Ya-za.glb": {
    name: "や座",
    description: "や座の説明",
  },
  "Usagi-za.glb": {
    name: "うさぎ座",
    description: "うさぎ座の説明",
  },
};

export class DescriptionHtml {
  descriptionHtmlMap: Map<string, THREE.Mesh>;
  //   jsonData: ConstellationData;
  public constructor() {
    this.descriptionHtmlMap = new Map<string, THREE.Mesh>();
    // this.jsonData = JSON.parse(jsonData) as ConstellationData;
  }

  async generate(): Promise<Map<string, THREE.Mesh>> {
    for (const key in jsonData) {
      const name = jsonData[key].name;
      const description = jsonData[key].description;

      this.descriptionHtmlMap.set(
        key,
        await this.addDescriptionHtml(name, description)
      );
    }

    return this.descriptionHtmlMap;
  }

  async addDescriptionHtml(
    constellationName: string,
    description: string
  ): Promise<THREE.Mesh> {
    // 大枠
    const container = document.createElement("div");
    container.className = "element-container";

    // 星座名
    const title = document.createElement("h4");
    title.className = "element-title";
    title.textContent = constellationName;

    // 星座の説明
    const desc = document.createElement("p");
    desc.className = "element-description";
    desc.textContent = description;

    container.appendChild(title);
    container.appendChild(desc);

    const html2canvasElement = document.getElementById("html2canvas");
    if (html2canvasElement === null) throw new Error();

    html2canvasElement.style.width = "230px";
    html2canvasElement.style.opacity = "0.8";
    html2canvasElement.appendChild(container);

    const canvas = await html2canvas(html2canvasElement, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
    });

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;

    const geometry = new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(1, 0, -2);
    mesh.rotateY(-Math.PI / 6);
    // mesh.visible = false;
    return mesh;
  }
}
