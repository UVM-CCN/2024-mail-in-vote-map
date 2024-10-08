// import d3
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

 // Set up dimensions
 const width = 660;
 const height = 700;

 // set the #loader div to show the loading screen
    d3.select("#loader").style("display", "block");

 // Create SVG
 const svg = d3.select("#map")
     .append("svg")
     .attr("width", width)
     .attr("height", height);

 // Define projection and path generator
 const projection = d3.geoMercator()
    .center([-72.7, 44])
    .scale(10000)
    .translate([width / 3, height / 2]);

 const path = d3.geoPath().projection(projection);

 // Create color scale (we'll set the domain later)
 const color = d3.scaleLinear()
     .range(["white", "#164734"]);

//Append a defs (for definition) element to your SVG
var defs = svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
var linearGradient = defs.append("linearGradient")
    .attr("id", "linear-gradient")
    .attr("transform", "translate(100, 20)");

//Horizontal gradient
linearGradient
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

//Set the color for the start (0%)
linearGradient.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "white"); //white

//Set the color for the end (100%)
linearGradient.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#164734"); //dark green

//Draw the rectangle and fill with gradient
svg.append("rect")
    .attr("width", 300)
    .attr("height", 20)
    .attr("transform", `translate(${(width/3)-100}, 20)`)
    .style("fill", "url(#linear-gradient)")
    .attr("stroke", "black");

// add numbers to the gradient
svg.append("text")
    .attr("x", (width/3)-100)
    .attr("y", 60)
    .text("0")
    .attr("fill", "black");

svg.append("text")
    .attr("x", (width/3)+180)
    .attr("y", 60)
    .text("3%")
    .attr("fill", "black");

// create an object to store total vote data by Ballot Status
const allVotesByStatus = {
    RECEIVED: 0,
    REQUESTED: 0,
    ISSUED: 0
};

 // Load both the GeoJSON and CSV data
 Promise.all([
     d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),
     d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241007.csv") // Replace with the path to your CSV file
 ]).then(function([vermont, voteData]) {
    // hide the loading screen
    d3.select("#loader").style("display", "none");
    
     // Process vote data
     const votesByTown = processVoteData(voteData);
     console.log(votesByTown); 
     // Set color scale domain based on total votes
     const totalVotes = Object.values(votesByTown).map(d => d.RECEIVED);
     color.domain([0, d3.max(totalVotes)]);

     // Add vote counts to GeoJSON properties
     vermont.features.forEach(town => {
      console.log(town.properties.TOWNNAME)
      const townName = town.properties.TOWNNAME.toUpperCase();
      town.properties.votes = votesByTown[townName] || { RECEIVED: 0, REQUESTED: 0, ISSUED: 0 };
  });

     // Draw counties
     svg.selectAll("path")
         .data(vermont.features)
         .enter().append("path")
         .attr("d", path)
         .attr("class", "county")
         .attr("fill", d => color(d.properties.votes.RECEIVED))
         .on("mouseover", function(event, d) {
             d3.select(this).attr("stroke", "#333").attr("stroke-width", 4);
             showTooltip(event, d);
         })
         .on("mouseout", function() {
             d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
             hideTooltip();
         });
         console.log(allVotesByStatus);

     // We don't need to draw a separate state outline now, as county borders will create the state shape
 });

 function processVoteData(voteData) {
    const votesByCounty = {};
    voteData.forEach(vote => {
        // add vote to total votes
        allVotesByStatus[vote["Ballot Status"]]++;

        const county = vote["Town Name"]; // Assuming 'county' is the column name in your CSV
        const status = vote["Ballot Status"];
        if (!votesByCounty[county]) {
            votesByCounty[county] = { RECEIVED: 0, REQUESTED: 0, ISSUED: 0 };
        }
        votesByCounty[county][status]++;
    });
    return votesByCounty;
 }

 function showTooltip(event, d) {
     const tooltip = d3.select("#tooltip");

    // calculate the percentage of votes received compared to votes issued
    const received = d.properties.votes.RECEIVED;
    const issued = d.properties.votes.ISSUED;
    const percentage = Math.round((received / issued) * 100);

     console.log(d.properties)
     tooltip.style("opacity", 1)
         .html(`<b>${d.properties.votes.RECEIVED} votes</b> received from <b>${d.properties.TOWNNAME}</b><br><br>${percentage}% of all ballots sent to this town`)
         .style("left", (event.pageX + 10) + "px")
         .style("top", (event.pageY - 28) + "px");
 }

 function hideTooltip() {
     d3.select("#tooltip").style("opacity", 0);
 }