# nk-line-chart

[![Build Status](https://travis-ci.com/naoak/nk-line-chart.svg?branch=master)](https://travis-ci.com/naoak/nk-line-chart)
[![npm](https://img.shields.io/npm/v/nk-line-chart.svg)](https://npmjs.com/package/nk-line-chart)

A very lightweight polymer component for drawing line charts.
This component directly uses SVG tag to draw charts without any additional graphic libraries.

## Demo
```html
<style>
  nk-line-chart {
    width: 340px;
    height: 120px;
    border: solid 1px #ccc;
  }
</style>
```

### Basic
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/basic.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
>
</nk-line-chart>
```

### Label at Point
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/label-at-point.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  pointLabel='{
    "enabled": true,
    "offset": {
      "y": -6
    },
    "text": {
      "attrs": {
        "fill": "#666",
        "text-anchor": "middle"
      }
    }
  }'
>
</nk-line-chart>
```

### X-axis Range
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-range.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  xRange='{
    "min": 0,
    "max": 10
  }'
>
</nk-line-chart>
```

### Y-axis Range
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-range.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  yRange='{
    "min": 0,
    "max": 10
  }'
>
</nk-line-chart>
```

### X-axis Grid Lines
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-grid.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  xAxis='{
    "enabled": true,
    "label": {
      "enabled": true,
      "offset": {
        "x": -6,
        "y": 5
      },
      "text": {
        "attrs": {
          "font-size": "14px",
          "fill": "#666",
          "text-anchor": "end"
        }
      }
    },
    "line": {
      "attrs": {
        "fill": "none",
        "stroke": "#e08080",
        "stroke-dasharray": "4,2",
        "stroke-width": 1
      }
    },
    "tickInterval": 2
  }'
>
</nk-line-chart>
```

### Y-axis Grid Lines
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-grid.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  yAxis='{
    "enabled": true,
    "label": {
      "enabled": true,
      "offset": {
        "x": 0,
        "y": 15
      },
      "text": {
        "attrs": {
          "font-size": "14px",
          "fill": "#666",
          "text-anchor": "middle"
        }
      }
    },
    "line": {
      "attrs": {
        "fill": "none",
        "stroke": "#e08080",
        "stroke-dasharray": "4,2",
        "stroke-width": 1
      }
    },
    "tickInterval": 2
  }'
>
</nk-line-chart>
```

### Origin: left-bottom (cartesian coordinates)
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-bottom.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  origin="left-bottom"
>
</nk-line-chart>
```

### Origin: left-top (screen coordinates)
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-top.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  origin="left-top"
>
</nk-line-chart>
```

### Custom Style for Points
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-points.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  point='{
    "enabled": true,
    "elements": [
      {
        "name": "circle",
        "attrs": {
          "fill": "#fff",
          "r": "8",
          "stroke": "#e08080",
          "stroke-width": 1.5
        }
      },
      {
        "name": "circle",
        "attrs": {
          "fill": "#e08080",
          "r": "3.5",
          "stroke": "none",
          "stroke-width": 0
        }
      }
    ]
  }'
>
</nk-line-chart>
```

### Custom Style for Background Rect
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-back.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  backgroundRectAttrs='{
    "fill": "#00f",
    "fill-opacity": 0.1,
    "stroke": "#00f",
    "stroke-width": 5,
    "stroke-opacity": 0.3
  }'
>
</nk-line-chart>
```

### Custom Style for Path
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-path.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chartArea='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  line='{
    "attrs": {
      "stroke": "#8080e0",
      "stroke-width": 2,
      "stroke-dasharray": "5, 2",
      "fill-opacity": 1,
      "fill": "none"
    }
  }'
>
</nk-line-chart>
```

## Running the demo locally
```
npm run demo
```

## Running the tests
```
npm run test
```

For watch mode,

```
npm run test:watch
```

Testing in watch mode, you can view coverage files by

```
open http://localhost:8080/coverage/
```
