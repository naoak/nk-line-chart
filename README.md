# \<nk-line-chart\>

A very lightweight polymer component for drawing line charts.

This component directly uses SVG tag to draw charts without graphic libraries.

```html
<style is="custom-style">
  nk-line-chart {
    width: 340px;
    height: 120px;
  }
</style>

<nk-line-chart
  rows='[
    [0, 0],
    [1, 1],
    [2, 1],
    [3, 2],
    [4, 3],
    [5, 5],
    [6, 8],
    [7, 13],
    [8, 21],
    [9, 34]
  ]'
  chart-area='{
    "top": 10,
    "left": 10,
    "width": 320,
    "height": 100
  }'>
</nk-line-chart>
```

![Sample](https://naoak.github.io/nk-line-chart/images/sample.svg)

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
