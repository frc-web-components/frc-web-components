import{d as c,M as f}from"./index-bba36e28.js";import{u as m}from"./index-458ae73e.js";import"./iframe-6fed4a4b.js";import"../sb-preview/runtime.js";import"./index-bab9eea1.js";import"./index-11d98b33.js";import"./index-356e4a49.js";var d={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var g=c,u=Symbol.for("react.element"),h=Symbol.for("react.fragment"),b=Object.prototype.hasOwnProperty,k=g.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function x(t,e,p){var r,n={},s=null,a=null;p!==void 0&&(s=""+p),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(r in e)b.call(e,r)&&!y.hasOwnProperty(r)&&(n[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)n[r]===void 0&&(n[r]=e[r]);return{$$typeof:u,type:t,key:s,ref:a,props:n,_owner:k.current}}i.Fragment=h;i.jsx=x;i.jsxs=x;d.exports=i;var o=d.exports;function l(t){const e=Object.assign({h1:"h1",p:"p"},m(),t.components);return o.jsxs(o.Fragment,{children:[o.jsx(f,{title:"FRC/Introduction"}),`
`,o.jsx("style",{children:`
    .subheading {
      --mediumdark: '#999999';
      font-weight: 700;
      font-size: 13px;
      color: #999;
      letter-spacing: 6px;
      line-height: 24px;
      text-transform: uppercase;
      margin-bottom: 12px;
      margin-top: 40px;
    }

    .link-list {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      row-gap: 10px;
    }

    @media (min-width: 620px) {
      .link-list {
        row-gap: 20px;
        column-gap: 20px;
        grid-template-columns: 1fr 1fr;
      }
    }

    @media all and (-ms-high-contrast:none) {
    .link-list {
        display: -ms-grid;
        -ms-grid-columns: 1fr 1fr;
        -ms-grid-rows: 1fr 1fr;
      }
    }

    .link-item {
      display: block;
      padding: 20px;
      border: 1px solid #00000010;
      border-radius: 5px;
      transition: background 150ms ease-out, border 150ms ease-out, transform 150ms ease-out;
      color: #333333;
      display: flex;
      align-items: flex-start;
    }

    .link-item:hover {
      border-color: #1EA7FD50;
      transform: translate3d(0, -3px, 0);
      box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
    }

    .link-item:active {
      border-color: #1EA7FD;
      transform: translate3d(0, 0, 0);
    }

    .link-item strong {
      font-weight: 700;
      display: block;
      margin-bottom: 2px;
    }

    .link-item img {
      height: 40px;
      width: 40px;
      margin-right: 15px;
      flex: none;
    }

    .link-item span,
    .link-item p {
      margin: 0;
      font-size: 14px;
      line-height: 20px;
    }

    .tip {
      display: inline-block;
      border-radius: 1em;
      font-size: 11px;
      line-height: 12px;
      font-weight: 700;
      background: #E7FDD8;
      color: #66BF3C;
      padding: 4px 12px;
      margin-right: 10px;
      vertical-align: top;
    }

    .tip-wrapper {
      font-size: 13px;
      line-height: 20px;
      margin-top: 40px;
      margin-bottom: 40px;
    }

    .tip-wrapper code {
      font-size: 12px;
      display: inline-block;
    }
  `}),`
`,o.jsx(e.h1,{id:"welcome-to-frc-web-components",children:"Welcome to FRC Web Components"}),`
`,o.jsx(e.p,{children:"FRC Web Components (FWC) is a set of tools for helping FRC teams build web-based dashboards for their robots. This storybook page contains documentation and example usage for the various UI components."})]})}function E(t={}){const{wrapper:e}=Object.assign({},m(),t.components);return e?o.jsx(e,Object.assign({},t,{children:o.jsx(l,t)})):l(t)}export{E as default};
