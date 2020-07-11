# \<nk-line-chart\>

A very lightweight polymer component for drawing line charts.

This component directly uses SVG tag to draw charts without graphic libraries.

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
![basic](https://raw.github.com/wiki/naoak/nk-line-chart/images/basic.png)

### Label at Point
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
![label at point](https://raw.github.com/wiki/naoak/nk-line-chart/images/label-at-point.png)

### X-axis Range
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
![xaxis range](https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-range.png)

### Y-axis Range
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
![yaxis range](https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-range.png)

### X-axis Grid Lines
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
![xaxis grid](https://raw.github.com/wiki/naoak/nk-line-chart/images/xaxis-grid.png)

### Y-axis Grid Lines
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
![yaxis grid](https://raw.github.com/wiki/naoak/nk-line-chart/images/yaxis-grid.png)

### Origin: left-bottom (cartesian coordinates)
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
![origin left-bottom](https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-bottom.png)

### Origin: left-top (screen coordinates)
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
![origin left-top](https://raw.github.com/wiki/naoak/nk-line-chart/images/origin-left-top.png)

### Custom Style for Points
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
![custom points](https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-points.png)

### Custom Style for Background Rect
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
![custom background](https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-back.png)

### Custom Style for Path
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
![custom path](https://raw.github.com/wiki/naoak/nk-line-chart/images/custom-path.png)

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Running the demo locally

```
polymer serve --npm
open  http://127.0.0.1:<port>/demo/
```

## Running the tests

```
polymer test --npm
```
