/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */
import{timeZones as t}from"./p-e0df7148.js";import{extractRegion as n}from"./p-7203665d.js";import"./p-953343b1.js";const o=t=>t.map((t=>{const{label:o}=t;const e=n(o);return{...t,continent:e}}));async function e(){const n=[];const e=t.map((t=>({label:t})));const c=o(e);for(const t of c){const{label:o,continent:e}=t;if(t.visited){continue}t.visited=true;const s={label:e,tzs:[{label:o}]};for(const t of c.filter((t=>!t.visited))){const{label:n,continent:o}=t;if(e===o){const o={label:n};s.tzs.push(o);t.visited=true}}n.push(s)}return n.map((t=>{t.tzs=t.tzs.sort(((t,n)=>t.label.localeCompare(n.label)));return{label:t.label,tzs:t.tzs.map((t=>t.label))}})).sort(((t,n)=>t.label.localeCompare(n.label)))}export{e as groupByRegion};
//# sourceMappingURL=p-13b5b199.js.map