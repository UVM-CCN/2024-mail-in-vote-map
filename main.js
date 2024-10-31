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

    let width = container.width;
    let height = container.height;

    let mapTranslateX;
    let mapTranslateY;

    let projectionScale = 15;
    console.log(container.width)

    if (container.width > 700) {
        width = 700;
        height = 800;

        mapTranslateY = height / 2.3;
        mapTranslateX = 200;
    } else if ((container.width > 500)&&(container.width < 700)) {
        width = container.width;
        height = 800;
        mapTranslateX = 200;
        mapTranslateY = height / 2.2;

        projectionScale = 16;

    } else {
        width = container.width;
        height = 700;
        mapTranslateX = width / 1.7;
        mapTranslateY = height / 1.5;

        projectionScale = 35;
    }

    svg.attr("width", width)
       .attr("height", height);

    // Update projection
    projection.scale(Math.min(width, height) * projectionScale)
              .translate([mapTranslateX, mapTranslateY]);

    // Update path generator
    path = d3.geoPath().projection(projection);

    // Update all paths
    svg.selectAll("path")
       .attr("d", path);

    // Update gradient rectangle
    svg.select("rect")
       .attr("width", width * 0.55)
       .attr("transform", `translate(${(width/4)-width*0.225}, 20)`);

    // Update gradient text positions
    svg.selectAll("text")
       .attr("x", (d, i) => i === 0 ? (width/4)-width*0.225 : (width/4)+width*0.225);
}

// event listener for radio buttons
d3.selectAll("input[name='scale-type']").on("change", function() {
    const value = this.value;

    if (value === "relative") {
        maxOfDomain = maxPercentage;
        color.domain([0, maxOfDomain]);
    } else {
        maxOfDomain = 100;
        color.domain([0, maxOfDomain]);
    }

    svg.selectAll("path")
       .attr("fill", d => {
           if (d.properties.votes.PERCENTAGE) {
               return color(d.properties.votes.PERCENTAGE);
           } else {
            console.log(d)
               return color(0);
           }
       });

       // update the max-domain-label with maxOfDomain
       d3.select("#max-domain-label").text(Math.round(maxOfDomain)+"%");
});

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
    .attr("transform", "translate(50, 20)");

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
    .attr("transform", `translate(${(width/3.5)-100}, 20)`)
    .style("fill", "url(#linear-gradient)")
    .attr("stroke", "black");

// create an object to store total vote data by Ballot Status
const allVotesByStatus = {
    RECEIVED: 0,
    REQUESTED: 0,
    ISSUED: 0,
    PERCENTAGE: 0,
    DEFECTIVE: 0,
    UNDELIVERABLE: 0,
    "UNKNOWN-NEVER RETURNED": 0,
    "RECEIVED / CURED BALLOT": 0,
    "RECEIVED AFTER ELECTION": 0
};

let maxPercentage = 0;
let maxOfDomain;

