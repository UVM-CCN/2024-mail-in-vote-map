(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))e(o);new MutationObserver(o=>{for(const E of o)if(E.type==="childList")for(const n of E.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function s(o){const E={};return o.integrity&&(E.integrity=o.integrity),o.referrerPolicy&&(E.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?E.credentials="include":o.crossOrigin==="anonymous"?E.credentials="omit":E.credentials="same-origin",E}function e(o){if(o.ep)return;o.ep=!0;const E=s(o);fetch(o.href,E)}})();const N=660;d3.select("#loader").style("display","block");const i=d3.select("#map").append("svg").attr("width","100%").attr("height","100%").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","0 0 660 700");function T(){const r=d3.select("#map").node().getBoundingClientRect();let t=r.width,s=r.height,e,o,E=15;console.log(r.width),r.width>700?(t=700,s=800,o=s/2.3,e=200):r.width>500&&r.width<700?(t=r.width,s=800,e=200,o=s/2.2,E=16):(t=r.width,s=700,e=t/1.7,o=s/1.5,E=35),i.attr("width",t).attr("height",s),d.scale(Math.min(t,s)*E).translate([e,o]),f=d3.geoPath().projection(d),i.selectAll("path").attr("d",f),i.select("rect").attr("width",t*.55).attr("transform",`translate(${t/4-t*.225}, 20)`),i.selectAll("text").attr("x",(n,C)=>C===0?t/4-t*.225:t/4+t*.225)}d3.selectAll("input[name='scale-type']").on("change",function(){this.value==="relative"?(p=c,l.domain([0,p])):(p=100,l.domain([0,p])),i.selectAll("path").attr("fill",t=>t.properties.votes.PERCENTAGE?l(t.properties.votes.PERCENTAGE):(console.log(t),l(0))),d3.select("#max-domain-label").text(Math.round(p)+"%")});const d=d3.geoMercator().center([-72.7,44]).scale(1e4),f=d3.geoPath().projection(d),l=d3.scaleLinear().range(["white","#164734"]);var D=i.append("defs"),R=D.append("linearGradient").attr("id","linear-gradient").attr("transform","translate(50, 20)");R.attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%");R.append("stop").attr("offset","0%").attr("stop-color","white");R.append("stop").attr("offset","100%").attr("stop-color","#164734");i.append("rect").attr("width",300).attr("height",20).attr("transform",`translate(${N/3.5-100}, 20)`).style("fill","url(#linear-gradient)").attr("stroke","black");const a={RECEIVED:0,REQUESTED:0,ISSUED:0,PERCENTAGE:0,DEFECTIVE:0,UNDELIVERABLE:0,"UNKNOWN-NEVER RETURNED":0,"RECEIVED / CURED BALLOT":0,"RECEIVED AFTER ELECTION":0};let c=0,p,u=[];Promise.all([d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241030.csv")]).then(function([r,t]){d3.select("#loader").style("display","none");const s=h(t);Object.values(s).map(e=>e.RECEIVED),p=c,l.domain([0,p]),r.features.forEach(e=>{e.properties.TOWNNAME=="AVERILL"&&console.log(e);let o=e.properties.TOWNNAME.toUpperCase();e.properties.votes=s[o]||{RECEIVED:0,REQUESTED:0,ISSUED:0}}),i.selectAll("path").data(r.features).enter().append("path").attr("d",f).attr("class","county").attr("fill",e=>t.find(o=>o["Town Name"]==e.properties.TOWNNAME)||e.properties.TOWNNAME=="ESSEX"||e.properties.TOWNNAME=="ESSEX JUNCTION"?l(e.properties.votes.PERCENTAGE):l(0)).on("mouseover",function(e,o){d3.select(this).attr("stroke","#333").attr("stroke-width",4),I(e,o)}).on("mouseout",function(){d3.select(this).attr("stroke","#fff").attr("stroke-width",.5),m()}),i.append("text").attr("x",N/3.5-105).attr("y",60).text("0%").attr("fill","black"),i.append("text").attr("x",N/3.5+180).attr("y",60).attr("id","max-domain-label").text(Math.round(p)+"%").attr("fill","black")});function h(r){const t={};u=[...new Set(r.map(e=>e["Ballot Status"]))],console.log(u),r.forEach(e=>{let o=e["Town Name"];const E=e["Ballot Status"];e["Town Name"]=="ESSEX TOWN"?o="ESSEX":e["Town Name"]=="ESSEX JUNCTION CITY"&&(o="ESSEX JUNCTION"),t[o]||(t[o]={RECEIVED:0,REQUESTED:0,ISSUED:0,DEFECTIVE:0,UNDELIVERABLE:0,"UNKNOWN-NEVER RETURNED":0,"RECEIVED / CURED BALLOT":0,"RECEIVED AFTER ELECTION":0,PERCENTAGE:0}),a[e["Ballot Status"]]++,t[o][E]++}),console.log(a);for(const e in t){e=="SOUTH HERO"&&console.log(t[e]),t[e].DEFECTIVE||(t[e].DEFECTIVE=0),t[e].UNDELIVERABLE==null&&(t[e].UNDELIVERABLE=0),t[e]["UNKNOWN-NEVER RETURNED"]||(t[e]["UNKNOWN-NEVER RETURNED"]=0),t[e]["RECEIVED / CURED BALLOT"]||(t[e]["RECEIVED / CURED BALLOT"]=0),t[e]["RECEIVED AFTER ELECTION"]||(t[e]["RECEIVED AFTER ELECTION"]=0);const o=t[e].RECEIVED+t[e]["RECEIVED / CURED BALLOT"]+t[e]["RECEIVED AFTER ELECTION"],E=t[e].ISSUED+t[e].UNDELIVERABLE+t[e]["UNKNOWN-NEVER RETURNED"]+t[e].DEFECTIVE;(o==0||E==0)&&(t[e].PERCENTAGE=0),t[e].PERCENTAGE=o/(E+o)*100}for(const e in t)t[e].PERCENTAGE>c&&(c=t[e].PERCENTAGE);return console.log("max percentage",c),a.PERCENTAGE=(a.RECEIVED+a["RECEIVED / CURED BALLOT"])/(a.ISSUED+a.RECEIVED+a["RECEIVED / CURED BALLOT"]+a.DEFECTIVE+a.UNDELIVERABLE+a["UNKNOWN-NEVER RETURNED"]+a.REQUESTED)*100,a.PERCENTAGE=a.PERCENTAGE.toFixed(2),d3.select("#subtitle").text(`In total, ${a.PERCENTAGE}% of mail-in ballots have been returned and accepted as of Oct 30, 2024`),t}function I(r,t){const s=d3.select("#tooltip"),e=t.properties.votes.RECEIVED+t.properties.votes["RECEIVED / CURED BALLOT"]+t.properties.votes["RECEIVED AFTER ELECTION"],o=t.properties.votes.ISSUED+t.properties.votes.UNDELIVERABLE+t.properties.votes["UNKNOWN-NEVER RETURNED"]+t.properties.votes.DEFECTIVE,E=Math.round(e/(o+e)*100);console.log(t.properties);let n;E?n=`<span style='font-size: 21px'><b>${E}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots returned</span><br><br>${e} ballots received out of ${o+e} sent out`:(console.log(t.properties),t.properties.votes.ISSUED>0?n=`<span style='font-size: 21px'><b>${E}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots returned</span><br><br>${e} ballots received out of ${o+e} sent out`:n=`<b>${t.properties.TOWNNAME}</b> <br><br> No data available`),s.style("opacity",1).html(n).style("left",r.pageX+10+"px").style("top",r.pageY-28+"px")}function m(){d3.select("#tooltip").style("opacity",0)}T();window.addEventListener("resize",T);