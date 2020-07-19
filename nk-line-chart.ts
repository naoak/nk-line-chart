/**
@license
Copyright 2016-2020, Naoaki Yamada
All rights reserved.
This source code is distributed under the MIT license.
*/
import { LitElement, svg, css, property, customElement } from 'lit-element';
import { spread } from '@open-wc/lit-helpers';

type Attrs = { [key in string]: number | string };
type ChartArea = {
  top?: number;
  left?: number;
  width: number;
  height: number;
};
type Origin = 'left-bottom' | 'left-top' | 'right-top' | 'right-bottom' | '';
type Range = { min: number; max: number };
type Vector2d = [number, number];
type VectorXY = { x: number; y: number };
type MappedXY = { x: number; y: number; vx: number; vy: number };
type LabelOptions = {
  enabled?: boolean;
  offset?: {
    x?: number;
    y?: number;
  };
  text?: {
    format?: TextFormat;
    attrs?: Attrs;
  };
};
type PointOptions = {
  enabled?: boolean;
  elements:
    | { name: string; attrs: Attrs }[]
    | ((p: MappedXY, i: number) => { name: string; attrs: Attrs }[]);
};
type LineOptions = {
  attrs: Attrs;
};
type BackgroundRectOptions = {
  attrs: Attrs;
};
type AxisOptions = {
  enabled?: boolean;
  label?: LabelOptions;
  line?: LineOptions;
  tickInterval?: number;
};
type TextFormat = typeof formatLabel;
type PointsAndFrame = ReturnType<typeof calcPointsAndFrame>;
type Transformer = ReturnType<typeof getTransformer>;

const EMPTY_ATTRS: Attrs = {};
const EMPTY_OFFSET: { x?: number; y?: number } = {};

@customElement('nk-line-chart')
export class NkLineChartElement extends LitElement {
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
  @property({ type: Array })
  rows: Vector2d[];

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
  @property({ type: Object })
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
  @property({ type: String })
  origin: Origin = 'left-bottom';

  /**
   * Attributes for the background rect of the chart area
   */
  @property({ type: Object })
  backgroundRect: BackgroundRectOptions = {
    attrs: {
      fill: 'none',
      stroke: 'none'
    }
  };

  /**
   * Options for x-axis grid lines and labels
   */
  @property({ type: Object })
  xAxis: AxisOptions = {
    enabled: false,
    label: {
      offset: {
        x: -4,
        y: 5
      },
      text: {
        attrs: {
          fill: '#333',
          'text-anchor': 'end'
        }
      }
    },
    line: {
      attrs: {
        fill: 'none',
        stroke: '#e08080',
        'stroke-dasharray': '4,2',
        'stroke-width': 1
      }
    },
    tickInterval: 2
  };

  /**
   * X-axis range of chart area. If not specified, the range will be computed by data rows.
   * ```
   * min: X-axis value at the left (right if the origin is right) of chart area
   * max: X-axis value at the right (left if the origin is right) of chart area
   * ```
   */
  @property({ type: Object })
  xRange: Range = null;

  /**
   * Options for y-axis grid lines and labels
   */
  @property({ type: Object })
  yAxis: AxisOptions = {
    enabled: false,
    label: {
      offset: {
        x: 0,
        y: 15
      },
      text: {
        attrs: {
          fill: '#333',
          'text-Anchor': 'middle'
        }
      }
    },
    line: {
      attrs: {
        fill: 'none',
        stroke: '#e08080',
        'stroke-dasharray': '4,2',
        'stroke-width': 1
      }
    },
    tickInterval: 2
  };

  /**
   * Y-axis range of chart area. If not specified, the range will be computed by data rows.
   * ```
   * min: Y-axis value at the bottom (top if the origin is top) of chart area
   * max: Y-axis value at the top (bottom if the origin is top) of chart area
   * ```
   */
  @property({ type: Object })
  yRange: Range = null;

  /**
   * Options for data points.
   *
   * ```
   * enabled: If false, this option will be ignored.
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
  @property({ type: Object })
  point: PointOptions = {
    enabled: true,
    elements: [
      {
        name: 'circle',
        attrs: {
          fill: '#e08080',
          r: '3',
          stroke: 'none',
          'stroke-width': 2
        }
      }
    ]
  };

  /**
   * Options for labels at points
   * ```
   * enabled: whether show labels or not (boolean)
   * offset: offset from label ({x, y})
   * text.format: function for label formatter (function(row, index))
   * text.attrs: text attributes (object)
   * ```
   */
  @property({ type: Object })
  pointLabel: LabelOptions = {
    enabled: false,
    offset: {
      y: -10
    },
    text: {
      format: formatLabel,
      attrs: {
        fill: '#333',
        'text-anchor': 'middle'
      }
    }
  };

