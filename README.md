# \<nk-line-chart\>

A very simple web component for drawing line chart

```html
<style is="custom-style">
  nk-line-chart {
    width: 340px;
    height: 120px;
  }
</style>

<nk-line-chart
  rows='[
    {"x": 0, "y": 0},
    {"x": 1, "y": 1},
    {"x": 2, "y": 1},
    {"x": 3, "y": 2},
    {"x": 4, "y": 3},
    {"x": 5, "y": 5},
    {"x": 6, "y": 8},
    {"x": 7, "y": 13},
    {"x": 8, "y": 21},
    {"x": 9, "y": 34}
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'>
</nk-line-chart>
```

![Sample](https://raw.githubusercontent.com/naoak/nk-line-chart/master/sample.svg)

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your application locally.

## Viewing Your Application

```
$ polymer serve
```

## Building Your Application

```
$ polymer build
```

This will create a `build/` folder with `bundled/` and `unbundled/` sub-folders
containing a bundled (Vulcanized) and unbundled builds, both run through HTML,
CSS, and JS optimizers.

You can serve the built versions by giving `polymer serve` a folder to serve
from:

```
$ polymer serve build/bundled
```

## Running Tests

```
$ polymer test
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `polymer test` to run your application's test suite locally.
