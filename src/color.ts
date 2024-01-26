import cv from "@techstark/opencv-js";
import { Colors, glb_path } from "./Loader_Data";

// mat_dataには切り取った画像をmat形式に変換したデータが引数として渡される
// 画像処理関数
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

// 色分類
export function Color_divide(H: number, S: number, V: number) {
  /* 黒 */
  if (V <= 80) {
    return { color: Colors.Black.toString(16), name: "Black" };
    /* 白 */
  } else if (S <= 15) {
    return { color: Colors.White.toString(16), name: "White" };
    /* 紫 */
  } else if (H == 0) {
    return { color: Colors.Purple.toString(16), name: "Purple" };
    /* 赤 */
  } else if (H < 25 || 165 < H) {
    return { color: Colors.Red.toString(16), name: "Red" };
    //   /* オレンジ */
    // } else if (H < 23) {
    //   return "Img_Colors.Orange";
    /* 黄色 */
  } else if (H < 40) {
    return { color: Colors.Yellow.toString(16), name: "Yellow" };
    /* 緑 */
  } else if (H < 90) {
    return { color: Colors.Green.toString(16), name: "Green" };
    /* 青 */
  } else if (H < 125) {
    return { color: Colors.Blue.toString(16), name: "Blue" };
    /* 紫 */
  } else {
    return { color: Colors.Purple.toString(16), name: "Purple" };
  }
}

// カラーコードから季節分類
export function season(category: string): string {
  // let glb_Keys: string[] = [],
  let glb_Values: string[] = [];
  if (category == "Purple") {
    // glb_Keys = Object.keys(glb_path["spring"]);
    glb_Values = Object.values(glb_path["spring"]);
  } else if (category == "Green" || category == "Blue") {
    // glb_Keys = Object.keys(glb_path["summer"]);
    glb_Values = Object.values(glb_path["summer"]);
  } else if (category == "Yellow") {
    // glb_Keys = Object.keys(glb_path["autumn"]);
    glb_Values = Object.values(glb_path["autumn"]);
  } else if (category == "White") {
    // glb_Keys = Object.keys(glb_path["winter"]);
    glb_Values = Object.values(glb_path["winter"]);
  } else if (category == "Black") {
    // glb_Keys = Object.keys(glb_path["south"]);
    glb_Values = Object.values(glb_path["south"]);
  } else if (category == "Red") {
    // 全てのカテゴリーのKeyとValueを取得
    // glb_Keys = Object.values(glb_path).flatMap((cate) => Object.keys(cate));
    glb_Values = Object.values(glb_path).flatMap((cate) => Object.values(cate));
  }
  const rndmIndex = Math.floor(Math.random() * glb_Values.length);
  // const rndmKey = glb_Keys[rndmIndex];
  const rndmValue = glb_Values[rndmIndex];
  return rndmValue;
}

// resultの画面表示関数
export function dspResult(result: string | boolean): void {
  const re: HTMLCanvasElement = document.createElement("canvas");
  re.width = 200; // 切り取る領域の幅
  re.height = 200; // 切り取る領域の高さ
  const re_ctx: CanvasRenderingContext2D | null = re.getContext("2d");
  if (re_ctx) {
    re_ctx.font = "30px Arial"; // フォントサイズとフォントファミリーを指定
    re_ctx.fillStyle = "black"; // テキストの色を指定
    re_ctx.textAlign = "center"; // テキストの水平揃えを指定
    re_ctx.textBaseline = "middle";
    re_ctx.fillText(result.toString(), re.width / 2, re.height / 2); // テキストを描画
    re.style.position = "absolute";
    re.style.left = "0";
    re.style.top = "0";
    re.style.zIndex = "11";
    document.body.appendChild(re);
  }
}
