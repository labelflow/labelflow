import React, { useState, useEffect } from "react";
import { Map as OlMap } from "ol";
import { fromLonLat } from "ol/proj";

import { Map } from "../map";

const kernels = {
  none: [0, 0, 0, 0, 1, 0, 0, 0, 0],
  sharpen: [0, -1, 0, -1, 5, -1, 0, -1, 0],
  sharpenless: [0, -1, 0, -1, 10, -1, 0, -1, 0],
  blur: [1, 1, 1, 1, 1, 1, 1, 1, 1],
  shadow: [1, 2, 1, 0, 1, 0, -1, -2, -1],
  emboss: [-2, 1, 0, -1, 1, 1, 0, 1, 2],
  edge: [0, 1, 0, 1, -4, 1, 0, 1, 0],
};

function normalize(kernel: any) {
  const len = kernel.length;
  const normal: Array<number> & { normalized?: boolean } = new Array(len);
  let i;
  let sum = 0;
  for (i = 0; i < len; i += 1) {
    sum += kernel[i];
  }
  if (sum <= 0) {
    normal.normalized = false;
    sum = 1;
  } else {
    normal.normalized = true;
  }
  for (i = 0; i < len; i += 1) {
    normal[i] = kernel[i] / sum;
  }
  return normal;
}

/**
 * Apply a convolution kernel to canvas.  This works for any size kernel, but
 * performance starts degrading above 3 x 3.
 * @param {CanvasRenderingContext2D} context Canvas 2d context.
 * @param {Array<number>} kernel Kernel.
 */
function convolve(context: any, kernel: any) {
  const { width, height } = context.canvas;

  const size = Math.sqrt(kernel.length);
  const half = Math.floor(size / 2);

  const inputData = context.getImageData(0, 0, width, height).data;

  const output = context.createImageData(width, height);
  const outputData = output.data;

  for (let pixelY = 0; pixelY < height; pixelY += 1) {
    const pixelsAbove = pixelY * width;
    for (let pixelX = 0; pixelX < width; pixelX += 1) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      for (let kernelY = 0; kernelY < size; kernelY += 1) {
        for (let kernelX = 0; kernelX < size; kernelX += 1) {
          const weight = kernel[kernelY * size + kernelX];
          const neighborY = Math.min(
            height - 1,
            Math.max(0, pixelY + kernelY - half)
          );
          const neighborX = Math.min(
            width - 1,
            Math.max(0, pixelX + kernelX - half)
          );
          const inputIndex = (neighborY * width + neighborX) * 4;
          r += inputData[inputIndex] * weight;
          g += inputData[inputIndex + 1] * weight;
          b += inputData[inputIndex + 2] * weight;
          a += inputData[inputIndex + 3] * weight;
        }
      }
      const outputIndex = (pixelsAbove + pixelX) * 4;
      outputData[outputIndex] = r;
      outputData[outputIndex + 1] = g;
      outputData[outputIndex + 2] = b;
      outputData[outputIndex + 3] = kernel.normalized ? a : 255;
    }
  }
  context.putImageData(output, 0, 0);
}

// const center = fromLonLat([-120, 50]);

export const ImageFilter = () => {
  const [selectedKernel, setSelectedKernel] = useState("sharpen");
  const [map, setMap] = useState<OlMap | null>(null);

  const onPostrender = (event: any): boolean => {
    const normalizedSelectedKernel = normalize(
      kernels[selectedKernel as keyof typeof kernels]
    );
    convolve(event.context, normalizedSelectedKernel);
    return true;
  };

  useEffect(() => {
    if (!map) return;
    map.render();
  }, [map, selectedKernel]);

  return (
    <>
      {/* This example does not work with onBlur */}
      {/* eslint-disable-next-line jsx-a11y/no-onchange */}
      <select
        value={selectedKernel}
        onChange={(e) => setSelectedKernel(e.target.value)}
      >
        <option>none</option>
        <option>sharpen</option>
        <option value="sharpenless">sharpen less</option>
        <option>blur</option>
        <option>shadow</option>
        <option>emboss</option>
        <option value="edge">edge detect</option>
      </select>
      <Map ref={setMap}>
        <olView initialCenter={fromLonLat([-120, 50])} initialZoom={6} />
        <olLayerTile onPostrender={onPostrender} args={{ preload: Infinity }}>
          <olSourceBingMaps
            imagerySet="Aerial"
            _key="AjsxIZS8gG8w-Gck9bKjBdP-7InQI8-UFHPUife_H0bScTfivLu9csMHNE_B0lGP"
          />
        </olLayerTile>
      </Map>
    </>
  );
};
