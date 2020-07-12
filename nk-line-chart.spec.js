import { fixture, expect } from '@open-wc/testing';
import { createSandbox } from 'sinon';
import './nk-line-chart.js';

describe('nk-line-chart', function() {
  var chart;
  var sandbox;

  beforeEach(async () => {
    sandbox = createSandbox();
    chart = await fixture('<nk-line-chart></nk-line-chart>');
    chart.style.width = '200px';
    chart.style.height = '100px';
  });

  it('SVG tag will be created if rows and chartAreas are set', function(done) {
    var container = chart.$.container;
    var appendChild = sandbox.spy(container, 'appendChild');

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    expect(appendChild).not.to.be.called;
    chart.async(function() {
      expect(appendChild).to.be.calledOnce;
      expect(container.children.length).to.equal(1);
      expect(container.children[0].tagName).to.equal('svg');
      done();
    });
  });

  it('SVG tags never exist more than one', function(done) {
    var container = chart.$.container;
    var appendChild = sandbox.spy(container, 'appendChild');
    var removeChild = sandbox.spy(container, 'removeChild');

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    expect(appendChild).not.to.be.called;
    chart.async(function() {
      expect(appendChild).to.be.calledOnce;
      expect(removeChild).not.to.be.called;
      expect(container.children.length).to.equal(1);
      expect(container.children[0].tagName).to.equal('svg');
      chart.chartArea = {
        width: 100,
        height: 100
      };
      chart.async(function() {
        expect(appendChild).to.be.calledTwice;
        expect(removeChild).to.be.calledOnce;
        expect(container.children.length).to.equal(1);
        expect(container.children[0].tagName).to.equal('svg');
        done();
      });
    });
  });

  it('SVG tag will not be created if rows or chartArea is null', function(done) {
    var container = chart.$.container;
    var appendChild = sandbox.spy(container, 'appendChild');
    var removeChild = sandbox.spy(container, 'removeChild');

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    expect(appendChild).not.to.be.called;
    chart.async(function() {
      expect(appendChild).to.be.calledOnce;
      expect(removeChild).not.to.be.called;
      expect(container.children.length).to.equal(1);
      expect(container.children[0].tagName).to.equal('svg');
      chart.chartArea = null;
      chart.async(function() {
        expect(appendChild).to.be.calledOnce;
        expect(removeChild).to.be.calledOnce;
        expect(container.children.length).to.equal(0);
        chart.rows = null;
        chart.chartArea = {
          width: 200,
          height: 100
        };
        chart.async(function() {
          expect(appendChild).to.be.calledOnce;
          expect(removeChild).to.be.calledOnce;
          expect(container.children.length).to.equal(0);
          done();
        });
      });
    });
  });

  it('Automatic Axis Range: Points just fit in the chart area when top and left are not specified', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1], [2, 2]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    chart.origin = 'left-top';
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('0');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('100');
      done();
    });
  });

  it('Automatic Axis Range: Points just fit in the chart area when the minimums of x and y are not 0', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [-1, -1], [0, 0], [1, 1]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    chart.origin = 'left-top';
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('0');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('100');
      done();
    });
  });

  it('Automatic Axis Range: Points just fit in the chart area when top and left are 0', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1], [2, 2]
    ];
    chart.chartArea = {
      top: 0,
      left: 0,
      width: 200,
      height: 100
    };
    chart.origin = 'left-top';
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('0');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('100');
      done();
    });
  });

  it('Automatic Axis Range: Points just fit in the chart area even when top and left are not 0', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1], [2, 2]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.origin = 'left-top';
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('10');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('50');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('190');
      expect(c2.getAttribute('cy')).to.equal('90');
      done();
    });
  });

  it('X-axis range can be explicitly set', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1], [2, 2]
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
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('40');
      expect(c0.getAttribute('cy')).to.equal('0');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('80');
      expect(c1.getAttribute('cy')).to.equal('50');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('120');
      expect(c2.getAttribute('cy')).to.equal('100');
      done();
    });
  });

  it('Y-axis range can be explicitly set', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1], [2, 2]
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
    chart.async(function() {
      var svg = container.children[0];
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(3);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('0');
      expect(c0.getAttribute('cy')).to.equal('20');
      var c1 = circles[1];
      expect(c1.getAttribute('cx')).to.equal('100');
      expect(c1.getAttribute('cy')).to.equal('40');
      var c2 = circles[2];
      expect(c2.getAttribute('cx')).to.equal('200');
      expect(c2.getAttribute('cy')).to.equal('60');
      done();
    });
  });

  it('The length of rows can be 0', function(done) {
    var container = chart.$.container;

    chart.rows = [];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    chart.async(function() {
      var svg = container.children[0];
      expect(svg.tagName).to.equal('svg');
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(0);
      done();
    });
  });

  it('A point will be located in the center when the lengh of rows is 1', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0]
    ];
    chart.chartArea = {
      width: 200,
      height: 100
    };
    chart.async(function() {
      var svg = container.children[0];
      expect(svg.tagName).to.equal('svg');
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(1);
      var c0 = circles[0];
      expect(c0.getAttribute('cx')).to.equal('100');
      expect(c0.getAttribute('cy')).to.equal('50');
      done();
    });
  });

  it('The change of origin invokes the recalculation of transform', function(done) {
    var container = chart.$.container;

    chart.rows = [
      ['0', '0'], ['1', '1']
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    expect(chart.origin).to.equal('left-bottom');
    chart.async(function() {
      var circles = getCircles(container);
      var c0 = circles[0];
      var c1 = circles[1];
      expect(c0.getAttribute('cx')).to.equal('10');
      expect(c0.getAttribute('cy')).to.equal('90');
      expect(c1.getAttribute('cx')).to.equal('190');
      expect(c1.getAttribute('cy')).to.equal('10');
      chart.origin = 'left-top';
      chart.async(function() {
        var circles = getCircles(container);
        var c0 = circles[0];
        var c1 = circles[1];
        expect(c0.getAttribute('cx')).to.equal('10');
        expect(c0.getAttribute('cy')).to.equal('10');
        expect(c1.getAttribute('cx')).to.equal('190');
        expect(c1.getAttribute('cy')).to.equal('90');
        chart.origin = 'right-top';
        chart.async(function() {
          var circles = getCircles(container);
          var c0 = circles[0];
          var c1 = circles[1];
          expect(c0.getAttribute('cx')).to.equal('190');
          expect(c0.getAttribute('cy')).to.equal('10');
          expect(c1.getAttribute('cx')).to.equal('10');
          expect(c1.getAttribute('cy')).to.equal('90');
          chart.origin = 'right-bottom';
          chart.async(function() {
            var circles = getCircles(container);
            var c0 = circles[0];
            var c1 = circles[1];
            expect(c0.getAttribute('cx')).to.equal('190');
            expect(c0.getAttribute('cy')).to.equal('90');
            expect(c1.getAttribute('cx')).to.equal('10');
            expect(c1.getAttribute('cy')).to.equal('10');
            chart.origin = '';
            chart.async(function() {
              var circles = getCircles(container);
              var c0 = circles[0];
              var c1 = circles[1];
              expect(c0.getAttribute('cx')).to.equal('10');
              expect(c0.getAttribute('cy')).to.equal('10');
              expect(c1.getAttribute('cx')).to.equal('190');
              expect(c1.getAttribute('cy')).to.equal('90');
              done();
            });
          });
        });
      });
    });

    function getCircles(container) {
      var svg = container.children[0];
      expect(svg.tagName).to.equal('svg');
      var circles = svg.querySelectorAll('circle');
      expect(circles.length).to.equal(2);
      return circles;
    }
  });

  it('The style of the background can be changed', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.backgroundRectStyle = {
      fill: "#00f",
      fillOpacity: 0.1,
      stroke: "#00f",
      strokeOpacity: 0.3,
      strokeWidth: 5
    };
    chart.async(function() {
      var svg = container.children[0];
      var rect = svg.querySelector('rect');
      expect(rect.getAttribute('fill')).to.equal('#00f');
      expect(rect.getAttribute('fill-opacity')).to.equal('0.1');
      expect(rect.getAttribute('stroke')).to.equal('#00f');
      expect(rect.getAttribute('stroke-opacity')).to.equal('0.3');
      expect(rect.getAttribute('stroke-width')).to.equal('5');
      done();
    });
  });

  it('The style of points can be changed by point.elements (Array)', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.point = {
      enable: true,
      elements: [
        {
          type: 'circle',
          style: {
            fill: '#fff',
            r: '6',
            stroke: '#e88',
            strokeWidth: 1.5
          }
        },
        {
          type: 'circle',
          style: {
            fill: '#e88',
            r: '3',
            stroke: 'none',
            strokeWidth: 0
          }
        }
      ]
    };
    chart.async(function() {
      var svg = container.children[0];
      var points = svg.querySelectorAll('.nk-line-chart-point');
      expect(points.length).to.equal(2);
      points.forEach(function(p) {
        var circles = p.querySelectorAll('circle');
        expect(circles.length).to.equal(2);
        var c0 = circles[0];
        var c1 = circles[1];
        expect(c0.getAttribute('fill')).to.equal('#fff');
        expect(c0.getAttribute('r')).to.equal('6');
        expect(c0.getAttribute('stroke')).to.equal('#e88');
        expect(c0.getAttribute('stroke-width')).to.equal('1.5');
        expect(c1.getAttribute('fill')).to.equal('#e88');
        expect(c1.getAttribute('r')).to.equal('3');
        expect(c1.getAttribute('stroke')).to.equal('none');
        expect(c1.getAttribute('stroke-width')).to.equal('0');
      });
      done();
    });
  });

  it('The style of points can be changed by point.elements (Function)', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.point = {
      enable: true,
      elements: function(p, i) {
        if (i === 0) {
          return [{
            type: 'circle',
            style: {
              fill: '#f00',
              r: '3',
              stroke: 'none',
              strokeWidth: 0
            }
          }];
        }
        else {
          return [{
            type: 'circle',
            style: {
              fill: '#00f',
              r: '3',
              stroke: 'none',
              strokeWidth: 0
            }
          }];
        }
      }
    };
    chart.async(function() {
      var svg = container.children[0];
      var points = svg.querySelectorAll('.nk-line-chart-point');
      expect(points.length).to.equal(2);
      points.forEach(function(p, i) {
        var circles = p.querySelectorAll('circle');
        expect(circles.length).to.equal(1);
        var c0 = circles[0];
        expect(c0.getAttribute('fill')).to.equal(i === 0 ? '#f00' : '#00f');
        expect(c0.getAttribute('r')).to.equal('3');
        expect(c0.getAttribute('stroke')).to.equal('none');
        expect(c0.getAttribute('stroke-width')).to.equal('0');
      });
      done();
    });
  });

  it('The style of a polygonal line can be changed', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [0, 0], [1, 1]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.pathStyle = {
      fill: 'none',
      fillOpacity: '1',
      stroke: '#0f0',
      strokeWidth: '5'
    };
    chart.async(function() {
      var svg = container.children[0];
      var path = svg.querySelector('path');
      expect(path.getAttribute('fill')).to.equal('none');
      expect(path.getAttribute('fill-opacity')).to.equal('1');
      expect(path.getAttribute('stroke')).to.equal('#0f0');
      expect(path.getAttribute('stroke-width')).to.equal('5');
      done();
    });
  });

  it('The label at point can be enabled', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.pointLabel.enable = true;
    chart.async(function() {
      var svg = container.children[0];
      var texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].textContent).to.equal('[1,2]');
      expect(texts[1].textContent).to.equal('[3,4]');
      done();
    });
  });

  it('The offset of label at point can be changed', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.origin = 'left-bottom';
    chart.pointLabel.enable = true;
    chart.pointLabel.offset = {
      x: 1,
      y: 1
    };
    chart.async(function() {
      var svg = container.children[0];
      var texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].getAttribute('x')).to.equal('11');
      expect(texts[0].getAttribute('y')).to.equal('91');
      expect(texts[1].getAttribute('x')).to.equal('191');
      expect(texts[1].getAttribute('y')).to.equal('11');
      done();
    });
  });

  it('The text formater of label at point can be changed', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.pointLabel.enable = true;
    chart.pointLabel.textFormat = function(row, index) {
      return '[' + index + ',' + row + ']';
    };
    chart.async(function() {
      var svg = container.children[0];
      var texts = svg.querySelectorAll('text');
      expect(texts.length).to.equal(2);
      expect(texts[0].textContent).to.equal('[0,1,2]');
      expect(texts[1].textContent).to.equal('[1,3,4]');
      done();
    });
  });

  it('The text style of label at point can be changed', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.pointLabel.enable = true;
    chart.pointLabel.textStyle = {
      fill: 'blue'
    };
    chart.async(function() {
      var svg = container.children[0];
      var pointLabelGroup = svg.querySelector('.nk-line-chart-point-label-group');
      var texts = pointLabelGroup.querySelectorAll('.nk-line-chart-point-label');
      expect(texts.length).to.equal(2);
      expect(texts[0].getAttribute('fill')).to.equal('blue');
      expect(texts[1].getAttribute('fill')).to.equal('blue');
      done();
    });
  });

  it('X-axis grid lines are disabled by default', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.async(function() {
      var svg = container.children[0];
      var axisGroup = svg.querySelector('.nk-line-chart-x-axis-group');
      expect(axisGroup).to.not.be.ok;
      done();
    });
  });

  it('Y-axis grid lines are disabled by default', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.async(function() {
      var svg = container.children[0];
      var axisGroup = svg.querySelector('.nk-line-chart-y-axis-group');
      expect(axisGroup).to.not.be.ok;
      done();
    });
  });

  it('X-axis grid lines can be enabled', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.xAxis.enable = true;
    chart.async(function() {
      var svg = container.children[0];
      var axisGroup = svg.querySelector('.nk-line-chart-x-axis-group');
      expect(axisGroup).to.be.ok;
      done();
    });
  });

  it('Y-axis grid lines can be enabled', function(done) {
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.yAxis.enable = true;
    chart.async(function() {
      var svg = container.children[0];
      var axisGroup = svg.querySelector('.nk-line-chart-y-axis-group');
      expect(axisGroup).to.be.ok;
      done();
    });
  });

  it('The style of x-axis grid can be customized', function(done) {
    var AXIS_GROUP = '.nk-line-chart-x-axis-group';
    var GRID_LINE_GROUP = '.nk-line-chart-x-axis-grid-line-group';
    var GRID_LINE = '.nk-line-chart-x-axis-grid-line';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.xAxis = {
      enable: true,
      lineStyle: {
        fill: 'none',
        stroke: '#80e080',
        strokeDasharray: '4,2',
        strokeWidth: 1
      },
      tickInterval: 2
    };
    chart.async(function() {
      var svg = container.children[0];
      var xAxis = svg.querySelector(AXIS_GROUP);
      var gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      var gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      var line = gridLines[0];
      expect(line.getAttribute('fill')).to.equal('none');
      expect(line.getAttribute('stroke')).to.equal('#80e080');
      expect(line.getAttribute('stroke-dasharray')).to.equal('4,2');
      expect(line.getAttribute('stroke-width')).to.equal('1');
      done();
    });
  });

  it('The style of y-axis grid can be customized', function(done) {
    var AXIS_GROUP = '.nk-line-chart-y-axis-group';
    var GRID_LINE_GROUP = '.nk-line-chart-y-axis-grid-line-group';
    var GRID_LINE = '.nk-line-chart-y-axis-grid-line';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.yAxis = {
      enable: true,
      lineStyle: {
        fill: 'none',
        stroke: '#80e080',
        strokeDasharray: '4,2',
        strokeWidth: 1
      },
      tickInterval: 2
    };
    chart.async(function() {
      var svg = container.children[0];
      var yAxis = svg.querySelector(AXIS_GROUP);
      var gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      var gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      var line = gridLines[0];
      expect(line.getAttribute('fill')).to.equal('none');
      expect(line.getAttribute('stroke')).to.equal('#80e080');
      expect(line.getAttribute('stroke-dasharray')).to.equal('4,2');
      expect(line.getAttribute('stroke-width')).to.equal('1');
      done();
    });
  });

  it('The label at x-axis can be enabled', function(done) {
    var AXIS_GROUP = '.nk-line-chart-x-axis-group';
    var GRID_LABEL_GROUP = '.nk-line-chart-x-axis-grid-label-group';
    var GRID_LABEL = '.nk-line-chart-x-axis-grid-label';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.xAxis = {
      enable: true,
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
        stroke: '#e08080',
      },
      tickInterval: 2
    };
    chart.async(function() {
      var svg = container.children[0];
      var xAxis = svg.querySelector(AXIS_GROUP);
      var gridLabelGroup = xAxis.querySelector(GRID_LABEL_GROUP);
      var gridLabels = gridLabelGroup.querySelectorAll(GRID_LABEL);
      var label = gridLabels[0];
      expect(label.getAttribute('fill')).to.equal('#333');
      expect(label.getAttribute('text-anchor')).to.equal('end');
      expect(label.textContent).to.equal('2');
      done();
    });
  });

  it('The label at y-axis can be enabled', function(done) {
    var AXIS_GROUP = '.nk-line-chart-y-axis-group';
    var GRID_LABEL_GROUP = '.nk-line-chart-y-axis-grid-label-group';
    var GRID_LABEL = '.nk-line-chart-y-axis-grid-label';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.yAxis = {
      enable: true,
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
        stroke: '#e08080',
      },
      tickInterval: 2
    };
    chart.async(function() {
      var svg = container.children[0];
      var yAxis = svg.querySelector(AXIS_GROUP);
      var gridLabelGroup = yAxis.querySelector(GRID_LABEL_GROUP);
      var gridLabels = gridLabelGroup.querySelectorAll(GRID_LABEL);
      var label = gridLabels[0];
      expect(label.getAttribute('fill')).to.equal('#333');
      expect(label.getAttribute('text-anchor')).to.equal('middle');
      expect(label.textContent).to.equal('2');
      done();
    });
  });

  it('Tick interval of x-axis grid lines can be changed', function(done) {
    var AXIS_GROUP = '.nk-line-chart-x-axis-group';
    var GRID_LINE_GROUP = '.nk-line-chart-x-axis-grid-line-group';
    var GRID_LINE = '.nk-line-chart-x-axis-grid-line';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.xAxis = {
      enable: true,
      lineStyle: {
        stroke: '#e08080'
      },
      tickInterval: 1
    };
    chart.async(function() {
      var svg = container.children[0];
      var xAxis = svg.querySelector(AXIS_GROUP);
      var gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
      var gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(3); // 2, 3, 4
      chart.xAxis = {
        enable: true,
        lineStyle: {
          stroke: '#e08080'
        },
        tickInterval: 2
      };
      chart.async(function() {
        svg = container.children[0];
        xAxis = svg.querySelector(AXIS_GROUP);
        gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
        gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
        expect(gridLines.length).to.equal(2); // 2, 4
        chart.xAxis = {
          enable: true,
          lineStyle: {
            stroke: '#e08080'
          },
          tickInterval: 3
        };
        chart.async(function() {
          svg = container.children[0];
          xAxis = svg.querySelector(AXIS_GROUP);
          gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
          gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
          expect(gridLines.length).to.equal(1); // 3
          chart.xAxis = {
            enable: true,
            lineStyle: {
              stroke: '#e08080'
            },
            tickInterval: 4
          };
          chart.async(function() {
            svg = container.children[0];
            xAxis = svg.querySelector(AXIS_GROUP);
            gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
            gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
            expect(gridLines.length).to.equal(1); // 4
            chart.xAxis = {
              enable: true,
              lineStyle: {
                stroke: '#e08080'
              },
              tickInterval: 5
            };
            chart.async(function() {
              svg = container.children[0];
              xAxis = svg.querySelector(AXIS_GROUP);
              gridLineGroup = xAxis.querySelector(GRID_LINE_GROUP);
              gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
              expect(gridLines.length).to.equal(0); // none
              done();
            });
          });
        });
      });
    });
  });

  it('Tick interval of y-axis grid lines can be changed', function(done) {
    var AXIS_GROUP = '.nk-line-chart-y-axis-group';
    var GRID_LINE_GROUP = '.nk-line-chart-y-axis-grid-line-group';
    var GRID_LINE = '.nk-line-chart-y-axis-grid-line';
    var container = chart.$.container;

    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.yAxis = {
      enable: true,
      lineStyle: {
        stroke: '#e08080'
      },
      tickInterval: 1
    };
    chart.async(function() {
      var svg = container.children[0];
      var yAxis = svg.querySelector(AXIS_GROUP);
      var gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
      var gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
      expect(gridLines.length).to.equal(3); // 1, 2, 3
      chart.yAxis = {
        enable: true,
        lineStyle: {
          stroke: '#e08080'
        },
        tickInterval: 2
      };
      chart.async(function() {
        svg = container.children[0];
        yAxis = svg.querySelector(AXIS_GROUP);
        gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
        gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
        expect(gridLines.length).to.equal(1); // 2
        chart.yAxis = {
          enable: true,
          lineStyle: {
            stroke: '#e08080'
          },
          tickInterval: 3
        };
        chart.async(function() {
          svg = container.children[0];
          yAxis = svg.querySelector(AXIS_GROUP);
          gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
          gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
          expect(gridLines.length).to.equal(1); // 3
          chart.yAxis = {
            enable: true,
            lineStyle: {
              stroke: '#e08080'
            },
            tickInterval: 4
          };
          chart.async(function() {
            svg = container.children[0];
            yAxis = svg.querySelector(AXIS_GROUP);
            gridLineGroup = yAxis.querySelector(GRID_LINE_GROUP);
            gridLines = gridLineGroup.querySelectorAll(GRID_LINE);
            expect(gridLines.length).to.equal(0);
            done();
          });
        });
      });
    });
  });

  it('`x-axis` event has gridLines data', function(done) {
    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.xAxis = {
      enable: true,
      lineStyle: {
        stroke: '#e08080'
      },
      tickInterval: 1
    };
    chart.addEventListener('x-axis', function(e) {
      var gridLines = e.detail.gridLines;
      expect(gridLines).to.deep.equal([
        [{"px":10,"py":90,"vx":1,"vy":2,"x":10,"y":10},{"px":190,"py":90,"vx":3,"vy":2,"x":190,"y":10}],
        [{"px":10,"py":50,"vx":1,"vy":3,"x":10,"y":50},{"px":190,"py":50,"vx":3,"vy":3,"x":190,"y":50}],
        [{"px":10,"py":10,"vx":1,"vy":4,"x":10,"y":90},{"px":190,"py":10,"vx":3,"vy":4,"x":190,"y":90}]
      ]);
      done();
    });
  });

  it('`y-axis` event has gridLines data', function(done) {
    chart.rows = [
      [1, 2], [3, 4]
    ];
    chart.chartArea = {
      top: 10,
      left: 10,
      width: 180,
      height: 80
    };
    chart.yAxis = {
      enable: true,
      lineStyle: {
        stroke: '#e08080'
      },
      tickInterval: 1
    };
    chart.addEventListener('y-axis', function(e) {
      var gridLines = e.detail.gridLines;
      expect(gridLines).to.deep.equal([
        [{"px":10,"py":90,"vx":1,"vy":2,"x":10,"y":10},{"px":10,"py":10,"vx":1,"vy":4,"x":10,"y":90}],
        [{"px":100,"py":90,"vx":2,"vy":2,"x":100,"y":10},{"px":100,"py":10,"vx":2,"vy":4,"x":100,"y":90}],
        [{"px":190,"py":90,"vx":3,"vy":2,"x":190,"y":10},{"px":190,"py":10,"vx":3,"vy":4,"x":190,"y":90}]
      ]);
      done();
    });
  });
});
