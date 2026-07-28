import { createImage, cropImage } from '@flumens';
import CV from '@techstark/opencv-js';

type URL = string;

const detectObjects = async (
  image: URL,
  isDebugging = false
): Promise<[string[], CV.Rect[]]> => {
  // split
  const imgEl = await createImage(image);
  let mat = CV.imread(imgEl);
  CV.imshow('imageCanvas', mat);

  mat = CV.imread('imageCanvas');
  const dst = mat.clone();

  CV.cvtColor(mat, mat, CV.COLOR_RGBA2GRAY, 0);
  const ksize = new CV.Size(7, 7);
  CV.GaussianBlur(mat, mat, ksize, 0, 0, CV.BORDER_DEFAULT);
  CV.threshold(mat, mat, 100, 255, CV.THRESH_BINARY_INV);

  const contours = new CV.MatVector();
  const hierarchy = new CV.Mat();
  CV.findContours(
    mat,
    contours,
    hierarchy,
    CV.RETR_EXTERNAL,
    CV.CHAIN_APPROX_SIMPLE
  );

  const detectedRectangles = [];

  for (let i = 0; i < (contours.size() as any); i++) {
    const cnt = contours.get(i);
    const area: any = CV.contourArea(cnt, false);
    if (area > 500 && area <= 150000) {
      const rect = CV.boundingRect(cnt);
      detectedRectangles.push(rect);

      if (isDebugging) {
        console.log('Found object at', rect);

        const point1 = new CV.Point(rect.x - 5, rect.y - 5);
        const point2 = new CV.Point(
          rect.x + rect.width + 5,
          rect.y + rect.height + 5
        );
        const rectangleColor = new CV.Scalar(255, 0, 0);
        CV.rectangle(dst, point1, point2, rectangleColor, 2);
      }
    }
  }

  const detectedCroppedImages = await Promise.all(
    detectedRectangles.map(rect =>
      // TODO: attach coords to image model for upload as caption
      cropImage(image, rect)
    )
  );

  CV.imshow('imageCanvas', dst);
  mat.delete();
  dst.delete();

  return [detectedCroppedImages, detectedRectangles];
};

export default detectObjects;
