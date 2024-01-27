<!-- <script setup lang="ts"> -->
<script lang="ts">
import { onMounted, ref, defineComponent } from "vue";
import { useWebAR } from "./WebAR";
import { TestScene } from "./scene";
import { requestDeviceMotionPermission, handleMotion } from "./Cencer";
import "@fontsource/klee-one";
import { DescriptionHtml } from "./descriptionHtml";

// let html2canvasElement: THREE.Mesh;

// onMounted(async () => {
//   const descriptionHtml = new DescriptionHtml();
//   html2canvasElement = await descriptionHtml.generateDescriptionHtml(
//     "tmp",
//     "desc"
//   );
// });

export default defineComponent({
  setup() {
    const webar = useWebAR(); //シングルトンを取得
    let isAnimationPlaying = ref(false); //アニメーションが再生されたかどうかの判別
    let isARStarted = ref(true); // 平面が検知されたかどうかの判別
    let Set_Object = ref(true); //オブジェクトが設置されたかどうかの判別
    let messe = ref(false); //ユーザーへのメッセージを表示するかどうかの判別
    let hassya = ref(false);
    let jd: boolean = true;
    let rocket: any | undefined; // ロケットオブジェクトを保持する変数
    let judge: boolean = false;
    let THRESHOLD: number = 20;
    let html2canvasElement: THREE.Mesh;
    let descriptionHtmlMap: Map<string, THREE.Mesh>;

    onMounted(async () => {
      const descriptionHtml = new DescriptionHtml();
      descriptionHtmlMap = await descriptionHtml.generate();
    });

    const scene_a = () => {
      const testScene = new TestScene();
      // testScene.addDescriptionHtml(html2canvasElement);
      // alert('1')
      testScene.addDescriptionHtmlMap(descriptionHtmlMap);
      // alert('2')
      // const seizadesu = descriptionHtmlMap.get("aRyuu-za.glb");
      // if (seizadesu === undefined) {
      //   throw new Error();
      // }
      // testScene.addDescriptionHtml(seizadesu);
      requestDeviceMotionPermission();
      // alert('3')
      webar.placeScene(testScene);
      // alert('4')
      Set_Object.value = false;
      // alert('5')
    };
    const playAnimation = () => {
      hassya.value = true;
      window.addEventListener("devicemotion", (event) => {
        const accelerationStrength = handleMotion(event);
        if (!judge && accelerationStrength > THRESHOLD) {
          judge = true;
          hassya.value = false;
          webar.startAnimationOnClick();
        }
      });

      isAnimationPlaying.value = true;
    };

    // ARが起動されたら状態を更新
    webar.delegate = {
      onARButton: () => {
        setTimeout(() => {
          messe.value = true;
        }, 2500);
      },
      onPlaneFound: (pose: THREE.Matrix4) => {
        // 平面が検知されたときの処理
        isARStarted.value = false;
        messe.value = false;
      },
    };

    return {
      scene_a,
      playAnimation,
      isARStarted,
      isAnimationPlaying,
      Set_Object,
      messe,
      hassya,
    };
  },
});
</script>
<template>
  <button
    @click="scene_a"
    class="place-scene-button"
    :style="{
      display: isARStarted || isAnimationPlaying ? 'none' : 'block',
      width: '150px',
      height: '75px',
    }"
  >
    ロケット設置
  </button>
  <!-- アニメーション再生ボタン -->
  <button
    @click="playAnimation"
    class="start-animation-button"
    :style="{
      display:
        isARStarted || isAnimationPlaying || Set_Object ? 'none' : 'block',
      width: '150px',
      height: '75px',
    }"
  >
    ロケット設置完了
  </button>

  <!-- 平面検知をユーザーに促すテキスト表示 -->
  <div
    v-if="messe"
    class="ar-message"
    style="
      width: 50%;
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      color: white;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 10px;
    "
  >
    端末を動かして平面を検出してください
  </div>
  <div
    v-if="hassya"
    class="hassya-message"
    style="
      width: 50%;
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 18px;
      color: white;
      background: rgba(0, 0, 0, 0.7);
      padding: 10px;
      border-radius: 10px;
      text-align: center;
      white-space: pre-line;
    "
  >
    端末を振り上げて<br />ロケットを発射 !
  </div>
</template>
<style scoped>
.place-scene-button {
  font-family: "Klee One", sans-serif;
  font-size: 18px;
  border-color: black;
  position: absolute;
  bottom: 70px;
  left: 25px;
  height: 30px;
  display: flex;
  background-color: rgb(65, 109, 240);
  color: black;
  justify-content: center;
  border-radius: 15px;
}
.start-animation-button {
  font-family: "Klee One", sans-serif;
  font-size: 18px;
  position: absolute;
  bottom: 70px;
  right: 25px;
  height: 30px;
  display: flex;
  background-color: rgb(65, 109, 240);
  color: black;
  justify-content: center;
  border-radius: 15px;
}
.ar-message {
  font-family: "Klee One", sans-serif;
  z-index: 20;
}
.hassya-message {
  font-family: "Klee One", sans-serif;
}
</style>
