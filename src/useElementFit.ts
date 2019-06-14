import { useEffect, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import ScaleMode from './ScaleMode';

const resize = (
  elementWidth: number,
  elementHeight: number,
  containerWidth: number,
  containerHeight: number,
  scaleMode: ScaleMode,
  alignmentX: number = 0.5,
  alignmentY: number = 0.5,
  maxWidth?: number | undefined,
  maxHeight?: number | undefined,
) => {
  let targetWidth: number = 0;
  let targetHeight: number = 0;
  let boundRatioX: number = 0;
  let boundRatioY: number = 0;
  let scale = 1;

  // get needed scale to fit in bounds with cover
  if (scaleMode === ScaleMode.CONTAIN || scaleMode === ScaleMode.COVER) {
    boundRatioX = containerWidth / elementWidth;
    boundRatioY = containerHeight / elementHeight;
  }

  // get scale for bounds container
  switch (scaleMode) {
    case ScaleMode.CONTAIN:
      scale = boundRatioX < boundRatioY ? boundRatioX : boundRatioY;
      break;
    case ScaleMode.COVER:
      scale = boundRatioX > boundRatioY ? boundRatioX : boundRatioY;
      break;
    case ScaleMode.ALIGN_ONLY:
      targetWidth = elementWidth;
      targetHeight = elementHeight;
      break;
  }

  if (scaleMode === ScaleMode.CONTAIN || scaleMode === ScaleMode.COVER) {
    // get needed scale to fit in max with contain
    if (maxWidth || maxHeight) {
      let scaleMaxRatioX = scale;
      let scaleMaxRatioY = scale;

      if (maxWidth) {
        scaleMaxRatioX = maxWidth / elementWidth;
      }

      if (maxHeight) {
        scaleMaxRatioY = maxHeight / elementHeight;
      }

      const scaleMax = scaleMaxRatioX < scaleMaxRatioY ? scaleMaxRatioX : scaleMaxRatioY;

      scale = Math.min(scale, scaleMax);
    }

    // do the actual scale
    targetWidth = elementWidth * scale;
    targetHeight = elementHeight * scale;
  }

  return {
    width: Math.round(targetWidth),
    height: Math.round(targetHeight),
    x: Math.round((containerWidth - targetWidth) * alignmentX),
    y: Math.round((containerHeight - targetHeight) * alignmentY),
  };
};

const useElementFit = (
  width: number,
  height: number,
  scaleMode: ScaleMode = ScaleMode.CONTAIN,
  alignmentX: number = 0.5,
  alignmentY: number = 0.5,
  maxWidth?: number | undefined,
  maxHeight?: number | undefined,
): {
  ref: React.RefObject<HTMLElement>;
  width: number;
  x: number;
  y: number;
  height: number;
} => {
  const [ref, containerWidth, containerHeight] = useResizeObserver();

  const [fitWidth, setFitWidth] = useState(1);
  const [fitHeight, setFitHeight] = useState(1);

  const [fitX, setFitX] = useState(1);
  const [fitY, setFitY] = useState(1);

  useEffect(() => {
    const { width: newWidth, height: newHeight, x, y } = resize(
      width,
      height,
      containerWidth,
      containerHeight,
      scaleMode,
      alignmentX,
      alignmentY,
      maxWidth,
      maxHeight,
    );

    setFitWidth(newWidth);
    setFitHeight(newHeight);
    setFitX(x);
    setFitY(y);
  }, [
    containerWidth,
    containerHeight,
    width,
    height,
    containerWidth,
    containerHeight,
    scaleMode,
    alignmentX,
    alignmentY,
    maxWidth,
    maxHeight,
  ]);

  return {
    ref,
    width: fitWidth,
    height: fitHeight,
    x: fitX,
    y: fitY,
  };
};

export default useElementFit;
