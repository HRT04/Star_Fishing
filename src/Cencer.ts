// デバイスのセンサー使用許可
export const requestDeviceMotionPermission = () => {
  if (
    DeviceMotionEvent &&
    (DeviceMotionEvent as any).requestPermission() === "function"
  ) {
    // 許可を取得
    (DeviceMotionEvent as any)
      .requestPermission()
      .then((permissionState: any) => {
        if (permissionState === "granted") {
          console.log("許可を得られました");
          // 許可を得られた場合、devicemotionをイベントリスナーに追加
          // devicemotionのイベント処理
        } else {
          // 許可を得られなかった場合の処理
          console.log("許可を得られませんでした");
        }
      })
      .catch(console.error); // https通信でない場合などで許可を取得できなかった場合
  } else {
    // 上記以外のブラウザ
  }
};

//振り上げた時の値計算
export function handleMotion(event: any) {
  // 加速度データの取得
  const acceleration = event.accelerationIncludingGravity;
  // 加速度の強さを計算
  const accelerationStrength = Math.sqrt(
    acceleration.x * acceleration.x +
      acceleration.y * acceleration.y +
      acceleration.z * acceleration.z
  );
  return accelerationStrength;
}
