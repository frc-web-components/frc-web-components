/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=(o,r,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof r!="object"&&Object.defineProperty(o,r,t),t);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function a(o,r){return(t,u,l)=>{const c=s=>{var n;return((n=s.renderRoot)==null?void 0:n.querySelector(o))??null};if(r){const{get:s,set:n}=typeof u=="object"?t:l??(()=>{const e=Symbol();return{get(){return this[e]},set(h){this[e]=h}}})();return i(t,u,{get(){let e=s.call(this);return e===void 0&&(e=c(this),(e!==null||this.hasUpdated)&&n.call(this,e)),e}})}return i(t,u,{get(){return c(this)}})}}export{a as h,i};
