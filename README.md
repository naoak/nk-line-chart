# nk-line-chart [![Build Status](https://travis-ci.com/naoak/nk-line-chart.svg?branch=master)](https://travis-ci.com/naoak/nk-line-chart) [![NPM](https://nodei.co/npm/nk-line-chart.png?compact=true)](https://npmjs.org/package/nk-line-chart)
A very lightweight polymer component for drawing line charts.

This component directly uses SVG tag to draw charts without any additional graphic libraries.

## Demo
```html
<custom-style>
  <style is="custom-style">
    nk-line-chart {
      width: 340px;
      height: 120px;
      border: solid 1px #ccc;
    }
  </style>
</custom-style>
```

### Basic
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/basic.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'>
</nk-line-chart>
```

### Label at Point
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/label-at-point.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  point-label='{
    "enable": true,
    "offset": {
      "y": -6
    },
    "textStyle": {
      "fill": "#666",
      "textAnchor": "middle"
    }
  }'>
</nk-line-chart>
```

### X-axis Range
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-range.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  x-range='{
    "min": 0,
    "max": 10
  }'>
</nk-line-chart>
```

### Y-axis Range
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-range.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  y-range='{
    "min": 0,
    "max": 10
  }'>
</nk-line-chart>
```

### X-axis Grid Lines
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-grid.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  x-axis='{
    "enable": true,
    "label": {
      "enable": true,
      "offset": {
        "x": -6,
        "y": 5
      },
      "textStyle": {
        "fontSize": "14px",
        "fill": "#666",
        "textAnchor": "end"
      }
    },
    "lineStyle": {
      "fill": "none",
      "stroke": "#e08080",
      "strokeDasharray": "4,2",
      "strokeWidth": 1
    },
    "tickInterval": 2
  }'>
</nk-line-chart>
```

### Y-axis Grid Lines
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-grid.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 20,
    "left": 20,
    "width": 300,
    "height": 80
  }'
  y-axis='{
    "enable": true,
    "label": {
      "enable": true,
      "offset": {
        "x": 0,
        "y": 15
      },
      "textStyle": {
        "fontSize": "14px",
        "fill": "#666",
        "textAnchor": "middle"
      }
    },
    "lineStyle": {
      "fill": "none",
      "stroke": "#e08080",
      "strokeDasharray": "4,2",
      "strokeWidth": 1
    },
    "tickInterval": 2
  }'>
</nk-line-chart>
```

### Origin: left-bottom (cartesian coordinates)
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-bottom.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  origin="left-bottom">
</nk-line-chart>
```

### Origin: left-top (screen coordinates)
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-top.png" width="340" height="120">

```html
<nk-line-chart
  rows='[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  origin="left-top">
</nk-line-chart>
```

### Custom Style for Points
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-points.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  point='{
    "enable": true,
    "elements": [
      {
        "type": "circle",
        "style": {
          "fill": "#fff",
          "r": "8",
          "stroke": "#e08080",
          "strokeWidth": 1.5
        }
      },
      {
        "type": "circle",
        "style": {
          "fill": "#e08080",
          "r": "3.5",
          "stroke": "none",
          "strokeWidth": 0
        }
      }
    ]
  }'>
</nk-line-chart>
```

### Custom Style for Background Rect
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-back.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  background-rect-style='{
    "fill": "#00f",
    "fillOpacity": 0.1,
    "stroke": "#00f",
    "strokeWidth": 5,
    "strokeOpacity": 0.3
  }'>
</nk-line-chart>
```

### Custom Style for Path
<img src="https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-path.png" width="340" height="120">

```html
<nk-line-chart
  rows="[
    [0, 0], [1, 1], [2, 1], [3, 2], [4, 3], [5, 5], [6, 8]
  ]"
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'
  path-style='{
    "stroke": "#8080e0",
    "strokeWidth": 2,
    "strokeDasharray": "5, 2",
    "fillOpacity": 1,
    "fill": "none"
  }'>
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

Testing in watch mode, you can view coverage files from
```
open http://localhost:8080/coverage/
```
