/*!
 * All material copyright ESRI, All Rights Reserved, unless otherwise specified.
 * See https://github.com/Esri/calcite-design-system/blob/dev/LICENSE.md for details.
 * v2.13.0
 */
import{d as e,a as t}from"./p-cedaddf4.js";import{s as o}from"./p-3d516d20.js";import{i as s}from"./p-df6c8bd7.js";function n(){const{classList:o}=document.body;const s=window.matchMedia("(prefers-color-scheme: dark)").matches;const n=()=>o.contains(e)||o.contains(t)&&s?"dark":"light";const c=e=>document.body.dispatchEvent(new CustomEvent("calciteModeChange",{bubbles:true,detail:{mode:e}}));const r=e=>{d!==e&&c(e);d=e};let d=n();c(d);window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",(e=>r(e.matches?"dark":"light")));new MutationObserver((()=>r(n()))).observe(document.body,{attributes:true,attributeFilter:["class"]})}function c(){if(s()){if(document.readyState==="interactive"){n()}else{document.addEventListener("DOMContentLoaded",(()=>n()),{once:true})}}o()}const r=c;export{r as g};
//# sourceMappingURL=p-f0df884c.js.map