import { expect, fixture, nextFrame } from '@open-wc/testing';
import './nk-line-chart.js';
import { NkLineChartElement } from './nk-line-chart.js';

describe('nk-line-chart', () => {
  let chart: NkLineChartElement;
  let container: ShadowRoot;

  beforeEach(async () => {
    chart = await fixture('<nk-line-chart></nk-line-chart>');
    chart.style.width = '200px';
    chart.style.height = '100px';
    container = chart.shadowRoot;
  });

  describe('svg', () => {
    it('should be created if chartArea and rows are specified', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        width: 200,
        height: 100
      };
      expect(container.querySelector('svg')).to.be.null;
      await nextFrame();
      expect(container.querySelector('svg')).to.be.ok;
    });
  });

  describe('automatic axis range', () => {
    it('Points just fit in the chart area when top and left are not specified', async () => {
      chart.rows = [
        [0, 0],
        [1, 1],
        [2, 2]
      ];
      chart.chartArea = {
        width: 200,
        height: 100
      };
      chart.origin = 'left-top';
      await nextFrame();
      const svg = container.children[0];
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      const [c0, c1, c2] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('0');
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('100');
    });

    it('Points just fit in the chart area when the minimums of x and y are not 0', async () => {
      chart.rows = [
        [-1, -1],
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        width: 200,
        height: 100
      };
      chart.origin = 'left-top';
      await nextFrame();
      const svg = container.children[0];
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      const [c0, c1, c2] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('0');
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('100');
    });

    it('Points just fit in the chart area even when top and left are not 0', async () => {
      chart.rows = [
        [0, 0],
        [1, 1],
        [2, 2]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.origin = 'left-top';
      await nextFrame();
      const svg = container.children[0];
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      const [c0, c1, c2] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('10');
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      expect(c2.getAttribute('cx')).to.equal('190');
      expect(c2.getAttribute('cy')).to.equal('90');
    });
  });

  describe('axis', () => {
    it('X-axis range can be explicitly set', async () => {
      chart.rows = [
        [0, 0],
        [1, 1],
        [2, 2]
      ];
      chart.chartArea = {
        top: 0,
        left: 0,
        width: 200,
        height: 100
      };
      chart.origin = 'left-top';
      chart.xRange = {
        min: -1,
        max: 4
      };
      await nextFrame();
      const svg = container.children[0];
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      const [c0, c1, c2] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('40');
      expect(c0.getAttribute('cy')).to.equal('0');
      expect(c1.getAttribute('cx')).to.equal('80');
      expect(c1.getAttribute('cy')).to.equal('50');
      expect(c2.getAttribute('cx')).to.equal('120');
      expect(c2.getAttribute('cy')).to.equal('100');
    });

    it('Y-axis range can be explicitly set', async () => {
      chart.rows = [
        [0, 0],
        [1, 1],
        [2, 2]
      ];
      chart.chartArea = {
        top: 0,
        left: 0,
        width: 200,
        height: 100
      };
      chart.origin = 'left-top';
      chart.yRange = {
        min: -1,
        max: 4
      };
      await nextFrame();
      const svg = container.children[0];
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      const [c0, c1, c2] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('20');
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('40');
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('60');
    });
  });

  describe('rows', () => {
    it('The length of rows can be 0', async () => {
      chart.rows = [];
      chart.chartArea = {
        width: 200,
        height: 100
      };
      chart.origin = 'left-top';
      await nextFrame();
      const svg = container.children[0];
      expect(svg.tagName).to.equal('svg');
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(0);
    });

    it('A point will be located in the center when the lengh of rows is 1', async () => {
      chart.rows = [[0, 0]];
      chart.chartArea = {
        width: 200,
        height: 100
      };
      await nextFrame();
      const svg = container.children[0];
      expect(svg.tagName).to.equal('svg');
      const circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(1);
      const c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('100');
      expect(c0.getAttribute('cy')).to.equal('50');
    });
  });

  describe('origin', () => {
    it('The change of origin invokes the recalculation of transform', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      expect(chart.origin).to.equal('left-bottom');
      await nextFrame();
      let circles = getCircles(container);
      let [c0, c1] = Array.from(circles);
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('90');
      expect(c1.getAttribute('cx')).to.equal('190');
      expect(c1.getAttribute('cy')).to.equal('10');
      chart.origin = 'left-top';
      await nextFrame();
      circles = getCircles(container);
      c0 = circles[0];
      c1 = circles[1];
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('10');
      expect(c1.getAttribute('cx')).to.equal('190');
      expect(c1.getAttribute('cy')).to.equal('90');
      chart.origin = 'right-top';
      await nextFrame();
      circles = getCircles(container);
      c0 = circles[0];
      c1 = circles[1];
      expect(c0.getAttribute('cx')).to.equal('190');
      expect(c0.getAttribute('cy')).to.equal('10');
      expect(c1.getAttribute('cx')).to.equal('10');
      expect(c1.getAttribute('cy')).to.equal('90');
      chart.origin = 'right-bottom';
      await nextFrame();
      circles = getCircles(container);
      c0 = circles[0];
      c1 = circles[1];
      expect(c0.getAttribute('cx')).to.equal('190');
      expect(c0.getAttribute('cy')).to.equal('90');
      expect(c1.getAttribute('cx')).to.equal('10');
      expect(c1.getAttribute('cy')).to.equal('10');
      chart.origin = '';
      await nextFrame();
      circles = getCircles(container);
      c0 = circles[0];
      c1 = circles[1];
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('10');
      expect(c1.getAttribute('cx')).to.equal('190');
      expect(c1.getAttribute('cy')).to.equal('90');

      function getCircles(container: ShadowRoot) {
        const svg = container.children[0];
        expect(svg.tagName).to.equal('svg');
        const circles = svg.querySelectorAll('circle');
        expect(circles.length).to.equal(2);
        return circles;
      }
    });
  });

  describe('attrs', () => {
    it('The attrs of the background can be changed', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.backgroundRectAttrs = {
        fill: '#00f',
        'fill-opacity': 0.1,
        stroke: '#00f',
        'stroke-opacity': 0.3,
        'stroke-width': 5
      };
      await nextFrame();
      const svg = container.children[0];
      const rect = svg.querySelector('rect');
      expect(rect.getAttribute('fill')).to.equal('#00f');
      expect(rect.getAttribute('fill-opacity')).to.equal('0.1');
      expect(rect.getAttribute('stroke')).to.equal('#00f');
      expect(rect.getAttribute('stroke-opacity')).to.equal('0.3');
      expect(rect.getAttribute('stroke-width')).to.equal('5');
    });

    it('The attrs of points can be changed by point.elements (Array)', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.point = {
        enabled: true,
        elements: [
          {
            name: 'circle',
            attrs: {
              fill: '#fff',
              r: '6',
              stroke: '#e88',
              'stroke-width': 1.5
            }
          },
          {
            name: 'circle',
            attrs: {
              fill: '#e88',
              r: '3',
              stroke: 'none',
              'stroke-width': 0
            }
          }
        ]
      };
      await nextFrame();
      const svg = container.children[0];
      const points = svg.querySelectorAll('.point');
      expect(points.length).to.equal(2);
      points.forEach(function (p) {
        const circles = p.querySelectorAll('circle');
        expect(circles.length).to.equal(2);
        const [c0, c1] = Array.from(circles);
        expect(c0.getAttribute('fill')).to.equal('#fff');
        expect(c0.getAttribute('r')).to.equal('6');
        expect(c0.getAttribute('stroke')).to.equal('#e88');
        expect(c0.getAttribute('stroke-width')).to.equal('1.5');
        expect(c1.getAttribute('fill')).to.equal('#e88');
        expect(c1.getAttribute('r')).to.equal('3');
        expect(c1.getAttribute('stroke')).to.equal('none');
        expect(c1.getAttribute('stroke-width')).to.equal('0');
      });
    });

    it('The attrs of points can be changed by point.elements (Function)', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.point = {
        enabled: true,
        elements: (p, i) => {
          if (i === 0) {
            return [
              {
                name: 'circle',
                attrs: {
                  fill: '#f00',
                  r: '3',
                  stroke: 'none',
                  'stroke-width': 0
                }
              }
            ];
          } else {
            return [
              {
                name: 'circle',
                attrs: {
                  fill: '#00f',
                  r: '3',
                  stroke: 'none',
                  'stroke-width': 0
                }
              }
            ];
          }
        }
      };
      await nextFrame();
      const svg = container.children[0];
      const points = svg.querySelectorAll('.point');
      expect(points.length).to.equal(2);
      points.forEach(function (p, i) {
        const circles = p.querySelectorAll('circle');
        expect(circles.length).to.equal(1);
        const c0 = circles[0];
        expect(c0.getAttribute('fill')).to.equal(i === 0 ? '#f00' : '#00f');
        expect(c0.getAttribute('r')).to.equal('3');
        expect(c0.getAttribute('stroke')).to.equal('none');
        expect(c0.getAttribute('stroke-width')).to.equal('0');
      });
    });

    it('The attrs of a polygonal line can be changed', async () => {
      chart.rows = [
        [0, 0],
        [1, 1]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.pathAttrs = {
        fill: 'none',
        'fill-opacity': 1,
        stroke: '#0f0',
        'stroke-width': 5
      };
      await nextFrame();
      const svg = container.children[0];
      const path = svg.querySelector('path');
      expect(path.getAttribute('fill')).to.equal('none');
      expect(path.getAttribute('fill-opacity')).to.equal('1');
      expect(path.getAttribute('stroke')).to.equal('#0f0');
      expect(path.getAttribute('stroke-width')).to.equal('5');
    });
  });

  describe('label', () => {
    it('The label at point can be enabled', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.pointLabel.enabled = true;
      await nextFrame();
      const svg = container.children[0];
      const texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].textContent).to.equal('[1,2]');
      expect(texts[1].textContent).to.equal('[3,4]');
    });

    it('The offset of label at point can be changed', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.origin = 'left-bottom';
      chart.pointLabel.enabled = true;
      chart.pointLabel.offset = {
        x: 1,
        y: 1
      };
      await nextFrame();
      const svg = container.children[0];
      const texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].getAttribute('x')).to.equal('11');
      expect(texts[0].getAttribute('y')).to.equal('91');
      expect(texts[1].getAttribute('x')).to.equal('191');
      expect(texts[1].getAttribute('y')).to.equal('11');
    });

    it('The text formater of label at point can be changed', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.pointLabel.enabled = true;
      chart.pointLabel.text.format = function (row, index) {
        return '[' + index + ',' + row + ']';
      };
      await nextFrame();
      const svg = container.children[0];
      const texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].textContent).to.equal('[0,1,2]');
      expect(texts[1].textContent).to.equal('[1,3,4]');
    });

    it('The text attrs of label at point can be changed', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.pointLabel.enabled = true;
      chart.pointLabel.text.attrs = {
        fill: 'blue'
      };
      await nextFrame();
      const svg = container.children[0];
      const pointLabelGroup = svg.querySelector('.point-label-group');
      const texts = pointLabelGroup.querySelectorAll('.point-label');
      expect(texts.length).to.equal(2);
      expect(texts[0].getAttribute('fill')).to.equal('blue');
      expect(texts[1].getAttribute('fill')).to.equal('blue');
    });
  });

  describe('grid lines', () => {
    it('X-axis grid lines are disabled by default', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.x-axis-group');
      expect(axisGroup).to.not.be.ok;
    });

    it('Y-axis grid lines are disabled by default', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.y-axis-group');
      expect(axisGroup).to.not.be.ok;
    });

    it('X-axis grid lines can be enabled', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.xAxis.enabled = true;
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.x-axis-group');
      expect(axisGroup).to.be.ok;
    });

    it('Y-axis grid lines can be enabled', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.yAxis.enabled = true;
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.y-axis-group');
      expect(axisGroup).to.be.ok;
    });

    it('X-axis options can be null', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.xAxis = null;
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.x-axis-group');
      expect(axisGroup).to.be.null;
    });

    it('Y-axis options can be null', async () => {
      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.yAxis = null;
      await nextFrame();
      const svg = container.children[0];
      const axisGroup = svg.querySelector('.y-axis-group');
      expect(axisGroup).to.be.null;
    });

    it('The attrs of x-axis grid can be customized', async () => {
      const AXIS_GROUP = '.x-axis-group';
      const GRID_LINE_GROUP = '.x-axis-grid-line-group';
      const GRID_LINE = '.x-axis-grid-line';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            fill: 'none',
            stroke: '#80e080',
            'stroke-dasharray': '4,2',
            'stroke-width': 1
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      const svg = container.children[0];
      const xAxis = svg.querySelector(AXIS_GROUP);
      const gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      const gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      const line = gridLines[0];
      expect(line.getAttribute('fill')).to.equal('none');
      expect(line.getAttribute('stroke')).to.equal('#80e080');
      expect(line.getAttribute('stroke-dasharray')).to.equal('4,2');
      expect(line.getAttribute('stroke-width')).to.equal('1');
    });

    it('The attrs of y-axis grid can be customized', async () => {
      const AXIS_GROUP = '.y-axis-group';
      const GRID_LINE_GROUP = '.y-axis-grid-line-group';
      const GRID_LINE = '.y-axis-grid-line';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.yAxis = {
        enabled: true,
        line: {
          attrs: {
            fill: 'none',
            stroke: '#80e080',
            'stroke-dasharray': '4,2',
            'stroke-width': 1
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      const svg = container.children[0];
      const yAxis = svg.querySelector(AXIS_GROUP);
      const gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      const gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      const line = gridLines[0];
      expect(line.getAttribute('fill')).to.equal('none');
      expect(line.getAttribute('stroke')).to.equal('#80e080');
      expect(line.getAttribute('stroke-dasharray')).to.equal('4,2');
      expect(line.getAttribute('stroke-width')).to.equal('1');
    });

    it('The label at x-axis can be enabled', async () => {
      const AXIS_GROUP = '.x-axis-group';
      const GRID_LABEL_GROUP = '.x-axis-grid-label-group';
      const GRID_LABEL = '.x-axis-grid-label';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.xAxis = {
        enabled: true,
        label: {
          enabled: true,
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
            stroke: '#e08080'
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      const svg = container.children[0];
      const xAxis = svg.querySelector(AXIS_GROUP);
      const gridLabelGroup = xAxis.querySelector(GRID_LABEL_GROUP);
      const gridLabels = Array.from(
        gridLabelGroup.querySelectorAll(GRID_LABEL)
      );
      const label = gridLabels[0];
      expect(label.getAttribute('fill')).to.equal('#333');
      expect(label.getAttribute('text-anchor')).to.equal('end');
      expect(label.textContent).to.equal('2');
    });

    it('The label at y-axis can be enabled', async () => {
      const AXIS_GROUP = '.y-axis-group';
      const GRID_LABEL_GROUP = '.y-axis-grid-label-group';
      const GRID_LABEL = '.y-axis-grid-label';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.yAxis = {
        enabled: true,
        label: {
          enabled: true,
          offset: {
            x: 0,
            y: 15
          },
          text: {
            attrs: {
              fill: '#333',
              'text-anchor': 'middle'
            }
          }
        },
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      const svg = container.children[0];
      const yAxis = svg.querySelector(AXIS_GROUP);
      const gridLabelGroup = yAxis.querySelector(GRID_LABEL_GROUP);
      const gridLabels = gridLabelGroup.querySelectorAll(GRID_LABEL);
      const label = gridLabels[0];
      expect(label.getAttribute('fill')).to.equal('#333');
      expect(label.getAttribute('text-anchor')).to.equal('middle');
      expect(label.textContent).to.equal('2');
    });

    it('Tick interval of x-axis grid lines can be changed', async () => {
      const AXIS_GROUP = '.x-axis-group';
      const GRID_LINE_GROUP = '.x-axis-grid-line-group';
      const GRID_LINE = '.x-axis-grid-line';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 1
      };
      await nextFrame();
      let svg = container.children[0];
      let xAxis = svg.querySelector(AXIS_GROUP);
      let gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      let gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(3); // 2, 3, 4
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      svg = container.children[0];
      xAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(2); // 2, 4
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 3
      };
      await nextFrame();
      svg = container.children[0];
      xAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(1); // 3
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 4
      };
      await nextFrame();
      svg = container.children[0];
      xAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(1); // 4
      chart.xAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 5
      };
      await nextFrame();
      svg = container.children[0];
      xAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(0); // none
    });

    it('Tick interval of y-axis grid lines can be changed', async () => {
      const AXIS_GROUP = '.y-axis-group';
      const GRID_LINE_GROUP = '.y-axis-grid-line-group';
      const GRID_LINE = '.y-axis-grid-line';

      chart.rows = [
        [1, 2],
        [3, 4]
      ];
      chart.chartArea = {
        top: 10,
        left: 10,
        width: 180,
        height: 80
      };
      chart.yAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 1
      };
      await nextFrame();
      let svg = container.children[0];
      let yAxis = svg.querySelector(AXIS_GROUP);
      let gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      let gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(3); // 1, 2, 3
      chart.yAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 2
      };
      await nextFrame();
      svg = container.children[0];
      yAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(1); // 2
      chart.yAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 3
      };
      await nextFrame();
      svg = container.children[0];
      yAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(1); // 3
      chart.yAxis = {
        enabled: true,
        line: {
          attrs: {
            stroke: '#e08080'
          }
        },
        tickInterval: 4
      };
      await nextFrame();
      svg = container.children[0];
      yAxis = svg.querySelector(AXIS_GROUP);
      gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(0);
    });
  });
});
