/**
@license
Copyright 2016-2017, Naoaki Yamada
All rights reserved.

This source code is distributed under the MIT license.
*/
/**
`nk-line-chart`
A very lightweight polymer component for drawing line charts.

@demo demo/index.html
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { camelToDashCase } from '@polymer/polymer/lib/utils/case-map.js';

var BASE_CLASS = 'nk-line-chart';
var NON_BUBBLES = {bubbles: false};
var NS = 'http://www.w3.org/2000/svg';

Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      #container {
        width: 100%;
        height: 100%;
        @apply --nk-line-chart-container;
      }
    </style>
    <div id="container"></div>
`,

  is: 'nk-line-chart',

  properties: {

    /**
     * Style for the background rect of the chart area
     */
    backgroundRectStyle: {
      type: Object,
      value: function() {
        return {
          fill: 'none',
          stroke: 'none'
        };
      }
    },

    /**
     * An object to configure the placement and size of the chart area.
     *
     * The following members are required.
     * `top`, `left`, `width`, `height`
     * Currently, the supported format is only a number of pixels.
     *
     * Example:
     * ```
     * {
     *   top: 10,
     *   left: 10,
     *   width: 320,
     *   height: 100
     * }
     * ```
     */
    chartArea: {
      type: Object
    },

    /**
     * The origin of coordinates. The possible values are,
     *
     * ```
     * left-bottom: cartesian cordinates
     * left-top: screen cordinates
     * right-top
     * right-bottom
     * ```
     */
    origin: {
      type: String,
      value: 'left-bottom'
    },

    /**
     * Style for polygonal lines
     */
    pathStyle: {
      type: Object,
      value: function() {
        return {
          fill: 'none',
          stroke: '#e08080',
          strokeWidth: 2,
        };
      }
    },

    /**
     * Option for labels at points
     *
     * ```
     * enable: whether show labels or not (boolean)
     * textFormat: function for label formatter (function(row, index))
     * offset: offset from label ({x, y})
     * textStyle: text styles (object)
     * ```
     */
    pointLabel: {
      type: Object,
      value: function() {
        return {
          enable: false,
          offset: {
            y: -10
          },
          textFormat: formatLabel,
          textStyle: {
            fill: '#333',
            textAnchor: 'middle'
          }
        };
      }
    },

    /**
     * Option for style of data points.
     *
     * ```
     * enable: If false, this option will be ignored.
     * elements: Function or array of elements which define styles of data points. Currently, `circle` is the only permittable type.
     *
     * (ex) A point which consists of two different circles.
     * elements: [
     *   {
     *     type: 'circle',
     *     style: {
     *       fill: '#fff',
     *       r: '8',
     *       stroke: '#e08080',
     *       strokeWidth: 1.5
     *     }
     *   },
     *   {
     *     type: 'circle',
     *     style: {
     *       fill: '#e08080',
     *       r: '3.5',
     *       stroke: 'none',
     *       strokeWidth: 0
     *     }
     *    }
     *  ]
     *
     * (ex) Can be a function which returns an array of elements
     * elements: function(p, i) {
     *   if (i === this._someIndex) {
     *     return [
     *       {
     *         type: 'circle',
     *         style: {
     *           fill: 'red',
     *           r: '8'
     *         }
     *       }
     *     ];
     *   }
     *   else {
     *     return [
     *       {
     *         type: 'circle',
     *         style: {
     *           fill: 'blue',
     *           r: '6'
     *         }
     *       }
     *     ];
     *   }
     * }.bind(this)
     * ```
     */
    point: {
      type: Object,
      value: function() {
        return {
          enable: true,
          elements: [
            {
              type: 'circle',
              style: {
                fill: '#e08080',
                r: '3',
                stroke: 'none',
                strokeWidth: 2
              }
            }
          ]
        };
      },
    },

    /**
     * Data rows
     *
     * ```
     * (ex)
     * [
     *   [0, 0], [1, 1]
     * ]
     * ```
     */
    rows: {
      type: Array
    },

    /**
     * Option for x-axis grid lines and labels
     */
    xAxis: {
      type: Object,
      value: function() {
        return {
          enable: false,
          label: {
            offset: {
              x: -4,
              y: 5
            },
            textStyle: {
              fill: '#333',
              textAnchor: 'end'
            }
          },
          lineStyle: {
            fill: 'none',
            stroke: '#e08080',
            strokeDasharray: '4,2',
            strokeWidth: 1
          },
          tickInterval: 2
        }
      }
    },

    /**
     * X-axis range of chart area. If not specified, the range will be computed by data rows.
     *
     * ```
     * min: X-axis value at the left (right if the origin is right) of chart area
     * max: X-axis value at the right (left if the origin is right) of chart area
     * ```
     */
    xRange: {
      type: Object,
      value: null
    },

    /**
     * Option for y-axis grid lines and labels
     */
    yAxis: {
      type: Object,
      value: function() {
        return {
          enable: false,
          label: {
            offset: {
              x: 0,
              y: 15
            },
            textStyle: {
              fill: '#333',
              textAnchor: 'middle'
            }
          },
          lineStyle: {
            fill: 'none',
            stroke: '#e08080',
            strokeDasharray: '4,2',
            strokeWidth: 1
          },
          tickInterval: 2
        }
      }
    },

    /**
     * Y-axis range of chart area. If not specified, the range will be computed by data rows.
     *
     * ```
     * min: Y-axis value at the bottom (top if the origin is top) of chart area
     * max: Y-axis value at the top (bottom if the origin is top) of chart area
     * ```
     */
    yRange: {
      type: Object,
      value: null
    },

    _transformer: {
      type: Function,
      computed: '_computeTransformer(origin, chartArea)'
    }
  },

  observers: [
    '_paramsChanged(backgroundRectStyle, chartArea.*, origin, pathStyle, point, pointLabel.*, rows, xAxis, xRange, yAxis, yRange)'
  ],

  _computeTransformer: function(origin, chartArea) {
    return getTransformer(origin, chartArea);
  },

  _draw: function(svg, pf) {
    var points = pf.points;
    var backgroundRectAttrs = toAttributes(this.backgroundRectStyle);
    var xAxisOpt = this.xAxis;
    var yAxisOpt = this.yAxis;
    var pathAttrs = toAttributes(this.pathStyle);
    var pointOpt = this.point;
    var circleAttr;
    var pointLabel = this.pointLabel;
    var g0 = document.createElementNS(NS, 'g');
    var g1c = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point-group');
    var g1t = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point-label-group');

    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.appendChild(g0);
    g0.appendChild(this._drawBackgroundRect(
      document.createElementNS(NS, 'rect'),
      this.chartArea, backgroundRectAttrs
    ));

    if (xAxisOpt && xAxisOpt.enable) {
      g0.appendChild(this._drawXAxis(addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-x-axis-group'), xAxisOpt, pf));
    }
    if (yAxisOpt && yAxisOpt.enable) {
      g0.appendChild(this._drawYAxis(addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-y-axis-group'), yAxisOpt, pf));
    }

    if (points.length > 0) {
      g0.appendChild(this._drawPath(
        addClass(document.createElementNS(NS, 'path'), BASE_CLASS + '-path'),
        points[0], pointsToMoves(points), pathAttrs
      ));
    }
    g0.appendChild(g1c);
    g0.appendChild(g1t);

    if (pointOpt && pointOpt.enable) {
      var pointElementsIsFunction = typeof(pointOpt.elements) === 'function';
      points.forEach(function(p, i) {
        var g = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point');
        var elements = pointElementsIsFunction ? pointOpt.elements(p, i) : pointOpt.elements;
        elements.forEach(function(e) {
          if (e.type === 'circle') {
            g.appendChild(this._drawCircle(
              document.createElementNS(NS, e.type),
              p, toAttributes(e.style)
            ));
          }
        }.bind(this))
        g1c.appendChild(g);
      }.bind(this));
    }

    if (pointLabel && pointLabel.enable) {
      points.forEach(function(p, i) {
        g1t.appendChild(this._drawLabelAtPoint(
          addClass(document.createElementNS(NS, 'text'), BASE_CLASS + '-point-label'),
          p, i
        ));
      }.bind(this));
    }
    return svg;
  },

  _drawBackgroundRect: function(rect, chartArea, attrs) {
    rect.classList.add(BASE_CLASS + '-background-rect');
    rect.setAttribute('x', chartArea.left);
    rect.setAttribute('y', chartArea.top);
    rect.setAttribute('width', chartArea.width);
    rect.setAttribute('height', chartArea.height);
    setAttributes(rect, attrs);
    return rect;
  },

  _drawCircle: function(circle, point, attrs) {
    point = this._transformer.convertPoint(point);
    circle.setAttribute('cx', point.x);
    circle.setAttribute('cy', point.y);
    setAttributes(circle, attrs);
    return circle;
  },

  _drawXAxis: function(group, xAxisOpt, pf) {
    var gridLines = document.createElementNS(NS, 'g');
    var gridLinesData = [];
    var gridLabels = document.createElementNS(NS, 'g');
    var interval = xAxisOpt.tickInterval;
    var start = Math.ceil(pf.vMinY / interval) * interval;
    var end = Math.floor(pf.vMaxY / interval) * interval;
    gridLines.classList.add(BASE_CLASS + '-x-axis-grid-line-group');
    gridLabels.classList.add(BASE_CLASS + '-x-axis-grid-label-group');
    for (var vy = start; vy <= end; vy += interval) {
      var cy = isFinite(pf.factorY) ? (vy - pf.vMinY) * pf.factorY + pf.top : pf.constantY
      var axisPoints = [
        {
          vx: pf.vMinX,
          vy: vy,
          x: pf.left,
          y: cy
        },
        {
          vx: pf.vMaxX,
          vy: vy,
          x: pf.left + pf.width,
          y: cy
        }
      ];
      gridLines.appendChild(this._drawPath(
        addClass(document.createElementNS(NS, 'path'), BASE_CLASS + '-x-axis-grid-line'),
        axisPoints[0], pointsToMoves(axisPoints), toAttributes(xAxisOpt.lineStyle)
      ));
      if (xAxisOpt.label) {
        gridLabels.appendChild(this._drawLabelAtAxis(
          addClass(document.createElementNS(NS, 'text'), BASE_CLASS + '-x-axis-grid-label'),
          axisPoints[0], xAxisOpt.label, 'vy'
        ));
      }
      var gridLinePointsData = axisPoints.map(function(point) {
        var pixel = this._transformer.convertPoint(point);
        return {
          px: pixel.x,
          py: pixel.y,
          vx: point.vx,
          vy: point.vy,
          x: point.x,
          y: point.y
        }
      }.bind(this));
      gridLinesData.push(gridLinePointsData);
    }
    group.appendChild(gridLines);
    group.appendChild(gridLabels);
    this.fire('x-axis', {gridLines: gridLinesData}, NON_BUBBLES);
    return group;
  },

  _drawYAxis: function(group, yAxisOpt, pf) {
    var gridLines = document.createElementNS(NS, 'g');
    var gridLinesData = [];
    var gridLabels = document.createElementNS(NS, 'g');
    var interval = yAxisOpt.tickInterval;
    var start = Math.ceil(pf.vMinX / interval) * interval;
    var end = Math.floor(pf.vMaxX / interval) * interval;
    gridLines.classList.add(BASE_CLASS + '-y-axis-grid-line-group');
    gridLabels.classList.add(BASE_CLASS + '-y-axis-grid-label-group');
    for (var vx = start; vx <= end; vx += interval) {
      var cx = isFinite(pf.factorX) ? (vx - pf.vMinX) * pf.factorX + pf.left : pf.constantX
      var axisPoints = [
        {
          vx: vx,
          vy: pf.vMinY,
          x: cx,
          y: pf.top
        },
        {
          vx: vx,
          vy: pf.vMaxY,
          x: cx,
          y: pf.top + pf.height
        }
      ];
      gridLines.appendChild(this._drawPath(
        addClass(document.createElementNS(NS, 'path'), BASE_CLASS + '-y-axis-grid-line'),
        axisPoints[0], pointsToMoves(axisPoints), toAttributes(yAxisOpt.lineStyle)
      ));
      if (yAxisOpt.label) {
        gridLabels.appendChild(this._drawLabelAtAxis(
          addClass(document.createElementNS(NS, 'text'), BASE_CLASS + '-y-axis-grid-label'),
          axisPoints[0], yAxisOpt.label, 'vx'
        ));
      }
      var gridLinePointsData = axisPoints.map(function(point) {
        var pixel = this._transformer.convertPoint(point);
        return {
          px: pixel.x,
          py: pixel.y,
          vx: point.vx,
          vy: point.vy,
          x: point.x,
          y: point.y
        }
      }.bind(this));
      gridLinesData.push(gridLinePointsData);
    }
    group.appendChild(gridLines);
    group.appendChild(gridLabels);
    this.fire('y-axis', {gridLines: gridLinesData}, NON_BUBBLES);
    return group;
  },

  _drawPath: function(path, startPoint, moves, attrs) {
    var transformer = this._transformer;
    startPoint = transformer.convertPoint(startPoint);
    var d = moves.reduce(function(memo, vector) {
      vector = transformer.convertVector(vector);
      return memo + 'l' + vector.x + ',' + vector.y;
    }, 'M' + startPoint.x + ',' + startPoint.y);
    path.setAttribute('d', d);
    setAttributes(path, attrs);
    return path;
  },

  _drawLabelAtAxis: function(text, point, labelOpt, pointValueName) {
    var option = labelOpt;
    var offset = option.offset || {};
    var attrs = toAttributes(option.textStyle);
    var formatter = option.textFormat || formatAxisLabel
    var cp = this._transformer.convertPoint(point);
    text.setAttribute('x', cp.x + (typeof(offset.x) === 'number' ? offset.x : 0));
    text.setAttribute('y', cp.y + (typeof(offset.y) === 'number' ? offset.y : 0));
    setAttributes(text, attrs);
    text.textContent = formatter(point[pointValueName]);
    return text;
  },

  _drawLabelAtPoint: function(text, point, index) {
    var option = this.pointLabel;
    var offset = option.offset || {};
    var row = this.rows[index];
    var attrs = toAttributes(option.textStyle);
    var formatter = option.textFormat || formatLabel;
    point = this._transformer.convertPoint(point);
    text.setAttribute('x', point.x + (typeof(offset.x) === 'number' ? offset.x : 0));
    text.setAttribute('y', point.y + (typeof(offset.y) === 'number' ? offset.y : -10));
    setAttributes(text, attrs);
    text.textContent = formatter(row, index);
    return text;
  },

  _paramsChanged: function(backgroundRectStyle, chartArea_, origin, pathStyle, point, pointLabel_, rows, xAxis_, xRange, yAxis_, yRange) {
    this.debounce('draw', function() {
      var container = this.$.container;
      if (this._svg) {
        container.removeChild(this._svg);
      }
      this._svg = null;
      if (rows && this.chartArea) {
        this._svg = this._draw(
          document.createElementNS(NS, 'svg'),
          calcPointsAndFrame(rows, this.chartArea, xRange, yRange)
        );
        container.appendChild(this._svg);
      }
    });
  }

  /**
   * Fires when x-axis grid lines are rendered
   *
   * | detail           | type            | meaning                                                     |
   * |:-----------------|:--------------- |:------------------------------------------------------------|
   * | gridLines        | Array           | Array of grid lines which contains points for start and end |
   *
   *
   * Example of gridLines
   * ```
   * [{"px":10,"py":90,"vx":1,"vy":2,"x":10,"y":10},{"px":190,"py":90,"vx":3,"vy":2,"x":190,"y":10}],
   * [{"px":10,"py":50,"vx":1,"vy":3,"x":10,"y":50},{"px":190,"py":50,"vx":3,"vy":3,"x":190,"y":50}],
   * [{"px":10,"py":10,"vx":1,"vy":4,"x":10,"y":90},{"px":190,"py":10,"vx":3,"vy":4,"x":190,"y":90}]
   * ```
   *
   * - px, py: Real pixel coordinates for start or end point after being transformed
   * - vx, vy: Numeric values for start or end point
   * - x, y: Pixel coordinates for start or end point before being transformed
   *
   * @event x-axis
   */

  /**
   * Fires when y-axis grid lines are rendered
   *
   * | detail           | type            | meaning                                                     |
   * |:-----------------|:--------------- |:------------------------------------------------------------|
   * | gridLines        | Array           | Array of grid lines which contains points for start and end |
   *
   * ```
   *
   * See detail for `x-axis`
   *
   * @event y-axis
   */
});

function addClass(node, className) {
  node.classList.add(className);
  return node;
}

function calcPointsAndFrame(rows, chartArea, xRange, yRange) {
  var top = chartArea.top || 0;
  var left = chartArea.left || 0;
  var width = chartArea.width;
  var height = chartArea.height;
  var vMinX = Number.MAX_VALUE;
  var vMinY = Number.MAX_VALUE;
  var vMaxX = Number.MIN_VALUE;
  var vMaxY = Number.MIN_VALUE;
  var factorX;
  var factorY;
  var constantX = width / 2 + left;
  var constantY = height / 2 + top;

  rows.forEach(function(r) {
    if (r[0] < vMinX) {
      vMinX = r[0];
    }
    if (r[0] > vMaxX) {
      vMaxX = r[0];
    }
    if (r[1] < vMinY) {
      vMinY = r[1];
    }
    if (r[1] > vMaxY) {
      vMaxY = r[1];
    }
  });
  if (xRange) {
    vMinX = typeof(xRange.min) === 'number' ? xRange.min : vMinX;
    vMaxX = typeof(xRange.max) === 'number' ? xRange.max : vMaxX;
  }
  if (yRange) {
    vMinY = typeof(yRange.min) === 'number' ? yRange.min : vMinY;
    vMaxY = typeof(yRange.max) === 'number' ? yRange.max : vMaxY;
  }
  factorX = width / (vMaxX - vMinX);
  factorY = height / (vMaxY - vMinY);

  return {
    width: width,
    height: height,
    left: left,
    top: top,
    constantX: constantX,
    constantY: constantY,
    factorX: factorX,
    factorY: factorY,
    points: rows.map(function(r) {
      return {
        vx: r[0],
        vy: r[1],
        x: isFinite(factorX) ? (r[0] - vMinX) * factorX + left : constantX,
        y: isFinite(factorY) ? (r[1] - vMinY) * factorY + top : constantY
      };
    }),
    vMinX: vMinX,
    vMinY: vMinY,
    vMaxX: vMaxX,
    vMaxY: vMaxY
  };
}

function formatLabel(row, index) {
  return '[' + row + ']';
}

function formatAxisLabel(value) {
  return value;
}

function getTransformer(origin, chartArea) {
  var transformer;

  switch (origin) {

    // cartesian coordinates
    case 'left-bottom':
      transformer = [
        function(point) {
          var result = {};
          result.x = point.x;
          result.y = chartArea.height + 2 * (chartArea.top || 0) - point.y;
          return result;
        },
        function(vector) {
          var result = {};
          result.x = vector.x;
          result.y = -vector.y;
          return result;
        }
      ];
      break;

    case 'right-bottom':
      transformer = [
        function(point) {
          var result = {};
          result.x = chartArea.width + 2 * (chartArea.left || 0) - point.x;
          result.y = chartArea.height + 2 * (chartArea.top || 0) - point.y;
          return result;
        },
        function(vector) {
          var result = {};
          result.x = -vector.x;
          result.y = -vector.y;
          return result;
        }
      ];
      break;

    case 'right-top':
      transformer = [
        function(point) {
          var result = {};
          result.x = chartArea.width + 2 * (chartArea.left || 0) - point.x;
          result.y = point.y;
          return result;
        },
        function(vector) {
          var result = {};
          result.x = -vector.x;
          result.y = vector.y;
          return result;
        }
      ];
      break;

    // screen coordinates
    case 'left-top':
    default:
      transformer = [
        function(point) {
          return point;
        },
        function(vector) {
          return vector;
        }
      ];
      break;
  }

  return {
    convertPoint: transformer[0],
    convertVector: transformer[1]
  };
}

function pointsToMoves(points) {
  var prevP;
  var moves = [];

  points.forEach(function(p) {
    if (prevP) {
      var move = {
        x: p.x - prevP.x,
        y: p.y - prevP.y
      };
      moves.push(move);
    }
    prevP = p;
  });
  return moves;
}

function setAttributes(element, attrs) {
  Object.keys(attrs).forEach(function(attrName) {
    element.setAttribute(attrName, attrs[attrName]);
  });
}

function toAttributes(properties) {
  return Object.keys(properties).reduce(function(memo, propName) {
    var attrName = camelToDashCase(propName);
    memo[attrName] = properties[propName];
    return memo;
  }, {});
}
