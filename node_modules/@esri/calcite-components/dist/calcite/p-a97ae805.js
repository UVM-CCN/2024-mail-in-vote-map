/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */
import{h as t}from"./p-0a2f91d4.js";const o={arrow:"calcite-floating-ui-arrow",arrowStroke:"calcite-floating-ui-arrow__stroke"};const r={width:12,height:6,strokeWidth:1};const e=({floatingLayout:e,key:i,ref:a})=>{const{width:s,height:n,strokeWidth:h}=r;const c=s/2;const d=e==="vertical";const l="M0,0"+` H${s}`+` L${s-c},${n}`+` Q${c},${n} ${c},${n}`+" Z";return t("svg",{"aria-hidden":"true",class:o.arrow,height:s,key:i,ref:a,viewBox:`0 0 ${s} ${s+(!d?h:0)}`,width:s+(d?h:0)},h>0&&t("path",{class:o.arrowStroke,d:l,fill:"none","stroke-width":h+1}),t("path",{d:l,stroke:"none"}))};export{e as F};
//# sourceMappingURL=p-a97ae805.js.map