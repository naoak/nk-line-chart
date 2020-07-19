/**
@license
Copyright 2016-2020, Naoaki Yamada
All rights reserved.
This source code is distributed under the MIT license.
*/
import { LitElement, svg, css, property, customElement } from 'lit-element';
import { spread } from '@open-wc/lit-helpers';
import { merge } from 'lodash-es';

export type Attrs = { [key in string]: number | string };

export type ChartArea = {
  top?: number;
  left?: number;
  width: number;
  height: number;
};

export type Origin =
  | 'left-bottom'
  | 'left-top'
  | 'right-top'
  | 'right-bottom'
  | '';

export type Range = { min: number; max: number };
export type Vector2d = [number, number];
export type VectorXY = { x: number; y: number };
export type MappedXY = { x: number; y: number; vx: number; vy: number };

export type LabelOptions = {
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

export type PointOptions = {
  enabled?: boolean;
  elements:
    | { name?: string; attrs: Attrs }[]
    | ((p: MappedXY, i: number) => { name?: string; attrs: Attrs }[]);
};

export type LineOptions = {
  attrs: Attrs;
};

export type BackgroundRectOptions = {
  attrs: Attrs;
};

export type AxisOptions = {
  enabled?: boolean;
  label?: LabelOptions;
  line?: LineOptions;
  tickInterval?: number;
};

export type OneSeriesOptions = {
  point?: PointOptions;
  pointLabel?: LabelOptions;
  line?: LineOptions;
};

export type PlotOptions = {
  common: OneSeriesOptions;
  series: OneSeriesOptions[];
} & OneSeriesOptions;

export type TextFormat = typeof formatLabel;

type PointsAndFrame = ReturnType<typeof calcPointsAndFrame>;
type Transformer = ReturnType<typeof getTransformer>;

const EMPTY_ATTRS: Attrs = {};
const EMPTY_OFFSET: { x?: number; y?: number } = {};

@customElement('nk-line-chart')
export class NkLineChartElement extends LitElement {
  /**
   * Data for lines
   * ```
   * (ex)
   * [
   *   [[0, 0], [1, 1], ...],
   *   [[-1, -1], [2, 2], ...]
   * ]
   * ```
   */
  @property({ type: Array })
  data: Vector2d[][];

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
   * X-axis range of chart area. If not specified, the range will be computed by data.
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
   * Y-axis range of chart area. If not specified, the range will be computed by data.
   * ```
   * min: Y-axis value at the bottom (top if the origin is top) of chart area
   * max: Y-axis value at the top (bottom if the origin is top) of chart area
   * ```
   */
  @property({ type: Object })
  yRange: Range = null;

  /**
   * Common point options
   */
  @property({ type: Object })
  point: PointOptions = {
    enabled: true,
    elements: [
      {
        name: 'circle',
        attrs: {
          r: '3',
          stroke: 'none',
          'stroke-width': 2
        }
      }
    ]
  };

  /**
   * Common label options
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
   * Common line options
   */
  @property({ type: Object })
  line: LineOptions = {
    attrs: {
      fill: 'none',
      'stroke-width': 2
    }
  };

  /**
   * Each series options for point, pointLabel and line
   */
  @property({ type: Array })
  series: OneSeriesOptions[] = [
    {
      point: {
        elements: [
          {
            attrs: {
              fill: '#e08080'
            }
          }
        ]
      },
      line: {
        attrs: {
          stroke: '#e08080'
        }
      }
    },
    {
      point: {
        elements: [
          {
            attrs: {
              fill: '#80c080'
            }
          }
        ]
      },
      line: {
        attrs: {
          stroke: '#80c080'
        }
      }
    },
    {
      point: {
        elements: [
          {
            attrs: {
              fill: '#8080e0'
            }
          }
        ]
      },
      line: {
        attrs: {
          stroke: '#8080e0'
        }
      }
    }
  ];

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
    if (!chartArea || !this.data) {
      return svg``;
    }

    const origin = this.origin;
    const transformer = getTransformer(origin, chartArea);
    const pf = calcPointsAndFrame(
      this.data,
      chartArea,
      this.xRange,
      this.yRange
    );
    const pointsList = pf.pointsList;
    const xAxisOpts = this.xAxis;
    const yAxisOpts = this.yAxis;
    const backgroundRectAttrs = this.backgroundRect?.attrs || EMPTY_ATTRS;
    const commonOpts = {
      point: this.point,
      pointLabel: this.pointLabel,
      line: this.line
    };

    return svg`
      <svg>
        <g class="g0">
          ${drawRect(chartArea, backgroundRectAttrs)}
          ${xAxisOpts?.enabled ? drawXAxis(transformer, xAxisOpts, pf) : svg``}
          ${yAxisOpts?.enabled ? drawYAxis(transformer, yAxisOpts, pf) : svg``}
          <g class="series-group">
            ${pointsList.map((points, i) => {
              const seriesOpts = getSeriesOptions(commonOpts, this.series, i);
              const lineAttrs = seriesOpts.line?.attrs || EMPTY_ATTRS;
              const pointOpts = seriesOpts.point;
              const pointLabel = seriesOpts.pointLabel;
              return svg`<g class="series" data-series-i=${i}>
                  ${drawPath('line', transformer, points, lineAttrs)}
                  <g class="point-group">
                    ${
                      pointOpts?.enabled
                        ? drawPoints(transformer, pointOpts, points)
                        : svg``
                    }
                  </g>
                  <g class="point-label-group">
                    ${drawLabels(transformer, pointLabel, points)}
                  </g>
                </g>
                `;
            })}
          </g>
        </g>
      </svg>
    `;
  }
}

function getSeriesOptions(
  commonOptions: OneSeriesOptions,
  seriesOptions: OneSeriesOptions[],
  i: number
) {
  const series =
    seriesOptions.length > 0 ? seriesOptions[i % seriesOptions.length] : {};
  return merge({}, commonOptions, series);
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
          !e.name || e.name === 'circle'
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
  data: Vector2d[][],
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

  data.forEach(row => {
    row.forEach(function (p) {
      if (p[0] < vMinX) {
        vMinX = p[0];
      }
      if (p[0] > vMaxX) {
        vMaxX = p[0];
      }
      if (p[1] < vMinY) {
        vMinY = p[1];
      }
      if (p[1] > vMaxY) {
        vMaxY = p[1];
      }
    });
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
    pointsList: data.map(points => {
      return points.map(p => {
        return {
          vx: p[0],
          vy: p[1],
          x: isFinite(factorX) ? (p[0] - vMinX) * factorX + left : constantX,
          y: isFinite(factorY) ? (p[1] - vMinY) * factorY + top : constantY
        } as MappedXY;
      });
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