  /**
   * Attributes for polygonal lines
   */
  @property({ type: Object })
  line: LineOptions = {
    attrs: {
      fill: 'none',
      stroke: '#e08080',
      'stroke-width': 2
    }
  };

  static get styles() {
    return css`
      :host {
        display: block;
      }
      svg {
        width: 100%;
        height: 100%;
      }
    `;
  }

  render() {
    const chartArea = this.chartArea;
    if (!chartArea || !this.rows) {
      return svg``;
    }

    const origin = this.origin;
    const transformer = getTransformer(origin, chartArea);
    const pf = calcPointsAndFrame(
      this.rows,
      chartArea,
      this.xRange,
      this.yRange
    );
    const points = pf.points;
    const pointOpts = this.point;
    const xAxisOpts = this.xAxis;
    const yAxisOpts = this.yAxis;
    const lineAttrs = this.line?.attrs || EMPTY_ATTRS;
    const backgroundRectAttrs = this.backgroundRect?.attrs || EMPTY_ATTRS;

    return svg`
      <svg>
        <g class="g0">
          ${drawRect(chartArea, backgroundRectAttrs)}
          ${xAxisOpts?.enabled ? drawXAxis(transformer, xAxisOpts, pf) : svg``}
          ${yAxisOpts?.enabled ? drawYAxis(transformer, yAxisOpts, pf) : svg``}
          ${drawPath('data-line', transformer, points, lineAttrs)}
          <g class="point-group">
            ${
              pointOpts?.enabled
                ? drawPoints(transformer, pointOpts, points)
                : svg``
            }
          </g>
          <g class="point-label-group">
            ${drawLabels(transformer, this.pointLabel, points)}
          </g>
        </g>
      </svg>
    `;
  }
}

function drawRect(area: ChartArea, attrs: Attrs) {
  return svg`<rect class="background"
    x="${area.left}"
    y="${area.top}"
    width="${area.width}"
    height="${area.height}"
    ...=${spread(attrs)}>
  </rect>`;
}

function drawXAxis(
  transformer: Transformer,
  axisOpts: AxisOptions,
  pf: PointsAndFrame
) {
  const interval = axisOpts.tickInterval;
  const start = Math.ceil(pf.vMinY / interval) * interval;
  const end = Math.floor(pf.vMaxY / interval) * interval;
  const lineAttrs = axisOpts.line?.attrs || EMPTY_ATTRS;
  const labelOpts = axisOpts.label;
  const labelOffset = labelOpts?.offset || EMPTY_OFFSET;
  const labelTextAttrs = labelOpts?.text?.attrs || EMPTY_ATTRS;
  const isLabelEnabled = labelOpts?.enabled;
  const formatter = labelOpts?.text?.format || formatAxisLabel;

  const tickItems: { cy: number; axisPoints: [MappedXY, MappedXY] }[] = [];
  for (let vy = start; vy <= end; vy += interval) {
    const cy = isFinite(pf.factorY)
      ? (vy - pf.vMinY) * pf.factorY + pf.top
      : pf.constantY;
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
    ] as [MappedXY, MappedXY];
    tickItems.push({ cy, axisPoints });
  }

  return svg`<g class="x-axis-group">
    <g class="x-axis-grid-line-group">
      ${tickItems.map(item =>
        drawPath('x-axis-grid-line', transformer, item.axisPoints, lineAttrs)
      )}
    </g>
    <g class="x-axis-grid-label-group">
      ${
        isLabelEnabled
          ? tickItems.map(item => {
              const point = item.axisPoints[0];
              const cp = transformer.convertPoint(point);
              const x =
                cp.x + (typeof labelOffset.x === 'number' ? labelOffset.x : 0);
              const y =
                cp.y + (typeof labelOffset.y === 'number' ? labelOffset.y : 0);
              return svg`<text class="x-axis-grid-label" x=${x} y=${y} ...=${spread(
                labelTextAttrs
              )}>${formatter(point.vy)}</text>`;
            })
          : svg``
      }
    </g>
  </g>`;
}

