[![Build Status](https://travis-ci.com/art0rz/use-element-fit.svg?branch=master)](https://travis-ci.com/art0rz/use-element-fit)
[![npm version](https://badge.fury.io/js/use-element-fit.svg)](https://badge.fury.io/js/use-element-fit)
# Description

`useElementFit` is a React hook that allows you to measure and element's based on certain restraints, similar to `object-fit` in CSS.

# Motivation
Working with canvas or more complex uses of `object-fit` often makes it useful to calculate the width/height and x/y values of a element or object, this effect helps you do this.

# Usage
## Demo

See `useElementFit` in [action](https://art0rz.github.io/use-element-fit/)

## Example

```jsx
import React from 'react';
import { useElementFit, ScaleMode } from 'use-element-fit';

const App = () => {
  const {ref, width, height} = useElementFit(0.5, 1, ScaleMode.COVER); // half the width and the full height of parent element

  return (
    <div ref={ref}>
      <div style={{
        width: `${width}px`,
        height: `${height}px`,
      }}>
        Size: {width}x{height}
      </div>
    </div>
  );
};
```

# API

## useElementFit

`useElementFit(ratioX, ratioY, scaleMode?, alignmentX?, alignmentY?, maxWidth?, maxHeight?)`

### Parameters

- `ratioX`
- **Type:** `number`
  - **Optional:** No
  - **Description:** target horizontal ratio of the result. For example, setting `ratioX` to `0.5` and `ratioY` to `1` will result in half the width and the full height of the element
  
- `ratioY`
  
  - **Type:** `number`
  - **Optional:** No
  - **Description:** target vertical ratio of the result. For example, setting `ratioX` to `1`  and `ratioY` to `0.5` will result in half the height and the full width of the element
  
- `scaleMode`
  
  - **Type:** `ScaleMode` or `string`
  - **Optional:** Yes
  - **Default:** `ScaleMode.COVER`
  - **Description:** The type of scaling calculation to perform. See [ScaleMode](#scalemode) for descriptions of different scale modes. This argument can also directly be supplied as a string, such as `cover`, `contain` and `align-only`.
  
- `alignmentX`
  - **Type:** `number`
  - **Optional:** Yes
  - **Default:** `0.5`
  - **Description:** The horizontal position of the result. For example, setting `alignmentX` to `1` will position the result at the very right edge, and vice versa for `0`
  
- `alignmentY`
  
  - **Type:** `number`
  - **Optional:** Yes
  - **Default:** `0.5`
  - **Description:** The horizontal position of the result. For example, setting `alignmentY` to `1` will position the result at the very bottom edge, and vice versa for `0`
  
- `maxWidth`
  
  - **Type:** `number`
  - **Optional:** Yes
  - **Description:** The maximum width of the result. Respects alignments, ratios and scale modes.
  
- `maxHeight`
  
  - **Type:** `number`
  - **Optional:** Yes
  - **Description:** The maximum height of the result. Respects alignments, ratios and scale modes.

### Returns

`useElementFit` returns and object with the following properties:

- `ref`
  - **Type:** `React.RefObject`
  - **Description:** The React ref to attach to the element you want to measure
  
- `width`
  - **Type:** `number`
  - **Description:** The resulting width of the calculation in pixels
  
- `height`
  - **Type:** `number`
  - **Description:** The resulting height of the calculation in pixels
  
- `x`
  - **Type:** `number`
  - **Description:** The resulting horizontal position of the calculation in pixels
  
- `y`
  - **Type:** `number`
  - **Description:** The resulting vertical position of the calculation in pixels

## ScaleMode

### Description

`ScaleMode` is a TypeScript enum which determines the type of scaling in `useElementFit`

- `ScaleMode.COVER`
  - Calculates the result to cover the entire measured element. If the proportions of the image differ from the element, the result is cropped either vertically or horizontally where needed, so that no empty space remains.
- `ScaleMode.CONTAIN`
  - Scales the result as large as possible without cropping.
- `ScaleMode.ALIGN_ONLY`
  - `ALIGN_ONLY` performs no width/height calculation and only aligns vertically and horizontally the result based on the supplied `alignmentX` and `alignmentY` within the container.

# Notes

* Uses [`use-resize-observer`](https://github.com/ZeeCoder/use-resize-observer) internally

# License
MIT
