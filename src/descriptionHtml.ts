import * as THREE from "three";
import html2canvas from "html2canvas";
import { jsonData } from "./seizaJsonData";

export class DescriptionHtml {
  descriptionHtmlMap: Map<string, THREE.Mesh>;
  public constructor() {
    this.descriptionHtmlMap = new Map<string, THREE.Mesh>();
  }

  async generate(): Promise<Map<string, THREE.Mesh>> {
    for (const key in jsonData) {
      const name = jsonData[key].name;
      const description = jsonData[key].description;

      const mesh = await this.addDescriptionHtml(key, name, description);
      this.descriptionHtmlMap.set(key, mesh);
    }

    return this.descriptionHtmlMap;
  }

  async addDescriptionHtml(
    key: string,
    constellationName: string,
    description: string
  ): Promise<THREE.Mesh> {
    // 大枠
    const container = document.createElement("div");
    container.className = "element-container";
    container.id = key;

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

    // ここに全ての要素をappneChildしてるのよくないかも
    const html2canvasElement = document.getElementById("html2canvas");
    if (html2canvasElement === null) throw new Error();
    html2canvasElement.innerHTML = "";

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
    mesh.position.set(0, 0, -2);
    // mesh.position.set(1, 0, -2);
    // mesh.rotateY(-Math.PI / 6);
    // mesh.visible = false;
    return mesh;
  }
}
