(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))e(r);new MutationObserver(r=>{for(const o of r)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&e(i)}).observe(document,{childList:!0,subtree:!0});function a(r){const o={};return r.integrity&&(o.integrity=r.integrity),r.referrerPolicy&&(o.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?o.credentials="include":r.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function e(r){if(r.ep)return;r.ep=!0;const o=a(r);fetch(r.href,o)}})();const E=660;d3.select("#loader").style("display","block");const n=d3.select("#map").append("svg").attr("width","100%").attr("height","100%").attr("preserveAspectRatio","xMinYMin meet").attr("viewBox","0 0 660 700");function h(){const s=d3.select("#map").node().getBoundingClientRect(),t=s.width,a=s.height;console.log(s),n.attr("width",t).attr("height",a),d.scale(Math.min(t,a)*14.3).translate([t/3,a/2.2]),f=d3.geoPath().projection(d),n.selectAll("path").attr("d",f),n.select("rect").attr("width",t*.45).attr("transform",`translate(${t/3-t*.225}, 20)`),n.selectAll("text").attr("x",(e,r)=>r===0?t/3-t*.225:t/3+t*.225)}const d=d3.geoMercator().center([-72.7,44]).scale(1e4),f=d3.geoPath().projection(d),c=d3.scaleLinear().range(["white","#164734"]);var N=n.append("defs"),u=N.append("linearGradient").attr("id","linear-gradient").attr("transform","translate(100, 20)");u.attr("x1","0%").attr("y1","0%").attr("x2","100%").attr("y2","0%");u.append("stop").attr("offset","0%").attr("stop-color","white");u.append("stop").attr("offset","100%").attr("stop-color","#164734");n.append("rect").attr("width",300).attr("height",20).attr("transform",`translate(${E/3-100}, 20)`).style("fill","url(#linear-gradient)").attr("stroke","black");const l={RECEIVED:0,REQUESTED:0,ISSUED:0,PERCENTAGE:0};let p=0;Promise.all([d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241010.csv")]).then(function([s,t]){d3.select("#loader").style("display","none");const a=m(t);Object.values(a).map(e=>e.RECEIVED),c.domain([0,p]),s.features.forEach(e=>{e.properties.TOWNNAME=="AVERILL"&&console.log(e);let r=e.properties.TOWNNAME.toUpperCase();e.properties.votes=a[r]||{RECEIVED:0,REQUESTED:0,ISSUED:0}}),n.selectAll("path").data(s.features).enter().append("path").attr("d",f).attr("class","county").attr("fill",e=>t.find(r=>r["Town Name"]==e.properties.TOWNNAME)||e.properties.TOWNNAME=="ESSEX"||e.properties.TOWNNAME=="ESSEX JUNCTION"?c(e.properties.votes.PERCENTAGE):c(0)).on("mouseover",function(e,r){d3.select(this).attr("stroke","#333").attr("stroke-width",4),S(e,r)}).on("mouseout",function(){d3.select(this).attr("stroke","#fff").attr("stroke-width",.5),g()}),n.append("text").attr("x",E/3-105).attr("y",60).text("0%").attr("fill","black"),n.append("text").attr("x",E/3+180).attr("y",60).text(Math.round(p)+"%").attr("fill","black")});function m(s){const t={};s.forEach(e=>{l[e["Ballot Status"]]++;let r=e["Town Name"];const o=e["Ballot Status"];e["Town Name"]=="ESSEX TOWN"?r="ESSEX":e["Town Name"]=="ESSEX JUNCTION CITY"&&(r="ESSEX JUNCTION"),r=="LEWIS"&&console.log("averill",e),t[r]||(t[r]={RECEIVED:0,REQUESTED:0,ISSUED:0}),t[r][o]++});for(const e in t){const r=t[e].RECEIVED,o=t[e].ISSUED;(r==0||o==0)&&(t[e].PERCENTAGE=0),t[e].PERCENTAGE=r/o*100}for(const e in t)t[e].PERCENTAGE>p&&(p=t[e].PERCENTAGE);return console.log("max percentage",p),l.PERCENTAGE=l.RECEIVED/l.ISSUED*100,l.PERCENTAGE=l.PERCENTAGE.toFixed(2),d3.select("#subtitle").text(`In total, ${l.PERCENTAGE}% of mail-in ballots have been returned and tallied as of Oct 10, 2024`),t}function S(s,t){const a=d3.select("#tooltip"),e=t.properties.votes.RECEIVED,r=t.properties.votes.ISSUED,o=Math.round(e/r*100);let i;o?i=`<span style='font-size: 21px'><b>${o}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots tallied</span><br><br>${t.properties.votes.RECEIVED} ballots received out of ${t.properties.votes.ISSUED} sent out`:(console.log(t.properties),t.properties.votes.ISSUED>0?i=`<span style='font-size: 21px'><b>${o}%</b> of <b>${t.properties.TOWNNAME}</b> mail-in ballots tallied</span><br><br>${t.properties.votes.RECEIVED} ballots received out of ${t.properties.votes.ISSUED} sent out`:i=`<b>${t.properties.TOWNNAME}</b> <br><br> No data available`),a.style("opacity",1).html(i).style("left",s.pageX+10+"px").style("top",s.pageY-28+"px")}function g(){d3.select("#tooltip").style("opacity",0)}h();window.addEventListener("resize",h);
