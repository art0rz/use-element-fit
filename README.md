[![Build Status](https://travis-ci.com/art0rz/use-element-fit.svg?branch=master)](https://travis-ci.com/art0rz/use-element-fit)

# useElementFit

`useElementFit` is a React hook that allows you to measure and element's based on certain restraints, similar to `object-fit` in CSS.

# Usage

```js
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

# Notes
* Uses [`use-resize-observer`](https://github.com/ZeeCoder/use-resize-observer) internally

# License
MIT