function drawYAxis(
  transformer: Transformer,
  axisOpts: AxisOptions,
  pf: PointsAndFrame
) {
  const interval = axisOpts.tickInterval;
  const start = Math.ceil(pf.vMinX / interval) * interval;
  const end = Math.floor(pf.vMaxX / interval) * interval;
  const lineAttrs = axisOpts.line?.attrs || EMPTY_ATTRS;
  const labelOpts = axisOpts.label;
  const labelOffset = labelOpts?.offset || EMPTY_OFFSET;
  const labelTextAttrs = labelOpts?.text?.attrs || EMPTY_ATTRS;
  const isLabelEnabled = labelOpts?.enabled;
  const formatter = labelOpts?.text?.format || formatAxisLabel;

  const tickItems: { cx: number; axisPoints: [MappedXY, MappedXY] }[] = [];
  for (let vx = start; vx <= end; vx += interval) {
    const cx = isFinite(pf.factorX)
      ? (vx - pf.vMinX) * pf.factorX + pf.left
      : pf.constantX;
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
    ] as [MappedXY, MappedXY];
    tickItems.push({ cx, axisPoints });
  }

  return svg`<g class="y-axis-group">
    <g class="y-axis-grid-line-group">
      ${tickItems.map(item =>
        drawPath('y-axis-grid-line', transformer, item.axisPoints, lineAttrs)
      )}
    </g>
    <g class="y-axis-grid-label-group">
      ${
        isLabelEnabled
          ? tickItems.map(item => {
              const point = item.axisPoints[0];
              const cp = transformer.convertPoint(point);
              const x =
                cp.x + (typeof labelOffset.x === 'number' ? labelOffset.x : 0);
              const y =
                cp.y + (typeof labelOffset.y === 'number' ? labelOffset.y : 0);
              return svg`<text class="y-axis-grid-label" x=${x} y=${y} ...=${spread(
                labelTextAttrs
              )}>${formatter(point.vx)}</text>`;
            })
          : svg``
      }
    </g>
  </g>`;
}

function drawPath(
  className: string,
  transformer: Transformer,
  points: VectorXY[],
  attrs: Attrs
) {
  if (!(points.length > 0)) {
    return svg``;
  }
  const { x, y } = transformer.convertPoint(points[0]);
  return svg`
    <path class="${className}"
      d="${pointsToMoves(points).reduce((memo, vector) => {
        vector = transformer.convertVector(vector);
        return memo + 'l' + vector.x + ',' + vector.y;
      }, 'M' + x + ',' + y)}"
      ...=${spread(attrs)}>
    </path>
  `;
}

function drawPoints(
  transformer: Transformer,
  pointOpts: PointOptions,
  points: MappedXY[]
) {
  const pointElements = pointOpts.elements;
  return svg`${points.map((p, i) => {
    const elements =
      typeof pointElements === 'function' ? pointElements(p, i) : pointElements;
    const cp = transformer.convertPoint(p);
    return svg`<g class="point">${elements.map(
      e =>
        svg`${
          e.name === 'circle'
            ? svg`<circle
          cx="${cp.x}"
          cy="${cp.y}"
          ...="${spread(e.attrs)}"></circle>`
            : svg``
        }`
    )}</g>`;
  })}`;
}

function drawLabels(
  transformer: Transformer,
  pointLabel: LabelOptions,
  points: MappedXY[]
) {
  const offset = pointLabel.offset || EMPTY_OFFSET;
  const attrs = pointLabel?.text?.attrs || EMPTY_ATTRS;
  const formatter = pointLabel?.text?.format || formatLabel;
  return svg`${
    pointLabel && pointLabel.enabled
      ? svg`${points.map((p, i) => {
          const point = transformer.convertPoint(p);
          const row = [p.vx, p.vy] as [number, number];
          const x =
            point.x + (typeof offset.x === 'number' ? offset.x : 0) + '';
          const y =
            point.y + (typeof offset.y === 'number' ? offset.y : -10) + '';
          return svg`<text class="point-label" x=${x} y=${y} ...=${spread(
            attrs
          )}>${formatter(row, i)}</text>`;
        })}`
      : svg``
  }`;
}

function calcPointsAndFrame(
  rows: Vector2d[],
  chartArea: ChartArea,
  xRange: Range,
  yRange: Range
) {
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

  rows.forEach(function (r) {
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
    vMinX = typeof xRange.min === 'number' ? xRange.min : vMinX;
    vMaxX = typeof xRange.max === 'number' ? xRange.max : vMaxX;
  }
  if (yRange) {
    vMinY = typeof yRange.min === 'number' ? yRange.min : vMinY;
    vMaxY = typeof yRange.max === 'number' ? yRange.max : vMaxY;
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
    points: rows.map(function (r) {
      return {
        vx: r[0],
        vy: r[1],
        x: isFinite(factorX) ? (r[0] - vMinX) * factorX + left : constantX,
        y: isFinite(factorY) ? (r[1] - vMinY) * factorY + top : constantY
      };
    }) as MappedXY[],
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
  let transformer: [
    (point: VectorXY) => VectorXY,
    (vector: VectorXY) => VectorXY
  ];

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
      transformer = [(point: VectorXY) => point, (vector: VectorXY) => vector];
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
  points.forEach(function (p) {
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
