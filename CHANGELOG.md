# Change Log

<!-- ## [X.Y.Z] - YYYY-MM-DD -->
<!-- ## Unreleased -->
<!-- ### Changed -->
<!-- ### Added -->
<!-- ### Fixed -->
<!-- ### Removed -->

## [3.0.0] - 2020-07-20
### Added
- Supported multiple lines.
- Added `series` property for multiple lines options.

### Changed
- Changed `textAttrs` => `text.attrs`.
- Changed `textFormat` => `text.format`.
- Changed `lineAttrs` => `line.attrs`.
- Changed `pathAttrs` => `line.attrs`.
- Changed `backgroundRectAttrs` => `backgroundRect.attrs`
- Changed `rows` => `data` for muliple lines support.

## [3.0.0-alpha.0] - 2020-07-19
### Changed
- Rewrited codes with lit-element.
- Renamed `*Style` => `*Attrs`.
- Renamed `elements[].type` => `elements[].name`.
- Renamed `enable` => `enabled`.

### Fixed
- Removed iron-demo-helpers to fix vulnerability
- Fixed watching demo/index.html

### Removed
- Dropped auto convertion of camel to dash case for styling attrs.
- Dropped axis events.

## [2.2.4] - 2020-08-04
### Added
- Exported types.

## [2.2.3] - 2020-07-17
### Added
- Tweaked publish things.

## [2.2.2] - 2020-07-17
### Added
- Added travis config.

## [2.2.1] - 2020-07-13
### Fixed
- Fixed demo and test commands in the README

## [2.2.0] - 2020-07-13
### Changed
- Rewrote in typescript.

## [2.1.1] - 2020-07-12
### Changed
- Upgrade @open-wc/testing to v3

## [2.1.0] - 2020-07-12
### Changed
- Rewrote with PolymerElement.
### Fixed
- Fixed function demo

## [2.0.1] - 2020-07-12
### Changed
- Replaced wct tester with karma.

## [2.0.0] - 2020-07-12
### Changed
- Added support for Polymer v3 and dropped support for Polymer v1.

## [1.2.1] - 2017-06-23
### Added
- Added custom events x-axis and y-axis which notify grid lines data (px, py, vx, vy, x, y).

## [1.2.0] - 2017-06-22
### Added
- Extended chart point.elements option to accept function, which can change point style at each points.
- Added grid line feature for x-axis and y-axis.
### Removed
- Removed deprecated circleStyle option.

## [1.1.5] - 2017-03-17
### Added
- Added custom style property for internal container.

## [1.1.4] - 2017-03-17
### Changed
- Separated a custom style demo.
### Added
- Added more flexible customizable style option for data points. Currently, multiple circles can be used per point.
- Added classes to SVG elements to clarify the role of each. (e.g. nk-line-chart-point-group, nk-line-chart-point, ..)
### Fixed
- Fixed a point label demo.

## [1.1.3] - 2017-03-17
### Added
- Added support for manual setting for x-axis and y-axis ranges.
- Added support for displaying text labels at data points.

## [1.1.1] - 2016-08-04
### Added
- Added support for background style for the chart area.

## [1.0.0] - 2016-07-15
First Release
