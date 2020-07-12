/**
@license
Copyright 2016-2020, Naoaki Yamada
All rights reserved.
This source code is distributed under the MIT license.
*/
import { html, PolymerElement } from '@polymer/polymer';
import { LegacyElementMixin, LegacyElementMixinConstructor } from '@polymer/polymer/lib/legacy/legacy-element-mixin';
import { camelToDashCase } from '@polymer/polymer/lib/utils/case-map.js';
import { customElement, property, computed, observe } from '@polymer/decorators';

const BASE_CLASS = 'nk-line-chart';
const NON_BUBBLES = {bubbles: false};
const NS = 'http://www.w3.org/2000/svg';

type Constructor<T> = new (...args: any[]) => T;
type Attrs = {[key in string]: number | string};
type ChartArea = {
  top?: number;
  left?: number;
  width: number;
  height: number
}
type Origin = 'left-bottom' | 'left-top' | 'right-top' | 'right-bottom' | '';
type Range = {min: number; max: number};
type Vector2d = [number, number];
type VectorXY = {x: number, y: number};
type LabelOptions = {
  enable?: boolean;
  offset?: {
    x?: number;
    y?: number;
  },
  textFormat?: typeof formatLabel;
  textStyle?: Attrs;
}
type PointOptions = {
  enable: boolean;
  elements: {type: string, style: Attrs}[] | ((p: AxisPoint, i: number) => {type: string, style: Attrs}[]);
};
type AxisOptions = {
  enable?: boolean,
  label?: LabelOptions;
  lineStyle?: Attrs;
  tickInterval?: number;
};
type AxisPoint = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};
type PointsAndFrame = ReturnType<typeof calcPointsAndFrame>;

export type AxisEventDetail = {
  gridLines: {
    px: number;
    py: number;
    vx: number;
    vy: number;
    x: number;
    y: number;
  }[][];
};

@customElement('nk-line-chart')
export class NkLineChartElement extends (LegacyElementMixin(PolymerElement) as (Constructor<PolymerElement> & LegacyElementMixinConstructor)) {
  static get template() {
    return html`
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
    `
  }

  /**
   * Style for the background rect of the chart area
   */
  @property({type: Object})
  backgroundRectStyle: Attrs = {
    fill: 'none',
    stroke: 'none'
  }

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
  @property({type: Object})
  chartArea: ChartArea;

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
  @property({type: String})
  origin: Origin = 'left-bottom';

  /**
   * Style for polygonal lines
   */
  @property({type: Object})
  pathStyle: Attrs = {
    fill: 'none',
    stroke: '#e08080',
    strokeWidth: 2
  }

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
  @property({type: Object})
  pointLabel: LabelOptions = {
    enable: false,
    offset: {
      y: -10
    },
    textFormat: formatLabel,
    textStyle: {
      fill: '#333',
      textAnchor: 'middle'
    }
  }

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
  @property({type: Object})
  point: PointOptions = {
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
  }

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
  @property({type: Array})
  rows: Vector2d[];

