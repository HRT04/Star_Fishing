import cv from "@techstark/opencv-js";

const cp_haba_x: number = 200;
const cp_haba_y: number = 240;

const line_haba_x: number = cp_haba_x * 1.0;
const line_haba_y: number = cp_haba_y * 0.9;

/*枠線描画関数*/
export function line(
  overlayCanvas: HTMLCanvasElement,
  overlayContext: CanvasRenderingContext2D
  // showline: boolean
) {
  // キャンバスを作成
  overlayCanvas.width = window.innerWidth;
  overlayCanvas.height = window.innerHeight;

  // キャンバスに枠線を描画
  overlayContext.strokeStyle = "#FF0000";
  overlayContext.lineWidth = 2;
  overlayContext.strokeRect(
    (overlayCanvas.width - line_haba_x) / 2,
    (overlayCanvas.height - line_haba_y) / 2,
    line_haba_x,
    line_haba_y
  ); // 枠線の座標とサイズを調整

  // 枠線の表示の切り替え
  // overlayCanvas.style.display = showline ? "block" : "none";
}

/* カメラ映像描画関数 */
export function videosetup(
  linevideo: CanvasRenderingContext2D | null,
  video: HTMLVideoElement
) {
  // カメラ映像を取得し、ビデオにセット
  async function setupCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      video.srcObject = stream;
      return new Promise((resolve) => {
        video.onloadedmetadata = () => {
          resolve(video);
        };
      });
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }

  // カメラ映像を描画する関数
  function drawCameraFrame() {
    // キャンバスにカメラの映像を描画
    if (linevideo && video) {
      linevideo.drawImage(video, 0, 0, window.innerWidth, window.innerHeight);
    }
    // この関数を次のフレームで再度呼び出す
    requestAnimationFrame(drawCameraFrame);
  }

  // カメラのセットアップが完了したら、ビデオを描画
  setupCamera().then(() => {
    // カメラのセットアップが完了したら、ビデオを描画
    drawCameraFrame();
  });
}

export function capture(canvas: HTMLCanvasElement) {
  const c_x = (canvas.width - cp_haba_x) / 2;
  const c_y = (canvas.height - cp_haba_y) / 2;
  // キャンバスを作成し、映像を描画
  const cp_canvas: HTMLCanvasElement = document.createElement("canvas");
  cp_canvas.width = cp_haba_x; // 切り取る領域の幅
  cp_canvas.height = cp_haba_y; // 切り取る領域の高さ
  const cp_ctx: CanvasRenderingContext2D | null = cp_canvas.getContext("2d");

  // キャンバス初期化
  if (!cp_ctx) return;
  cp_ctx.beginPath();
  // キャプチャした画像をクロップして描画
  cp_ctx.drawImage(
    canvas,
    c_x,
    c_y,
    cp_haba_x,
    cp_haba_y,
    0,
    0,
    cp_haba_x,
    cp_haba_y
  );

  // キャンバスからデータURL形式で画像を取得
  const capturedImage: string = cp_canvas.toDataURL();

  // キャンバスから切り取った画像データを取得
  const capturedImageData = cp_ctx.getImageData(0, 0, cp_haba_x, cp_haba_y);
  // cp_canvas.style.position = "absolute";
  // cp_canvas.style.left = "0";
  // cp_canvas.style.top = "0";
  // cp_canvas.style.zIndex = "10";
  // document.body.appendChild(cp_canvas);

  // 切り取った画像をOpenCVのMat形式に変換
  const img_mat = cv.matFromImageData(capturedImageData);
  return img_mat;
}