let allPossibleBallotStatuses = [];

 // Load both the GeoJSON and CSV data
 Promise.all([
     d3.json("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/FS_VCGI_OPENDATA_Boundary_BNDHASH_poly_towns_SP_v1_-4796836414587772833.geojson"),
     d3.csv("https://raw.githubusercontent.com/UVM-CCN/2024-mail-in-vote-map/refs/heads/main/external-data/filtered-20241031.csv") // Replace with the path to your CSV file
 ]).then(function([vermont, voteData]) {
    // hide the loading screen
    d3.select("#loader").style("display", "none");
    
     // Process vote data
     const votesByTown = processVoteData(voteData);

     // Set color scale domain based on total votes
     const totalVotes = Object.values(votesByTown).map(d => d.RECEIVED);

     // set the max domain to the max percentage
    maxOfDomain = maxPercentage;
     
     // set it 0 to 1 for percentage
     color.domain([0, maxOfDomain]);

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
            .attr("x", (width/3.5)-105)
            .attr("y", 60)
            .text("0%")
            .attr("fill", "black");

        svg.append("text")
            .attr("x", (width/3.5)+180)
            .attr("y", 60)
            .attr("id", "max-domain-label")
            .text(Math.round(maxOfDomain)+"%")
            .attr("fill", "black");

            
 });

 function processVoteData(voteData) {
    const votesByCounty = {};

    // get every unique string in the Ballot Status column
    allPossibleBallotStatuses = [...new Set(voteData.map(vote => vote["Ballot Status"]))];
    console.log(allPossibleBallotStatuses)
    voteData.forEach(vote => {

        let county = vote["Town Name"]; // Assuming 'county' is the column name in your CSV
        const status = vote["Ballot Status"];

        if (vote["Town Name"] == "ESSEX TOWN") {
            county = "ESSEX";
        } else if (vote["Town Name"] == "ESSEX JUNCTION CITY") {
            county = "ESSEX JUNCTION";
        }
      
        // if the county doesn't exist in the object, add it with zeros and all possible statuses
        if (!votesByCounty[county]) {
            votesByCounty[county] = { RECEIVED: 0, REQUESTED: 0, ISSUED: 0, DEFECTIVE: 0, UNDELIVERABLE: 0, "UNKNOWN-NEVER RETURNED": 0, "RECEIVED / CURED BALLOT": 0, "RECEIVED AFTER ELECTION": 0, PERCENTAGE: 0};
        } 

        
        // add vote to total votes
        allVotesByStatus[vote["Ballot Status"]]++;

        votesByCounty[county][status]++;
    });
    console.log(allVotesByStatus)
    

    // calculate the percentage of votes received compared to votes issued
    for (const county in votesByCounty) {
        if (county == "SOUTH HERO") {
            console.log(votesByCounty[county])
        }
        // add some conditionals to set NaN values to 0

        if (!votesByCounty[county].DEFECTIVE) {
            votesByCounty[county].DEFECTIVE = 0;
        }

        if (votesByCounty[county].UNDELIVERABLE == undefined) {
            votesByCounty[county].UNDELIVERABLE = 0;
        }

        if (!votesByCounty[county]["UNKNOWN-NEVER RETURNED"]) {
            votesByCounty[county]["UNKNOWN-NEVER RETURNED"] = 0;
        }

        if (!votesByCounty[county]["RECEIVED / CURED BALLOT"]) {
            votesByCounty[county]["RECEIVED / CURED BALLOT"] = 0;
        }

        if (!votesByCounty[county]["RECEIVED AFTER ELECTION"]) {
            votesByCounty[county]["RECEIVED AFTER ELECTION"] = 0;
        }


        // all received types
        const received = votesByCounty[county].RECEIVED+
        votesByCounty[county]["RECEIVED / CURED BALLOT"]+
        votesByCounty[county]["RECEIVED AFTER ELECTION"];
        
        // all issued types
        const issued = votesByCounty[county].ISSUED+
        votesByCounty[county]["UNDELIVERABLE"]+
        votesByCounty[county]["UNKNOWN-NEVER RETURNED"]+
        votesByCounty[county]["DEFECTIVE"];

        if (received == 0 || issued == 0) {
            votesByCounty[county].PERCENTAGE = 0;
            // console.log(received, issued, (received/issued), county)
        }
        votesByCounty[county].PERCENTAGE = (received / (issued+received)) * 100;
    }

    // fir all the counties, find the max percentage
    for (const county in votesByCounty) {
        if (votesByCounty[county].PERCENTAGE > maxPercentage) {
            maxPercentage = votesByCounty[county].PERCENTAGE;
        }
    }

    console.log('max percentage', maxPercentage);
    
    allVotesByStatus.PERCENTAGE = ((allVotesByStatus.RECEIVED+allVotesByStatus["RECEIVED / CURED BALLOT"]) / 
        (allVotesByStatus.ISSUED+allVotesByStatus.RECEIVED+allVotesByStatus["RECEIVED / CURED BALLOT"]+allVotesByStatus["DEFECTIVE"]+allVotesByStatus["UNDELIVERABLE"]+allVotesByStatus["UNKNOWN-NEVER RETURNED"]+allVotesByStatus["REQUESTED"])) * 100;
    

    // round allVotesByStatus.PERCENTAGE to two decimal places
    allVotesByStatus.PERCENTAGE = allVotesByStatus.PERCENTAGE.toFixed(2);

    const dateStamp = "Oct 30, 2024"; // Replace with the date of your data

    // edit the text of the h3 tag with #subtitle
    d3.select("#subtitle").text(`In total, ${allVotesByStatus.PERCENTAGE}% of mail-in ballots have been returned and accepted as of ${dateStamp}`);

    return votesByCounty;
 }

 function showTooltip(event, d) {
     const tooltip = d3.select("#tooltip");

    // calculate the percentage of votes received compared to votes issued
    // all received types
    const received = d.properties.votes.RECEIVED+
    d.properties.votes["RECEIVED / CURED BALLOT"]+
    d.properties.votes["RECEIVED AFTER ELECTION"];
    
    // all issued types
    const issued = d.properties.votes.ISSUED+
    d.properties.votes["UNDELIVERABLE"]+
    d.properties.votes["UNKNOWN-NEVER RETURNED"]+
    d.properties.votes["DEFECTIVE"];

    const percentage = Math.round((received / (issued+received)) * 100);
    console.log(d.properties)
    let textString;
    if (!percentage) {
        console.log(d.properties)
        if (d.properties.votes.ISSUED > 0) {
            // this is a town that has been issued ballots, but no one has returned them
            textString = `<span style='font-size: 21px'><b>${percentage}%</b> of <b>${d.properties.TOWNNAME}</b> mail-in ballots returned</span><br><br>${received} ballots received out of ${issued+received} sent out`
        } else {
            // this is a town that is showing all zeros for issued and received, some data discrepancy
            textString = `<b>${d.properties.TOWNNAME}</b> <br><br> No data available`
        }
    } else {
        // normal situation
        textString = `<span style='font-size: 21px'><b>${percentage}%</b> of <b>${d.properties.TOWNNAME}</b> mail-in ballots returned</span><br><br>${received} ballots received out of ${issued+received} sent out`
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