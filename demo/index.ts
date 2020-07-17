import '@polymer/polymer/lib/elements/dom-bind.js';
import '@polymer/iron-demo-helpers/demo-snippet.js';
import '@polymer/iron-demo-helpers/demo-pages-shared-styles.js';
import '../nk-line-chart.ts';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';

const template = html`
<custom-style>
  <style is="custom-style" include="demo-pages-shared-styles">
    nk-line-chart {
      width: 340px;
      height: 120px;
      border: solid 1px #ccc;
    }
  </style>
</custom-style>`;
(window as any)._template = template;