  /**
   * Options for x-axis grid lines and labels
   */
  @property({type: Object})
  xAxis: AxisOptions = {
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

  /**
   * X-axis range of chart area. If not specified, the range will be computed by data rows.
   *
   * ```
   * min: X-axis value at the left (right if the origin is right) of chart area
   * max: X-axis value at the right (left if the origin is right) of chart area
   * ```
   */
  @property({type: Object})
  xRange: Range = null;

  /**
   * Options for y-axis grid lines and labels
   */
  @property({type: Object})
  yAxis: AxisOptions = {
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

  /**
   * Y-axis range of chart area. If not specified, the range will be computed by data rows.
   *
   * ```
   * min: Y-axis value at the bottom (top if the origin is top) of chart area
   * max: Y-axis value at the top (bottom if the origin is top) of chart area
   * ```
   */
  @property({type: Object})
  yRange: Range = null;

  _svg: SVGSVGElement;

  @computed('origin', 'chartArea')
  get _transformer() {
    return getTransformer(this.origin, this.chartArea);
  }

  _draw(svg: SVGSVGElement, pf: PointsAndFrame) {
    const points = pf.points;
    const backgroundRectAttrs = toAttributes(this.backgroundRectStyle);
    const xAxisOpt = this.xAxis;
    const yAxisOpt = this.yAxis;
    const pathAttrs = toAttributes(this.pathStyle);
    const pointOpt = this.point;
    const pointLabel = this.pointLabel;
    const g0 = document.createElementNS(NS, 'g');
    const g1c = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point-group');
    const g1t = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point-label-group');

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
      points.forEach((p, i) => {
        const g = addClass(document.createElementNS(NS, 'g'), BASE_CLASS + '-point');
        const elements = typeof(pointOpt.elements) === 'function' ? pointOpt.elements(p, i) : pointOpt.elements;
        elements.forEach((e) => {
          if (e.type === 'circle') {
            g.appendChild(this._drawCircle(
              document.createElementNS(NS, e.type),
              p, toAttributes(e.style)
            ));
          }
        });
        g1c.appendChild(g);
      });
    }

    if (pointLabel && pointLabel.enable) {
      points.forEach((p, i) => {
        g1t.appendChild(this._drawLabelAtPoint(
          addClass(document.createElementNS(NS, 'text'), BASE_CLASS + '-point-label'),
          p, i
        ));
      });
    }
    return svg;
  }

  _drawBackgroundRect(rect: SVGRectElement, chartArea: ChartArea, attrs: Attrs) {
    rect.classList.add(BASE_CLASS + '-background-rect');
    rect.setAttribute('x', chartArea.left + '');
    rect.setAttribute('y', +chartArea.top + '');
    rect.setAttribute('width', chartArea.width + '');
    rect.setAttribute('height', chartArea.height + '');
    setAttributes(rect, attrs);
    return rect;
  }

  _drawCircle(circle: SVGCircleElement, point: VectorXY, attrs: Attrs) {
    point = this._transformer.convertPoint(point);
    circle.setAttribute('cx', point.x + '');
    circle.setAttribute('cy', point.y + '');
    setAttributes(circle, attrs);
    return circle;
  }

  _drawXAxis(group: SVGGElement, xAxisOpt: AxisOptions, pf: PointsAndFrame) {
    const gridLines = document.createElementNS(NS, 'g');
    const gridLinesData = [];
    const gridLabels = document.createElementNS(NS, 'g');
    const interval = xAxisOpt.tickInterval;
    const start = Math.ceil(pf.vMinY / interval) * interval;
    const end = Math.floor(pf.vMaxY / interval) * interval;
    gridLines.classList.add(BASE_CLASS + '-x-axis-grid-line-group');
    gridLabels.classList.add(BASE_CLASS + '-x-axis-grid-label-group');
    for (let vy = start; vy <= end; vy += interval) {
      const cy = isFinite(pf.factorY) ? (vy - pf.vMinY) * pf.factorY + pf.top : pf.constantY
      const axisPoints = [
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
      const gridLinePointsData = axisPoints.map((point) => {
        const pixel = this._transformer.convertPoint(point);
        return {
          px: pixel.x,
          py: pixel.y,
          vx: point.vx,
          vy: point.vy,
          x: point.x,
          y: point.y
        }
      });
      gridLinesData.push(gridLinePointsData);
    }
    group.appendChild(gridLines);
    group.appendChild(gridLabels);
    this.fire('x-axis', {gridLines: gridLinesData}, NON_BUBBLES);
    return group;
  }

  _drawYAxis(group: SVGGElement, yAxisOpt: AxisOptions, pf: PointsAndFrame) {
    const gridLines = document.createElementNS(NS, 'g');
    const gridLinesData = [];
    const gridLabels = document.createElementNS(NS, 'g');
    const interval = yAxisOpt.tickInterval;
    const start = Math.ceil(pf.vMinX / interval) * interval;
    const end = Math.floor(pf.vMaxX / interval) * interval;
    gridLines.classList.add(BASE_CLASS + '-y-axis-grid-line-group');
    gridLabels.classList.add(BASE_CLASS + '-y-axis-grid-label-group');
    for (let vx = start; vx <= end; vx += interval) {
      const cx = isFinite(pf.factorX) ? (vx - pf.vMinX) * pf.factorX + pf.left : pf.constantX
      const axisPoints = [
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
      const gridLinePointsData = axisPoints.map((point) => {
        const pixel = this._transformer.convertPoint(point);
        return {
          px: pixel.x,
          py: pixel.y,
          vx: point.vx,
          vy: point.vy,
          x: point.x,
          y: point.y
        }
      });
      gridLinesData.push(gridLinePointsData);
    }
    group.appendChild(gridLines);
    group.appendChild(gridLabels);
    this.fire('y-axis', {gridLines: gridLinesData}, NON_BUBBLES);
    return group;
  }

  _drawPath(path: SVGPathElement, startPoint: VectorXY, moves: VectorXY[], attrs: Attrs) {
    const transformer = this._transformer;
    startPoint = transformer.convertPoint(startPoint);
    const d = moves.reduce(function(memo, vector) {
      vector = transformer.convertVector(vector);
      return memo + 'l' + vector.x + ',' + vector.y;
    }, 'M' + startPoint.x + ',' + startPoint.y);
    path.setAttribute('d', d);
    setAttributes(path, attrs);
    return path;
  }

  _drawLabelAtAxis(text: SVGTextElement, point: AxisPoint, labelOpt: LabelOptions, pointValueName: keyof AxisPoint) {
    const option = labelOpt;
    const offset = option.offset || {};
    const attrs = toAttributes(option.textStyle);
    const formatter = option.textFormat || formatAxisLabel
    const cp = this._transformer.convertPoint(point);
    text.setAttribute('x', cp.x + (typeof(offset.x) === 'number' ? offset.x : 0) + '');
    text.setAttribute('y', cp.y + (typeof(offset.y) === 'number' ? offset.y : 0) + '');
    setAttributes(text, attrs);
    text.textContent = formatter(point[pointValueName]) + '';
    return text;
  }

  _drawLabelAtPoint(text: SVGTextElement, point: VectorXY, index: number) {
    const option = this.pointLabel;
    const offset = option.offset || {};
    const row = this.rows[index];
    const attrs = toAttributes(option.textStyle);
    const formatter = option.textFormat || formatLabel;
    point = this._transformer.convertPoint(point);
    text.setAttribute('x', point.x + (typeof(offset.x) === 'number' ? offset.x : 0) + '');
    text.setAttribute('y', point.y + (typeof(offset.y) === 'number' ? offset.y : -10) + '');
    setAttributes(text, attrs);
    text.textContent = formatter(row, index);
    return text;
  }

  @observe('backgroundRectStyle', 'chartArea.*', 'origin', 'pathStyle', 'point', 'pointLabel.*', 'rows', 'xAxis', 'xRange', 'yAxis', 'yRange')
  _paramsChanged(backgroundRectStyle: Attrs, chartArea_: ChartArea, origin: Origin, pathStyle: Attrs, point: PointOptions, pointLabel_: LabelOptions, rows: Vector2d[], xAxis_: AxisOptions, xRange: Range, yAxis_: AxisOptions, yRange: Range) {
    this.debounce('draw', () => {
      const container = this.$.container;
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
}

function addClass<T extends Element>(node: T, className: string) {
  node.classList.add(className);
  return node;
}

function calcPointsAndFrame(rows: Vector2d[], chartArea: ChartArea, xRange: Range, yRange: Range) {
  const top = chartArea.top || 0;
  const left = chartArea.left || 0;
  const width = chartArea.width;
  const height = chartArea.height;
  const constantX = width / 2 + left;
  const constantY = height / 2 + top;
  let vMinX = Number.MAX_VALUE;
  let vMinY = Number.MAX_VALUE;
  let vMaxX = Number.MIN_VALUE;
  let vMaxY = Number.MIN_VALUE;
  let factorX: number;
  let factorY: number;

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

function formatLabel(row: Vector2d | number, index?: number) {
  return '[' + row + ']';
}

function formatAxisLabel(value: number) {
  return value;
}

function getTransformer(origin: Origin, chartArea: ChartArea) {
  let transformer: [(point: VectorXY) => VectorXY, (vector: VectorXY) => VectorXY];

  switch (origin) {

    // cartesian coordinates
    case 'left-bottom':
      transformer = [
        (point: VectorXY) => ({
          x: point.x,
          y: chartArea.height + 2 * (chartArea.top || 0) - point.y
        }),
        (vector: VectorXY) => ({
          x: vector.x,
          y: -vector.y
        })
      ];
      break;

    case 'right-bottom':
      transformer = [
        (point: VectorXY) => ({
          x: chartArea.width + 2 * (chartArea.left || 0) - point.x,
          y: chartArea.height + 2 * (chartArea.top || 0) - point.y
        }),
        (vector: VectorXY) => ({
          x: -vector.x,
          y: -vector.y
        })
      ];
      break;

    case 'right-top':
      transformer = [
        (point: VectorXY) => ({
          x: chartArea.width + 2 * (chartArea.left || 0) - point.x,
          y: point.y
        }),
        (vector: VectorXY) => ({
          x: -vector.x,
          y: vector.y
        })
      ];
      break;

    // screen coordinates
    case 'left-top':
    default:
      transformer = [
        (point: VectorXY) => point,
        (vector: VectorXY) => vector
      ];
      break;
  }

  return {
    convertPoint: transformer[0],
    convertVector: transformer[1]
  };
}

function pointsToMoves(points: VectorXY[]) {
  let prevP: VectorXY;
  let moves: VectorXY[] = [];
  points.forEach(function(p) {
    if (prevP) {
      const move = {
        x: p.x - prevP.x,
        y: p.y - prevP.y
      };
      moves.push(move);
    }
    prevP = p;
  });
  return moves;
}

function setAttributes(element: Element, attrs: Attrs) {
  Object.keys(attrs).forEach(function(attrName) {
    element.setAttribute(attrName, attrs[attrName] as string);
  });
}

function toAttributes(properties: any) {
  return Object.getOwnPropertyNames(properties).reduce((memo, propName) => {
    const attrName = camelToDashCase(propName);
    memo[attrName] = properties[propName];
    return memo;
  }, {} as Attrs);
}
