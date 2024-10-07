/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */
import{f as n}from"./p-0a2f91d4.js";import{i as a}from"./p-df6c8bd7.js";const e=new WeakMap;const r=new WeakMap;function s(n){r.set(n,new Promise((a=>e.set(n,a))))}function t(n){e.get(n)()}function o(n){return r.get(n)}async function i(e){await o(e);if(!a()){return}n(e);return new Promise((n=>requestAnimationFrame((()=>n()))))}export{t as a,o as b,i as c,s};
//# sourceMappingURL=p-65e04a6e.js.map