(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const E of document.querySelectorAll('link[rel="modulepreload"]'))e(E);new MutationObserver(E=>{for(const o of E)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function a(E){const o={};return E.integrity&&(o.integrity=E.integrity),E.referrerPolicy&&(o.referrerPolicy=E.referrerPolicy),E.crossOrigin==="use-credentials"?o.credentials="include":E.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(E){if(E.ep)return;E.ep=!0;const o=a(E);fetch(E.href,o)}})();const c=660;d3.select("#loader").style("display","block");const i=d3.select("#map").append("svg").attr("width","100%").attr("height","100%").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","0 0 660 700");function u(){const s=d3.select("#map").node().getBoundingClientRect(),t=s.width,a=s.height;console.log(s),i.attr("width",t).attr("height",a),N.scale(Math.min(t,a)*14.3).translate([t/3.5,a/2.2]),d=d3.geoPath().projection(N),i.selectAll("path").attr("d",d),i.select("rect").attr("width",t*.55).attr("transform",`translate(${t/4-t*.225}, 20)`),i.selectAll("text").attr("x",(e,E)=>E===0?t/4-t*.225:t/4+t*.225)}const N=d3.geoMercator().center([-72.7,44]).scale(1e4),d=d3.geoPath().projection(N),l=d3.scaleLinear().range(["white","#164734"]);var T=i.append("defs"),f=T.append("linearGradient").attr("id","linear-gradient").attr("transform","translate(50, 20)");f.attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%");f.append("stop").attr("offset","0%").attr("stop-color","white");f.append("stop").attr("offset","100%").attr("stop-color","#164734");i.append("rect").attr("width",300).attr("height",20).attr("transform",`translate(${c/3.5-100}, 20)`).style("fill","url(#linear-gradient)").attr("stroke","black");const r={RECEIVED:0,REQUESTED:0,ISSUED:0,PERCENTAGE:0,DEFECTIVE:0,UNDELIVERABLE:0,"UNKNOWN-NEVER RETURNED":0,"RECEIVED / CURED BALLOT":0,"RECEIVED AFTER ELECTION":0};let p=0,R=[];Promise.all([d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241014.csv")]).then(function([s,t]){d3.select("#loader").style("display","none");const a=C(t);Object.values(a).map(e=>e.RECEIVED),l.domain([0,p]),s.features.forEach(e=>{e.properties.TOWNNAME=="AVERILL"&&console.log(e);let E=e.properties.TOWNNAME.toUpperCase();e.properties.votes=a[E]||{RECEIVED:0,REQUESTED:0,ISSUED:0}}),i.selectAll("path").data(s.features).enter().append("path").attr("d",d).attr("class","county").attr("fill",e=>t.find(E=>E["Town Name"]==e.properties.TOWNNAME)||e.properties.TOWNNAME=="ESSEX"||e.properties.TOWNNAME=="ESSEX JUNCTION"?l(e.properties.votes.PERCENTAGE):l(0)).on("mouseover",function(e,E){d3.select(this).attr("stroke","#333").attr("stroke-width",4),D(e,E)}).on("mouseout",function(){d3.select(this).attr("stroke","#fff").attr("stroke-width",.5),I()}),i.append("text").attr("x",c/3.5-105).attr("y",60).text("0%").attr("fill","black"),i.append("text").attr("x",c/3.5+180).attr("y",60).text(Math.round(p)+"%").attr("fill","black")});function C(s){const t={};R=[...new Set(s.map(e=>e["Ballot Status"]))],console.log(R),s.forEach(e=>{let E=e["Town Name"];const o=e["Ballot Status"];e["Town Name"]=="ESSEX TOWN"?E="ESSEX":e["Town Name"]=="ESSEX JUNCTION CITY"&&(E="ESSEX JUNCTION"),t[E]||(t[E]={RECEIVED:0,REQUESTED:0,ISSUED:0,DEFECTIVE:0,UNDELIVERABLE:0,"UNKNOWN-NEVER RETURNED":0,"RECEIVED / CURED BALLOT":0,"RECEIVED AFTER ELECTION":0,PERCENTAGE:0}),r[e["Ballot Status"]]++,t[E][o]++}),console.log(r);for(const e in t){e=="SOUTH HERO"&&console.log(t[e]),t[e].DEFECTIVE||(t[e].DEFECTIVE=0),t[e].UNDELIVERABLE==null&&(t[e].UNDELIVERABLE=0),t[e]["UNKNOWN-NEVER RETURNED"]||(t[e]["UNKNOWN-NEVER RETURNED"]=0),t[e]["RECEIVED / CURED BALLOT"]||(t[e]["RECEIVED / CURED BALLOT"]=0),t[e]["RECEIVED AFTER ELECTION"]||(t[e]["RECEIVED AFTER ELECTION"]=0);const E=t[e].RECEIVED+t[e]["RECEIVED / CURED BALLOT"]+t[e]["RECEIVED AFTER ELECTION"],o=t[e].ISSUED+t[e].UNDELIVERABLE+t[e]["UNKNOWN-NEVER RETURNED"]+t[e].DEFECTIVE;(E==0||o==0)&&(t[e].PERCENTAGE=0),t[e].PERCENTAGE=E/(o+E)*100}for(const e in t)t[e].PERCENTAGE>p&&(p=t[e].PERCENTAGE);return console.log("max percentage",p),r.PERCENTAGE=(r.RECEIVED+r["RECEIVED / CURED BALLOT"])/(r.ISSUED+r.RECEIVED+r["RECEIVED / CURED BALLOT"]+r.DEFECTIVE+r.UNDELIVERABLE+r["UNKNOWN-NEVER RETURNED"]+r.REQUESTED)*100,r.PERCENTAGE=r.PERCENTAGE.toFixed(2),d3.select("#subtitle").text(`In total, ${r.PERCENTAGE}% of mail-in ballots have been returned and tallied as of Oct 14, 2024`),t}function D(s,t){const a=d3.select("#tooltip"),e=t.properties.votes.RECEIVED+t.properties.votes["RECEIVED / CURED BALLOT"]+t.properties.votes["RECEIVED AFTER ELECTION"],E=t.properties.votes.ISSUED+t.properties.votes.UNDELIVERABLE+t.properties.votes["UNKNOWN-NEVER RETURNED"]+t.properties.votes.DEFECTIVE,o=Math.round(e/(E+e)*100);console.log(t.properties);let n;o?n=`<span style='font-size: 21px'><b>${o}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots tallied</span><br><br>${e} ballots received out of ${E+e} sent out`:(console.log(t.properties),t.properties.votes.ISSUED>0?n=`<span style='font-size: 21px'><b>${o}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots tallied</span><br><br>${e} ballots received out of ${E+e} sent out`:n=`<b>${t.properties.TOWNNAME}</b> <br><br> No data available`),a.style("opacity",1).html(n).style("left",s.pageX+10+"px").style("top",s.pageY-28+"px")}function I(){d3.select("#tooltip").style("opacity",0)}u();window.addEventListener("resize",u);
