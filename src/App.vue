<script setup lang="ts">
// import HelloWorld from "./components/HelloWorld.vue";
import { onErrorCaptured, onMounted, reactive, ref } from "vue";
import { useWebAR, WebAR, type WebARDelegate } from "./WebAR";
import ChangeScene from "./ChangeScene.vue";
import useLogger from "./logger";

const log = useLogger();
const overlay_dom = "overlay";

onErrorCaptured((err, instance, info) => {
  log.error(err, info);
});

class WebAREventHandler implements WebARDelegate {
  onARButton(): void {
    log.info(webar.color_num);
  }
}

const webar = useWebAR(); //WebARクラスの唯一のインスタンスを取得
webar.delegate = new WebAREventHandler();

//本モジュールが表示可能な状態になった直後に実行される
onMounted(() => {
  //webarの初期化
  webar.start(overlay_dom);
});
</script>
<template>
  <main>
    <!-- <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.svg"
      width="125"
      height="125"
    /> -->
    <!-- <HelloWorld msg="You did it!" /> -->
    <ChangeScene></ChangeScene>
  </main>
</template>

<style scoped>
#webar {
  /* display: flex;
  align-items: end; */
  position: fixed;
  bottom: 0;
}

main {
  /* background-color: red; */
  height: 100%;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
