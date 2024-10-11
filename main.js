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
.attr("width", "100%")
.attr("height", "100%")
.attr("preserveAspectRatio", "xMinYMin meet")
.attr("viewBox", `0 0 660 700`);

function resizeMap() {
    // get the container dimensions of the parent node of #map
    const container = d3.select("#map").node().getBoundingClientRect();

    const width = container.width;
    const height = container.height;
    console.log(container)

    svg.attr("width", width)
       .attr("height", height);

    // Update projection
    projection.scale(Math.min(width, height) * 14.3)
              .translate([width / 3, height / 2.2]);

    // Update path generator
    path = d3.geoPath().projection(projection);

    // Update all paths
    svg.selectAll("path")
       .attr("d", path);

    // Update gradient rectangle
    svg.select("rect")
       .attr("width", width * 0.45)
       .attr("transform", `translate(${(width/3)-width*0.225}, 20)`);

    // Update gradient text positions
    svg.selectAll("text")
       .attr("x", (d, i) => i === 0 ? (width/3)-width*0.225 : (width/3)+width*0.225);
}

 // Define projection and path generator
 const projection = d3.geoMercator()
    .center([-72.7, 44])
    .scale(10000)

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

// create an object to store total vote data by Ballot Status
const allVotesByStatus = {
    RECEIVED: 0,
    REQUESTED: 0,
    ISSUED: 0,
    PERCENTAGE: 0
};

let maxPercentage = 0;

 // Load both the GeoJSON and CSV data
 Promise.all([
     d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),
     d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241010.csv") // Replace with the path to your CSV file
 ]).then(function([vermont, voteData]) {
    // hide the loading screen
    d3.select("#loader").style("display", "none");
    
     // Process vote data
     const votesByTown = processVoteData(voteData);
     

     // Set color scale domain based on total votes
     const totalVotes = Object.values(votesByTown).map(d => d.RECEIVED);

     // set it 0 to 1 for percentage
     color.domain([0, maxPercentage]);

     // Add vote counts to GeoJSON properties
     vermont.features.forEach(town => {
      if (town.properties.TOWNNAME == "AVERILL") {
            console.log(town);
        }

        
      let townName = town.properties.TOWNNAME.toUpperCase();

      town.properties.votes = votesByTown[townName] || { RECEIVED: 0, REQUESTED: 0, ISSUED: 0};
  });

     // Draw counties
     svg.selectAll("path")
         .data(vermont.features)
         .enter().append("path")
         .attr("d", path)
         .attr("class", "county")
         .attr("fill", d => {
            // check to see if the county is already in the object
            if (voteData.find(vote => vote["Town Name"] == d.properties.TOWNNAME)) {
                
                return color(d.properties.votes.PERCENTAGE);
            } else {
                if (d.properties.TOWNNAME == "ESSEX") {
                    return color(d.properties.votes.PERCENTAGE);
                } else if (d.properties.TOWNNAME == "ESSEX JUNCTION") {
                    return color(d.properties.votes.PERCENTAGE);
                }

                return color(0);
            } 

            //  return color(percentage);
         })
         .on("mouseover", function(event, d) {
             d3.select(this).attr("stroke", "#333").attr("stroke-width", 4);
             showTooltip(event, d);
         })
         .on("mouseout", function() {
             d3.select(this).attr("stroke", "#fff").attr("stroke-width", 0.5);
             hideTooltip();
         });
        //  console.log(allVotesByStatus);

     
         // add numbers to the gradient
        svg.append("text")
            .attr("x", (width/3)-105)
            .attr("y", 60)
            .text("0%")
            .attr("fill", "black");

        svg.append("text")
            .attr("x", (width/3)+180)
            .attr("y", 60)
            .text(Math.round(maxPercentage)+"%")
            .attr("fill", "black");

            
 });

 function processVoteData(voteData) {
    const votesByCounty = {};
    voteData.forEach(vote => {
        // add vote to total votes
        allVotesByStatus[vote["Ballot Status"]]++;

        let county = vote["Town Name"]; // Assuming 'county' is the column name in your CSV
        const status = vote["Ballot Status"];

        if (vote["Town Name"] == "ESSEX TOWN") {
            county = "ESSEX";
        } else if (vote["Town Name"] == "ESSEX JUNCTION CITY") {
            county = "ESSEX JUNCTION";
        }

        // check to see if the county is already in the object
        if (county == "LEWIS") {
            console.log('averill', vote)
        }
      
        if (!votesByCounty[county]) {
            votesByCounty[county] = { RECEIVED: 0, REQUESTED: 0, ISSUED: 0 };
        } 
        votesByCounty[county][status]++;
    });

    // calculate the percentage of votes received compared to votes issued
    for (const county in votesByCounty) {
        const received = votesByCounty[county].RECEIVED;
        const issued = votesByCounty[county].ISSUED;
        if (received == 0 || issued == 0) {
            votesByCounty[county].PERCENTAGE = 0;
            // console.log(received, issued, (received/issued), county)
        }
        votesByCounty[county].PERCENTAGE = (received / issued) * 100;
    }

    // fir all the counties, find the max percentage
    for (const county in votesByCounty) {
        if (votesByCounty[county].PERCENTAGE > maxPercentage) {
            maxPercentage = votesByCounty[county].PERCENTAGE;
        }
    }

    console.log('max percentage', maxPercentage);
    
    allVotesByStatus.PERCENTAGE = (allVotesByStatus.RECEIVED / allVotesByStatus.ISSUED) * 100;
    

    // round allVotesByStatus.PERCENTAGE to two decimal places
    allVotesByStatus.PERCENTAGE = allVotesByStatus.PERCENTAGE.toFixed(2);

    const dateStamp = "Oct 10, 2024"; // Replace with the date of your data

    // edit the text of the h3 tag with #subtitle
    d3.select("#subtitle").text(`In total, ${allVotesByStatus.PERCENTAGE}% of Vermonters have returned their ballots as of ${dateStamp}`);

    return votesByCounty;
 }

 function showTooltip(event, d) {
     const tooltip = d3.select("#tooltip");

    // calculate the percentage of votes received compared to votes issued
    const received = d.properties.votes.RECEIVED;
    const issued = d.properties.votes.ISSUED;
    const percentage = Math.round((received / issued) * 100);

    let textString;
    if (!percentage) {
        console.log(d.properties)
        if (d.properties.votes.ISSUED > 0) {
            // this is a town that has been issued ballots, but no one has returned them
            textString = `<span style='font-size: 21px'><b>${percentage}%</b> of <b>${d.properties.TOWNNAME}</b> has voted</span><br><br>${d.properties.votes.RECEIVED} ballots received out of ${d.properties.votes.ISSUED} sent out`
        } else {
            // this is a town that is showing all zeros for issued and received, some data discrepancy
            textString = `<b>${d.properties.TOWNNAME}</b> <br><br> No data available`
        }
    } else {
        textString = `<span style='font-size: 21px'><b>${percentage}%</b> of <b>${d.properties.TOWNNAME}</b> has voted</span><br><br>${d.properties.votes.RECEIVED} ballots received out of ${d.properties.votes.ISSUED} sent out`
    }

    //  console.log(d.properties)
     tooltip.style("opacity", 1)
         .html(textString)
         .style("left", (event.pageX + 10) + "px")
         .style("top", (event.pageY - 28) + "px");
 }

 function hideTooltip() {
     d3.select("#tooltip").style("opacity", 0);
 }

 // Initial call
resizeMap();

// Add event listener for window resize
window.addEventListener("resize", resizeMap);