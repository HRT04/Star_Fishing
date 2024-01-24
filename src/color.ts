import cv from "@techstark/opencv-js";

interface img_colors {
  Red: number;
  Orange: number;
  Yellow: number;
  Green: number;
  Brue: number;
  Purple: number;
  Black: number;
  White: number;
}

export const Img_Colors: img_colors = {
  Red: 0xf03d3d,
  Orange: 0xff9e3d,
  Yellow: 0xf8f877,
  Green: 0x35ac35,
  Brue: 0x4e4ef4,
  Purple: 0xba79fc,
  Black: 0x404040,
  White: 0xffffff,
};
// mat_dataには切り取った画像をmat形式に変換したデータが引数として渡される
export function Color_process(mat_data: cv.Mat) {
  const hsv = new cv.Mat();

  // 平滑化処理
  const smooth_data = new cv.Mat();
  cv.GaussianBlur(
    mat_data,
    smooth_data,
    new cv.Size(7, 7),
    0,
    0,
    cv.BORDER_DEFAULT
  );

  // // コントラスト強調
  // const contrast_data = new cv.Mat();
  // cv.convertScaleAbs(smooth_data, contrast_data, 2.0, 0);
  // console.log(hsv);
  cv.cvtColor(smooth_data, hsv, cv.COLOR_RGB2HSV_FULL);

  let srcVec: cv.MatVector = new cv.MatVector();
  srcVec.push_back(hsv);

  // Hueヒストグラムの計算
  const hist: cv.Mat = new cv.Mat();
  const histSize: number[] = [180]; // ヒストグラムのサイズ
  const ranges: number[] = [0, 180]; // ヒストグラムの値の範囲
  const channels: number[] = [0];
  cv.calcHist(srcVec, channels, new cv.Mat(), hist, histSize, ranges, false);

  let maxIdx: number = hist.data32F.indexOf(Math.max(...hist.data32F));
  const modeHue: number = maxIdx;

  // Saturationヒストグラムの計算
  const hist2: cv.Mat = new cv.Mat();
  const histSize2: number[] = [256]; // ヒストグラムのサイズ
  const ranges2: number[] = [0, 256]; // ヒストグラムの値の範
  const channels2: number[] = [1];
  cv.calcHist(
    srcVec,
    channels2,
    new cv.Mat(),
    hist2,
    histSize2,
    ranges2,
    false
  );

  let maxIdy: number = hist2.data32F.indexOf(Math.max(...hist2.data32F));
  const modeSatu: number = maxIdy;

  // Valueヒストグラムの計算
  const hist3: cv.Mat = new cv.Mat();
  const histSize3: number[] = [256]; // ヒストグラムのサイズ
  const ranges3: number[] = [0, 256]; // ヒストグラムの値の範
  const channels3: number[] = [2];
  cv.calcHist(
    srcVec,
    channels3,
    new cv.Mat(),
    hist3,
    histSize3,
    ranges3,
    false
  );
  // Release memory
  let maxIdz: number = hist3.data32F.indexOf(Math.max(...hist3.data32F));
  const modeValue: number = maxIdz;

  // Release memory
  mat_data.delete();
  smooth_data.delete();
  // contrast_data.delete();
  hsv.delete();
  hist.delete();
  hist2.delete();

  const Return_data = {
    modeHue: Math.floor(modeHue * 0.75), // 色相
    modeSatu: modeSatu, // 彩度
    modeValue: modeValue, // 明度
  };
  return Return_data;
}

export function Color_divide(H: number, S: number, V: number) {
  /* 黒 */
  if (V <= 90) {
    return Img_Colors.Black.toString(16);
    /* 白 */
  } else if (S <= 15) {
    return Img_Colors.White.toString(16);
    /* 赤 */
  } else if (H < 23 || 165 < H) {
    return Img_Colors.Red.toString(16);
    //   /* オレンジ */
    // } else if (H < 23) {
    //   return "Img_Colors.Orange";
    /* 黄色 */
  } else if (H < 40) {
    return Img_Colors.Yellow.toString(16);
    /* 緑 */
  } else if (H < 90) {
    return Img_Colors.Green.toString(16);
    /* 青 */
  } else if (H < 125) {
    return Img_Colors.Brue.toString(16);
    /* 紫 */
  } else {
    return Img_Colors.Purple.toString(16);
  }
}

// resultの画面表示関数
export function dspResult(result: string): void {
  const re: HTMLCanvasElement = document.createElement("canvas");
  re.width = 200; // 切り取る領域の幅
  re.height = 200; // 切り取る領域の高さ
  const re_ctx: CanvasRenderingContext2D | null = re.getContext("2d");
  if (re_ctx) {
    re_ctx.font = "30px Arial"; // フォントサイズとフォントファミリーを指定
    re_ctx.fillStyle = "black"; // テキストの色を指定
    re_ctx.textAlign = "center"; // テキストの水平揃えを指定
    re_ctx.textBaseline = "middle";
    re_ctx.fillText(result, re.width / 2, re.height / 2); // テキストを描画
    re.style.position = "absolute";
    re.style.left = "0";
    re.style.top = "0";
    re.style.zIndex = "11";
    document.body.appendChild(re);
  }
}
