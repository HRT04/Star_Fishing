<script setup lang="ts">
import { ref } from "vue";
import { useWebAR } from "./WebAR";
import { TestScene } from "./scene";
import { requestDeviceMotionPermission, handleMotion } from "./Cencer";
import "@fontsource/klee-one";

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

// function handleFrame(time: number, frame: any) {
//   const device = frame.device;

//   // frameからデバイスモーション情報を取得
//   const deviceMotion = frame.getDeviceMotion();

//   // deviceMotionを使用して振り上げの判定やその他の処理を行う
//   if (deviceMotion) {
//     const acceleration = deviceMotion.acceleration;
//     const accelerationStrength = Math.sqrt(
//       acceleration.x * acceleration.x +
//         acceleration.y * acceleration.y +
//         acceleration.z * acceleration.z
//     );

//     if (!judge && accelerationStrength > THRESHOLD) {
//       webar.startAnimationOnClick();
//       judge = true;
//     }
//   }

// 次のフレームをリクエスト
//   device.requestAnimationFrame(handleFrame);
// }

const scene_a = () => {
  const testScene = new TestScene();
  requestDeviceMotionPermission();
  // const colorNum = webar.color_num;
  // rocket = testScene.rocket;
  // if (testScene && testScene.isObjectVisible) {
  //   isObjectVisible = testScene.isObjectVisible;
  // }
  // if (!colorNum) return;
  webar.placeScene(testScene);
  Set_Object.value = false;
};
const playAnimation = () => {
  // if (webar.arScene) {
  //   if (!navigator.xr) return;
  hassya.value = true;
  window.addEventListener("devicemotion", (event) => {
    // console.log(" event");
    const accelerationStrength = handleMotion(event);
    //console.log({ accelerationStrength });

    // const displayDiv = document.getElementById("accelerationStrengthDisplay");
    // if (displayDiv !== null) {
    //   displayDiv.textContent = "Acceleration Strength: " + accelerationStrength;
    // }
    if (!judge && accelerationStrength > THRESHOLD) {
      judge = true;
      hassya.value = false;
      webar.startAnimationOnClick();
    }
  });

  isAnimationPlaying.value = true;

  //   try {
  //     const DV_motion = navigator.xr.requestSession("immersive-ar");
  //     DV_motion.requestAnimationFrame((time: number) =>
  //       handleFrame(time, DV_motion)
  //     );
  //     // xrDeviceを使用してXRセッションを開始するなどの処理を行う
  //   } catch (error) {
  //     console.error("Failed to request XR device:", error);
  //   }
  // webar.arScene.addEventListener("update", (event: any) => {
  //   const deviceMotion = event.frame.getDeviceMotion();
  //   const accelerationStrength = handleMotion(deviceMotion);
  // }
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
// const again_play = () => {
//   isAnimationPlaying.value = false;
//   webar.startAnimationOnClick();
// };

// const scene_b = () => {
//   webar.changeScene(new TestScene2());
// };
</script>
<template>
  <!-- <button @click="scene_b">Change Scene</button> -->

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

  <!-- <button
    @click="again_play"
    :style="{ display: isAnimationPlaying ? 'block' : 'none' }"
  >
    Again
  </button> -->
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
